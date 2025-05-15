import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, DollarSign, ChevronDown, ChevronUp, Check, ExternalLink, Zap, Sparkles } from 'lucide-react';

// Particle animation canvas component
const ParticleField = ({ color = '#E8FF65' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const updateSize = () => {
      if (canvas && canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
      }
    };
    
    window.addEventListener('resize', updateSize);
    updateSize();
    
    // Particle properties
    const particles: {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      life: number;
      maxLife: number;
    }[] = [];
    
    // Create particles
    const createParticles = () => {
      if (particles.length < 50 && Math.random() > 0.8) {
        const size = Math.random() * 2 + 1;
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: size,
          speedX: (Math.random() - 0.5) * 0.8,
          speedY: (Math.random() - 0.5) * 0.8,
          life: 0,
          maxLife: 100 + Math.random() * 100
        });
      }
    };
    
    // Update particles
    const updateParticles = () => {
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.speedX;
        p.y += p.speedY;
        p.life++;
        
        // Remove if dead
        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
          i--;
          continue;
        }
      }
    };
    
    // Draw particles
    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        const opacity = 1 - (p.life / p.maxLife);
        ctx.fillStyle = color + Math.round(opacity * 255).toString(16).padStart(2, '0');
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
    };
    
    // Animation loop
    const animate = () => {
      createParticles();
      updateParticles();
      drawParticles();
      animationRef.current = requestAnimationFrame(animate);
    };
    
    const animationRef = { current: 0 };
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', updateSize);
    };
  }, [color]);
  
  return <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-20" />;
};

interface DepositNeuralFrameProps {
  isVisible: boolean;
  walletAddress?: string;
  selectedRisk?: string;
  onComplete: () => void;
}

