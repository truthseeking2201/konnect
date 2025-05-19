import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { digitalRainAnimation } from '@/utils/animations';

interface DigitalRainLoaderProps {
  isVisible: boolean;
  message?: string;
  className?: string;
  columns?: number;
  characters?: string;
  color?: string;
}

interface RainDrop {
  id: number;
  column: number;
  characters: string[];
  delay: number;
}

const DigitalRainLoader: React.FC<DigitalRainLoaderProps> = ({
  isVisible = true,
  message = 'Decrypting secure connection',
  className = '',
  columns = 16,
  characters = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワ',
  color = '#3B82F6', // primary blue
}) => {
  const [rainDrops, setRainDrops] = useState<RainDrop[]>([]);
  
  // Generate random raindrops
  useEffect(() => {
    if (isVisible) {
      const newRainDrops: RainDrop[] = [];
      
      for (let i = 0; i < columns; i++) {
        // Generate a random sequence of characters for each column
        const charArray = Array.from({ length: Math.floor(Math.random() * 5) + 3 }, () => {
          return characters.charAt(Math.floor(Math.random() * characters.length));
        });
        
        newRainDrops.push({
          id: i,
          column: i,
          characters: charArray,
          delay: Math.random() * 2, // random start delay
        });
      }
      
      setRainDrops(newRainDrops);
    }
  }, [isVisible, columns, characters]);
  
  if (!isVisible) return null;
  
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative w-48 h-32 overflow-hidden rounded-lg bg-bg/30 backdrop-blur-sm p-2">
        <div className="grid" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {rainDrops.map((drop) => (
            <div key={`raindrop-${drop.id}`} className="flex flex-col items-center">
              {drop.characters.map((char, index) => (
                <motion.div
                  key={`char-${drop.id}-${index}`}
                  className="text-xs font-mono"
                  style={{ 
                    color, 
                    textShadow: `0 0 5px ${color}`,
                    opacity: 1 - (index * 0.2), // Fade out as they go down
                  }}
                  custom={drop.delay + (index * 0.1)}
                  initial="hidden"
                  animate="visible"
                  variants={digitalRainAnimation}
                >
                  {char}
                </motion.div>
              ))}
            </div>
          ))}
        </div>
        
        {/* Add some floating numbers/symbols for effect */}
        {Array.from({ length: 10 }).map((_, i) => (
          <motion.div
            key={`floating-${i}`}
            className="absolute text-[10px] font-mono"
            style={{ 
              left: `${Math.random() * 100}%`, 
              top: `${Math.random() * 100}%`,
              color,
              opacity: 0.5 + Math.random() * 0.5,
              textShadow: `0 0 3px ${color}`,
            }}
            animate={{ 
              opacity: [0, 1, 0],
              y: [0, -10],
            }}
            transition={{
              duration: 1 + Math.random() * 2,
              repeat: Infinity,
              repeatDelay: Math.random() * 3,
            }}
          >
            {characters.charAt(Math.floor(Math.random() * characters.length))}
          </motion.div>
        ))}
      </div>
      
      {message && (
        <motion.div
          className="mt-4 text-sm text-blue-300 font-mono"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
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

export default DigitalRainLoader;