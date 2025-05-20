import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, OrbitControls, Html, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Activity, AlertTriangle, Twitter, MessageSquare, Check, Filter, Maximize, BarChart4 } from 'lucide-react';

// Define interfaces
interface Signal {
  id: string;
  source: string;
  sourceType: 'twitter' | 'telegram' | 'konnect';
  token: string;
  confidence: number;
  direction: 'long' | 'short';
  timestamp: number;
  pnlHistory: number[];
  socialEngagement: number;
  onchainConfirmation: number;
  relations?: string[]; // IDs of related signals
}

interface FilterState {
  minConfidence: number;
  sourceTypes: {
    twitter: boolean;
    telegram: boolean;
    konnect: boolean;
  };
  timeRange: 'all' | '1h' | '4h' | '24h';
}

interface SignalNetworkVisualizerProps {
  isActive: boolean;
  selectedRisk?: 'conservative' | 'balanced' | 'aggressive';
  onSelectSignal?: (signal: Signal) => void;
}

// Helper function to generate edges between signals
const generateEdges = (signals: Signal[]) => {
  const edges: Array<{source: string, target: string, strength: number}> = [];
  
  // Connect signals with similar tokens or sources
  signals.forEach((signal, i) => {
    for (let j = i + 1; j < signals.length; j++) {
      const target = signals[j];
      let strength = 0;
      
      // Token relationship
      if (signal.token === target.token) {
        strength += 0.5;
      }
      
      // Source relationship
      if (signal.source === target.source) {
        strength += 0.3;
      }
      
      // Confidence relationship (connect high-confidence signals)
      if (signal.confidence > 0.8 && target.confidence > 0.8) {
        strength += 0.2;
      }
      
      // Social engagement relationship
      const socialDiff = Math.abs(signal.socialEngagement - target.socialEngagement) / 100;
      if (socialDiff < 0.2) {
        strength += 0.2 * (1 - socialDiff);
      }
      
      // Explicitly defined relations
      if (signal.relations?.includes(target.id) || target.relations?.includes(signal.id)) {
        strength += 0.5;
      }
      
      // Add edge if strength is significant
      if (strength > 0.3) {
        edges.push({
          source: signal.id,
          target: target.id,
          strength: strength
        });
      }
    }
  });
  
  return edges;
};

// Force-directed layout calculation using simulation
const useForceLayout = (signals: Signal[], edges: any[]) => {
  const [nodePositions, setNodePositions] = useState<{[key: string]: THREE.Vector3}>({});
  
  useEffect(() => {
    if (signals.length === 0) return;
    
    const positions: {[key: string]: THREE.Vector3} = {};
    
    // Initialize positions in a sphere
    signals.forEach((signal) => {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 5 + Math.random() * 3;
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      positions[signal.id] = new THREE.Vector3(x, y, z);
    });
    
    // Run force simulation
    const simulation = () => {
      const repulsionForce = 0.2;
      const attractionForce = 0.01;
      const edgeForce = 0.1;
      const centerForce = 0.01;
      
      // Calculate forces
      const forces: {[key: string]: THREE.Vector3} = {};
      signals.forEach(signal => {
        forces[signal.id] = new THREE.Vector3(0, 0, 0);
      });
      
      // Repulsion between all nodes
      for (let i = 0; i < signals.length; i++) {
        const signal1 = signals[i];
        const pos1 = positions[signal1.id];
        
        for (let j = i + 1; j < signals.length; j++) {
          const signal2 = signals[j];
          const pos2 = positions[signal2.id];
          
          const diff = new THREE.Vector3().subVectors(pos1, pos2);
          const distance = diff.length();
          if (distance === 0) continue;
          
          const direction = diff.normalize();
          const forceMagnitude = repulsionForce / (distance * distance);
          
          const force = direction.multiplyScalar(forceMagnitude);
          forces[signal1.id].add(force);
          forces[signal2.id].sub(force);
        }
      }
      
      // Attraction along edges
      edges.forEach(edge => {
        const pos1 = positions[edge.source];
        const pos2 = positions[edge.target];
        
        const diff = new THREE.Vector3().subVectors(pos2, pos1);
        const distance = diff.length();
        if (distance === 0) return;
        
        const direction = diff.normalize();
        const forceMagnitude = attractionForce * distance * edge.strength;
        
        const force = direction.multiplyScalar(forceMagnitude);
        forces[edge.source].add(force);
        forces[edge.target].sub(force);
      });
      
      // Center gravity force
      signals.forEach(signal => {
        const pos = positions[signal.id];
        const diff = new THREE.Vector3().subVectors(new THREE.Vector3(0, 0, 0), pos);
        const distance = diff.length();
        if (distance === 0) return;
        
        const direction = diff.normalize();
        const forceMagnitude = centerForce * distance;
        
        const force = direction.multiplyScalar(forceMagnitude);
        forces[signal.id].add(force);
      });
      
      // Apply forces
      signals.forEach(signal => {
        const pos = positions[signal.id];
        pos.add(forces[signal.id]);
      });
    };
    
    // Run simulation iterations
    for (let i = 0; i < 100; i++) {
      simulation();
    }
    
    setNodePositions(positions);
  }, [signals, edges]);
  
  return nodePositions;
};

