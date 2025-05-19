import React from 'react';
import { motion } from 'framer-motion';
import { glitchAnimation } from '@/utils/animations';

interface GlitchTextProps {
  text: string;
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
  color?: string;
  glowColor?: string;
  as?: React.ElementType;
}

const GlitchText: React.FC<GlitchTextProps> = ({
  text,
  className = '',
  intensity = 'medium',
  color = '#3B82F6', // primary blue
  glowColor = 'rgba(99, 102, 241, 0.7)', // electric ink with transparency
  as: Component = 'div',
}) => {
  // Custom animation variants based on intensity
  const intensityConfig = {
    low: {
      x: [0, -1, 1, 0, 1, -1, 0],
      y: [0, 1, -1, 0],
      speed: 2.5,
    },
    medium: {
      x: [0, -2, 2, -1, 0, 2, -2, 0],
      y: [0, 1, -1, 2, -2, 1, 0],
      speed: 1.5,
    },
    high: {
      x: [0, -3, 3, -2, 0, 3, -3, 0],
      y: [0, 2, -2, 3, -3, 1, 0],
      speed: 0.8,
    },
  };

  const { x, y, speed } = intensityConfig[intensity];

  const customGlitchAnimation = {
    ...glitchAnimation,
    visible: {
      opacity: 1,
      x,
      y,
      transition: {
        x: {
          duration: speed,
          repeat: Infinity,
          repeatType: 'mirror',
          ease: 'easeInOut',
        },
        y: {
          duration: speed,
          repeat: Infinity,
          repeatType: 'mirror',
          ease: 'easeInOut',
        },
        opacity: {
          duration: 0.3,
        },
      },
    },
  };

  return (
    <Component
      className={`relative inline-block ${className}`}
      style={{ color }}
      data-text={text}
    >
      {/* Base Text */}
      <span className="relative z-10">{text}</span>

      {/* Glitch Layers */}
      <motion.span
        className="absolute top-0 left-0 w-full h-full"
        style={{
          color,
          textShadow: `0 0 5px ${glowColor}, 0 0 10px ${glowColor}`,
          clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)',
        }}
        initial="hidden"
        animate="visible"
        variants={customGlitchAnimation}
        data-text={text}
      >
        {text}
      </motion.span>

      <motion.span
        className="absolute top-0 left-0 w-full h-full"
        style={{
          color,
          textShadow: `0 0 5px ${glowColor}, 0 0 10px ${glowColor}`,
          clipPath: 'polygon(0 55%, 100% 55%, 100% 100%, 0 100%)',
        }}
        initial="hidden"
        animate="visible"
        variants={customGlitchAnimation}
        custom={0.2} // Slightly offset timing
        data-text={text}
      >
        {text}
      </motion.span>

      {/* Random character flicker */}
      {intensity === 'high' && (
        <motion.span
          className="absolute top-0 left-0 w-full h-full opacity-70"
          style={{
            color,
            mixBlendMode: 'difference',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.7, 0] }}
          transition={{
            duration: 0.2,
            repeat: Infinity,
            repeatDelay: Math.random() * 2 + 1,
          }}
        >
          {text
            .split('')
            .map((char, i) =>
              Math.random() > 0.7 ? String.fromCharCode(Math.floor(Math.random() * 26) + 97) : char
            )
            .join('')}
        </motion.span>
      )}
    </Component>
  );
};

export default GlitchText;