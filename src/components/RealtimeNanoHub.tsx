import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SnapshotData {
  pnl24h: string;
  token: string;
  influencer: string;
  confidence: number;
  ts: number;
}

interface RealtimeNanoHubProps {
  walletAddress?: string;
}

const RealtimeNanoHub: React.FC<RealtimeNanoHubProps> = ({ walletAddress }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<SnapshotData | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Hardcoded data simulation for demo
  useEffect(() => {
    if (!walletAddress) return;
    
    // Simulate loading
    setIsLoading(true);
    setError(null);
    
    // Simulate network delay
    const loadingTimer = setTimeout(() => {
      // Generate mock data that's consistently based on wallet address
      // This way we get predictable but different results for different wallet addresses
      const walletLastChar = walletAddress.slice(-1);
      const hashCode = walletAddress.split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
      }, 0);
      
      // Determine data based on wallet hash
      const tokens = ['SOL', 'BTC', 'ETH', 'AVAX', 'MATIC'];
      const influencers = ['@0xRamen', '@CryptoTori', '@ChainQuest', '@AlgoTrader'];
      
      // Get reliable but "random" index
      const tokenIndex = Math.abs(hashCode) % tokens.length;
      const influencerIndex = Math.abs(hashCode >> 4) % influencers.length;
      
      // Generate PnL value that's positive biased
      const pnlBase = 5 + (Math.abs(hashCode) % 10);
      const pnlMultiplier = Math.random() > 0.2 ? 1 : -1; // 80% chance of positive
      const pnlValue = (pnlBase * pnlMultiplier * (0.8 + Math.random() * 0.4)).toFixed(2);
      const pnl24h = (parseFloat(pnlValue) >= 0 ? '+' : '') + pnlValue;
      
      const mockData: SnapshotData = {
        pnl24h,
        token: tokens[tokenIndex],
        influencer: influencers[influencerIndex],
        confidence: 0.75 + (Math.abs(hashCode) % 20) / 100, // 75-95% confidence
        ts: Date.now()
      };
      
      setData(mockData);
      setIsLoading(false);
    }, 800); // Shorter loading time for demo
    
    return () => clearTimeout(loadingTimer);
  }, [walletAddress]);
  
  // Format timestamp
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  if (!walletAddress) {
    return null;
  }
  
  return (
    <div className="container-grid py-10">
      <AnimatePresence>
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="bg-surface rounded-lg p-6 h-48 animate-pulse">
              <div className="h-6 bg-bg/40 rounded w-1/3 mb-6"></div>
              <div className="h-12 bg-bg/40 rounded w-2/3 mb-4"></div>
              <div className="h-4 bg-bg/40 rounded w-1/2"></div>
            </div>
            <div className="bg-surface rounded-lg p-6 h-48 animate-pulse">
              <div className="h-6 bg-bg/40 rounded w-1/3 mb-6"></div>
              <div className="h-12 bg-bg/40 rounded w-2/3 mb-4"></div>
              <div className="h-4 bg-bg/40 rounded w-1/2"></div>
            </div>
          </motion.div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-red-900/20 border border-red-500 text-red-300 p-4 rounded-lg"
          >
            {error}
          </motion.div>
        ) : data && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="bg-surface rounded-lg p-6">
              <h3 className="text-gray-400 mb-2">24h Performance</h3>
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className={`text-4xl font-bold mb-4 ${
                  data.pnl24h.startsWith('+') ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {data.pnl24h}%
              </motion.div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Last Update</span>
                <span className="text-electric-ink text-sm">{formatTime(data.ts)}</span>
              </div>
            </div>
            
            <div className="bg-surface rounded-lg p-6">
              <h3 className="text-gray-400 mb-2">Latest Signal</h3>
              <div className="mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-primary-glow flex items-center justify-center">
                    <span className="text-primary font-bold">{data.token}</span>
                  </div>
                  <div className="ml-3">
                    <div className="text-white font-medium">
                      Signal by {data.influencer}
                    </div>
                    <div className="text-sm text-gray-400">
                      Confidence: {Math.round(data.confidence * 100)}%
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-2 pt-2 border-t border-gray-700">
                <div className="w-full bg-bg/70 rounded-full h-2 mb-1">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${data.confidence * 100}%` }}
                    className="bg-primary h-2 rounded-full"
                  />
                </div>
                <div className="text-xs text-gray-400 flex justify-between">
                  <span>Signal Strength</span>
                  <span>{Math.round(data.confidence * 100)}%</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RealtimeNanoHub;