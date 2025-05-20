import React, { useEffect, useState, useRef } from 'react';
import { motion, useAnimation, useMotionValue, useTransform } from 'framer-motion';

interface HeroDockProps {
  onConnectWallet: () => void;
  isWalletConnected: boolean;
}

type Particle = {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  color: string;
};

const HeroDock: React.FC<HeroDockProps> = ({ onConnectWallet, isWalletConnected }) => {
  const [isHovering, setIsHovering] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Motion values for parallax effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Transform mouse position into small movements
  const titleX = useTransform(mouseX, [-500, 500], [20, -20]);
  const titleY = useTransform(mouseY, [-500, 500], [10, -10]);
  
  const logoX = useTransform(mouseX, [-500, 500], [10, -10]);
  const logoY = useTransform(mouseY, [-500, 500], [5, -5]);
  
  const buttonX = useTransform(mouseX, [-500, 500], [5, -5]);
  const buttonY = useTransform(mouseY, [-500, 500], [2, -2]);
  
  const bgLayer1X = useTransform(mouseX, [-500, 500], [30, -30]);
  const bgLayer1Y = useTransform(mouseY, [-500, 500], [15, -15]);
  
  const bgLayer2X = useTransform(mouseX, [-500, 500], [50, -50]);
  const bgLayer2Y = useTransform(mouseY, [-500, 500], [25, -25]);
  
  // Analytics tracking
  const trackEvent = (name: string, params = {}) => {
    if (typeof window !== 'undefined') {
      console.log(`[Analytics] ${name}`, params);
    }
  };
  
  const handleConnectClick = () => {
    trackEvent('wallet_connect_attempt', { provider: 'metamask' });
    onConnectWallet();
    
    // Create burst effect
    createParticleBurst(40);
  };
  
  // Track mouse position for parallax effect
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate relative position from center
    const relativeX = e.clientX - centerX;
    const relativeY = e.clientY - centerY;
    
    mouseX.set(relativeX);
    mouseY.set(relativeY);
    
    setMousePosition({ x: e.clientX, y: e.clientY });
  };
  
  // Create particles
  const createParticle = (x: number, y: number): Particle => {
    const colors = ['#3b82f6', '#6366f1', '#4f46e5', '#818cf8', '#2563eb'];
    return {
      id: Math.random(),
      x,
      y,
      size: Math.random() * 6 + 1,
      speed: Math.random() * 3 + 0.5,
      opacity: Math.random() * 0.8 + 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
    };
  };
  
  // Create particle burst
  const createParticleBurst = (count: number) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const buttonRect = containerRef.current.querySelector('button')?.getBoundingClientRect();
    
    if (!buttonRect) return;
    
    const centerX = buttonRect.left + buttonRect.width / 2;
    const centerY = buttonRect.top + buttonRect.height / 2;
    
    const newParticles: Particle[] = [];
    
    for (let i = 0; i < count; i++) {
      newParticles.push(createParticle(centerX, centerY));
    }
    
    setParticles(prev => [...prev, ...newParticles]);
  };
  
  // Initialize floating particles
  useEffect(() => {
    const initialParticles: Particle[] = [];
    
    for (let i = 0; i < 20; i++) {
      initialParticles.push(createParticle(
        Math.random() * window.innerWidth,
        Math.random() * window.innerHeight
      ));
    }
    
    setParticles(initialParticles);
    
    const intervalId = setInterval(() => {
      setParticles(prev => 
        prev
          .map(p => ({
            ...p,
            y: p.y - p.speed,
            opacity: p.y < 0 ? 0 : p.opacity
          }))
          .filter(p => p.opacity > 0)
      );
      
      // Add new particles occasionally
      if (Math.random() > 0.7) {
        setParticles(prev => [
          ...prev, 
          createParticle(
            Math.random() * window.innerWidth,
            window.innerHeight
          )
        ]);
      }
    }, 50);
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Auto-pulsing animation for the background
  const bgAnimation = useAnimation();
  
  useEffect(() => {
    const animateBg = async () => {
      while (true) {
        await bgAnimation.start({
          scale: [1, 1.05, 1],
          opacity: [0.5, 0.7, 0.5],
          transition: { duration: 8, ease: "easeInOut" }
        });
      }
    };
    
    animateBg();
  }, [bgAnimation]);
  
  return (
    <div 
      ref={containerRef}
      className="container-grid z-10 relative pt-12 md:pt-24 overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Animated background layers */}
      <motion.div 
        className="absolute inset-0 z-0 opacity-30"
        style={{ 
          x: bgLayer1X, 
          y: bgLayer1Y,
          background: 'radial-gradient(circle at center, rgba(59, 130, 246, 0.4) 0%, rgba(37, 99, 235, 0.1) 50%, transparent 100%)',
          width: '120%',
          height: '120%',
          left: '-10%',
          top: '-10%',
        }}
        animate={bgAnimation}
      />
      
      <motion.div 
        className="absolute inset-0 z-0 opacity-20"
        style={{ 
          x: bgLayer2X, 
          y: bgLayer2Y,
          background: 'radial-gradient(circle at 60% 30%, rgba(99, 102, 241, 0.4) 0%, rgba(79, 70, 229, 0.1) 40%, transparent 80%)',
          width: '130%',
          height: '130%',
          left: '-15%',
          top: '-15%',
        }}
      />
      
      {/* Floating particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            x: particle.x,
            y: particle.y,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            opacity: particle.opacity,
            zIndex: 1,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: particle.opacity }}
          exit={{ opacity: 0 }}
        />
      ))}
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
        {/* Logo section */}
        <motion.div 
          className="md:col-span-4"
          style={{ x: logoX, y: logoY }}
        >
          <div className="flex items-center mb-4">
            <motion.div 
              className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 mr-3 relative"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 opacity-0"
                animate={{ 
                  opacity: [0, 0.6, 0],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
            <motion.h3 
              className="font-space font-bold text-blue-400"
              whileHover={{ scale: 1.05, color: "#60a5fa" }}
              transition={{ duration: 0.2 }}
            >
              KONSTELLATION
            </motion.h3>
          </div>
        </motion.div>
        
        {/* Content section */}
        <div className="md:col-span-8 relative">
          <motion.div
            style={{ x: titleX, y: titleY }}
          >
            <motion.h1 
              className="mb-6 text-white text-4xl md:text-5xl font-bold"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Echo Lite <motion.span 
                className="text-blue-400 relative"
                whileHover={{ scale: 1.05 }}
              >
                &quot;Neon Singularity&quot;
                <motion.div 
                  className="absolute -bottom-1 left-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600"
                  initial={{ width: 0 }}
                  whileInView={{ width: '100%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                />
              </motion.span>
            </motion.h1>
            
            <motion.p 
              className="text-gray-300 mb-8 max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Your portal to algorithmic trading in the Konstellation ecosystem. 
              Zero friction, maximum transparency, minimal learning curve.
            </motion.p>
          </motion.div>
          
          <motion.div
            style={{ x: buttonX, y: buttonY }}
          >
            <motion.button
              aria-label="Connect Wallet"
              onClick={handleConnectClick}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              whileHover={{ 
                scale: 1.06,
                boxShadow: "0 0 20px 2px rgba(99, 102, 241, 0.5)"
              }}
              whileTap={{
                scale: 0.98,
                transition: { duration: 0.2, ease: [0.21, 0.68, 0.19, 1.01] }
              }}
              className={`
                bg-gradient-to-r from-blue-600 to-indigo-600
                hover:from-blue-500 hover:to-indigo-500
                text-white font-bold py-3 px-8 rounded-lg
                shadow-lg shadow-indigo-500/30
                border border-indigo-400/30 relative
                ${!isWalletConnected ? 'animate-pulse-subtle' : ''}
              `}
              disabled={isWalletConnected}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              {isWalletConnected ? 'Wallet Connected' : 'Connect Wallet'}
              
              {/* Button glow effect */}
              {isHovering && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-blue-500/20 rounded-lg -z-10"
                />
              )}
              
              {/* Button light trail */}
              <motion.div
                className="absolute inset-0 rounded-lg overflow-hidden"
                style={{ zIndex: -5 }}
              >
                <motion.div
                  className="w-20 h-20 rounded-full absolute -z-10 bg-gradient-to-r from-blue-400/40 to-indigo-500/40 blur-xl"
                  animate={{ 
                    x: ['-100%', '200%'],
                    opacity: [0, 1, 0]
                  }}
                  transition={{ 
                    duration: 2.5, 
                    repeat: Infinity,
                    repeatType: 'loop',
                    ease: "easeInOut",
                    delay: 1
                  }}
                  style={{ top: '50%', translateY: '-50%' }}
                />
              </motion.div>
            </motion.button>
          </motion.div>
          
          {/* Floating 3D elements */}
          <motion.div
            className="absolute -right-12 top-0 w-20 h-20 opacity-20 hidden md:block"
            style={{
              x: useTransform(mouseX, [-500, 500], [40, -40]),
              y: useTransform(mouseY, [-500, 500], [20, -20]),
              rotateX: useTransform(mouseY, [-500, 500], [10, -10]),
              rotateY: useTransform(mouseX, [-500, 500], [-10, 10]),
            }}
          >
            <div className="w-full h-full bg-gradient-to-br from-blue-500/40 to-indigo-600/40 rounded-lg" />
          </motion.div>
          
          <motion.div
            className="absolute -left-16 -bottom-6 w-12 h-12 opacity-30 hidden md:block"
            style={{
              x: useTransform(mouseX, [-500, 500], [-30, 30]),
              y: useTransform(mouseY, [-500, 500], [-15, 15]),
              rotateX: useTransform(mouseY, [-500, 500], [-15, 15]),
              rotateY: useTransform(mouseX, [-500, 500], [15, -15]),
            }}
          >
            <div className="w-full h-full bg-gradient-to-br from-indigo-500/50 to-blue-600/50 rounded-full" />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HeroDock;