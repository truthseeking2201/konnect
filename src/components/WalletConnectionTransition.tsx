import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ParticleLoader } from './Loaders';
import GlitchText from './Loaders/GlitchText';

interface WalletConnectionTransitionProps {
  isConnecting: boolean;
  onConnected?: () => void;
  walletAddress?: string;
  className?: string;
}

const WalletConnectionTransition: React.FC<WalletConnectionTransitionProps> = ({
  isConnecting,
  onConnected,
  walletAddress,
  className = '',
}) => {
  // Animation stages
  const [stage, setStage] = useState(0);
  const [hexCode, setHexCode] = useState<string[]>([]);
  
  console.log('🔄 WalletConnectionTransition render:', { isConnecting, stage });
  
  useEffect(() => {
    console.log('🔌 WalletConnectionTransition effect triggered:', { isConnecting, stage });
    
    if (isConnecting) {
      // Reset and start
      console.log('🔄 Resetting and starting connection animation');
      setStage(0);
      setHexCode([]);
      
      // Generate random hex code revealing effect
      const generateHex = () => {
        console.log('📝 Starting address reveal animation');
        const fullAddress = walletAddress || '0x7F5Ec7A125eB1F31536d431E27bd6d27C00Af3E2';
        const addressArray = fullAddress.split('');
        let currentHex: string[] = [];
        
        // Reveal the address one character at a time
        const interval = setInterval(() => {
          if (currentHex.length < addressArray.length) {
            currentHex = [...addressArray.slice(0, currentHex.length + 1)];
            setHexCode(currentHex);
          } else {
            clearInterval(interval);
            
            // Advance to the next stage after address reveal
            console.log('📝 Address reveal complete, moving to stage 2');
            setTimeout(() => {
              setStage(2);
              
              // Call onConnected callback after animations complete
              setTimeout(() => {
                console.log('✅ Calling onConnected callback');
                if (onConnected) onConnected();
              }, 1000);
            }, 500);
          }
        }, 80);
        
        return () => clearInterval(interval);
      };
      
      // Start first stage
      console.log('🎬 Setting stage to 1');
      setStage(1);
      
      // Start address reveal after a delay
      console.log('⏱️ Starting address reveal timer');
      setTimeout(generateHex, 1500);
    }
  }, [isConnecting, walletAddress, onConnected]);
  
  if (!isConnecting) return null;
  
  return (
    <motion.div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-bg/90 backdrop-blur-md ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <AnimatePresence mode="wait">
        {stage === 1 && (
          <motion.div
            key="connection-loader"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center"
          >
            <ParticleLoader
              isVisible={true}
              message="Establishing secure connection"
              particleCount={30}
            />
            
            <motion.div 
              className="mt-8 font-mono text-sm text-blue-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              Initializing handshake protocol...
            </motion.div>
          </motion.div>
        )}
        
        {stage === 2 && (
          <motion.div
            key="connection-success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <GlitchText 
              text="WALLET CONNECTED" 
              className="text-2xl font-bold font-mono mb-6"
              intensity="medium"
            />
            
            <motion.div 
              className="font-mono text-lg text-primary flex items-center justify-center space-x-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
              <span>{hexCode.join('')}</span>
            </motion.div>
            
            <motion.div
              className="mt-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="w-40 h-40 mx-auto relative">
                {/* Abstract connected illustration */}
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="30"
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="1"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                  
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#6366F1"
                    strokeWidth="0.5"
                    strokeDasharray="1,2"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1, rotate: 360 }}
                    transition={{ 
                      pathLength: { duration: 1, ease: "easeOut" },
                      rotate: { duration: 20, ease: "linear", repeat: Infinity }
                    }}
                    style={{ transformOrigin: "center" }}
                  />
                  
                  <motion.path
                    d="M50,20 L50,80 M20,50 L80,50 M35,35 L65,65 M35,65 L65,35"
                    stroke="#3B82F6"
                    strokeWidth="1"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                  />
                  
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="5"
                    fill="#6366F1"
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.2, 1] }}
                    transition={{ duration: 0.5, times: [0, 0.8, 1], delay: 0.8 }}
                  />
                </svg>
                
                {/* Glowing particles */}
                {Array.from({ length: 20 }).map((_, i) => (
                  <motion.div
                    key={`particle-${i}`}
                    className="absolute rounded-full bg-primary"
                    style={{
                      width: 2 + Math.random() * 3,
                      height: 2 + Math.random() * 3,
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      filter: "blur(1px)",
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: [0, 0.8, 0],
                      scale: [0, 1, 0],
                    }}
                    transition={{
                      duration: 1 + Math.random() * 2,
                      repeat: Infinity,
                      repeatDelay: Math.random() * 2,
                      delay: Math.random() * 1,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default WalletConnectionTransition;