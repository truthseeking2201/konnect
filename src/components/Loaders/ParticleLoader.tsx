import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { particleAnimation, rippleAnimation } from '@/utils/animations';

interface ParticleLoaderProps {
  isVisible: boolean;
  message?: string;
  className?: string;
  particleCount?: number;
  colors?: string[];
}

interface Particle {
  id: number;
  x: number;
  y: number;
  delay: number;
  direction: 'up' | 'down' | 'left' | 'right';
  size: number;
  color: string;
}

const ParticleLoader: React.FC<ParticleLoaderProps> = ({
  isVisible = true,
  message = 'Preparing wallet connection',
  className = '',
  particleCount = 20,
  colors = ['#3B82F6', '#6366F1', '#8B5CF6', '#2563EB']
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  
  // Generate random particles
  useEffect(() => {
    if (isVisible) {
      const directions: Array<'up' | 'down' | 'left' | 'right'> = ['up', 'down', 'left', 'right'];
      const newParticles: Particle[] = [];
      
      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100, // random position within container
          y: Math.random() * 100,
          delay: Math.random() * 2, // random start delay
          direction: directions[Math.floor(Math.random() * directions.length)],
          size: 2 + Math.random() * 4, // random size
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }
      
      setParticles(newParticles);
    }
  }, [isVisible, particleCount, colors]);
  
  if (!isVisible) return null;
  
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative w-32 h-32">
        {/* Central focus ring */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <motion.div
            className="rounded-full bg-primary-glow"
            initial="hidden"
            animate="visible"
            variants={rippleAnimation}
            style={{
              width: '40px',
              height: '40px',
              boxShadow: '0 0 15px rgba(99, 102, 241, 0.5), 0 0 30px rgba(99, 102, 241, 0.3)',
              border: '2px solid rgba(99, 102, 241, 0.6)'
            }}
          />
        </div>
        
        {/* Secondary ripple */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <motion.div
            className="rounded-full bg-transparent"
            initial="hidden"
            animate="visible"
            variants={rippleAnimation}
            transition={{ delay: 0.5 }}
            style={{
              width: '60px',
              height: '60px',
              border: '1px solid rgba(99, 102, 241, 0.4)'
            }}
          />
        </div>
        
        {/* Particles */}
        {particles.map((particle) => (
          <motion.div
            key={`particle-${particle.id}`}
            className="absolute rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.color,
              boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
            }}
            custom={particle.direction}
            initial="hidden"
            animate="visible"
            variants={particleAnimation(particle.direction)}
            transition={{ delay: particle.delay }}
          />
        ))}
      </div>
      
      {message && (
        <motion.div
          className="mt-4 text-sm text-blue-300 font-mono"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
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

export default ParticleLoader;