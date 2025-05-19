import React, { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Brain, Zap, CheckCircle, AlertCircle, AlertTriangle, BarChart4, Terminal, SquareDot, Wand2, ChevronRight, ArrowUpCircle, ArrowDownCircle, Server } from 'lucide-react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, Html, useTexture, OrbitControls, PerspectiveCamera, PointMaterial, Box, Sphere, Environment, MeshTransmissionMaterial, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

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
}

interface TradeConfig {
  maxDailyRisk: number;  // % of portfolio
  stopLoss: number;      // % per trade
  takeProfit: number;    // % per trade
  gasLimit: number;      // in gwei
  slippage: number;      // in %
}

interface TradeAgentProps {
  selectedSignal: Signal | null;
  isActive: boolean;
  riskProfile?: 'conservative' | 'balanced' | 'aggressive';
  onTrade?: (tradeDetails: any) => void;
}

// Animated particle system for trade execution
const ParticleFlow = ({ active, direction, speed = 0.5 }) => {
  const count = 300;
  const positions = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;  
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return positions;
  }, [count]);
  
  const direction3D = direction === 'long' ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(0, -1, 0);
  
  useFrame((state) => {
    if (active) {
      const time = state.clock.getElapsedTime();
      const points = (state.scene.getObjectByName('particles') as THREE.Points | undefined)?.geometry;
      
      if (points) {
        const positions = points.attributes.position.array as Float32Array;
        
        for (let i = 0; i < count; i++) {
          const i3 = i * 3;
          
          // Apply some perlin noise-like movement
          positions[i3] += Math.sin(time * speed + i) * 0.01;
          positions[i3 + 1] += direction3D.y * speed * 0.05; // Direction-based movement
          positions[i3 + 2] += Math.cos(time * speed + i) * 0.01;
          
          // Reset particles when they go off bounds
          if (direction === 'long' && positions[i3 + 1] > 5) {
            positions[i3 + 1] = -5;
          } else if (direction === 'short' && positions[i3 + 1] < -5) {
            positions[i3 + 1] = 5;
          }
        }
        
        points.attributes.position.needsUpdate = true;
      }
    }
  });

  return (
    <points name="particles">
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position" 
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        transparent
        opacity={0.8}
        color={direction === 'long' ? '#4ade80' : '#ef4444'}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
};

// Animated circuit paths
const CircuitPath = ({ position, scale = 1, color = '#3b82f6', animated = true }) => {
  const pathRef = useRef<THREE.Line>(null);
  const startPoint = useMemo(() => new THREE.Vector3(-2 + Math.random() * 4, -2 + Math.random() * 4, 0), []);
  
  // Generate random path points
  const points = useMemo(() => {
    const pts = [startPoint];
    let lastPoint = startPoint.clone();
    
    const segments = 6 + Math.floor(Math.random() * 6);
    for (let i = 0; i < segments; i++) {
      // Create either a horizontal or vertical segment
      const horizontal = Math.random() > 0.5;
      const newPoint = lastPoint.clone();
      
      if (horizontal) {
        newPoint.x += (Math.random() - 0.5) * 4;
      } else {
        newPoint.y += (Math.random() - 0.5) * 4;
      }
      
      pts.push(newPoint);
      lastPoint = newPoint;
    }
    
    return pts;
  }, [startPoint]);
  
  // Line geometry from points
  const lineGeometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(points);
    return new THREE.BufferGeometry().setFromPoints(curve.getPoints(50));
  }, [points]);
  
  useFrame(({ clock }) => {
    if (pathRef.current && animated) {
      const t = clock.getElapsedTime();
      
      // Animate the opacity/color
      const material = pathRef.current.material as THREE.LineBasicMaterial;
      const luminosity = Math.sin(t * 2) * 0.2 + 0.5;
      material.color.setStyle(color);
      material.color.multiplyScalar(luminosity);
      
      // Dash animation
      pathRef.current.position.z = Math.sin(t * 0.5) * 0.02;
    }
  });
  
  return (
    <line 
      ref={pathRef} 
      geometry={lineGeometry}
      position={position}
      scale={[scale, scale, scale]}
    >
      <lineBasicMaterial
        color={color}
        opacity={0.7}
        transparent
        linewidth={1}
      />
    </line>
  );
};

