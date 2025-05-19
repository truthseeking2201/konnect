import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { InstancedMesh, Object3D, Color, MathUtils } from 'three';
import { useGLTF } from '@react-three/drei';

type Token = {
  symbol: string;
  color: string;
};

interface StarFieldProps {
  starCount?: number;
  highlightTokens?: Token[];
}

const Stars: React.FC<StarFieldProps> = ({ starCount = 900, highlightTokens = [] }) => {
  console.log('🌟 Stars component rendering', { starCount, highlightTokens });
  const meshRef = useRef<InstancedMesh>(null);
  const [isReady, setIsReady] = useState(false);
  const [highlightedStars, setHighlightedStars] = useState<number[]>([]);
  
  // Handle texture loading with error handling
  const [texture, setTexture] = useState<any>(null);
  const [textureError, setTextureError] = useState<boolean>(false);
  
  useEffect(() => {
    console.log('🔄 Stars texture loading effect');
    // Create a basic fallback texture if loading fails
    const createFallbackTexture = () => {
      console.log('🎨 Creating fallback texture');
      const canvas = document.createElement('canvas');
      canvas.width = 32;
      canvas.height = 32;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Draw a simple star shape
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(16, 16, 8, 0, Math.PI * 2);
        ctx.fill();
        
        // Add some glow
        const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.5)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(16, 16, 16, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Convert to image
      const image = new Image();
      image.src = canvas.toDataURL();
      
      // Create a Three.js texture
      const fallbackTexture = new THREE.Texture(image);
      image.onload = () => {
        fallbackTexture.needsUpdate = true;
      };
      
      return fallbackTexture;
    };
    
    // Try to load the texture
    const loadTexture = async () => {
      console.log('🔍 Attempting to load star.png texture');
      try {
        const loader = new THREE.TextureLoader();
        const loadedTexture = await new Promise((resolve, reject) => {
          loader.load('/star.png', 
            (tex) => {
              console.log('✅ Texture loaded successfully');
              resolve(tex);
            }, 
            (progress) => {
              console.log('📊 Texture loading progress:', progress);
            }, 
            (error) => {
              console.error('❌ Texture loading error:', error);
              reject(error);
            }
          );
        });
        console.log('✅ Setting loaded texture');
        setTexture(loadedTexture);
      } catch (error) {
        console.error('❌ Failed to load star texture:', error);
        setTextureError(true);
        console.log('🎨 Using fallback texture');
        setTexture(createFallbackTexture());
      }
    };
    
    loadTexture();
  }, []);
  
  const temp = useRef(new Object3D());
  const color = useRef(new Color());
  
  // Initialize star positions with more visible attributes
  useEffect(() => {
    console.log('🌌 Initializing star positions', { starCount, meshRef: !!meshRef.current });
    if (meshRef.current) {
      for (let i = 0; i < starCount; i++) {
        const theta = 2 * Math.PI * Math.random();
        const phi = Math.acos(2 * Math.random() - 1);
        const distance = 5 + Math.random() * 30;
        
        const x = distance * Math.sin(phi) * Math.cos(theta);
        const y = distance * Math.sin(phi) * Math.sin(theta);
        const z = distance * Math.cos(phi);
        
        temp.current.position.set(x, y, z);
        temp.current.updateMatrix();
        
        meshRef.current.setMatrixAt(i, temp.current.matrix);
        
        // Brighter stars - increased base brightness
        const brightness = 0.8 + Math.random() * 0.2; // Much brighter base value
        color.current.setRGB(brightness, brightness, brightness);
        meshRef.current.setColorAt(i, color.current);
      }
      
      meshRef.current.instanceMatrix.needsUpdate = true;
      if (meshRef.current.instanceColor) 
        meshRef.current.instanceColor.needsUpdate = true;
      
      setIsReady(true);
    }
  }, [starCount]);
  
  // Handle token highlighting
  useEffect(() => {
    if (meshRef.current && isReady && highlightTokens.length > 0) {
      // Reset previous highlights
      highlightedStars.forEach(index => {
        const brightness = 0.5 + Math.random() * 0.5;
        color.current.setRGB(brightness, brightness, brightness);
        meshRef.current?.setColorAt(index, color.current);
      });
      
      // Select random stars to highlight for each token
      const newHighlights: number[] = [];
      highlightTokens.forEach(token => {
        // Parse token color
        color.current.set(token.color);
        
        // Highlight 5-10 random stars per token
        const highlightCount = 5 + Math.floor(Math.random() * 5);
        for (let i = 0; i < highlightCount; i++) {
          const starIndex = Math.floor(Math.random() * starCount);
          newHighlights.push(starIndex);
          
          // Set star color and scale it
          meshRef.current?.setColorAt(starIndex, color.current);
          
          // We would normally scale here, but InstancedMesh doesn't support individual scaling
          // Instead we'll use a shader or a different approach for actual implementation
        }
      });
      
      if (meshRef.current.instanceColor)
        meshRef.current.instanceColor.needsUpdate = true;
      
      setHighlightedStars(newHighlights);
    }
  }, [highlightTokens, isReady, starCount]);
  
  // Animate galaxy rotation
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.0015;
    }
  });
  
  // Wait for texture to be loaded or fallback created
  if (!texture) {
    console.log('⏳ Waiting for texture to load');
    return null;
  }
  
  return (
    <instancedMesh 
      ref={meshRef} 
      args={[undefined, undefined, starCount]}
      onAfterRender={() => {
        if (!isReady) {
          console.log('🎬 Stars rendered to screen');
          setIsReady(true);
        }
      }}
    >
      <planeGeometry args={[1.0, 1.0]} /> {/* Even larger stars for better visibility */}
      <meshBasicMaterial 
        map={texture} 
        transparent 
        depthWrite={false}
        vertexColors 
        opacity={1.0}
      />
    </instancedMesh>
  );
};

