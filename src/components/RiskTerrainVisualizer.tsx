import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { SimplexNoise } from 'three/examples/jsm/math/SimplexNoise';
import { useSpring, animated } from '@react-spring/three';

type RiskLevel = 'conservative' | 'balanced' | 'aggressive';

interface RiskTerrainVisualizerProps {
  riskLevel: RiskLevel;
  width?: number;
  height?: number;
}

const terrainColors = {
  conservative: {
    base: new THREE.Color('#1a365d'), // Deep blue
    peak: new THREE.Color('#3b82f6'), // Bright blue
    particle: '#60a5fa'
  },
  balanced: {
    base: new THREE.Color('#1e3a8a'), // Deep indigo
    peak: new THREE.Color('#6366f1'), // Bright indigo
    particle: '#818cf8'
  },
  aggressive: {
    base: new THREE.Color('#312e81'), // Deep purple
    peak: new THREE.Color('#8b5cf6'), // Bright purple
    particle: '#a78bfa'
  }
};

const terrainConfigs = {
  conservative: {
    amplitude: 2.5,
    frequency: 0.2,
    peaks: 3,
    particleCount: 100,
    particleSpeed: 0.2
  },
  balanced: {
    amplitude: 5,
    frequency: 0.4,
    peaks: 5,
    particleCount: 200,
    particleSpeed: 0.4
  },
  aggressive: {
    amplitude: 8,
    frequency: 0.6,
    peaks: 7,
    particleCount: 300,
    particleSpeed: 0.6
  }
};