// Floating holographic display
const HolographicDisplay = ({ position, children, width = 2, height = 1, rotation = [0, 0, 0] }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (groupRef.current) {
      const t = clock.getElapsedTime();
      // Subtle floating motion
      groupRef.current.position.y = position[1] + Math.sin(t * 1.5) * 0.05;
      // Subtle rotation
      groupRef.current.rotation.z = rotation[2] + Math.sin(t * 0.8) * 0.03;
    }
  });
  
  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      {/* Holographic frame */}
      <mesh>
        <planeGeometry args={[width + 0.1, height + 0.1]} />
        <meshBasicMaterial color="#3b82f6" opacity={0.1} transparent />
      </mesh>
      
      {/* Content container */}
      <group position={[0, 0, 0.01]}>
        {children}
      </group>
      
      {/* Edge glow effects */}
      <mesh position={[0, height/2 + 0.02, 0.01]}>
        <planeGeometry args={[width - 0.05, 0.03]} />
        <meshBasicMaterial color="#60a5fa" opacity={0.7} transparent />
      </mesh>
      <mesh position={[0, -height/2 - 0.02, 0.01]}>
        <planeGeometry args={[width - 0.05, 0.03]} />
        <meshBasicMaterial color="#60a5fa" opacity={0.7} transparent />
      </mesh>
    </group>
  );
};

// Core energy sphere for trade execution
const EnergyCore = ({ active, direction, executing = false, success = false }) => {
  const sphereRef = useRef<THREE.Mesh>(null);
  const innerSphereRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (sphereRef.current && innerSphereRef.current) {
      const t = clock.getElapsedTime();
      
      // Pulsating effect
      const pulseScale = 1 + Math.sin(t * 3) * 0.05;
      sphereRef.current.scale.set(pulseScale, pulseScale, pulseScale);
      
      // Rotation
      sphereRef.current.rotation.y = t * 0.2;
      innerSphereRef.current.rotation.y = -t * 0.3;
      innerSphereRef.current.rotation.z = t * 0.1;
      
      // Color change during execution
      if (executing) {
        const material = sphereRef.current.material as THREE.MeshStandardMaterial;
        material.emissiveIntensity = 1.5 + Math.sin(t * 10) * 0.5;
      }
    }
  });
  
  // Define base color based on trade direction
  const baseColor = direction === 'long' ? '#4ade80' : '#ef4444';
  const activeColor = success ? '#4ade80' : executing ? '#60a5fa' : baseColor;
  
  return (
    <group>
      {/* Outer sphere */}
      <mesh ref={sphereRef}>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshStandardMaterial
          color={activeColor}
          emissive={activeColor}
          emissiveIntensity={active ? 1 : 0.2}
          transparent
          opacity={0.7}
        />
      </mesh>
      
      {/* Inner sphere */}
      <mesh ref={innerSphereRef}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <MeshTransmissionMaterial
          backside
          samples={4}
          resolution={256}
          transmission={1}
          clearcoat={1}
          thickness={0.2}
          chromaticAberration={0.05}
          anisotropy={0.1}
          roughness={0.2}
          distortion={0.2}
          color={activeColor}
          emissive={activeColor}
          emissiveIntensity={active ? 2 : 0.5}
        />
      </mesh>
      
      {/* Sparkles when active */}
      {active && (
        <Sparkles
          count={50}
          scale={[3, 3, 3]}
          size={2}
          speed={0.3}
          color={activeColor}
          opacity={0.7}
        />
      )}
    </group>
  );
};