interface CanvasDepthGalaxyProps {
  starCount?: number;
  highlightTokens?: Token[];
  onReady?: () => void;
}

const CanvasDepthGalaxy: React.FC<CanvasDepthGalaxyProps> = ({ 
  starCount = 2500, // Increased default star count dramatically
  highlightTokens = [], 
  onReady 
}) => {
  console.log('🔄 CanvasDepthGalaxy component rendering');
  
  useEffect(() => {
    if (onReady) {
      console.log('⏱️ Galaxy onReady timeout starting');
      // Simulate texture loading time
      const timeout = setTimeout(() => {
        console.log('🚀 Galaxy onReady callback firing');
        onReady();
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [onReady]);
  
  // Error boundary for THREE.js/Canvas errors
  const [hasError, setHasError] = useState(false);
  
  // Handle THREE.js errors
  const handleError = (error: Error) => {
    console.error('❌ THREE.js error:', error);
    setHasError(true);
  };
  
  if (hasError) {
    return (
      <div className="galaxy-canvas bg-indigo-900/30 flex items-center justify-center">
        <div className="text-red-400 text-center p-4">
          <h3 className="text-lg font-bold">Galaxy Rendering Error</h3>
          <p>There was an error rendering the 3D galaxy.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="galaxy-canvas">
      <Canvas 
        camera={{ position: [0, 0, 15], fov: 75 }} // Closer camera and wider field of view
        onCreated={(state) => console.log('✅ Canvas created', { gl: !!state.gl })}
        onError={(e) => {
          console.error('❌ Canvas error event:', e);
          setHasError(true);
        }}
      >
        <ambientLight intensity={1.0} /> {/* Brighter ambient light */}
        <pointLight position={[0, 0, 0]} intensity={2.0} /> {/* Central light source */}
        <Stars starCount={starCount} highlightTokens={highlightTokens} />
      </Canvas>
    </div>
  );
};

export default CanvasDepthGalaxy;