const RiskTerrainVisualizer = ({ 
  riskLevel, 
  width = 300, 
  height = 200 
}: RiskTerrainVisualizerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const terrainRef = useRef<THREE.Mesh | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const frameIdRef = useRef<number>(0);
  const prevRiskLevelRef = useRef<RiskLevel>(riskLevel);

  // Spring animation for smooth transitions
  const { amplitude, frequency } = useSpring({
    amplitude: terrainConfigs[riskLevel].amplitude,
    frequency: terrainConfigs[riskLevel].frequency,
    config: { mass: 1, tension: 120, friction: 14 }
  });

  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Create scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0a0f1e'); // Dark background
    sceneRef.current = scene;
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 15, 25);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 1);
    scene.add(ambientLight);
    
    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);
    
    // Add point light that changes with risk level
    const pointLight = new THREE.PointLight(
      terrainColors[riskLevel].peak, 
      1.5, 
      50
    );
    pointLight.position.set(0, 10, 0);
    scene.add(pointLight);
    
    // Add orbit controls for interactivity
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2.2;
    controls.minDistance = 10;
    controls.maxDistance = 50;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
    
    // Create terrain geometry
    createTerrain();
    createParticles();
    
    // Animation loop
    const animate = () => {
      controls.update();
      updateTerrain();
      updateParticles();
      renderer.render(scene, camera);
      frameIdRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Cleanup
    return () => {
      cancelAnimationFrame(frameIdRef.current);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [width, height]);
  
  // Update terrain when risk level changes
  useEffect(() => {
    if (prevRiskLevelRef.current !== riskLevel && sceneRef.current) {
      updateTerrainColors();
      updateParticleColors();
      prevRiskLevelRef.current = riskLevel;
    }
  }, [riskLevel]);
  
  // Create terrain mesh
  const createTerrain = () => {
    if (!sceneRef.current) return;
    
    const geometry = new THREE.PlaneGeometry(30, 30, 128, 128);
    geometry.rotateX(-Math.PI / 2);
    
    const vertexShader = `
      uniform float u_amplitude;
      uniform float u_frequency;
      uniform float u_time;
      
      varying float vElevation;
      varying vec2 vUv;
      
      // Simplex 3D noise function
      vec4 permute(vec4 x) {
        return mod(((x*34.0)+1.0)*x, 289.0);
      }
      vec4 taylorInvSqrt(vec4 r) {
        return 1.79284291400159 - 0.85373472095314 * r;
      }
      float snoise(vec3 v) {
        const vec2 C = vec2(1.0/6.0, 1.0/3.0);
        const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
        
        // First corner
        vec3 i  = floor(v + dot(v, C.yyy));
        vec3 x0 = v - i + dot(i, C.xxx);
        
        // Other corners
        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min(g.xyz, l.zxy);
        vec3 i2 = max(g.xyz, l.zxy);
        
        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + C.yyy;
        vec3 x3 = x0 - D.yyy;
        
        // Permutations
        i = mod(i, 289.0);
        vec4 p = permute(permute(permute(
          i.z + vec4(0.0, i1.z, i2.z, 1.0))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0))
          + i.x + vec4(0.0, i1.x, i2.x, 1.0));
          
        // Gradients
        float n_ = 1.0/7.0;
        vec3 ns = n_ * D.wyz - D.xzx;
        
        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
        
        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_);
        
        vec4 x = x_ *ns.x + ns.yyyy;
        vec4 y = y_ *ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);
        
        vec4 b0 = vec4(x.xy, y.xy);
        vec4 b1 = vec4(x.zw, y.zw);
        
        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));
        
        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
        
        vec3 p0 = vec3(a0.xy, h.x);
        vec3 p1 = vec3(a0.zw, h.y);
        vec3 p2 = vec3(a1.xy, h.z);
        vec3 p3 = vec3(a1.zw, h.w);
        
        // Normalise gradients
        vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
        p0 *= norm.x;
        p1 *= norm.y;
        p2 *= norm.z;
        p3 *= norm.w;
        
        // Mix final noise value
        vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
        m = m * m;
        return 42.0 * dot(m*m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
      }
      
      void main() {
        vUv = uv;
        
        // Create terrain elevation with multiple frequency layers
        float elevation = 0.0;
        
        // Base layer
        elevation += snoise(vec3(position.x * u_frequency, position.z * u_frequency, u_time * 0.05)) * u_amplitude;
        
        // Detail layers with different frequencies
        elevation += snoise(vec3(position.x * u_frequency * 2.0, position.z * u_frequency * 2.0, u_time * 0.08)) * u_amplitude * 0.5;
        elevation += snoise(vec3(position.x * u_frequency * 4.0, position.z * u_frequency * 4.0, u_time * 0.1)) * u_amplitude * 0.25;
        
        // Store elevation for fragment shader
        vElevation = elevation;
        
        // Modify vertex position
        vec3 newPosition = position;
        newPosition.y = elevation;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
      }
    `;
    
    const fragmentShader = `
      uniform vec3 u_baseColor;
      uniform vec3 u_peakColor;
      uniform float u_amplitude;
      
      varying float vElevation;
      varying vec2 vUv;
      
      void main() {
        // Calculate color based on elevation
        float normalizedElevation = (vElevation + u_amplitude) / (2.0 * u_amplitude);
        vec3 color = mix(u_baseColor, u_peakColor, normalizedElevation);
        
        // Add a subtle glow effect
        float edgeFactor = 1.0 - 2.0 * abs(vUv.x - 0.5);
        float glow = pow(edgeFactor, 3.0) * 0.3;
        color += u_peakColor * glow;
        
        gl_FragColor = vec4(color, 1.0);
      }
    `;
    
    const material = new THREE.ShaderMaterial({
      uniforms: {
        u_amplitude: { value: terrainConfigs[riskLevel].amplitude },
        u_frequency: { value: terrainConfigs[riskLevel].frequency },
        u_time: { value: 0 },
        u_baseColor: { value: terrainColors[riskLevel].base },
        u_peakColor: { value: terrainColors[riskLevel].peak }
      },
      vertexShader,
      fragmentShader,
      side: THREE.DoubleSide
    });
    
    const terrain = new THREE.Mesh(geometry, material);
    terrain.position.y = -5;
    sceneRef.current.add(terrain);
    terrainRef.current = terrain;
  };
  
  // Create particle system for visual flair
  const createParticles = () => {
    if (!sceneRef.current) return;
    
    const config = terrainConfigs[riskLevel];
    const particleCount = config.particleCount;
    
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Position particles in a dome shape
      const radius = Math.random() * 15;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI * 0.5;
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = Math.abs(radius * Math.cos(phi));
      positions[i3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
      
      // Random initial velocities
      velocities[i3] = (Math.random() - 0.5) * 0.05;
      velocities[i3 + 1] = Math.random() * 0.05 + 0.02;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.05;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
      color: terrainColors[riskLevel].particle,
      size: 0.2,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    
    const particles = new THREE.Points(geometry, particleMaterial);
    particles.position.y = 0;
    sceneRef.current.add(particles);
    particlesRef.current = particles;
  };
  
  // Update terrain on animation frame
  const updateTerrain = () => {
    if (!terrainRef.current) return;
    
    const material = terrainRef.current.material as THREE.ShaderMaterial;
    if (material.uniforms) {
      // Update time uniform for animation
      material.uniforms.u_time.value += 0.01;
      
      // Update amplitude and frequency with spring values for smooth transitions
      material.uniforms.u_amplitude.value = amplitude.get();
      material.uniforms.u_frequency.value = frequency.get();
    }
  };
  
  // Update terrain colors when risk level changes
  const updateTerrainColors = () => {
    if (!terrainRef.current) return;
    
    const material = terrainRef.current.material as THREE.ShaderMaterial;
    if (material.uniforms) {
      material.uniforms.u_baseColor.value = terrainColors[riskLevel].base;
      material.uniforms.u_peakColor.value = terrainColors[riskLevel].peak;
    }
  };
  
  // Update particles on animation frame
  const updateParticles = () => {
    if (!particlesRef.current) return;
    
    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
    const velocities = particlesRef.current.geometry.attributes.velocity.array as Float32Array;
    const speed = terrainConfigs[riskLevel].particleSpeed;
    
    for (let i = 0; i < positions.length; i += 3) {
      // Update position based on velocity
      positions[i] += velocities[i] * speed;
      positions[i + 1] += velocities[i + 1] * speed;
      positions[i + 2] += velocities[i + 2] * speed;
      
      // Reset particles that go too high
      if (positions[i + 1] > 15) {
        // Position particles in a dome shape
        const radius = Math.random() * 15;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI * 0.5;
        
        positions[i] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i + 1] = 0; // Start at the ground
        positions[i + 2] = radius * Math.sin(phi) * Math.sin(theta);
        
        // Random new velocities
        velocities[i] = (Math.random() - 0.5) * 0.05;
        velocities[i + 1] = Math.random() * 0.05 + 0.02;
        velocities[i + 2] = (Math.random() - 0.5) * 0.05;
      }
    }
    
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  };
  
  // Update particle colors when risk level changes
  const updateParticleColors = () => {
    if (!particlesRef.current) return;
    
    const material = particlesRef.current.material as THREE.PointsMaterial;
    material.color.set(terrainColors[riskLevel].particle);
  };
  
  return (
    <div ref={containerRef} className="risk-terrain-container" style={{ width, height }}></div>
  );
};

export default RiskTerrainVisualizer;