// Signal Node Component
const SignalNode: React.FC<{
  signal: Signal,
  position: THREE.Vector3,
  isSelected: boolean,
  onClick: () => void
}> = ({ signal, position, isSelected, onClick }) => {
  const nodeRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  // Define colors based on signal properties
  const baseColor = useMemo(() => {
    if (signal.direction === 'long') {
      return new THREE.Color(0x4ade80); // Green for long
    } else {
      return new THREE.Color(0xef4444); // Red for short
    }
  }, [signal.direction]);
  
  const confidenceColor = useMemo(() => {
    // Blend between base color and blue based on confidence
    const color = baseColor.clone();
    color.lerp(new THREE.Color(0x3b82f6), signal.confidence * 0.7);
    return color;
  }, [baseColor, signal.confidence]);
  
  // Node size based on confidence and social engagement
  const size = useMemo(() => 
    0.5 + (signal.confidence * 0.5) + (signal.socialEngagement * 0.01),
  [signal.confidence, signal.socialEngagement]);
  
  // Pulse effect for selected nodes
  useFrame(({ clock }) => {
    if (nodeRef.current) {
      if (isSelected) {
        const scale = 1 + Math.sin(clock.getElapsedTime() * 3) * 0.1;
        nodeRef.current.scale.set(scale, scale, scale);
        
        // Also make it emit more light when selected
        const intensity = 2 + Math.sin(clock.getElapsedTime() * 3) * 0.5;
        if (nodeRef.current.material instanceof THREE.MeshStandardMaterial) {
          nodeRef.current.material.emissiveIntensity = intensity;
        }
      } else if (hovered) {
        const scale = 1.2;
        nodeRef.current.scale.set(scale, scale, scale);
      } else {
        nodeRef.current.scale.set(1, 1, 1);
        if (nodeRef.current.material instanceof THREE.MeshStandardMaterial) {
          nodeRef.current.material.emissiveIntensity = 1.5;
        }
      }
    }
  });
  
  // Format timestamp for display
  const formatTimestamp = (timestamp: number) => {
    const now = Date.now();
    const diffMinutes = Math.floor((now - timestamp) / (60 * 1000));
    
    if (diffMinutes < 1) return 'just now';
    if (diffMinutes === 1) return '1m ago';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    return new Date(timestamp).toLocaleDateString();
  };
  
  // Get icon for source type
  const getSourceIcon = (sourceType: 'twitter' | 'telegram' | 'konnect') => {
    switch (sourceType) {
      case 'twitter': return <Twitter size={12} className="text-blue-400 mr-1" />;
      case 'telegram': return <MessageSquare size={12} className="text-blue-300 mr-1" />;
      case 'konnect': return <Check size={12} className="text-green-400 mr-1" />;
    }
  };
  
  return (
    <group position={position}>
      {/* Main node sphere */}
      <mesh 
        ref={nodeRef}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial 
          color={confidenceColor}
          emissive={confidenceColor} 
          emissiveIntensity={1.5}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
      
      {/* Glow effect */}
      <mesh scale={[1.2, 1.2, 1.2]}>
        <sphereGeometry args={[size, 16, 16]} />
        <meshBasicMaterial 
          color={confidenceColor}
          transparent={true}
          opacity={0.15}
        />
      </mesh>
      
      {/* Token label */}
      <Billboard
        follow={true}
        lockX={false}
        lockY={false}
        lockZ={false}
      >
        <Text
          position={[0, size + 0.3, 0]}
          fontSize={0.4}
          color="white"
          anchorX="center"
          anchorY="middle"
          font="/fonts/Inter-Bold.woff"
        >
          {signal.token}
        </Text>
      </Billboard>
      
      {/* Detailed info panel on hover/selection */}
      {(hovered || isSelected) && (
        <Html
          position={[size + 0.3, size + 0.3, 0]}
          distanceFactor={10}
          occlude={true}
          className="pointer-events-none"
        >
          <div className="bg-indigo-900/90 backdrop-blur-md rounded-lg p-3 border border-blue-500/30 shadow-xl w-48 select-none">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center text-white text-sm font-bold">
                {getSourceIcon(signal.sourceType)}
                <span>{signal.source}</span>
              </div>
              <span className={`px-1.5 py-0.5 rounded-md text-xs font-mono ${
                signal.direction === 'long' ? 'bg-green-500/30 text-green-300' : 'bg-red-500/30 text-red-300'
              }`}>
                {signal.direction.toUpperCase()}
              </span>
            </div>
            
            <div className="text-xs text-blue-200/80 mb-2">
              {formatTimestamp(signal.timestamp)}
            </div>
            
            <div className="flex justify-between mb-2">
              <div className="text-xs text-blue-300">Confidence</div>
              <div className="text-xs font-bold text-white">{Math.round(signal.confidence * 100)}%</div>
            </div>
            
            <div className="h-1.5 bg-blue-950 rounded-full overflow-hidden mb-3">
              <div 
                className={`h-full rounded-full ${
                  signal.direction === 'long' 
                    ? 'bg-gradient-to-r from-blue-500 to-green-400' 
                    : 'bg-gradient-to-r from-blue-500 to-red-400'
                }`}
                style={{ width: `${signal.confidence * 100}%` }}
              ></div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xxs">
              <div className="flex flex-col">
                <span className="text-blue-300">Social</span>
                <span className="font-bold text-white">{signal.socialEngagement}%</span>
              </div>
              <div className="flex flex-col">
                <span className="text-blue-300">Onchain</span>
                <span className="font-bold text-white">{signal.onchainConfirmation}%</span>
              </div>
            </div>
            
            {isSelected && (
              <div className="mt-2 border-t border-blue-500/30 pt-2 text-center text-xs text-blue-200">
                <span className="animate-pulse">Selected Signal</span>
              </div>
            )}
          </div>
        </Html>
      )}
    </group>
  );
};

