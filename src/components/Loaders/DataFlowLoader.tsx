import React from 'react';
import { motion } from 'framer-motion';
import { dataFlowAnimation, glitchAnimation } from '@/utils/animations';

interface DataFlowLoaderProps {
  isVisible: boolean;
  message?: string;
  className?: string;
  type?: 'circle' | 'linear' | 'radial' | 'diagonal';
  color?: string;
}

const DataFlowLoader: React.FC<DataFlowLoaderProps> = ({
  isVisible = true,
  message = 'Processing transaction data',
  className = '',
  type = 'circle',
  color = '#3B82F6', // primary blue
}) => {
  if (!isVisible) return null;

  const getPath = () => {
    switch (type) {
      case 'circle':
        return 'M 50,50 m -30,0 a 30,30 0 1,1 60,0 a 30,30 0 1,1 -60,0';
      case 'linear':
        return 'M 10,50 L 90,50';
      case 'radial':
        return 'M 50,50 L 50,20 M 50,50 L 80,50 M 50,50 L 50,80 M 50,50 L 20,50 M 50,50 L 65,35 M 50,50 L 65,65 M 50,50 L 35,65 M 50,50 L 35,35';
      case 'diagonal':
        return 'M 10,10 L 90,90 M 10,90 L 90,10';
      default:
        return 'M 50,50 m -30,0 a 30,30 0 1,1 60,0 a 30,30 0 1,1 -60,0';
    }
  };

  // Generate multiple data flow particles
  const dataFlows = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    delay: i * 0.3,
    size: 3 + Math.random() * 2,
    color: color,
    opacity: 0.6 + Math.random() * 0.4,
  }));

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative">
        <svg width="100" height="100" viewBox="0 0 100 100" className="overflow-visible">
          {/* Flow path (visible but subtle) */}
          <motion.path
            d={getPath()}
            stroke="rgba(99, 102, 241, 0.2)"
            strokeWidth="3"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />

          {/* Data flow particles */}
          {dataFlows.map((flow) => (
            <motion.circle
              key={`flow-${flow.id}`}
              r={flow.size}
              fill={flow.color}
              opacity={flow.opacity}
              filter="url(#glow)"
              custom={flow.delay}
              initial="hidden"
              animate="visible"
              variants={dataFlowAnimation}
            >
              <animateMotion
                path={getPath()}
                dur={`${2 + flow.delay}s`}
                repeatCount="indefinite"
                rotate="auto"
              />
            </motion.circle>
          ))}

          {/* Glow filter */}
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
        </svg>
      </div>

      {message && (
        <motion.div
          className="mt-4 text-sm text-blue-300 font-mono"
          variants={glitchAnimation}
          initial="hidden"
          animate="visible"
        >
          {message}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            ...
          </motion.span>
        </motion.div>
      )}
    </div>
  );
};

export default DataFlowLoader;