// 3D scene component
const TradeAgentScene = ({ 
  selectedSignal,
  isAnalyzing,
  isTrading,
  tradeResult,
  riskProfile,
  tradeConfig
}) => {
  // Create circuit paths
  const circuitPaths = useMemo(() => {
    const paths = [];
    for (let i = 0; i < 12; i++) {
      paths.push({
        position: [
          (Math.random() - 0.5) * 15,
          (Math.random() - 0.5) * 15,
          (Math.random() - 0.5) * 3
        ],
        scale: 0.5 + Math.random() * 1.5,
        color: Math.random() > 0.5 ? '#3b82f6' : '#4f46e5',
        animated: Math.random() > 0.3
      });
    }
    return paths;
  }, []);
  
  return (
    <Canvas dpr={[1, 2]} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
      <color attach="background" args={['#0f172a']} />
      
      <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={50} />
      
      {/* Ambient lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.8} color="#60a5fa" />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#818cf8" />
      
      {/* Circuit paths in background */}
      {circuitPaths.map((path, i) => (
        <CircuitPath 
          key={i} 
          position={path.position} 
          scale={path.scale} 
          color={path.color} 
          animated={path.animated} 
        />
      ))}
      
      {/* Central energy core */}
      <group position={[0, 0, 0]}>
        <EnergyCore 
          active={!!selectedSignal} 
          direction={selectedSignal?.direction || 'long'} 
          executing={isTrading}
          success={!!tradeResult}
        />
      </group>
      
      {/* Holographic displays */}
      {selectedSignal && (
        <>
          {/* Signal Display */}
          <HolographicDisplay position={[-3, 2, 0]} width={2.8} height={1.2} rotation={[0, 0, -0.05]}>
            <Html transform>
              <div className="text-blue-300 w-64 h-32 p-3 font-mono text-xs">
                <div className="flex justify-between mb-2">
                  <div className="font-bold text-blue-200">{selectedSignal.token}</div>
                  <div className={`${selectedSignal.direction === 'long' ? 'text-green-400' : 'text-red-400'}`}>
                    {selectedSignal.direction.toUpperCase()}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <div>Source:</div>
                  <div className="text-blue-200">{selectedSignal.source}</div>
                  <div>Confidence:</div>
                  <div className="text-blue-200">{Math.round(selectedSignal.confidence * 100)}%</div>
                  <div>Social:</div>
                  <div className="text-blue-200">{selectedSignal.socialEngagement}%</div>
                  <div>Onchain:</div>
                  <div className="text-blue-200">{selectedSignal.onchainConfirmation}%</div>
                </div>
              </div>
            </Html>
          </HolographicDisplay>
          
          {/* Risk Profile Display */}
          <HolographicDisplay position={[3, 2, 0]} width={2.8} height={1.2} rotation={[0, 0, 0.05]}>
            <Html transform>
              <div className="text-blue-300 w-64 h-32 p-3 font-mono text-xs">
                <div className="font-bold text-blue-200 mb-2">{riskProfile.toUpperCase()} PROFILE</div>
                <div className="grid grid-cols-2 gap-1">
                  <div>Max Risk:</div>
                  <div className="text-blue-200">{tradeConfig.maxDailyRisk}%</div>
                  <div>Stop Loss:</div>
                  <div className="text-blue-200">{tradeConfig.stopLoss}%</div>
                  <div>Take Profit:</div>
                  <div className="text-blue-200">{tradeConfig.takeProfit}%</div>
                  <div>Gas Limit:</div>
                  <div className="text-blue-200">{tradeConfig.gasLimit} gwei</div>
                  <div>Slippage:</div>
                  <div className="text-blue-200">{tradeConfig.slippage}%</div>
                </div>
              </div>
            </Html>
          </HolographicDisplay>
          
          {/* Result Display (only shown when trade result exists) */}
          {tradeResult && (
            <HolographicDisplay position={[0, -2.5, 0]} width={5} height={1.8}>
              <Html transform>
                <div className="text-blue-300 w-96 h-40 p-3 font-mono text-xs">
                  <div className="font-bold text-green-400 mb-2 text-center">TRADE EXECUTED SUCCESSFULLY</div>
                  <div className="grid grid-cols-2 gap-1">
                    <div>Token:</div>
                    <div className="text-blue-200">{tradeResult.token}</div>
                    <div>Direction:</div>
                    <div className={`${tradeResult.direction === 'long' ? 'text-green-400' : 'text-red-400'}`}>
                      {tradeResult.direction.toUpperCase()}
                    </div>
                    <div>Entry Price:</div>
                    <div className="text-blue-200">{tradeResult.entryPrice}</div>
                    <div>Position Size:</div>
                    <div className="text-blue-200">{tradeResult.positionSize}</div>
                    <div>Stop Loss:</div>
                    <div className="text-red-400">{tradeResult.stopLoss}</div>
                    <div>Take Profit:</div>
                    <div className="text-green-400">{tradeResult.takeProfit}</div>
                    <div>TX Hash:</div>
                    <div className="text-blue-200 truncate">{tradeResult.txHash}</div>
                  </div>
                </div>
              </Html>
            </HolographicDisplay>
          )}
        </>
      )}
      
      {/* Active particles when trading */}
      {selectedSignal && (
        <ParticleFlow 
          active={isAnalyzing || isTrading} 
          direction={selectedSignal.direction} 
          speed={isTrading ? 1.5 : 0.5} 
        />
      )}
      
      {/* Subtle controls with constraints */}
      <OrbitControls 
        enablePan={false}
        enableZoom={true}
        minDistance={5}
        maxDistance={15}
        autoRotate={!selectedSignal}
        autoRotateSpeed={0.5}
        enableRotate={!isTrading}
      />
    </Canvas>
  );
};