// Network Edges Component
const NetworkEdges: React.FC<{
  edges: any[],
  nodePositions: {[key: string]: THREE.Vector3}
}> = ({ edges, nodePositions }) => {
  const edgeRefs = useRef<THREE.Line[]>([]);
  
  useFrame(() => {
    // Animate edges with flowing dash pattern
    edgeRefs.current.forEach((line, index) => {
      if (line.material instanceof THREE.LineDashedMaterial) {
        (line.material as any).dashOffset -= 0.01 * edges[index].strength;
      }
    });
  });
  
  return (
    <group>
      {edges.map((edge, index) => {
        const sourcePos = nodePositions[edge.source];
        const targetPos = nodePositions[edge.target];
        
        if (!sourcePos || !targetPos) return null;
        
        // Create points for curved line
        const points = [];
        const sourceVec = new THREE.Vector3(sourcePos.x, sourcePos.y, sourcePos.z);
        const targetVec = new THREE.Vector3(targetPos.x, targetPos.y, targetPos.z);
        
        const midPoint = new THREE.Vector3().addVectors(sourceVec, targetVec).multiplyScalar(0.5);
        const distance = sourceVec.distanceTo(targetVec);
        
        // Add slight curve based on distance
        const normal = new THREE.Vector3(0, 1, 0);
        midPoint.addScaledVector(normal, distance * 0.1);
        
        // Create curved path
        const curve = new THREE.QuadraticBezierCurve3(
          sourceVec,
          midPoint,
          targetVec
        );
        
        const curvePoints = curve.getPoints(10);
        points.push(...curvePoints);
        
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
        
        return (
          <line
            key={`${edge.source}-${edge.target}`}
            ref={(el) => {
              if (el) edgeRefs.current[index] = el as unknown as THREE.Line;
            }}
            // @ts-ignore three.js geometry prop
            geometry={lineGeometry}
          >
            <lineDashedMaterial
              color={new THREE.Color(0x3b82f6)}
              linewidth={1}
              transparent={true}
              opacity={edge.strength * 0.7}
              dashSize={0.2}
              gapSize={0.1}
              scale={1}
              onBeforeCompile={(shader) => {
                shader.uniforms.dashOffset = { value: 0 };
              }}
            />
          </line>
        );
      })}
    </group>
  );
};

