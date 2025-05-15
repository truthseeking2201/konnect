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
  const meshRef = useRef<InstancedMesh>(null);
  const [isReady, setIsReady] = useState(false);
  const [highlightedStars, setHighlightedStars] = useState<number[]>([]);
  
  // Handle texture loading with error handling
  const [texture, setTexture] = useState<any>(null);
  const [textureError, setTextureError] = useState<boolean>(false);
  
  useEffect(() => {
    // Create a basic fallback texture if loading fails
    const createFallbackTexture = () => {
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
      try {
        const loader = new THREE.TextureLoader();
        const loadedTexture = await new Promise((resolve, reject) => {
          loader.load('/star.png', resolve, undefined, reject);
        });
        setTexture(loadedTexture);
      } catch (error) {
        console.error('Failed to load star texture:', error);
        setTextureError(true);
        setTexture(createFallbackTexture());
      }
    };
    
    loadTexture();
  }, []);
  
  const temp = useRef(new Object3D());
  const color = useRef(new Color());
  
  // Initialize star positions
  useEffect(() => {
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
        
        // Set default star color (white with slight variations)
        const brightness = 0.5 + Math.random() * 0.5;
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
    return null;
  }
  
  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, starCount]}>
      <planeGeometry args={[0.25, 0.25]} />
      <meshBasicMaterial 
        map={texture} 
        transparent 
        depthWrite={false}
        vertexColors 
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
  starCount = 900, 
  highlightTokens = [], 
  onReady 
}) => {
  useEffect(() => {
    if (onReady) {
      // Simulate texture loading time
      const timeout = setTimeout(() => onReady(), 500);
      return () => clearTimeout(timeout);
    }
  }, [onReady]);
  
  return (
    <div className="galaxy-canvas">
      <Canvas camera={{ position: [0, 0, 20], fov: 60 }}>
        <Stars starCount={starCount} highlightTokens={highlightTokens} />
      </Canvas>
    </div>
  );
};

export default CanvasDepthGalaxy;