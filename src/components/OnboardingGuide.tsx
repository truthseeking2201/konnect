import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Info } from 'lucide-react';

interface OnboardingGuideProps {
  currentStep: number;
  isWalletConnected: boolean;
  onClose: () => void;
  guideType?: 'echoLite' | 'echoAgent';
}

const OnboardingGuide: React.FC<OnboardingGuideProps> = ({ 
  currentStep, 
  isWalletConnected,
  onClose,
  guideType = 'echoLite'
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [currentTip, setCurrentTip] = useState(0);

  // Update the current tip based on the app's current step
  useEffect(() => {
    if (currentStep === 1) {
      setCurrentTip(0);
    } else if (currentStep === 2) {
      setCurrentTip(1);
    } else if (currentStep === 3) {
      setCurrentTip(2);
    }
  }, [currentStep]);

  // Echo Lite tips (default)
  const echoLiteTips = [
    {
      title: "Neural Interface Sync",
      description: "Begin by connecting your quantum wallet to establish neural sync. Activate the 'Connect Wallet' node in the hero dimension.",
      highlight: "Connect Wallet"
    },
    {
      title: "Risk Calibration Matrix",
      description: "Select a neural pattern that resonates with your trading consciousness: Conservative, Balanced, or Aggressive signal amplification.",
      highlight: "Risk Profile"
    },
    {
      title: "Quantum Capital Infusion",
      description: "Initialize your position with capital infusion. The neural network will harmonize with your selected risk calibration to generate optimal signal paths.",
      highlight: "Deposit"
    },
    {
      title: "Dimensional Performance Tracking",
      description: "Monitor your quantum algorithm's neural pathways and signal strength through the holographic dashboard interface.",
      highlight: "Performance"
    }
  ];
  
  // Echo Agent tips
  const echoAgentTips = [
    {
      title: "Neural Wallet Integration",
      description: "Connect your wallet to unlock Echo's AI trading capabilities. This establishes a secure connection for analyzing signals and executing trades.",
      highlight: "Connect Wallet"
    },
    {
      title: "Risk Profile Calibration",
      description: "Select your preferred risk tolerance. This determines Echo's trading frequency, position sizing, and the confidence threshold required for trade execution.",
      highlight: "Risk Profile"
    },
    {
      title: "Signal Selection & Execution",
      description: "Review signals detected by Echo's AI and approve high-confidence trades. The agent will analyze social signals and provide transparent reasoning for each decision.",
      highlight: "Signals"
    },
    {
      title: "Performance Monitoring",
      description: "Track Echo's performance through the interactive dashboard. Review trade history, win rates, and detailed reasoning behind each trade decision.",
      highlight: "Dashboard"
    },
    {
      title: "Echo Instruction Interface",
      description: "Communicate directly with Echo using the chat interface in the bottom right corner. You can ask questions, give specific instructions, or use commands to control your agent.",
      highlight: "Chat"
    }
  ];
  
  // Select the appropriate tips based on guide type
  const tips = guideType === 'echoAgent' ? echoAgentTips : echoLiteTips;

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="bg-surface border border-electric-ink rounded-lg shadow-lg p-4 m-4">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center">
              <Info className="text-electric-ink mr-2" size={18} />
              <h3 className="text-primary font-space font-semibold">
                {tips[currentTip].title}
              </h3>
            </div>
            <button onClick={handleClose} className="text-gray-400 hover:text-white">
              <X size={18} />
            </button>
          </div>
          
          <p className="text-gray-300 mb-4">
            {tips[currentTip].description}
          </p>
          
          <div className="flex justify-between items-center">
            <div className="flex space-x-1">
              {tips.map((_, index) => (
                <div 
                  key={index} 
                  className={`w-2 h-2 rounded-full ${
                    index === currentTip ? 'bg-primary' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
            
            <div className="flex items-center">
              <span className="text-xs text-gray-400 mr-2">
                Step {currentTip + 1} of {tips.length}
              </span>
              {currentTip < tips.length - 1 && (
                <button 
                  onClick={() => setCurrentTip(prev => Math.min(prev + 1, tips.length - 1))}
                  className="bg-primary-glow text-primary p-1 rounded-full"
                  disabled={!isWalletConnected && currentTip === 0}
                >
                  <ArrowRight size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default OnboardingGuide;