import React from 'react';
import { motion } from 'framer-motion';
import { circularLoaderAnimation } from '@/utils/animations';

interface CircularLoaderProps {
  isVisible: boolean;
  message?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  thickness?: number;
  color?: string;
  secondaryColor?: string;
  glowEffect?: boolean;
}

const CircularLoader: React.FC<CircularLoaderProps> = ({
  isVisible = true,
  message = 'Loading',
  className = '',
  size = 'md',
  thickness = 4,
  color = '#3B82F6', // primary blue
  secondaryColor = '#6366F1', // electric ink
  glowEffect = true,
}) => {
  if (!isVisible) return null;
  
  // Determine SVG dimensions based on size
  const dimensions = {
    sm: 40,
    md: 60,
    lg: 80,
  };
  
  const svgSize = dimensions[size];
  const center = svgSize / 2;
  const radius = center - thickness;
  
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative">
        <svg 
          width={svgSize} 
          height={svgSize} 
          viewBox={`0 0 ${svgSize} ${svgSize}`} 
          className="overflow-visible"
        >
          {/* Glow filter */}
          {glowEffect && (
            <defs>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
          )}
          
          {/* Base circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="rgba(99, 102, 241, 0.15)"
            strokeWidth={thickness}
          />
          
          {/* Animated segments */}
          <motion.circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={thickness}
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * radius}
            strokeDashoffset={2 * Math.PI * radius * 0.75}
            filter={glowEffect ? "url(#glow)" : "none"}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={circularLoaderAnimation}
          />
          
          <motion.circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={secondaryColor}
            strokeWidth={thickness / 2}
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * radius}
            strokeDashoffset={2 * Math.PI * radius * 0.75}
            filter={glowEffect ? "url(#glow)" : "none"}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={circularLoaderAnimation}
            style={{ 
              rotate: 180, 
              transformOrigin: 'center' 
            }}
          />
          
          {/* Digital dots around the circle */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 30 * Math.PI) / 180;
            const dotX = center + (radius + thickness * 1.5) * Math.cos(angle);
            const dotY = center + (radius + thickness * 1.5) * Math.sin(angle);
            
            return (
              <motion.circle
                key={`dot-${i}`}
                cx={dotX}
                cy={dotY}
                r={thickness / 3}
                fill="rgba(99, 102, 241, 0.7)"
                initial={{ opacity: 0.2 }}
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.1,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
              />
            );
          })}
        </svg>
      </div>
      
      {message && (
        <motion.div
          className="mt-4 text-sm text-blue-300 font-mono flex items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {message}
          <motion.span 
            className="inline-flex ml-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              repeatType: 'loop' 
            }}
          >
            <span className="h-1 w-1 bg-blue-300 rounded-full mx-0.5"></span>
            <span className="h-1 w-1 bg-blue-300 rounded-full mx-0.5" style={{ animationDelay: '0.2s' }}></span>
            <span className="h-1 w-1 bg-blue-300 rounded-full mx-0.5" style={{ animationDelay: '0.4s' }}></span>
          </motion.span>
        </motion.div>
      )}
    </div>
  );
};

export default CircularLoader;