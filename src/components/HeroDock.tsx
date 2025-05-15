import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface HeroDockProps {
  onConnectWallet: () => void;
  isWalletConnected: boolean;
}

const HeroDock: React.FC<HeroDockProps> = ({ onConnectWallet, isWalletConnected }) => {
  const [isHovering, setIsHovering] = useState(false);
  
  // Analytics tracking
  const trackEvent = (name: string, params = {}) => {
    if (typeof window !== 'undefined') {
      console.log(`[Analytics] ${name}`, params);
    }
  };
  
  const handleConnectClick = () => {
    trackEvent('wallet_connect_attempt', { provider: 'metamask' });
    onConnectWallet();
  };
  
  return (
    <div className="container-grid z-10 relative pt-12 md:pt-24">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-4">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 mr-3"></div>
            <h3 className="font-space font-bold text-blue-400">KONSTELLATION</h3>
          </div>
        </div>
        
        <div className="md:col-span-8">
          <h1 className="mb-6 text-white">
            Echo Lite <span className="text-blue-400">&quot;Neon Singularity&quot;</span>
          </h1>
          
          <p className="text-gray-300 mb-8 max-w-xl">
            Your portal to algorithmic trading in the Konstellation ecosystem. 
            Zero friction, maximum transparency, minimal learning curve.
          </p>
          
          <motion.button
            aria-label="Connect Wallet"
            onClick={handleConnectClick}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.2, ease: [0.21, 0.68, 0.19, 1.01] }}
            className={`bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3 px-8 rounded-lg shadow-lg shadow-indigo-500/30 border border-indigo-400/30 relative ${!isWalletConnected ? 'animate-pulse-subtle' : ''}`}
            disabled={isWalletConnected}
          >
            {isWalletConnected ? 'Wallet Connected' : 'Connect Wallet'}
            
            {isHovering && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-blue-500/20 rounded-lg -z-10"
              />
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default HeroDock;