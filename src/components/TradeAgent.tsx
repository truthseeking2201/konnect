import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Brain, Zap, CheckCircle, AlertCircle, AlertTriangle, BarChart4, Terminal, SquareDot, Wand2, ChevronRight, ArrowUpCircle, ArrowDownCircle, Server } from 'lucide-react';

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
  
  // For circuit board pattern background
  const circuitBoardRef = useRef<HTMLDivElement>(null);
  
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
      
      // Ready to trade
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
  
  // Create circuit animation
  useEffect(() => {
    if (!circuitBoardRef.current) return;
    
    const createCircuitPath = () => {
      const container = circuitBoardRef.current;
      if (!container) return;
      
      const width = container.offsetWidth;
      const height = container.offsetHeight;
      
      // Create a new path
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("width", "100%");
      svg.setAttribute("height", "100%");
      svg.style.position = "absolute";
      svg.style.top = "0";
      svg.style.left = "0";
      svg.style.pointerEvents = "none";
      
      // Create path element
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      
      // Generate random path
      const startX = Math.random() * width * 0.3;
      let pathD = `M ${startX},0`;
      
      let currentX = startX;
      let currentY = 0;
      
      // Add random segments
      const segments = 8 + Math.floor(Math.random() * 8);
      for (let i = 0; i < segments; i++) {
        const nextX = currentX + (Math.random() * 60 - 30);
        const nextY = currentY + (Math.random() * 50 + 20);
        
        // Don't go outside bounds
        if (nextY > height) break;
        
        if (Math.random() > 0.5) {
          // Straight line with 90 degree turn
          pathD += ` L ${currentX},${nextY} L ${nextX},${nextY}`;
        } else {
          // Straight line
          pathD += ` L ${nextX},${nextY}`;
        }
        
        currentX = nextX;
        currentY = nextY;
      }
      
      path.setAttribute("d", pathD);
      path.setAttribute("fill", "none");
      path.setAttribute("stroke", "rgba(59, 130, 246, 0.2)");
      path.setAttribute("stroke-width", "1");
      path.setAttribute("stroke-dasharray", "4,4");
      
      svg.appendChild(path);
      container.appendChild(svg);
      
      // Animate pulse
      let opacity = 0.2;
      let increasing = true;
      const animate = () => {
        if (increasing) {
          opacity += 0.01;
          if (opacity >= 0.5) increasing = false;
        } else {
          opacity -= 0.01;
          if (opacity <= 0.1) increasing = true;
        }
        path.setAttribute("stroke", `rgba(59, 130, 246, ${opacity})`);
      };
      
      const interval = setInterval(animate, 50);
      
      // Remove after some time
      setTimeout(() => {
        clearInterval(interval);
        svg.remove();
      }, 8000 + Math.random() * 4000);
    };
    
    // Create new circuit paths periodically
    const interval = setInterval(createCircuitPath, 2000);
    createCircuitPath(); // create one immediately
    
    return () => clearInterval(interval);
  }, [isAnalyzing, tradeResult]);

  if (!isActive) return null;
  
  return (
    <div className="bg-gradient-to-br from-indigo-950/40 to-blue-950/30 backdrop-blur-sm rounded-xl p-6 mb-6 border border-indigo-500/30 shadow-lg shadow-blue-500/5 relative overflow-hidden">
      {/* Circuit board background effect */}
      <div 
        ref={circuitBoardRef}
        className="absolute inset-0 opacity-40 pointer-events-none" 
      ></div>
      
      {/* Glow effects at corners */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl"></div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-6">
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
            className="px-4 py-1.5 bg-gradient-to-r from-indigo-500/20 to-blue-500/20 rounded-full border border-indigo-500/30 text-indigo-300 text-xs font-mono flex items-center shadow-inner shadow-indigo-500/5"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="mr-1.5">●</span>
            <span className="tracking-widest">{riskProfile.toUpperCase()}</span>
          </motion.div>
        </div>
      
        {!selectedSignal ? (
          <div className="py-10 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Server className="mx-auto mb-4 text-blue-400/50" size={40} />
              <p className="text-blue-300/70 font-medium">Select a signal to activate Echo Agent</p>
              <p className="text-blue-300/50 text-sm mt-2 max-w-md mx-auto">
                Echo is waiting for your command. Select a high-confidence signal from the list to begin analysis and trading.
              </p>
              
              <motion.div
                className="w-40 h-40 bg-indigo-500/5 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -z-10"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          </div>
        ) : (
          <div>
            {/* Signal Summary */}
            <motion.div 
              className="p-4 border border-indigo-500/30 rounded-xl mb-6 bg-gradient-to-r from-indigo-900/20 to-blue-900/20 backdrop-blur-sm overflow-hidden relative"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
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
              
              <div className="flex justify-between items-center">
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
                      <span className="text-blue-300/80 text-sm">Signal ID: {selectedSignal.id.slice(0, 6)}</span>
                    </div>
                    <div className="text-sm text-indigo-300 flex items-center mt-1">
                      <span className="font-mono">Confidence:</span>
                      <span className="text-blue-200 font-bold ml-1.5">{Math.round(selectedSignal.confidence * 100)}%</span>
                    </div>
                  </div>
                </div>
                
                <motion.div 
                  className={`px-3 py-1.5 rounded-md text-sm font-bold ${
                    selectedSignal.direction === 'long' 
                      ? 'bg-green-500/30 text-green-300 border border-green-500/40' 
                      : 'bg-red-500/30 text-red-300 border border-red-500/40'
                  }`}
                  whileHover={{ scale: 1.05 }}
                >
                  {selectedSignal.direction === 'long' ? (
                    <div className="flex items-center">
                      <ArrowUpCircle size={16} className="mr-1" />
                      LONG
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <ArrowDownCircle size={16} className="mr-1" />
                      SHORT
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
            
            {/* Analysis Output */}
            <motion.div 
              className="font-mono text-sm relative mb-6 overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-950/70 to-indigo-950/70 backdrop-blur-sm rounded-xl -z-10"></div>
              <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-blue-500 to-indigo-600"></div>
              
              {/* Terminal header */}
              <div className="flex items-center border-b border-blue-800/50 px-4 py-2">
                <Terminal size={14} className="text-blue-400 mr-2" />
                <span className="text-blue-300 font-medium">Echo Analysis Matrix</span>
              </div>
              
              {/* Log content */}
              <div className="p-4 h-40 overflow-y-auto custom-scrollbar">
                {analysis.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.2 }}
                    className="mb-2 text-blue-200/90 flex"
                  >
                    <span className="text-indigo-400 mr-2 w-4"><ChevronRight size={14} /></span>
                    <span>{step}</span>
                  </motion.div>
                ))}
                
                {isAnalyzing && (
                  <motion.div 
                    className="text-indigo-300 flex items-center"
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
                    className="text-red-300 flex items-center bg-red-900/20 p-2 rounded border border-red-500/30"
                  >
                    <AlertTriangle size={14} className="mr-2 text-red-400" />
                    {error}
                  </motion.div>
                )}
              </div>
            </motion.div>
            
            {/* Trade Configuration */}
            {!isAnalyzing && !error && !tradeResult && (
              <>
                <motion.div 
                  className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
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
                </motion.div>
                
                <motion.button
                  onClick={executeTrade}
                  disabled={isTrading}
                  className={`
                    w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500
                    text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center 
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
                          EXECUTE {selectedSignal.direction === 'long' ? 'BUY' : 'SELL'} TRADE WITH ECHO
                        </span>
                      </>
                    )}
                  </div>
                </motion.button>
              </>
            )}
            
            {/* Trade Result */}
            {tradeResult && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-5 bg-gradient-to-br from-green-900/30 to-blue-900/30 backdrop-blur-sm border border-green-500/30 rounded-xl relative overflow-hidden"
              >
                {/* Success animation */}
                <motion.div 
                  className="absolute inset-0 bg-green-500/5"
                  animate={{ opacity: [0, 0.2, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                
                {/* Animated accent line */}
                <div className="absolute top-0 left-0 right-0 h-0.5 overflow-hidden">
                  <motion.div 
                    className="w-full h-full bg-gradient-to-r from-green-400 via-blue-300 to-green-500"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                  />
                </div>
                
                <div className="flex items-center mb-5">
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
                      Transaction Successfully Executed
                    </span>
                    <motion.div 
                      className="ml-2 w-1.5 h-1.5 bg-green-400 rounded-full"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </motion.h4>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  {[
                    { label: "Token", value: tradeResult.token, valueClass: "text-blue-100 font-medium" },
                    { 
                      label: "Direction", 
                      value: tradeResult.direction.toUpperCase(), 
                      valueClass: tradeResult.direction === 'long' ? 'text-green-400 font-medium' : 'text-red-400 font-medium',
                      icon: tradeResult.direction === 'long' ? <ArrowUpCircle size={14} className="mr-1.5" /> : <ArrowDownCircle size={14} className="mr-1.5" />
                    },
                    { label: "Entry Price", value: tradeResult.entryPrice, valueClass: "text-blue-100 font-medium" },
                    { label: "Position Size", value: tradeResult.positionSize, valueClass: "text-blue-100 font-medium" },
                    { label: "Stop Loss", value: tradeResult.stopLoss, valueClass: "text-red-400 font-medium" },
                    { label: "Take Profit", value: tradeResult.takeProfit, valueClass: "text-green-400 font-medium" }
                  ].map((item, index) => (
                    <motion.div 
                      key={item.label}
                      className="bg-indigo-950/20 backdrop-blur-sm p-3 rounded-lg border border-blue-500/20"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + (index * 0.1) }}
                    >
                      <div className="text-xs text-blue-300/70 mb-1 font-mono">{item.label}</div>
                      <div className={`flex items-center ${item.valueClass}`}>
                        {item.icon}
                        {item.value}
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                <motion.div 
                  className="mt-4 p-3 bg-indigo-900/30 rounded-lg border border-indigo-500/20 font-mono text-xs"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <div className="flex flex-wrap gap-y-2">
                    <div className="mr-4 text-blue-300/70">Transaction Hash:</div>
                    <div className="text-indigo-300 flex-1">{tradeResult.txHash}</div>
                  </div>
                  <div className="flex mt-1">
                    <div className="mr-4 text-blue-300/70">Gas Used:</div>
                    <div className="text-indigo-300">{tradeResult.gas} gwei</div>
                  </div>
                </motion.div>
                
                <motion.button
                  onClick={() => setTradeResult(null)}
                  className="mt-5 w-full bg-gradient-to-r from-indigo-900/80 to-blue-900/80 hover:from-indigo-800/80 hover:to-blue-800/80 text-blue-100 font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-colors border border-blue-500/30"
                  whileHover={{ y: -2, boxShadow: "0 10px 15px -3px rgba(59, 130, 246, 0.3)" }}
                  whileTap={{ y: 0 }}
                >
                  <BarChart4 className="mr-2 text-blue-300" size={18} />
                  View Complete Transaction Details
                </motion.button>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TradeAgent;