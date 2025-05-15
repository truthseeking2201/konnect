import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { AlertTriangle, TrendingUp, Twitter, MessageSquare, Check, Zap, Activity, BarChart4 } from 'lucide-react';

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

interface SignalEngineProps {
  isActive: boolean;
  selectedRisk?: 'conservative' | 'balanced' | 'aggressive';
  onSelectSignal?: (signal: Signal) => void;
}

const SignalEngine: React.FC<SignalEngineProps> = ({ 
  isActive, 
  selectedRisk = 'balanced',
  onSelectSignal
}) => {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSignalId, setSelectedSignalId] = useState<string | null>(null);
  
  // Ref for particle container
  const particleRef = useRef<HTMLDivElement>(null);
  
  // Generate realistic mock signals
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
          onchainConfirmation: 76
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
          onchainConfirmation: 82
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
          onchainConfirmation: 68
        },
        {
          id: 'sig_4',
          source: 'KonnectUser_042',
          sourceType: 'konnect',
          token: 'AVAX',
          confidence: 0.83,
          direction: 'long',
          timestamp: Date.now() - 45 * 60 * 1000, // 45 mins ago
          pnlHistory: [15, 12, 18, 14, 16],
          socialEngagement: 80,
          onchainConfirmation: 74
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
    }, 1500);
  }, [isActive, selectedRisk]);
  
  // Format timestamp to relative time
  const formatRelativeTime = (timestamp: number) => {
    const now = Date.now();
    const diffMinutes = Math.floor((now - timestamp) / (60 * 1000));
    
    if (diffMinutes < 1) return 'just now';
    if (diffMinutes === 1) return '1 min ago';
    if (diffMinutes < 60) return `${diffMinutes} mins ago`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours === 1) return '1 hour ago';
    if (diffHours < 24) return `${diffHours} hours ago`;
    
    return new Date(timestamp).toLocaleDateString();
  };
  
  // Get source icon
  const getSourceIcon = (sourceType: 'twitter' | 'telegram' | 'konnect') => {
    switch (sourceType) {
      case 'twitter':
        return <Twitter size={16} className="text-blue-400" />;
      case 'telegram':
        return <MessageSquare size={16} className="text-blue-300" />;
      case 'konnect':
        return <Check size={16} className="text-green-400" />;
      default:
        return null;
    }
  };

  // Handle signal selection
  const handleSelectSignal = (signal: Signal) => {
    setSelectedSignalId(signal.id);
    if (onSelectSignal) {
      onSelectSignal(signal);
    }
  };
  
  // Create particle effect when signals change
  useEffect(() => {
    if (!particleRef.current || isLoading || signals.length === 0) return;
    
    const createParticle = () => {
      const particle = document.createElement('div');
      const size = Math.random() * 6 + 2;
      
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.background = `rgba(${Math.floor(Math.random()*80 + 100)}, ${Math.floor(Math.random()*150 + 100)}, 255, ${Math.random() * 0.5 + 0.5})`;
      particle.style.borderRadius = '50%';
      particle.style.position = 'absolute';
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.filter = 'blur(1px)';
      particle.style.boxShadow = `0 0 ${Math.random() * 10 + 5}px rgba(50, 120, 255, 0.7)`;
      
      // Add to container
      particleRef.current?.appendChild(particle);
      
      // Animate
      const keyframes = [
        { transform: 'translateY(0) scale(1)', opacity: 1 },
        { transform: `translateY(-${Math.random() * 50 + 20}px) scale(0)`, opacity: 0 }
      ];
      
      const animation = particle.animate(keyframes, {
        duration: Math.random() * 2000 + 1000,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
      });
      
      animation.onfinish = () => {
        particle.remove();
      };
    };
    
    // Create particles periodically
    const interval = setInterval(() => {
      if (Math.random() > 0.6) { // only create particles sometimes to avoid too many
        createParticle();
      }
    }, 300);
    
    return () => clearInterval(interval);
  }, [isLoading, signals]);

  if (!isActive) return null;
  
  return (
    <div className="w-full mb-8 relative">
      {/* Particle container for ambient effects */}
      <div 
        ref={particleRef} 
        className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-70"
      ></div>
      
      <div className="bg-gradient-to-r from-indigo-900/20 via-blue-900/10 to-indigo-900/20 backdrop-blur-sm rounded-xl p-5 border border-blue-500/30 shadow-lg shadow-blue-500/10 relative z-10">
        <div className="flex justify-between items-center mb-6">
          <motion.h3 
            className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-300 flex items-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <TrendingUp className="mr-2 text-blue-400" size={24} />
            <span className="tracking-wide">SIGNAL ENGINE</span>
            <motion.div 
              className="ml-2"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            >
              <Activity className="text-blue-400" size={16} />
            </motion.div>
          </motion.h3>
          
          <div className="flex items-center bg-blue-900/30 px-3 py-1.5 rounded-full">
            <motion.div 
              className="inline-block w-2 h-2 bg-green-400 rounded-full mr-2"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            ></motion.div>
            <span className="text-sm text-green-400 font-mono tracking-wider">LIVE</span>
          </div>
        </div>
      
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 gap-4"
            >
              {[1, 2, 3].map((i) => (
                <div 
                  key={i} 
                  className="border border-blue-500/20 bg-indigo-900/10 rounded-xl p-4 relative overflow-hidden"
                >
                  <div className="animate-pulse">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-800/50"></div>
                      <div className="ml-3">
                        <div className="h-4 w-28 bg-blue-700/30 rounded"></div>
                        <div className="h-3 w-20 bg-blue-600/20 rounded mt-2"></div>
                      </div>
                      <div className="ml-auto">
                        <div className="h-6 w-12 bg-blue-700/30 rounded"></div>
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-3">
                      <div className="h-8 bg-blue-900/40 rounded"></div>
                      <div className="h-8 bg-blue-900/40 rounded"></div>
                    </div>
                  </div>
                  
                  {/* Animated loader line */}
                  <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 via-indigo-400 to-purple-500">
                    <motion.div 
                      className="w-full h-full"
                      animate={{ scaleX: [0, 1], x: ['-100%', '100%'] }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 2, 
                        ease: "easeInOut" 
                      }}
                    />
                  </div>
                </div>
              ))}
            </motion.div>
          ) : signals.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-gradient-to-br from-amber-900/20 to-amber-800/10 backdrop-blur-sm rounded-xl p-6 text-center border border-amber-500/30"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <AlertTriangle className="mx-auto mb-3 text-amber-400" size={28} />
                <p className="text-amber-200/80 font-medium">No signals matching your risk profile at the moment.</p>
                <p className="text-amber-200/60 text-sm mt-1">Echo is actively scanning for high-confidence signals.</p>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 gap-4"
            >
              {signals.map((signal, index) => (
                <motion.div
                  key={signal.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ 
                    y: -5, 
                    boxShadow: "0 12px 20px -10px rgba(59, 130, 246, 0.3)",
                    scale: 1.01
                  }}
                  className={`
                    relative bg-gradient-to-r 
                    ${selectedSignalId === signal.id 
                      ? 'from-blue-900/40 to-indigo-900/40 border-2 border-blue-400/70' 
                      : 'from-blue-900/20 to-indigo-900/20 border border-blue-500/30'}
                    backdrop-blur-sm rounded-xl p-4 cursor-pointer
                    transition-all duration-300 hover:border-blue-400/80
                  `}
                  onClick={() => handleSelectSignal(signal)}
                >
                  {/* Selected indicator glow */}
                  {selectedSignalId === signal.id && (
                    <>
                      <div className="absolute inset-0 bg-blue-500/5 rounded-xl pointer-events-none"></div>
                      <motion.div 
                        className="absolute -inset-px rounded-xl border-2 border-blue-400/60 pointer-events-none"
                        animate={{ opacity: [0.6, 1, 0.6] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      ></motion.div>
                    </>
                  )}
                  
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <motion.div 
                        className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/80 to-indigo-500/80 flex items-center justify-center mr-3 shadow-lg shadow-blue-500/20"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <span className="text-white font-bold text-lg">{signal.token}</span>
                        {/* Subtle pulsing glow effect */}
                        <motion.div 
                          className="absolute inset-0 rounded-full bg-blue-400/20"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      </motion.div>
                      
                      <div>
                        <div className="flex items-center text-blue-100 font-medium">
                          <span className="mr-1.5 p-1 bg-indigo-800/40 rounded-full">
                            {getSourceIcon(signal.sourceType)}
                          </span>
                          <span className="ml-1 font-mono tracking-wide">{signal.source}</span>
                          <motion.span 
                            className={`ml-2 px-2 py-0.5 rounded-md text-xs font-bold ${
                              signal.direction === 'long' 
                                ? 'bg-green-500/30 text-green-300 border border-green-500/40' 
                                : 'bg-red-500/30 text-red-300 border border-red-500/40'
                            }`}
                            whileHover={{ scale: 1.05 }}
                          >
                            {signal.direction.toUpperCase()}
                          </motion.span>
                        </div>
                        <div className="text-sm text-blue-300/70 mt-1 flex items-center">
                          <span className="inline-block w-1.5 h-1.5 bg-blue-400/50 rounded-full mr-1.5"></span>
                          {formatRelativeTime(signal.timestamp)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <motion.div 
                        className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-indigo-200"
                        whileHover={{ scale: 1.1 }}
                      >
                        {Math.round(signal.confidence * 100)}%
                      </motion.div>
                      <div className="text-xs text-blue-300/70 font-mono uppercase tracking-wider">confidence</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="bg-indigo-950/30 rounded-lg p-3 backdrop-blur-sm border border-blue-500/20">
                      <div className="w-full">
                        <div className="flex justify-between items-center mb-1.5">
                          <div className="text-xs text-blue-300/70 flex items-center font-mono">
                            <Twitter className="mr-1" size={12} />
                            SOCIAL SIGNAL
                          </div>
                          <div className="text-xs text-blue-200 font-bold">{signal.socialEngagement}%</div>
                        </div>
                        <div className="w-full bg-indigo-950/60 rounded-full h-1.5 overflow-hidden">
                          <motion.div 
                            className="bg-gradient-to-r from-blue-400 to-indigo-300 h-1.5 rounded-full relative"
                            style={{ width: `${signal.socialEngagement}%` }}
                            initial={{ width: 0 }}
                            animate={{ width: `${signal.socialEngagement}%` }}
                            transition={{ duration: 1, delay: 0.2 }}
                          >
                            {/* Animated shine effect */}
                            <motion.div 
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                              animate={{ x: ['-100%', '100%'] }}
                              transition={{ repeat: Infinity, duration: 1.5, repeatDelay: 0.5 }}
                            />
                          </motion.div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-indigo-950/30 rounded-lg p-3 backdrop-blur-sm border border-blue-500/20">
                      <div className="w-full">
                        <div className="flex justify-between items-center mb-1.5">
                          <div className="text-xs text-blue-300/70 flex items-center font-mono">
                            <BarChart4 className="mr-1" size={12} />
                            ONCHAIN DATA
                          </div>
                          <div className="text-xs text-blue-200 font-bold">{signal.onchainConfirmation}%</div>
                        </div>
                        <div className="w-full bg-indigo-950/60 rounded-full h-1.5 overflow-hidden">
                          <motion.div 
                            className="bg-gradient-to-r from-green-400 to-emerald-300 h-1.5 rounded-full relative"
                            style={{ width: `${signal.onchainConfirmation}%` }}
                            initial={{ width: 0 }}
                            animate={{ width: `${signal.onchainConfirmation}%` }}
                            transition={{ duration: 1, delay: 0.4 }}
                          >
                            {/* Animated shine effect */}
                            <motion.div 
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                              animate={{ x: ['-100%', '100%'] }}
                              transition={{ repeat: Infinity, duration: 1.5, repeatDelay: 0.7 }}
                            />
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Animated Select Indicator */}
                  {selectedSignalId !== signal.id && (
                    <motion.div 
                      className="absolute bottom-3 right-3 text-blue-300/70 text-xs flex items-center opacity-0 group-hover:opacity-100"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.7 }}
                      whileHover={{ scale: 1.05, opacity: 1 }}
                    >
                      <Zap size={12} className="mr-1" />
                      SELECT SIGNAL
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SignalEngine;