// 3D Network Scene
const NetworkScene: React.FC<{
  signals: Signal[],
  selectedSignalId: string | null,
  onSelectSignal: (signal: Signal) => void,
  isLoading: boolean
}> = ({ signals, selectedSignalId, onSelectSignal, isLoading }) => {
  // Generate edges between signals
  const edges = useMemo(() => generateEdges(signals), [signals]);
  
  // Calculate node positions using force-directed layout
  const nodePositions = useForceLayout(signals, edges);
  
  // Camera animation
  const { camera } = useThree();
  
  useEffect(() => {
    // Initial camera position animation
    const initialPos = { x: 15, y: 10, z: 15 };
    const targetPos = { x: 10, y: 5, z: 10 };
    const duration = 2000;
    const startTime = Date.now();
    
    const animateCamera = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out cubic
      const t = 1 - Math.pow(1 - progress, 3);
      
      camera.position.x = initialPos.x + (targetPos.x - initialPos.x) * t;
      camera.position.y = initialPos.y + (targetPos.y - initialPos.y) * t;
      camera.position.z = initialPos.z + (targetPos.z - initialPos.z) * t;
      
      if (progress < 1) {
        requestAnimationFrame(animateCamera);
      }
    };
    
    if (!isLoading) {
      animateCamera();
    }
  }, [isLoading, camera]);
  
  // Focus on selected node
  useEffect(() => {
    if (selectedSignalId && nodePositions[selectedSignalId]) {
      const pos = nodePositions[selectedSignalId];
      const targetPos = new THREE.Vector3(
        pos.x + 5,
        pos.y + 2,
        pos.z + 5
      );
      
      const duration = 1000;
      const startTime = Date.now();
      const startPos = camera.position.clone();
      
      const animateCamera = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease out cubic
        const t = 1 - Math.pow(1 - progress, 3);
        
        camera.position.x = startPos.x + (targetPos.x - startPos.x) * t;
        camera.position.y = startPos.y + (targetPos.y - startPos.y) * t;
        camera.position.z = startPos.z + (targetPos.z - startPos.z) * t;
        
        camera.lookAt(pos);
        
        if (progress < 1) {
          requestAnimationFrame(animateCamera);
        }
      };
      
      animateCamera();
    }
  }, [selectedSignalId, nodePositions, camera]);
  
  // Add ambient particles/stars
  const Particles = () => {
    const particlesRef = useRef<THREE.Points>(null);
    const particleCount = 1000;
    
    const positions = useMemo(() => {
      const pos = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const radius = 50;
        const theta = 2 * Math.PI * Math.random();
        const phi = Math.acos(2 * Math.random() - 1);
        
        pos[i3] = radius * Math.sin(phi) * Math.cos(theta);
        pos[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        pos[i3 + 2] = radius * Math.cos(phi);
      }
      return pos;
    }, []);
    
    const sizes = useMemo(() => {
      const size = new Float32Array(particleCount);
      for (let i = 0; i < particleCount; i++) {
        size[i] = Math.random() * 0.5 + 0.1;
      }
      return size;
    }, []);
    
    useFrame(() => {
      if (particlesRef.current) {
        particlesRef.current.rotation.y += 0.0001;
        particlesRef.current.rotation.x += 0.00005;
      }
    });
    
    return (
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={positions}
            count={particleCount}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            array={sizes}
            count={particleCount}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.15}
          color={new THREE.Color(0x3b82f6)}
          transparent
          opacity={0.3}
          sizeAttenuation
        />
      </points>
    );
  };
  
  return (
    <>
      <OrbitControls 
        enableZoom={true}
        enablePan={true}
        enableRotate={true}
        zoomSpeed={0.6}
        panSpeed={0.5}
        rotateSpeed={0.4}
        minDistance={3}
        maxDistance={40}
      />
      
      <ambientLight intensity={0.3} />
      <directionalLight intensity={0.5} position={[10, 10, 5]} />
      
      {/* Background particles */}
      <Particles />
      
      {Object.keys(nodePositions).length > 0 && (
        <>
          {/* Network edges */}
          <NetworkEdges edges={edges} nodePositions={nodePositions} />
          
          {/* Signal nodes */}
          {signals.map((signal) => (
            <SignalNode
              key={signal.id}
              signal={signal}
              position={nodePositions[signal.id] || new THREE.Vector3(0, 0, 0)}
              isSelected={selectedSignalId === signal.id}
              onClick={() => onSelectSignal(signal)}
            />
          ))}
        </>
      )}
    </>
  );
};

