import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RiskTerrainVisualizer from './RiskTerrainVisualizer';

type RiskLevel = 'conservative' | 'balanced' | 'aggressive';

interface RiskCardProps {
  preset: RiskLevel;
  label: string;
  icon: string;
  description: string;
  stopLoss: string;
  maxTradesPerDay: number;
  isSelected: boolean;
  onSelect: () => void;
  onHover: () => void;
}

const RiskCard: React.FC<RiskCardProps> = ({
  preset,
  label,
  icon,
  description,
  stopLoss,
  maxTradesPerDay,
  isSelected,
  onSelect,
  onHover
}: RiskCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // For analytics
  const trackEvent = (name: string, params = {}) => {
    if (typeof window !== 'undefined') {
      console.log(`[Analytics] ${name}`, params);
    }
  };
  
  return (
    <motion.div
      role="radio"
      aria-checked={isSelected}
      tabIndex={0}
      className={`
        relative bg-surface/80 backdrop-blur-sm rounded-lg p-6 cursor-pointer 
        transition-all duration-300 border-2 z-10
        ${isSelected ? 'border-blue-500 shadow-lg shadow-blue-500/30' : 'border-transparent'}
      `}
      whileHover={{ scale: 1.03, y: -8 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => {
        onSelect();
        trackEvent('risk_selected', { level: preset });
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onSelect();
          trackEvent('risk_selected', { level: preset });
        }
      }}
      onMouseEnter={() => {
        setIsHovered(true);
        onHover();
        trackEvent('risk_hover', { level: preset });
      }}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Conditional animation styles based on risk level */}
      {preset === 'conservative' && isHovered && (
        <motion.div
          className="absolute inset-0 rounded-lg border-2 border-blue-400 opacity-30"
          animate={{ 
            boxShadow: ['0 0 0px rgba(59, 130, 246, 0)', '0 0 15px rgba(59, 130, 246, 0.7)', '0 0 0px rgba(59, 130, 246, 0)'] 
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
      
      {preset === 'balanced' && isHovered && (
        <motion.div
          className="absolute inset-0 rounded-lg border-2 border-indigo-400 opacity-30"
          animate={{ 
            boxShadow: ['0 0 5px rgba(99, 102, 241, 0.3)', '0 0 20px rgba(99, 102, 241, 0.6)', '0 0 5px rgba(99, 102, 241, 0.3)'] 
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}
      
      {preset === 'aggressive' && isHovered && (
        <motion.div
          className="absolute inset-0 rounded-lg border-2 border-purple-400 opacity-30"
          animate={{
            x: [0, -2, 3, -3, 2, 0],
            y: [0, 2, -1, 0, -2, 0],
            boxShadow: ['0 0 10px rgba(139, 92, 246, 0.5)', '0 0 25px rgba(139, 92, 246, 0.8)', '0 0 10px rgba(139, 92, 246, 0.5)']
          }}
          transition={{ duration: 1, repeat: Infinity, repeatType: 'loop' }}
        />
      )}
      
      <div className="flex items-center mb-3">
        <motion.span 
          className="text-3xl mr-3"
          animate={isHovered ? { scale: [1, 1.2, 1], rotate: preset === 'aggressive' ? [0, -5, 5, 0] : 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          {icon}
        </motion.span>
        <h3 className={`text-lg font-bold ${preset === 'conservative' ? 'text-blue-400' : preset === 'balanced' ? 'text-indigo-400' : 'text-purple-400'}`}>
          {label}
        </h3>
      </div>
      
      <p className="text-gray-300 mb-4 text-sm">{description}</p>
      
      <div className="grid grid-cols-2 gap-4">
        <motion.div 
          className="bg-bg/50 rounded p-3"
          whileHover={{ backgroundColor: 'rgba(30, 41, 59, 0.8)' }}
        >
          <span className="text-sm text-gray-400">Stop Loss</span>
          <p className={`font-bold ${preset === 'conservative' ? 'text-blue-400' : preset === 'balanced' ? 'text-indigo-400' : 'text-purple-400'}`}>
            {stopLoss}
          </p>
        </motion.div>
        
        <motion.div 
          className="bg-bg/50 rounded p-3"
          whileHover={{ backgroundColor: 'rgba(30, 41, 59, 0.8)' }}
        >
          <span className="text-sm text-gray-400">Max Trades</span>
          <p className={`font-bold ${preset === 'conservative' ? 'text-blue-400' : preset === 'balanced' ? 'text-indigo-400' : 'text-purple-400'}`}>
            {maxTradesPerDay}/day
          </p>
        </motion.div>
      </div>
      
      {isSelected && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -bottom-3 left-1/2 transform -translate-x-1/2"
        >
          <div className={`w-6 h-6 rotate-45 ${preset === 'conservative' ? 'bg-blue-500' : preset === 'balanced' ? 'bg-indigo-500' : 'bg-purple-500'}`}></div>
        </motion.div>
      )}
    </motion.div>
  );
};

interface RiskToggleRail3DProps {
  onSelect: (level: RiskLevel) => void;
  selected?: RiskLevel;
}

const RiskToggleRail3D: React.FC<RiskToggleRail3DProps> = ({ onSelect, selected }) => {
  const [selectedRisk, setSelectedRisk] = useState<RiskLevel>(selected || 'balanced');
  const [hoveredRisk, setHoveredRisk] = useState<RiskLevel | null>(null);
  const [shouldAnimate, setShouldAnimate] = useState<boolean>(!selected);
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const infoTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    if (selected) {
      setSelectedRisk(selected);
      setShouldAnimate(false);
    }
  }, [selected]);
  
  const handleSelect = (risk: RiskLevel) => {
    setSelectedRisk(risk);
    onSelect(risk);
    
    // Show info panel with details about the selected risk profile
    setShowInfoPanel(true);
    
    // Clear any existing timeout
    if (infoTimeoutRef.current) {
      clearTimeout(infoTimeoutRef.current);
    }
    
    // Hide info panel after 5 seconds
    infoTimeoutRef.current = setTimeout(() => {
      setShowInfoPanel(false);
    }, 5000);
  };
  
  const handleHover = (risk: RiskLevel) => {
    setHoveredRisk(risk);
  };
  
  const riskOptions = [
    {
      preset: 'conservative' as RiskLevel,
      label: 'Conservative',
      icon: '🛡️',
      description: 'Lower returns, minimal downside risk. Perfect for beginners.',
      stopLoss: '5%',
      maxTradesPerDay: 3,
      detailedDescription: 'Conservative risk profiles prioritize capital preservation with tight stop-losses and limited trade frequency. This approach minimizes volatility but may limit potential gains during strong market trends.',
      appropriateFor: 'New traders, risk-averse investors, or those with short-term financial goals.'
    },
    {
      preset: 'balanced' as RiskLevel,
      label: 'Balanced',
      icon: '⚖️',
      description: 'Moderate risk-reward ratio with reasonable protection.',
      stopLoss: '10%',
      maxTradesPerDay: 6,
      detailedDescription: 'Balanced risk profiles seek to optimize risk and reward, allowing for moderate market exposure while maintaining reasonable safety measures. This approach aims for consistent returns across varying market conditions.',
      appropriateFor: 'Experienced traders, medium-term investors, or those with a moderate risk tolerance.'
    },
    {
      preset: 'aggressive' as RiskLevel,
      label: 'Aggressive',
      icon: '🚀',
      description: 'Maximum potential returns with significant volatility.',
      stopLoss: '20%',
      maxTradesPerDay: 10,
      detailedDescription: 'Aggressive risk profiles aim to maximize returns by taking larger positions and allowing for greater price fluctuations. This approach can outperform during favorable market conditions but may experience deeper drawdowns during market downturns.',
      appropriateFor: 'Seasoned traders, long-term investors with high risk tolerance, or those seeking maximum growth potential.'
    }
  ];
  
  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      const currentIndex = riskOptions.findIndex(r => r.preset === selectedRisk);
      const nextIndex = Math.min(currentIndex + 1, riskOptions.length - 1);
      handleSelect(riskOptions[nextIndex].preset);
    }
    else if (e.key === 'ArrowLeft') {
      const currentIndex = riskOptions.findIndex(r => r.preset === selectedRisk);
      const prevIndex = Math.max(currentIndex - 1, 0);
      handleSelect(riskOptions[prevIndex].preset);
    }
  };
  
  // Find detailed info for the selected risk
  const selectedRiskInfo = riskOptions.find(risk => risk.preset === selectedRisk);
  
  return (
    <div className="container-grid py-8 relative">
      {/* 3D Terrain Visualization */}
      <div className="absolute inset-0 flex justify-center items-center" style={{ zIndex: 0, opacity: 0.9 }}>
        <RiskTerrainVisualizer
          riskLevel={hoveredRisk || selectedRisk}
          width={(typeof window !== 'undefined' && window.innerWidth > 768) ? 800 : 300}
          height={400}
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        <motion.h2 
          className="text-3xl font-space font-bold mb-6 text-center"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Choose Your <span className={`
            ${selectedRisk === 'conservative' ? 'text-blue-400' : selectedRisk === 'balanced' ? 'text-indigo-400' : 'text-purple-400'}
          `}>Risk Profile</span>
        </motion.h2>
        
        <motion.p 
          className="text-center text-gray-300 mb-8 max-w-2xl mx-auto"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Select a risk profile that matches your trading style and comfort level. 
          Your selection determines trade frequency, stop-loss settings, and overall strategy aggressiveness.
        </motion.p>
        
        <div 
          className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${shouldAnimate ? 'relative' : ''}`}
          role="radiogroup"
          aria-label="Risk profile selection"
          onKeyDown={handleKeyDown}
        >
          {shouldAnimate && (
            <div className="absolute inset-0 border-2 border-dashed border-blue-500/30 animate-pulse-subtle rounded-lg pointer-events-none"></div>
          )}
          {riskOptions.map((risk) => (
            <RiskCard
              key={risk.preset}
              {...risk}
              isSelected={selectedRisk === risk.preset}
              onSelect={() => handleSelect(risk.preset)}
              onHover={() => handleHover(risk.preset)}
            />
          ))}
        </div>
        
        {/* Detailed Info Panel */}
        <AnimatePresence>
          {showInfoPanel && selectedRiskInfo && (
            <motion.div 
              className={`
                mt-8 p-6 rounded-lg backdrop-blur-md 
                ${selectedRisk === 'conservative' ? 'bg-blue-900/30 border border-blue-500/30' : 
                  selectedRisk === 'balanced' ? 'bg-indigo-900/30 border border-indigo-500/30' : 
                  'bg-purple-900/30 border border-purple-500/30'}
              `}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex justify-between items-start">
                <h3 className={`
                  text-xl font-bold mb-3
                  ${selectedRisk === 'conservative' ? 'text-blue-300' : 
                    selectedRisk === 'balanced' ? 'text-indigo-300' : 
                    'text-purple-300'}
                `}>
                  {selectedRiskInfo.label} Profile Details
                </h3>
                <button 
                  onClick={() => setShowInfoPanel(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Close details panel"
                >
                  ×
                </button>
              </div>
              
              <p className="text-gray-200 mb-4">{selectedRiskInfo.detailedDescription}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-black/20 rounded p-4">
                  <h4 className="text-gray-300 font-medium mb-2">Best For</h4>
                  <p className="text-sm text-gray-400">{selectedRiskInfo.appropriateFor}</p>
                </div>
                
                <div className="bg-black/20 rounded p-4">
                  <h4 className="text-gray-300 font-medium mb-2">Key Metrics</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-400">Stop Loss:</span>
                      <p className={`font-medium ${selectedRisk === 'conservative' ? 'text-blue-300' : selectedRisk === 'balanced' ? 'text-indigo-300' : 'text-purple-300'}`}>
                        {selectedRiskInfo.stopLoss}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-400">Max Trades:</span>
                      <p className={`font-medium ${selectedRisk === 'conservative' ? 'text-blue-300' : selectedRisk === 'balanced' ? 'text-indigo-300' : 'text-purple-300'}`}>
                        {selectedRiskInfo.maxTradesPerDay}/day
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <motion.div 
                className="mt-4 p-3 bg-black/30 rounded border-l-4 text-sm text-gray-300"
                initial={{ x: -5, opacity: 0.8 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                style={{ 
                  borderLeftColor: selectedRisk === 'conservative' ? '#3b82f6' : selectedRisk === 'balanced' ? '#6366f1' : '#8b5cf6'
                }}
              >
                <strong>Note:</strong> You can always adjust your risk profile later in the settings.
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RiskToggleRail3D;