const TradeAgent: React.FC<TradeAgentProps> = ({ 
  selectedSignal, 
  isActive,
  riskProfile = 'balanced',
  onTrade
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isTrading, setIsTrading] = useState(false);
  const [analysis, setAnalysis] = useState<string[]>([]);
  const [tradeConfig, setTradeConfig] = useState<TradeConfig>({
    maxDailyRisk: 5,
    stopLoss: 10,
    takeProfit: 20,
    gasLimit: 50,
    slippage: 0.5
  });
  const [tradeResult, setTradeResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Update config based on risk profile
  useEffect(() => {
    if (riskProfile === 'conservative') {
      setTradeConfig({
        maxDailyRisk: 3,
        stopLoss: 5,
        takeProfit: 10,
        gasLimit: 40,
        slippage: 0.3
      });
    } else if (riskProfile === 'balanced') {
      setTradeConfig({
        maxDailyRisk: 5,
        stopLoss: 10,
        takeProfit: 20,
        gasLimit: 50,
        slippage: 0.5
      });
    } else {
      setTradeConfig({
        maxDailyRisk: 10,
        stopLoss: 20,
        takeProfit: 40,
        gasLimit: 60,
        slippage: 1.0
      });
    }
  }, [riskProfile]);
  
  // When a new signal is selected, analyze it
  useEffect(() => {
    if (!selectedSignal || !isActive) return;
    
    setIsAnalyzing(true);
    setAnalysis([]);
    setTradeResult(null);
    setError(null);
    
    // Simulate analysis process with realistic step-by-step updates
    const analyzeSignal = async () => {
      const steps = [
        `Analyzing ${selectedSignal.token} signal from ${selectedSignal.source}...`,
        `Checking historical performance of ${selectedSignal.source}...`,
        `Evaluating social engagement metrics (${selectedSignal.socialEngagement}%)...`,
        `Verifying onchain confirmation signals (${selectedSignal.onchainConfirmation}%)...`,
        `Computing optimal position size based on ${riskProfile} risk profile...`,
        `Calculating entry, stop-loss and take-profit levels...`,
        `Performing final risk assessment...`
      ];
      
      for (let i = 0; i < steps.length; i++) {
        // Add a small random delay between steps for realism
        await new Promise(r => setTimeout(r, 800 + Math.random() * 400));
        setAnalysis(prev => [...prev, steps[i]]);
      }
      
      // Finish analysis
      await new Promise(r => setTimeout(r, 1000));
      setIsAnalyzing(false);
      
      // Simulate a low-confidence signal rejection (10% chance)
      if (selectedSignal.confidence < 0.7 && Math.random() < 0.1) {
        setError(`Signal confidence (${Math.round(selectedSignal.confidence * 100)}%) below required threshold for ${riskProfile} risk profile.`);
        return;
      }
    };
    
    analyzeSignal();
  }, [selectedSignal, isActive, riskProfile]);
  
  // Function to execute a trade
  const executeTrade = async () => {
    if (!selectedSignal || isTrading) return;
    
    setIsTrading(true);
    setError(null);
    
    // Simulate trade execution
    await new Promise(r => setTimeout(r, 2000));
    
    // 90% success rate
    if (Math.random() < 0.9) {
      const tradeDetails = {
        token: selectedSignal.token,
        direction: selectedSignal.direction,
        entryPrice: generateMockPrice(selectedSignal.token),
        positionSize: calculatePositionSize(selectedSignal.confidence, riskProfile),
        stopLoss: `-${tradeConfig.stopLoss}%`,
        takeProfit: `+${tradeConfig.takeProfit}%`,
        timestamp: Date.now(),
        txHash: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 10)}`,
        gas: Math.round(tradeConfig.gasLimit * (0.8 + Math.random() * 0.4)),
        status: 'success'
      };
      
      setTradeResult(tradeDetails);
      if (onTrade) onTrade(tradeDetails);
    } else {
      // Simulated failure
      setError('Transaction failed due to high network congestion. Try again with higher gas limit.');
    }
    
    setIsTrading(false);
  };
  
  // Helper function to generate realistic prices for tokens
  const generateMockPrice = (token: string) => {
    switch (token) {
      case 'ETH':
        return `$${(3500 + Math.random() * 200).toFixed(2)}`;
      case 'BTC':
        return `$${(64000 + Math.random() * 2000).toFixed(2)}`;
      case 'SOL':
        return `$${(140 + Math.random() * 15).toFixed(2)}`;
      case 'AVAX':
        return `$${(35 + Math.random() * 5).toFixed(2)}`;
      case 'ARB':
        return `$${(1.2 + Math.random() * 0.3).toFixed(2)}`;
      default:
        return `$${(10 + Math.random() * 5).toFixed(2)}`;
    }
  };
  
  // Calculate position size based on confidence and risk profile
  const calculatePositionSize = (confidence: number, risk: string) => {
    let baseSize = 0;
    
    if (risk === 'conservative') {
      baseSize = 5; // 5% of portfolio
    } else if (risk === 'balanced') {
      baseSize = 10; // 10% of portfolio
    } else {
      baseSize = 20; // 20% of portfolio
    }
    
    // Adjust by confidence
    const adjustedSize = baseSize * confidence;
    return `${adjustedSize.toFixed(1)}%`;
  };

  if (!isActive) return null;
  
  return (
    <div className="bg-gradient-to-br from-indigo-950/40 to-blue-950/30 backdrop-blur-sm rounded-xl p-6 mb-6 border border-indigo-500/30 shadow-lg shadow-blue-500/5 relative overflow-hidden h-[70vh] md:h-[75vh] perspective-1000">
      {/* 3D Scene rendered in background */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        }>
          <TradeAgentScene 
            selectedSignal={selectedSignal}
            isAnalyzing={isAnalyzing}
            isTrading={isTrading}
            tradeResult={tradeResult}
            riskProfile={riskProfile}
            tradeConfig={tradeConfig}
          />
        </Suspense>
      </div>
      
      {/* UI Overlay */}
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-8">
          <motion.h3 
            className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-indigo-200 flex items-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              animate={{ 
                rotateZ: [0, 5, 0, -5, 0],
              }}
              transition={{ 
                duration: 5, 
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="mr-3"
            >
              <Brain className="text-indigo-300" size={24} />
            </motion.div>
            <span className="tracking-wide">ECHO AGENT</span>
          </motion.h3>
          
          <motion.div 
            className="px-4 py-1.5 bg-gradient-to-r from-indigo-500/20 to-blue-500/20 rounded-full border border-indigo-500/30 text-indigo-300 text-xs font-mono flex items-center backdrop-blur-md shadow-inner shadow-indigo-500/5"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="mr-1.5">●</span>
            <span className="tracking-widest">{riskProfile.toUpperCase()}</span>
          </motion.div>
        </div>
      
        {!selectedSignal ? (
          <div className="relative h-[60vh] flex flex-col items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-md mx-auto backdrop-blur-md bg-indigo-900/20 p-6 rounded-xl border border-indigo-500/30"
            >
              <Server className="mx-auto mb-4 text-blue-400" size={40} />
              <p className="text-blue-300 font-medium">Select a signal to activate Echo Agent</p>
              <p className="text-blue-300/80 text-sm mt-2">
                Echo is waiting for your command. Select a high-confidence signal from the list to begin analysis and trading.
              </p>
            </motion.div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[60vh] md:h-[62vh]">
            {/* Left Panel - Signal Summary */}
            <motion.div 
              className="md:col-span-1 backdrop-blur-md p-4 border border-indigo-500/30 rounded-xl bg-gradient-to-r from-indigo-900/20 to-blue-900/20 overflow-hidden relative"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Animated accent line */}
              <div className="absolute top-0 left-0 right-0 h-0.5 overflow-hidden">
                <motion.div 
                  className="w-full h-full bg-gradient-to-r from-blue-400 via-indigo-300 to-blue-500"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                />
              </div>
              
              <div className="flex flex-col h-full">
                <div className="mb-4">
                  <h3 className="text-blue-100 font-medium text-lg mb-3">Signal Data</h3>
                  <div className="flex items-center">
                    <motion.div 
                      className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/80 to-indigo-500/80 flex items-center justify-center mr-3 shadow-md shadow-blue-500/20 relative"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <span className="text-white font-bold text-lg">{selectedSignal.token}</span>
                      {/* Pulsing ring animation */}
                      <motion.div 
                        className="absolute inset-0 rounded-full border-2 border-blue-400/50 -z-10"
                        animate={{ 
                          scale: [1, 1.4, 1],
                          opacity: [0.7, 0, 0.7]
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          repeatType: "reverse" 
                        }}
                      />
                    </motion.div>
                    
                    <div>
                      <div className="text-blue-100 font-medium flex items-center">
                        <span className="tracking-wide font-mono">{selectedSignal.source}</span>
                        <span className="inline-block w-1.5 h-1.5 bg-blue-400 rounded-full mx-2"></span>
                        <SquareDot size={14} className="text-blue-400 mr-1" />
                        <span className="text-blue-300/80 text-sm">ID: {selectedSignal.id.slice(0, 6)}</span>
                      </div>
                      <div className="text-sm text-indigo-300 flex items-center mt-1">
                        <span className="font-mono">Confidence:</span>
                        <span className="text-blue-200 font-bold ml-1.5">{Math.round(selectedSignal.confidence * 100)}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <motion.div 
                    className={`mt-4 px-3 py-1.5 rounded-md text-sm font-bold text-center ${
                      selectedSignal.direction === 'long' 
                        ? 'bg-green-500/30 text-green-300 border border-green-500/40' 
                        : 'bg-red-500/30 text-red-300 border border-red-500/40'
                    }`}
                    whileHover={{ scale: 1.05 }}
                  >
                    {selectedSignal.direction === 'long' ? (
                      <div className="flex items-center justify-center">
                        <ArrowUpCircle size={16} className="mr-1" />
                        LONG POSITION
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <ArrowDownCircle size={16} className="mr-1" />
                        SHORT POSITION
                      </div>
                    )}
                  </motion.div>
                </div>
                
                <div className="flex-1 mt-4 font-mono text-sm bg-indigo-950/60 rounded-lg overflow-hidden relative">
                  <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-blue-500 to-indigo-600"></div>
                  
                  {/* Terminal header */}
                  <div className="flex items-center border-b border-blue-800/50 px-4 py-2">
                    <Terminal size={14} className="text-blue-400 mr-2" />
                    <span className="text-blue-300 font-medium">Signal Metrics</span>
                  </div>
                  
                  {/* Signal data */}
                  <div className="p-4 h-full overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="text-indigo-400">Source Type:</div>
                      <div className="text-blue-300">{selectedSignal.sourceType}</div>
                      
                      <div className="text-indigo-400">Timestamp:</div>
                      <div className="text-blue-300">{new Date(selectedSignal.timestamp).toLocaleTimeString()}</div>
                      
                      <div className="text-indigo-400">Social Metrics:</div>
                      <div className="text-blue-300">{selectedSignal.socialEngagement}%</div>
                      
                      <div className="text-indigo-400">Onchain Conf:</div>
                      <div className="text-blue-300">{selectedSignal.onchainConfirmation}%</div>
                    </div>
                    
                    <div className="mt-4 text-indigo-400">Historical PNL:</div>
                    <div className="h-20 mt-2 flex items-end">
                      {selectedSignal.pnlHistory && selectedSignal.pnlHistory.map((pnl, index) => (
                        <div 
                          key={index}
                          className={`w-full ${pnl >= 0 ? 'bg-green-500/50' : 'bg-red-500/50'} rounded-sm mx-0.5`}
                          style={{ 
                            height: `${Math.min(Math.abs(pnl) * 2, 100)}%`,
                            maxWidth: `${100 / Math.max(selectedSignal.pnlHistory.length, 1)}%`
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Middle Panel - Analysis Output */}
            <motion.div 
              className="md:col-span-1 backdrop-blur-md border border-indigo-500/30 rounded-xl bg-gradient-to-b from-indigo-900/20 to-blue-950/20 overflow-hidden font-mono text-sm relative"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-blue-500 to-indigo-600"></div>
              
              {/* Terminal header */}
              <div className="flex items-center border-b border-blue-800/50 px-4 py-2">
                <Terminal size={14} className="text-blue-400 mr-2" />
                <span className="text-blue-300 font-medium">Echo Analysis Matrix</span>
              </div>
              
              {/* Log content */}
              <div className="p-4 h-[calc(100%-40px)] overflow-y-auto custom-scrollbar">
                {analysis.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.2 }}
                    className="mb-3 text-blue-200/90 flex"
                  >
                    <span className="text-indigo-400 mr-2 w-4 flex-shrink-0"><ChevronRight size={14} /></span>
                    <span>{step}</span>
                  </motion.div>
                ))}
                
                {isAnalyzing && (
                  <motion.div 
                    className="text-indigo-300 flex items-center mt-4"
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <Wand2 size={14} className="mr-2 text-indigo-400" />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-indigo-200 font-medium">
                      Processing neural inputs...
                    </span>
                  </motion.div>
                )}
                
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-300 flex items-center bg-red-900/20 p-3 rounded border border-red-500/30 mt-4"
                  >
                    <AlertTriangle size={14} className="mr-2 text-red-400 flex-shrink-0" />
                    {error}
                  </motion.div>
                )}
                
                {!isAnalyzing && !error && !tradeResult && analysis.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-green-300 flex items-center bg-green-900/20 p-3 rounded border border-green-500/30 mt-4"
                  >
                    <CheckCircle size={14} className="mr-2 text-green-400 flex-shrink-0" />
                    Analysis complete. Trade opportunity validated. Ready to execute.
                  </motion.div>
                )}
              </div>
            </motion.div>
            
            {/* Right Panel - Trade Execution */}
            <motion.div 
              className="md:col-span-1 backdrop-blur-md border border-indigo-500/30 rounded-xl bg-gradient-to-br from-indigo-900/20 to-blue-950/20 overflow-hidden relative"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <div className="h-full flex flex-col p-4">
                <h3 className="text-blue-100 font-medium text-lg mb-4">Trade Configuration</h3>
                
                {/* Trade Config Parameters */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {[
                    { label: "Max Risk", value: `${tradeConfig.maxDailyRisk}%`, color: "from-blue-500 to-blue-400" },
                    { label: "Stop Loss", value: `${tradeConfig.stopLoss}%`, color: "from-red-500 to-red-400" },
                    { label: "Take Profit", value: `${tradeConfig.takeProfit}%`, color: "from-green-500 to-green-400" },
                    { label: "Gas (gwei)", value: tradeConfig.gasLimit, color: "from-indigo-500 to-indigo-400" },
                    { label: "Slippage", value: `${tradeConfig.slippage}%`, color: "from-purple-500 to-purple-400" }
                  ].map((config, index) => (
                    <motion.div 
                      key={config.label}
                      className="bg-indigo-950/30 p-3 rounded-lg text-center border border-blue-500/20 backdrop-blur-sm relative overflow-hidden"
                      whileHover={{ y: -3, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.2)" }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div className="relative z-10">
                        <div className="text-xs text-blue-300/70 mb-1 font-mono uppercase tracking-wider">{config.label}</div>
                        <div className="text-lg bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-indigo-200 font-mono font-bold">
                          {config.value}
                        </div>
                      </div>
                      {/* Decorative gradient dot */}
                      <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-r ${config.color} opacity-40 blur-lg`}></div>
                    </motion.div>
                  ))}
                </div>
                
                {/* Position Sizing */}
                <div className="mb-6 bg-indigo-950/30 p-4 rounded-lg border border-blue-500/20">
                  <div className="text-xs text-blue-300/70 mb-2 font-mono uppercase tracking-wider">Position Size</div>
                  <div className="text-2xl bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-indigo-200 font-mono font-bold text-center">
                    {calculatePositionSize(selectedSignal.confidence, riskProfile)}
                  </div>
                </div>
                
                <div className="flex-grow"></div>
                
                {/* Execute Trade Button */}
                {!isAnalyzing && !error && !tradeResult && (
                  <motion.button
                    onClick={executeTrade}
                    disabled={isTrading}
                    className={`
                      w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500
                      text-white font-bold py-4 px-4 rounded-xl flex items-center justify-center 
                      transition-all duration-300 shadow-lg shadow-indigo-500/30
                      border border-indigo-400/30 relative overflow-hidden
                    `}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    {/* Animated gradient background */}
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-indigo-600/0 via-indigo-400/30 to-indigo-600/0"
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    />
                    
                    <div className="relative z-10 flex items-center font-mono tracking-wide">
                      {isTrading ? (
                        <>
                          <div className="mr-3 relative">
                            <div className="w-6 h-6 border-2 border-blue-200 border-t-transparent rounded-full animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                            </div>
                          </div>
                          <span className="text-blue-100">PROCESSING TRANSACTION...</span>
                        </>
                      ) : (
                        <>
                          <motion.div 
                            className="mr-3"
                            animate={{ rotate: [0, 10, 0, -10, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            <Zap className="text-blue-200" size={24} />
                          </motion.div>
                          <span className="text-blue-100">
                            EXECUTE {selectedSignal.direction === 'long' ? 'BUY' : 'SELL'} TRADE
                          </span>
                        </>
                      )}
                    </div>
                  </motion.button>
                )}
                
                {/* Trade Result Success Message */}
                {tradeResult && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gradient-to-br from-green-900/30 to-blue-900/30 backdrop-blur-sm border border-green-500/30 rounded-xl p-4 relative overflow-hidden"
                  >
                    {/* Success animation */}
                    <motion.div 
                      className="absolute inset-0 bg-green-500/5"
                      animate={{ opacity: [0, 0.2, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    
                    <div className="flex items-center mb-3">
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", duration: 1 }}
                      >
                        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                          <CheckCircle className="text-green-400" size={24} />
                        </div>
                      </motion.div>
                      <motion.h4 
                        className="text-green-400 font-bold ml-3 flex items-center"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-emerald-200">
                          Transaction Executed
                        </span>
                        <motion.div 
                          className="ml-2 w-1.5 h-1.5 bg-green-400 rounded-full"
                          animate={{ scale: [1, 1.5, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      </motion.h4>
                    </div>
                    
                    <motion.div 
                      className="mt-4 p-3 bg-indigo-900/30 rounded-lg border border-indigo-500/20 font-mono text-xs"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                    >
                      <div className="flex flex-wrap gap-y-2">
                        <div className="mr-4 text-blue-300/70">Transaction Hash:</div>
                        <div className="text-indigo-300 flex-1 truncate">{tradeResult.txHash}</div>
                      </div>
                      <div className="flex mt-1">
                        <div className="mr-4 text-blue-300/70">Gas Used:</div>
                        <div className="text-indigo-300">{tradeResult.gas} gwei</div>
                      </div>
                    </motion.div>
                    
                    <motion.button
                      onClick={() => setTradeResult(null)}
                      className="mt-4 w-full bg-gradient-to-r from-indigo-900/80 to-blue-900/80 hover:from-indigo-800/80 hover:to-blue-800/80 text-blue-100 font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-colors border border-blue-500/30"
                      whileHover={{ y: -2, boxShadow: "0 10px 15px -3px rgba(59, 130, 246, 0.3)" }}
                      whileTap={{ y: 0 }}
                    >
                      <BarChart4 className="mr-2 text-blue-300" size={18} />
                      View Complete Details
                    </motion.button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </div>
      
      {/* Add a global CSS class for custom scrollbars */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(30, 41, 59, 0.5);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(99, 102, 241, 0.5);
          border-radius: 4px;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
};

export default TradeAgent;