const DepositNeuralFrame: React.FC<DepositNeuralFrameProps> = ({ 
  isVisible, 
  walletAddress, 
  selectedRisk = 'balanced',
  onComplete 
}) => {
  const [amount, setAmount] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'deposit' | 'summary'>('deposit');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showLeverageInfo, setShowLeverageInfo] = useState(false);
  const [pulseRate, setPulseRate] = useState(1);
  
  // Holographic effect
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Neural scan animation
  const [scanProgress, setScanProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  
  // Token selection with holographic cards
  const [selectedToken, setSelectedToken] = useState<'USDC' | 'ETH' | 'USDT'>('USDC');
  const [showTokenDropdown, setShowTokenDropdown] = useState(false);
  
  const tokenOptions = [
    { id: 'USDC', name: 'USDC', icon: '💵', balance: '5,245.00', color: 'text-blue-400', glow: 'shadow-blue-400/20' },
    { id: 'ETH', name: 'ETH', icon: '💎', balance: '3.42', color: 'text-purple-400', glow: 'shadow-purple-400/20' },
    { id: 'USDT', name: 'USDT', icon: '💰', balance: '2,500.00', color: 'text-green-400', glow: 'shadow-green-400/20' }
  ];
  
  // Adaptive text suggestion based on selected risk
  const suggestedAmount = 
    selectedRisk === 'conservative' ? '500' :
    selectedRisk === 'balanced' ? '1000' :
    selectedRisk === 'aggressive' ? '2500' : '1000';
  
  // Reset panel when it becomes visible
  useEffect(() => {
    if (isVisible) {
      setAmount('');
      setActiveTab('deposit');
      setShowSuccess(false);
      setIsProcessing(false);
    }
  }, [isVisible]);
  
  // Handle mouse move for holographic effect
  useEffect(() => {
    if (!containerRef.current) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const container = containerRef.current;
      if (!container) return;
      
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      setMousePosition({ x, y });
    };
    
    containerRef.current.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      containerRef.current?.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  // Neural scan animation
  useEffect(() => {
    if (isProcessing && scanProgress < 100) {
      setIsScanning(true);
      const interval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 1;
        });
      }, 20);
      
      return () => clearInterval(interval);
    } else if (!isProcessing) {
      setScanProgress(0);
      setIsScanning(false);
    }
  }, [isProcessing, scanProgress]);
  
  // Handle deposit submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setPulseRate(2);
    
    // Simulate processing delay with phases
    setTimeout(() => {
      // First phase - verification
      setPulseRate(3);
      
      setTimeout(() => {
        // Second phase - processing
        setPulseRate(4);
        
        setTimeout(() => {
          // Complete
          setIsProcessing(false);
          setShowSuccess(true);
          setPulseRate(1);
          
          // Simulate transaction completion
          setTimeout(() => {
            setActiveTab('summary');
          }, 1500);
        }, 800);
      }, 800);
    }, 1000);
  };
  
  // Handle final confirmation
  const handleConfirm = () => {
    // Complete the deposit flow
    onComplete();
  };
  
  if (!isVisible) return null;
  
  // Calculate expected APY based on risk profile
  const expectedApy = 
    selectedRisk === 'conservative' ? '12-18%' :
    selectedRisk === 'balanced' ? '20-35%' :
    selectedRisk === 'aggressive' ? '40-65%' : '20-35%';
  
  // Calculate expected daily revenue
  const dailyRevenuePercent = 
    selectedRisk === 'conservative' ? 0.05 :
    selectedRisk === 'balanced' ? 0.08 :
    selectedRisk === 'aggressive' ? 0.15 : 0.08;
  
  const parsedAmount = parseFloat(amount.replace(/,/g, '')) || 0;
  const dailyRevenue = (parsedAmount * dailyRevenuePercent).toFixed(2);
  
  // Leverage multiplier based on risk profile
  const leverageMultiplier = 
    selectedRisk === 'conservative' ? 1 :
    selectedRisk === 'balanced' ? 2 :
    selectedRisk === 'aggressive' ? 3 : 2;
  
  // Calculate available balance for selected token
  const selectedTokenObj = tokenOptions.find(t => t.id === selectedToken);
  const availableBalance = selectedTokenObj?.balance || '0.00';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="container-grid py-10"
    >
      <div 
        ref={containerRef}
        className="relative bg-indigo-950/40 backdrop-blur-xl rounded-xl border border-blue-500/30 shadow-lg shadow-blue-500/10 max-w-xl mx-auto overflow-hidden"
        style={{
          background: `linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(99, 102, 241, 0.1) 100%)`,
        }}
      >
        {/* Animated particles */}
        <ParticleField color={
          selectedRisk === 'conservative' ? '#3095FF' :
          selectedRisk === 'aggressive' ? '#6366F1' : 
          '#3B82F6'
        } />
        
        {/* Holographic gradient overlay */}
        <div 
          className="absolute inset-0 z-0 opacity-20 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(59, 130, 246, 0.4) 0%, transparent 50%)`,
          }}
        />
        
        {/* Neural Scan Line */}
        {isScanning && (
          <motion.div 
            className="absolute top-0 left-0 w-full h-1 bg-blue-500 z-10"
            animate={{
              y: `${scanProgress}%`,
              opacity: [0.7, 1, 0.7]
            }}
            transition={{
              y: { duration: 2, ease: "linear" },
              opacity: { repeat: Infinity, duration: 1 }
            }}
          />
        )}
        
        <div className="relative z-10 p-6">
          {/* Tabs */}
          <div className="flex mb-6 border-b border-gray-800">
            <button
              className={`pb-3 px-4 font-medium ${
                activeTab === 'deposit' 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-gray-400 hover:text-gray-300'
              }`}
              onClick={() => !showSuccess && setActiveTab('deposit')}
            >
              <span className="flex items-center">
                <Zap size={16} className="mr-2" /> Deposit
              </span>
            </button>
            <button
              className={`pb-3 px-4 font-medium ${
                activeTab === 'summary' 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-gray-400 hover:text-gray-300'
              }`}
              onClick={() => showSuccess && setActiveTab('summary')}
            >
              <span className="flex items-center">
                <Sparkles size={16} className="mr-2" /> Summary
              </span>
            </button>
            
            {/* Pulse indicator */}
            <div className="ml-auto">
              <div className={`flex items-center transition-colors ${isProcessing ? 'text-primary' : 'text-gray-600'}`}>
                <motion.div 
                  className="w-2 h-2 rounded-full bg-current mr-2"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ 
                    duration: 2 / pulseRate, 
                    repeat: Infinity,
                    repeatType: "loop" 
                  }}
                />
                <span className="text-xs uppercase tracking-wider">
                  {isProcessing ? 'Processing' : 'Ready'}
                </span>
              </div>
            </div>
          </div>
          
          {activeTab === 'deposit' && (
            <AnimatePresence mode="wait">
              {showSuccess ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-6"
                >
                  <motion.div 
                    className="w-20 h-20 bg-primary/20 rounded-full mx-auto flex items-center justify-center mb-4"
                    initial={{ scale: 0.8 }}
                    animate={{ 
                      scale: [0.8, 1.2, 1],
                      boxShadow: [
                        '0 0 0 0 rgba(232, 255, 101, 0.4)',
                        '0 0 0 20px rgba(232, 255, 101, 0)',
                        '0 0 0 0 rgba(232, 255, 101, 0.4)'
                      ]
                    }}
                    transition={{ 
                      duration: 1.5,
                      repeat: Infinity,
                      repeatType: "loop"
                    }}
                  >
                    <Check className="text-primary" size={32} strokeWidth={3} />
                  </motion.div>
                  
                  <h3 className="text-xl font-space font-bold text-white mb-2">
                    <motion.span 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      Neural Synthesis Complete
                    </motion.span>
                  </h3>
                  
                  <motion.p 
                    className="text-gray-300 mb-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    Your capital has been quantumly integrated into the algorithm.
                  </motion.p>
                  
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    <button
                      onClick={() => setActiveTab('summary')}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 px-6 rounded-md font-medium flex items-center justify-center mx-auto group relative overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center">
                        Interface with Metrics <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                      </span>
                      <motion.div 
                        className="absolute inset-0 bg-primary-glow/30"
                        animate={{ 
                          x: ['-100%', '100%'],
                        }}
                        transition={{ 
                          duration: 1.5, 
                          repeat: Infinity,
                          ease: "linear"
                        }}
                      />
                    </button>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.form
                  key="deposit-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                >
                  <div className="mb-6">
                    <label className="block text-gray-400 mb-2 text-sm flex items-center">
                      <Zap size={14} className="text-primary mr-1" /> Input Quantum
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <DollarSign className="text-gray-400" size={18} />
                      </div>
                      <input
                        type="text"
                        value={amount}
                        onChange={(e) => {
                          // Allow only numbers and commas
                          const value = e.target.value.replace(/[^0-9,]/g, '');
                          setAmount(value);
                        }}
                        placeholder={`Suggested: $${suggestedAmount}`}
                        className="bg-bg/40 backdrop-blur-sm border border-gray-700 text-white rounded-md py-3 pl-10 pr-20 w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center">
                        <div className="relative">
                          <button 
                            type="button"
                            onClick={() => setShowTokenDropdown(!showTokenDropdown)}
                            className="h-full px-3 flex items-center bg-bg/40 border-l border-gray-700 rounded-r-md focus:outline-none transition-colors hover:bg-primary/10"
                          >
                            <motion.span 
                              className="w-6 h-6 flex items-center justify-center rounded-full mr-1"
                              whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                              transition={{ duration: 0.5 }}
                            >
                              {selectedTokenObj?.icon}
                            </motion.span>
                            <span className={`font-medium ${selectedTokenObj?.color}`}>{selectedToken}</span>
                            {showTokenDropdown ? <ChevronUp size={14} className="ml-1" /> : <ChevronDown size={14} className="ml-1" />}
                          </button>
                          
                          <AnimatePresence>
                            {showTokenDropdown && (
                              <motion.div 
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className="absolute right-0 mt-2 w-48 bg-bg/80 backdrop-blur-lg border border-gray-700 rounded-md overflow-hidden shadow-xl z-10"
                              >
                                {tokenOptions.map((token) => (
                                  <motion.button
                                    key={token.id}
                                    type="button"
                                    onClick={() => {
                                      setSelectedToken(token.id as any);
                                      setShowTokenDropdown(false);
                                    }}
                                    className={`w-full text-left px-4 py-3 hover:bg-surface flex items-center relative ${
                                      selectedToken === token.id ? 'bg-surface/70' : ''
                                    }`}
                                    whileHover={{ 
                                      backgroundColor: 'rgba(255,255,255,0.05)',
                                      transition: { duration: 0.1 }
                                    }}
                                  >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${token.glow} shadow-lg`}>
                                      <span className="text-lg">{token.icon}</span>
                                    </div>
                                    <div>
                                      <span className={`font-medium ${token.color} block leading-tight`}>{token.name}</span>
                                      <span className="text-xs text-gray-400 block">{token.balance} available</span>
                                    </div>
                                    {selectedToken === token.id && (
                                      <Check size={14} className="ml-auto text-primary" />
                                    )}
                                  </motion.button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-gray-400">
                      <span>Available: {availableBalance} {selectedToken}</span>
                      <button 
                        type="button" 
                        onClick={() => setAmount(availableBalance.replace(/,/g, ''))}
                        className="text-blue-400 hover:underline flex items-center"
                      >
                        <span>MAX</span>
                        <motion.div
                          animate={{ x: [0, 3, 0] }}
                          transition={{ repeat: 3, duration: 0.3, delay: 1, repeatDelay: 5 }}
                        >
                          <Zap size={10} className="ml-1" />
                        </motion.div>
                      </button>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex justify-between items-center">
                      <label className="block text-gray-400 mb-2 text-sm flex items-center">
                        <Zap size={14} className="text-primary mr-1" /> Neural Amplifier
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowLeverageInfo(!showLeverageInfo)}
                        className="text-electric-ink text-xs flex items-center hover:underline"
                      >
                        <motion.span
                          animate={{ opacity: [0.7, 1, 0.7] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          What is this?
                        </motion.span>
                      </button>
                    </div>
                    
                    <AnimatePresence>
                      {showLeverageInfo && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="bg-bg/40 backdrop-blur-sm border border-gray-800 rounded-md p-3 mb-3 text-xs text-gray-300">
                            Neural amplification expands your signal strength through quantum borrowing.
                            Higher amplification means stronger potential returns but increased volatility.
                            Your risk profile automatically calibrates the optimal amplification level.
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    <motion.div 
                      className="bg-bg/30 backdrop-blur-sm border border-gray-800 rounded-md p-4 flex justify-between items-center relative overflow-hidden"
                      whileHover={{ boxShadow: '0 0 15px rgba(20, 241, 255, 0.2)' }}
                    >
                      {/* Amplification lines */}
                      <div className="absolute inset-0 pointer-events-none">
                        {[...Array(leverageMultiplier * 2)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute left-0 h-[1px] w-full bg-electric-ink/20"
                            style={{ top: `${(i + 1) * (100 / (leverageMultiplier * 2 + 1))}%` }}
                            animate={{
                              opacity: [0.1, 0.3, 0.1],
                              width: ['0%', '100%']
                            }}
                            transition={{
                              opacity: {
                                duration: 2,
                                repeat: Infinity,
                                delay: i * 0.2
                              },
                              width: {
                                duration: 2,
                                repeat: Infinity,
                                delay: i * 0.1
                              }
                            }}
                          />
                        ))}
                      </div>
                      
                      <div className="relative z-10">
                        <div className="font-space font-medium text-white text-xl flex items-center">
                          <span className="mr-1">{leverageMultiplier}x</span>
                          <motion.div 
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className={`w-3 h-3 rounded-full bg-primary/50`}
                          />
                        </div>
                        <div className="text-xs text-gray-400 mt-1">Based on {selectedRisk} profile</div>
                      </div>
                      <div className="text-right relative z-10">
                        <div className="font-space font-medium text-electric-ink">
                          ${parsedAmount ? (parsedAmount * leverageMultiplier).toLocaleString() : '0.00'}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">Quantum position</div>
                      </div>
                    </motion.div>
                  </div>
                  
                  <div className="mb-8">
                    <label className="block text-gray-400 mb-2 text-sm flex items-center">
                      <Zap size={14} className="text-primary mr-1" /> Projected Outcome
                    </label>
                    <motion.div 
                      className="bg-bg/30 backdrop-blur-sm border border-gray-800 rounded-md p-6 grid grid-cols-2 gap-8 relative overflow-hidden"
                      whileHover={{ boxShadow: '0 0 15px rgba(232, 255, 101, 0.2)' }}
                    >
                      {/* Neural network background effect */}
                      <div className="absolute inset-0 pointer-events-none opacity-30">
                        {[...Array(10)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute bg-primary/5"
                            style={{
                              left: `${Math.random() * 100}%`,
                              top: `${Math.random() * 100}%`,
                              width: `${10 + Math.random() * 20}%`,
                              height: '1px',
                              transformOrigin: '0 0',
                              transform: `rotate(${Math.random() * 360}deg)`
                            }}
                            animate={{
                              opacity: [0, 0.5, 0],
                              width: ['0%', `${10 + Math.random() * 40}%`]
                            }}
                            transition={{
                              repeat: Infinity,
                              duration: 3 + Math.random() * 5,
                              delay: Math.random() * 2
                            }}
                          />
                        ))}
                      </div>
                      
                      <div className="relative z-10">
                        <div className="text-sm text-gray-400 mb-1 flex items-center">
                          <motion.div 
                            animate={{ y: [0, -3, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="mr-1"
                          >
                            〰️
                          </motion.div>
                          Daily Revenue (est.)
                        </div>
                        <motion.div 
                          className="font-space font-medium text-2xl text-white"
                          animate={{ 
                            color: dailyRevenue && parseFloat(dailyRevenue) > 0 
                              ? ['#FFFFFF', '#E8FF65', '#FFFFFF'] 
                              : '#FFFFFF'
                          }}
                          transition={{ duration: 3, repeat: Infinity }}
                        >
                          ${dailyRevenue}
                        </motion.div>
                      </div>
                      <div className="relative z-10">
                        <div className="text-sm text-gray-400 mb-1 flex items-center">
                          <motion.div 
                            animate={{ 
                              rotate: [0, 10, 0, -10, 0],
                            }}
                            transition={{ duration: 5, repeat: Infinity }}
                            className="mr-1"
                          >
                            ✨
                          </motion.div>
                          Projection Range
                        </div>
                        <motion.div 
                          className="font-space font-medium text-2xl"
                          animate={{ 
                            color: ['#14F1FF', '#E8FF65', '#14F1FF'],
                          }}
                          transition={{ duration: 4, repeat: Infinity }}
                        >
                          {expectedApy}
                        </motion.div>
                      </div>
                    </motion.div>
                  </div>
                  
                  <div className="border-t border-gray-800 pt-6 text-center">
                    <motion.button
                      type="submit"
                      disabled={isProcessing || !parsedAmount}
                      className={`
                        w-full py-3 rounded-md font-space font-semibold flex items-center justify-center relative overflow-hidden
                        ${parsedAmount ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' : 'bg-gray-700 text-gray-400 cursor-not-allowed'}
                      `}
                      whileHover={parsedAmount ? { scale: 1.02 } : undefined}
                      whileTap={parsedAmount ? { scale: 0.98 } : undefined}
                    >
                      {/* Animated background */}
                      {parsedAmount && !isProcessing && (
                        <motion.div 
                          className="absolute inset-0 bg-blue-500/20"
                          animate={{ 
                            x: ['-100%', '100%'],
                          }}
                          transition={{ 
                            duration: 2, 
                            repeat: Infinity,
                            ease: "linear"
                          }}
                        />
                      )}
                      
                      {isProcessing ? (
                        <motion.div className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-bg" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span className="flex items-center">
                            <motion.span
                              animate={{ opacity: [1, 0.5, 1] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            >
                              {scanProgress < 30 ? 'Initializing Quantum Bridge' : 
                               scanProgress < 60 ? 'Synthesizing Neural Paths' : 
                               scanProgress < 90 ? 'Binding Capital Matrix' : 
                               'Finalizing Integration'}
                            </motion.span>
                          </span>
                        </motion.div>
                      ) : (
                        <span className="relative z-10 flex items-center tracking-wider">
                          INITIATE NEURAL SYNTHESIS 
                          <motion.span
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.5 }}
                            className="ml-2"
                          >
                            <Zap size={16} />
                          </motion.span>
                        </span>
                      )}
                    </motion.button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          )}
          
          {activeTab === 'summary' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-lg font-space font-medium text-white mb-4 flex items-center">
                  <motion.span
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="inline-block mr-2"
                  >
                    ✨
                  </motion.span>
                  Neural Projection Matrix
                </h3>
                
                <div className="space-y-4">
                  {[
                    { label: 'Initial Quantum', value: `$${parsedAmount.toLocaleString()} ${selectedToken}` },
                    { label: 'Neural Amplifier', value: `${leverageMultiplier}x` },
                    { label: 'Effective Position', value: `$${(parsedAmount * leverageMultiplier).toLocaleString()}` },
                    { label: 'Risk Profile', value: selectedRisk, highlight: true },
                    { label: 'Projection Range', value: expectedApy, highlight: true },
                    { label: 'Daily Signal', value: `$${dailyRevenue}` }
                  ].map((item, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex justify-between py-3 border-b border-gray-800 relative overflow-hidden"
                    >
                      {/* Light beam animation */}
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-glow/20 to-transparent"
                        initial={{ x: '-100%' }}
                        animate={{ x: '100%' }}
                        transition={{ 
                          duration: 2, 
                          delay: 1 + i * 0.2,
                          repeat: Infinity,
                          repeatDelay: 5
                        }}
                      />
                      
                      <span className="text-gray-400">{item.label}</span>
                      <span className={`font-medium ${item.highlight ? 'text-primary' : 'text-white'}`}>
                        {item.value}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              <motion.div 
                className="bg-bg/40 backdrop-blur-lg rounded-md p-5 border border-electric-ink/30 relative overflow-hidden"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {/* Pulse effect */}
                <motion.div 
                  className="absolute inset-0 bg-electric-ink/5 rounded-md"
                  animate={{ 
                    boxShadow: [
                      '0 0 0 0 rgba(20, 241, 255, 0)',
                      '0 0 0 10px rgba(20, 241, 255, 0.1)',
                      '0 0 0 20px rgba(20, 241, 255, 0)',
                    ]
                  }}
                  transition={{ 
                    duration: 2.5, 
                    repeat: Infinity,
                    repeatType: "loop"
                  }}
                />
                
                <div className="flex items-start relative z-10">
                  <div className="bg-electric-ink/20 rounded-full p-2 mr-3 flex-shrink-0">
                    <Zap size={20} className="text-electric-ink" />
                  </div>
                  <div>
                    <h4 className="font-space font-medium text-electric-ink mb-1">Quantum signal activated</h4>
                    <p className="text-gray-300 text-sm">
                      The neural network has integrated your capital and is now actively generating quantum signals. Monitor your performance metrics in real-time.
                    </p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                <button
                  onClick={handleConfirm}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-8 rounded-md font-space font-medium inline-flex items-center relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center">
                    ENTER NEURAL INTERFACE 
                    <motion.span 
                      animate={{ x: [0, 5, 0] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                      className="ml-2"
                    >
                      <ArrowRight size={16} />
                    </motion.span>
                  </span>
                  
                  {/* Animated background */}
                  <motion.div 
                    className="absolute inset-0 bg-blue-500/20"
                    animate={{ 
                      x: ['-100%', '100%'],
                    }}
                    transition={{ 
                      duration: 1.5, 
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                </button>
                
                <div className="mt-4">
                  <a 
                    href="#" 
                    className="inline-flex items-center text-sm text-electric-ink hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <motion.span
                      animate={{ y: [0, -2, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      View quantum ledger signature
                    </motion.span>
                    <ExternalLink size={14} className="ml-1" />
                  </a>
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default DepositNeuralFrame;