// Loading Animation Component
const NetworkLoadingAnimation: React.FC = () => {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="relative">
        <div className="w-20 h-20 rounded-full border-t-4 border-b-4 border-blue-500 animate-spin"></div>
        <div className="w-16 h-16 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full border-t-4 border-b-4 border-indigo-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-400">
          <Activity className="animate-pulse" size={24} />
        </div>
      </div>
      <div className="ml-4">
        <div className="text-blue-300 font-bold animate-pulse">Initializing Network</div>
        <div className="text-blue-400/70 text-sm">Calculating signal relationships...</div>
      </div>
    </div>
  );
};

// Main Component
const SignalNetworkVisualizer: React.FC<SignalNetworkVisualizerProps> = ({
  isActive,
  selectedRisk = 'balanced',
  onSelectSignal
}) => {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSignalId, setSelectedSignalId] = useState<string | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    minConfidence: 0.5,
    sourceTypes: {
      twitter: true,
      telegram: true,
      konnect: true
    },
    timeRange: 'all'
  });
  
  // Generate mock signals with relationships
  useEffect(() => {
    if (!isActive) return;
    
    setIsLoading(true);
    
    // Mock data generation
    setTimeout(() => {
      const mockSignals: Signal[] = [
        {
          id: 'sig_1',
          source: '@0xRamen',
          sourceType: 'twitter',
          token: 'ETH',
          confidence: 0.87,
          direction: 'long',
          timestamp: Date.now() - 12 * 60 * 1000, // 12 mins ago
          pnlHistory: [12, 8, 15, 10, 18],
          socialEngagement: 89,
          onchainConfirmation: 76,
          relations: ['sig_4', 'sig_7']
        },
        {
          id: 'sig_2',
          source: 'Alpha Hunters',
          sourceType: 'telegram',
          token: 'SOL',
          confidence: 0.92,
          direction: 'long',
          timestamp: Date.now() - 27 * 60 * 1000, // 27 mins ago
          pnlHistory: [23, 18, 25, 20, 22],
          socialEngagement: 93,
          onchainConfirmation: 82,
          relations: ['sig_5', 'sig_9']
        },
        {
          id: 'sig_3',
          source: '@ChainQuest',
          sourceType: 'twitter',
          token: 'ARB',
          confidence: 0.75,
          direction: 'long',
          timestamp: Date.now() - 38 * 60 * 1000, // 38 mins ago
          pnlHistory: [8, 6, 9, 10, 12],
          socialEngagement: 71,
          onchainConfirmation: 68,
          relations: ['sig_8']
        },
        {
          id: 'sig_4',
          source: 'KonnectUser_042',
          sourceType: 'konnect',
          token: 'ETH',
          confidence: 0.83,
          direction: 'long',
          timestamp: Date.now() - 45 * 60 * 1000, // 45 mins ago
          pnlHistory: [15, 12, 18, 14, 16],
          socialEngagement: 80,
          onchainConfirmation: 74,
          relations: ['sig_1', 'sig_7']
        },
        {
          id: 'sig_5',
          source: 'Alpha Hunters',
          sourceType: 'telegram',
          token: 'AVAX',
          confidence: 0.88,
          direction: 'long',
          timestamp: Date.now() - 120 * 60 * 1000, // 2 hours ago
          pnlHistory: [20, 18, 22, 19, 24],
          socialEngagement: 85,
          onchainConfirmation: 78,
          relations: ['sig_2']
        },
        {
          id: 'sig_6',
          source: '@TradingMaster',
          sourceType: 'twitter',
          token: 'BNB',
          confidence: 0.69,
          direction: 'short',
          timestamp: Date.now() - 180 * 60 * 1000, // 3 hours ago
          pnlHistory: [5, 8, 6, 9, 7],
          socialEngagement: 65,
          onchainConfirmation: 62,
          relations: []
        },
        {
          id: 'sig_7',
          source: '@0xRamen',
          sourceType: 'twitter',
          token: 'LINK',
          confidence: 0.81,
          direction: 'long',
          timestamp: Date.now() - 90 * 60 * 1000, // 1.5 hours ago
          pnlHistory: [10, 12, 9, 14, 11],
          socialEngagement: 78,
          onchainConfirmation: 73,
          relations: ['sig_1', 'sig_4']
        },
        {
          id: 'sig_8',
          source: '@ChainQuest',
          sourceType: 'twitter',
          token: 'ARB',
          confidence: 0.78,
          direction: 'short',
          timestamp: Date.now() - 240 * 60 * 1000, // 4 hours ago
          pnlHistory: [14, 12, 15, 11, 16],
          socialEngagement: 75,
          onchainConfirmation: 70,
          relations: ['sig_3']
        },
        {
          id: 'sig_9',
          source: 'KonnectUser_087',
          sourceType: 'konnect',
          token: 'SOL',
          confidence: 0.86,
          direction: 'long',
          timestamp: Date.now() - 60 * 60 * 1000, // 1 hour ago
          pnlHistory: [17, 15, 19, 16, 20],
          socialEngagement: 82,
          onchainConfirmation: 79,
          relations: ['sig_2']
        },
        {
          id: 'sig_10',
          source: 'BlockSignals',
          sourceType: 'telegram',
          token: 'MATIC',
          confidence: 0.73,
          direction: 'long',
          timestamp: Date.now() - 150 * 60 * 1000, // 2.5 hours ago
          pnlHistory: [9, 7, 11, 8, 10],
          socialEngagement: 68,
          onchainConfirmation: 64,
          relations: []
        }
      ];
      
      // Filter signals based on risk profile
      let filteredSignals: Signal[];
      if (selectedRisk === 'conservative') {
        // Only high confidence signals
        filteredSignals = mockSignals.filter(s => s.confidence > 0.85);
      } else if (selectedRisk === 'balanced') {
        // Medium and high confidence signals
        filteredSignals = mockSignals.filter(s => s.confidence > 0.75);
      } else {
        // All signals
        filteredSignals = mockSignals;
      }
      
      setSignals(filteredSignals);
      setIsLoading(false);
    }, 2000);
  }, [isActive, selectedRisk]);
  
  // Apply current filters
  const filteredSignals = useMemo(() => {
    return signals.filter(signal => {
      // Confidence filter
      if (signal.confidence < filters.minConfidence) return false;
      
      // Source type filter
      if (!filters.sourceTypes[signal.sourceType]) return false;
      
      // Time range filter
      if (filters.timeRange !== 'all') {
        const now = Date.now();
        const hourDiff = (now - signal.timestamp) / (1000 * 60 * 60);
        
        switch (filters.timeRange) {
          case '1h': if (hourDiff > 1) return false; break;
          case '4h': if (hourDiff > 4) return false; break;
          case '24h': if (hourDiff > 24) return false; break;
        }
      }
      
      return true;
    });
  }, [signals, filters]);
  
  // Handle signal selection
  const handleSelectSignal = (signal: Signal) => {
    setSelectedSignalId(signal.id);
    if (onSelectSignal) {
      onSelectSignal(signal);
    }
  };
  
  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    setFullscreen(!fullscreen);
  };
  
  // Toggle source type filter
  const toggleSourceType = (type: 'twitter' | 'telegram' | 'konnect') => {
    setFilters(prev => ({
      ...prev,
      sourceTypes: {
        ...prev.sourceTypes,
        [type]: !prev.sourceTypes[type]
      }
    }));
  };
  
  // Set confidence threshold
  const setConfidenceThreshold = (value: number) => {
    setFilters(prev => ({
      ...prev,
      minConfidence: value
    }));
  };
  
  // Set time range filter
  const setTimeRange = (range: 'all' | '1h' | '4h' | '24h') => {
    setFilters(prev => ({
      ...prev,
      timeRange: range
    }));
  };
  
  if (!isActive) return null;
  
  return (
    <motion.div 
      className={`relative ${fullscreen ? 'fixed inset-0 z-50 p-4 bg-gray-900/95' : 'w-full mb-8'}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={`bg-gradient-to-r from-indigo-900/20 via-blue-900/10 to-indigo-900/20 backdrop-blur-sm rounded-xl border border-blue-500/30 shadow-lg shadow-blue-500/10 overflow-hidden ${fullscreen ? 'h-full' : 'h-[600px]'}`}>
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-blue-500/20">
          <motion.h3 
            className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-300 flex items-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <TrendingUp className="mr-2 text-blue-400" size={24} />
            <span className="tracking-wide">SIGNAL NETWORK</span>
            <motion.div 
              className="ml-2"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            >
              <Activity className="text-blue-400" size={16} />
            </motion.div>
          </motion.h3>
          
          <div className="flex items-center space-x-3">
            {/* Filters button */}
            <motion.button
              className="flex items-center bg-blue-900/30 px-3 py-1.5 rounded-full text-blue-300 hover:bg-blue-900/50 transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById('filters-panel')?.classList.toggle('hidden')}
            >
              <Filter size={16} className="mr-1.5" />
              <span className="text-sm font-medium">Filters</span>
            </motion.button>
            
            {/* Fullscreen toggle */}
            <motion.button
              className="flex items-center bg-blue-900/30 px-3 py-1.5 rounded-full text-blue-300 hover:bg-blue-900/50 transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleFullscreen}
            >
              <Maximize size={16} className="mr-1.5" />
              <span className="text-sm font-medium">{fullscreen ? 'Exit' : 'Expand'}</span>
            </motion.button>
            
            {/* Live indicator */}
            <div className="flex items-center bg-blue-900/30 px-3 py-1.5 rounded-full">
              <motion.div 
                className="inline-block w-2 h-2 bg-green-400 rounded-full mr-2"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              ></motion.div>
              <span className="text-sm text-green-400 font-mono tracking-wider">LIVE</span>
            </div>
          </div>
        </div>
        
        {/* Filters panel */}
        <div id="filters-panel" className="px-4 py-2 border-b border-blue-500/20 bg-indigo-900/20 hidden">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {/* Confidence slider */}
            <div className="flex flex-col">
              <label className="text-xs text-blue-300 mb-1">Confidence: {Math.round(filters.minConfidence * 100)}%</label>
              <input 
                type="range" 
                min="0.5" 
                max="1" 
                step="0.05"
                value={filters.minConfidence}
                onChange={(e) => setConfidenceThreshold(parseFloat(e.target.value))}
                className="w-32 accent-blue-500"
              />
            </div>
            
            {/* Source type filters */}
            <div className="flex flex-col">
              <span className="text-xs text-blue-300 mb-1">Source Type:</span>
              <div className="flex space-x-2">
                <button 
                  className={`px-2 py-1 text-xs rounded ${filters.sourceTypes.twitter ? 'bg-blue-600/50 text-white' : 'bg-blue-900/30 text-blue-400'}`}
                  onClick={() => toggleSourceType('twitter')}
                >
                  <div className="flex items-center">
                    <Twitter size={12} className="mr-1" />
                    Twitter
                  </div>
                </button>
                <button 
                  className={`px-2 py-1 text-xs rounded ${filters.sourceTypes.telegram ? 'bg-blue-600/50 text-white' : 'bg-blue-900/30 text-blue-400'}`}
                  onClick={() => toggleSourceType('telegram')}
                >
                  <div className="flex items-center">
                    <MessageSquare size={12} className="mr-1" />
                    Telegram
                  </div>
                </button>
                <button 
                  className={`px-2 py-1 text-xs rounded ${filters.sourceTypes.konnect ? 'bg-blue-600/50 text-white' : 'bg-blue-900/30 text-blue-400'}`}
                  onClick={() => toggleSourceType('konnect')}
                >
                  <div className="flex items-center">
                    <Check size={12} className="mr-1" />
                    Konnect
                  </div>
                </button>
              </div>
            </div>
            
            {/* Time range filters */}
            <div className="flex flex-col">
              <span className="text-xs text-blue-300 mb-1">Time Range:</span>
              <div className="flex space-x-2">
                <button 
                  className={`px-2 py-1 text-xs rounded ${filters.timeRange === 'all' ? 'bg-blue-600/50 text-white' : 'bg-blue-900/30 text-blue-400'}`}
                  onClick={() => setTimeRange('all')}
                >
                  All
                </button>
                <button 
                  className={`px-2 py-1 text-xs rounded ${filters.timeRange === '1h' ? 'bg-blue-600/50 text-white' : 'bg-blue-900/30 text-blue-400'}`}
                  onClick={() => setTimeRange('1h')}
                >
                  1h
                </button>
                <button 
                  className={`px-2 py-1 text-xs rounded ${filters.timeRange === '4h' ? 'bg-blue-600/50 text-white' : 'bg-blue-900/30 text-blue-400'}`}
                  onClick={() => setTimeRange('4h')}
                >
                  4h
                </button>
                <button 
                  className={`px-2 py-1 text-xs rounded ${filters.timeRange === '24h' ? 'bg-blue-600/50 text-white' : 'bg-blue-900/30 text-blue-400'}`}
                  onClick={() => setTimeRange('24h')}
                >
                  24h
                </button>
              </div>
            </div>
            
            {/* Signal count */}
            <div className="ml-auto flex items-center">
              <BarChart4 size={14} className="text-blue-400 mr-1.5" />
              <span className="text-sm text-blue-300 font-mono">
                {filteredSignals.length} signals
              </span>
            </div>
          </div>
        </div>
        
        {/* Main content - Network visualization */}
        <div className="w-full h-full">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-[calc(100%-60px)]"
              >
                <NetworkLoadingAnimation />
              </motion.div>
            ) : filteredSignals.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-[calc(100%-60px)] flex items-center justify-center"
              >
                <div className="bg-gradient-to-br from-amber-900/20 to-amber-800/10 backdrop-blur-sm rounded-xl p-6 text-center border border-amber-500/30 max-w-md">
                  <AlertTriangle className="mx-auto mb-3 text-amber-400" size={28} />
                  <p className="text-amber-200/80 font-medium">No signals matching your filters at the moment.</p>
                  <p className="text-amber-200/60 text-sm mt-1">Try adjusting your filters or wait for new signals.</p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="network"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-[calc(100%-60px)]"
              >
                <Canvas 
                  camera={{ position: [15, 10, 15], fov: 60 }}
                  dpr={[1, 2]}
                  gl={{ antialias: true, alpha: true }}
                  style={{ background: 'transparent' }}
                >
                  <NetworkScene 
                    signals={filteredSignals}
                    selectedSignalId={selectedSignalId}
                    onSelectSignal={handleSelectSignal}
                    isLoading={isLoading}
                  />
                </Canvas>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Instructions overlay */}
        {!isLoading && filteredSignals.length > 0 && (
          <div className="absolute bottom-4 left-4 bg-indigo-900/70 backdrop-blur-sm rounded-lg p-3 border border-blue-500/30 text-xs text-blue-300 max-w-xs">
            <p className="mb-1 font-bold text-blue-200">Network Controls:</p>
            <ul className="space-y-1 ml-3 list-disc">
              <li>Click on a node to select that signal</li>
              <li>Drag to rotate the network</li>
              <li>Scroll to zoom in/out</li>
              <li>Right-click and drag to pan</li>
            </ul>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SignalNetworkVisualizer;
