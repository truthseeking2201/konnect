import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { progressBarAnimation } from '@/utils/animations';

interface ProgressBarProps {
  progress?: number; // 0-100
  isIndeterminate?: boolean;
  color?: string;
  height?: number;
  className?: string;
  showPercentage?: boolean;
  animateOnRender?: boolean;
  glowEffect?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress = 0,
  isIndeterminate = false,
  color = '#3B82F6', // primary blue
  height = 4,
  className = '',
  showPercentage = false,
  animateOnRender = true,
  glowEffect = true,
}) => {
  const [localProgress, setLocalProgress] = useState(animateOnRender ? 0 : progress);
  
  // Update local progress when prop changes
  useEffect(() => {
    if (!isIndeterminate) {
      setLocalProgress(progress);
    }
  }, [progress, isIndeterminate]);
  
  return (
    <div className={`w-full ${className}`}>
      <div className="relative w-full overflow-hidden rounded-full bg-surface" style={{ height }}>
        {/* Glow filter */}
        {glowEffect && (
          <svg width="0" height="0">
            <defs>
              <filter id="progress-glow" x="-10%" y="-10%" width="120%" height="120%">
                <feGaussianBlur stdDeviation="1.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
          </svg>
        )}
        
        <motion.div
          className="absolute top-0 left-0 h-full rounded-full"
          style={{ 
            backgroundColor: color,
            filter: glowEffect ? "url(#progress-glow)" : "none",
            boxShadow: glowEffect ? `0 0 8px ${color}` : "none",
          }}
          initial="hidden"
          animate={isIndeterminate ? "indeterminate" : "visible"}
          variants={progressBarAnimation}
          custom={localProgress}
        />
        
        {/* Small glowing particles along the progress bar */}
        {!isIndeterminate && glowEffect && localProgress > 10 && (
          <>
            <motion.div
              className="absolute top-0 h-full w-2 rounded-full"
              style={{ 
                backgroundColor: `${color}`, 
                filter: "blur(3px)",
                opacity: 0.7,
              }}
              initial={{ left: "0%" }}
              animate={{ left: `${localProgress - 2}%` }}
              transition={{ duration: 0.8 }}
            />
            
            <motion.div
              className="absolute top-0 h-full w-1 rounded-full"
              style={{ 
                backgroundColor: "white", 
                filter: "blur(1px)",
                opacity: 0.8,
              }}
              initial={{ left: "0%" }}
              animate={{ left: `${localProgress - 1}%` }}
              transition={{ duration: 0.8 }}
            />
          </>
        )}
      </div>
      
      {/* Percentage text */}
      {showPercentage && !isIndeterminate && (
        <motion.div 
          className="text-xs font-mono text-blue-300 mt-1 text-right"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {Math.round(localProgress)}%
        </motion.div>
      )}
    </div>
  );
};

export default ProgressBar;