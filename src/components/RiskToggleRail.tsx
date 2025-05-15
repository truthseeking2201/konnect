import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

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
}

const RiskCard: React.FC<RiskCardProps> = ({
  preset,
  label,
  icon,
  description,
  stopLoss,
  maxTradesPerDay,
  isSelected,
  onSelect
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
        relative bg-surface rounded-lg p-6 cursor-pointer 
        transition-all duration-300 border-2
        ${isSelected ? 'border-blue-500 shadow-lg shadow-blue-500/10' : 'border-transparent'}
      `}
      whileHover={{ scale: 1.02, y: -5 }}
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
        trackEvent('risk_hover', { level: preset });
      }}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Conditional shake animation for aggressive preset */}
      {preset === 'aggressive' && (
        <motion.div
          className="absolute inset-0 rounded-lg border-2 border-blue-500 opacity-30"
          animate={isHovered ? {
            x: [0, -1, 2, -2, 1, 0],
            y: [0, 1, -1, 0, -1, 0]
          } : {}}
          transition={{ duration: 0.5, repeat: isHovered ? Infinity : 0, repeatType: 'loop' }}
        />
      )}
      
      <div className="flex items-center mb-4">
        <span className="text-2xl mr-2">{icon}</span>
        <h3 className="text-lg font-bold text-blue-400">{label}</h3>
      </div>
      
      <p className="text-gray-300 mb-4 text-sm">{description}</p>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-bg/50 rounded p-3">
          <span className="text-sm text-gray-400">Stop Loss</span>
          <p className="text-blue-400 font-bold">{stopLoss}</p>
        </div>
        
        <div className="bg-bg/50 rounded p-3">
          <span className="text-sm text-gray-400">Max Trades</span>
          <p className="text-blue-400 font-bold">{maxTradesPerDay}/day</p>
        </div>
      </div>
      
      {isSelected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute -bottom-2 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-4 h-4 bg-blue-500 rotate-45"></div>
        </motion.div>
      )}
    </motion.div>
  );
};

interface RiskToggleRailProps {
  onSelect: (level: RiskLevel) => void;
  selected?: RiskLevel;
}

const RiskToggleRail: React.FC<RiskToggleRailProps> = ({ onSelect, selected }) => {
  const [selectedRisk, setSelectedRisk] = useState<RiskLevel>(selected || 'balanced');
  const [shouldAnimate, setShouldAnimate] = useState<boolean>(!selected);
  
  useEffect(() => {
    if (selected) {
      setSelectedRisk(selected);
      setShouldAnimate(false);
    }
  }, [selected]);
  
  const handleSelect = (risk: RiskLevel) => {
    setSelectedRisk(risk);
    onSelect(risk);
  };
  
  const riskOptions = [
    {
      preset: 'conservative' as RiskLevel,
      label: 'Conservative',
      icon: '🛡️',
      description: 'Lower returns, minimal downside risk. Perfect for beginners.',
      stopLoss: '5%',
      maxTradesPerDay: 3
    },
    {
      preset: 'balanced' as RiskLevel,
      label: 'Balanced',
      icon: '⚖️',
      description: 'Moderate risk-reward ratio with reasonable protection.',
      stopLoss: '10%',
      maxTradesPerDay: 6
    },
    {
      preset: 'aggressive' as RiskLevel,
      label: 'Aggressive',
      icon: '🚀',
      description: 'Maximum potential returns with significant volatility.',
      stopLoss: '20%',
      maxTradesPerDay: 10
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
  
  return (
    <div className="container-grid py-12">
      <h2 className="text-2xl font-space font-bold mb-8 text-center">
        Choose Your <span className="text-blue-400">Risk Profile</span>
      </h2>
      
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
          />
        ))}
      </div>
    </div>
  );
};

export default RiskToggleRail;