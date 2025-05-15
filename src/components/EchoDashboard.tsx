import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, TrendingUp, TrendingDown, Clock, Zap, Info, History, AlertTriangle } from 'lucide-react';

interface Trade {
  id: string;
  token: string;
  direction: 'long' | 'short';
  entryPrice: string;
  currentPrice?: string;
  pnl: string;
  timestamp: number;
  status: 'open' | 'closed';
  source: string;
  confidence: number;
}

interface EchoDashboardProps {
  isActive: boolean;
  selectedRisk?: 'conservative' | 'balanced' | 'aggressive';
  walletAddress?: string;
}

const EchoDashboard: React.FC<EchoDashboardProps> = ({
  isActive,
  selectedRisk,
  walletAddress
}) => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'trades' | 'audit'>('overview');
  const [hoverInfo, setHoverInfo] = useState<{x: number, y: number, text: string} | null>(null);
  
  // Generate mock data based on wallet address
  useEffect(() => {
    if (!isActive || !walletAddress) return;
    
    setIsLoading(true);
    
    // Simulate loading delay
    setTimeout(() => {
      // Generate deterministic but different data for different wallets
      const hashCode = walletAddress.split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
      }, 0);
      
      // Generate mock trades
      const generateTrades = () => {
        const tokens = ['ETH', 'BTC', 'SOL', 'AVAX', 'MATIC', 'ARB', 'LINK'];
        const sources = ['@0xRamen', '@CryptoTori', '@ChainQuest', '@AlgoTrader', 'Alpha Hunters'];
        const mockTrades: Trade[] = [];
        
        // Number of trades based on risk profile
        const tradeCount = selectedRisk === 'conservative' ? 3 : 
                          selectedRisk === 'balanced' ? 5 : 8;
        
        for (let i = 0; i < tradeCount; i++) {
          // Generate deterministic but seemingly random values
          const seed = (hashCode + i) % 100;
          const tokenIndex = (seed * 7 + i) % tokens.length;
          const sourceIndex = (seed * 3 + i) % sources.length;
          const direction = seed % 3 === 0 ? 'short' : 'long';
          
          // Generate realistic PnL that trends positive for demo purposes
          const pnlBase = direction === 'long' ? 5 + (seed % 20) : (seed % 15) - 7;
          const pnlFormatted = (pnlBase > 0 ? '+' : '') + pnlBase.toFixed(2) + '%';
          
          // Generate timestamps over the past week
          const hoursAgo = i * 6 + (seed % 12); // 0-96 hours ago
          const timestamp = Date.now() - hoursAgo * 60 * 60 * 1000;
          
          mockTrades.push({
            id: `trade_${i}_${seed}`,
            token: tokens[tokenIndex],
            direction,
            entryPrice: generateMockPrice(tokens[tokenIndex]),
            currentPrice: generateMockPrice(tokens[tokenIndex], direction === 'long' ? pnlBase > 0 : pnlBase < 0),
            pnl: pnlFormatted,
            timestamp,
            status: i === 0 ? 'open' : 'closed', // First trade is always open
            source: sources[sourceIndex],
            confidence: 0.7 + (seed % 30) / 100 // 70-99% confidence
          });
        }
        
        return mockTrades.sort((a, b) => b.timestamp - a.timestamp); // Sort by most recent
      };
      
      setTrades(generateTrades());
      setIsLoading(false);
    }, 1500);
  }, [isActive, walletAddress, selectedRisk]);
  
  // Helper function to generate mock price strings
  const generateMockPrice = (token: string, isHigher: boolean = true) => {
    // Base prices for tokens
    const basePrice = {
      'ETH': 3500,
      'BTC': 65000,
      'SOL': 140,
      'AVAX': 35,
      'MATIC': 0.85,
      'ARB': 1.2,
      'LINK': 18
    }[token] || 10;
    
    // Add a small random variation
    const variation = basePrice * (isHigher ? 0.05 : -0.03) * Math.random();
    const price = basePrice + variation;
    
    // Format based on price range
    if (price < 1) return `$${price.toFixed(4)}`;
    if (price < 10) return `$${price.toFixed(2)}`;
    if (price < 1000) return `$${price.toFixed(1)}`;
    return `$${price.toFixed(0)}`;
  };
  
  // Calculate aggregated stats
  const calculateStats = () => {
    if (trades.length === 0) return null;
    
    const totalTrades = trades.length;
    const openTrades = trades.filter(t => t.status === 'open').length;
    
    // Calculate win rate
    let winCount = 0;
    trades.forEach(trade => {
      const pnlValue = parseFloat(trade.pnl.replace('%', ''));
      if (pnlValue > 0) winCount++;
    });
    const winRate = (winCount / totalTrades) * 100;
    
    // Overall PnL
    let totalPnl = 0;
    trades.forEach(trade => {
      const pnlValue = parseFloat(trade.pnl.replace('%', ''));
      totalPnl += pnlValue;
    });
    const averagePnl = totalPnl / totalTrades;
    
    // Best and worst trade
    let bestTrade = -100;
    let worstTrade = 100;
    trades.forEach(trade => {
      const pnlValue = parseFloat(trade.pnl.replace('%', ''));
      if (pnlValue > bestTrade) bestTrade = pnlValue;
      if (pnlValue < worstTrade) worstTrade = pnlValue;
    });
    
    return {
      totalTrades,
      openTrades,
      winRate,
      averagePnl,
      bestTrade,
      worstTrade
    };
  };
  
  // Format timestamp
  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diffMinutes = Math.floor((now - timestamp) / (60 * 1000));
    
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'yesterday';
    return `${diffDays}d ago`;
  };
  
  // Handle mouse hover for info tooltip
  const handleMouseEnter = (e: React.MouseEvent, text: string) => {
    setHoverInfo({
      x: e.clientX,
      y: e.clientY,
      text
    });
  };
  
  const handleMouseLeave = () => {
    setHoverInfo(null);
  };
  
  if (!isActive || !walletAddress) return null;
  
  const stats = calculateStats();
  
  return (
    <div className="bg-surface rounded-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-primary flex items-center">
          <BarChart3 className="mr-2" size={20} />
          Echo Dashboard
        </h3>
        
        {selectedRisk && (
          <div className="px-3 py-1 bg-electric-ink/10 rounded-full text-electric-ink text-xs font-mono">
            {selectedRisk.toUpperCase()} MODE
          </div>
        )}
      </div>
      
      {/* Tabs */}
      <div className="flex border-b border-gray-800 mb-6">
        <button
          onClick={() => setSelectedTab('overview')}
          className={`px-4 py-2 border-b-2 ${
            selectedTab === 'overview' 
              ? 'border-primary text-primary' 
              : 'border-transparent text-gray-400 hover:text-gray-300'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setSelectedTab('trades')}
          className={`px-4 py-2 border-b-2 ${
            selectedTab === 'trades' 
              ? 'border-primary text-primary' 
              : 'border-transparent text-gray-400 hover:text-gray-300'
          }`}
        >
          Trades
        </button>
        <button
          onClick={() => setSelectedTab('audit')}
          className={`px-4 py-2 border-b-2 ${
            selectedTab === 'audit' 
              ? 'border-primary text-primary' 
              : 'border-transparent text-gray-400 hover:text-gray-300'
          }`}
        >
          Audit Log
        </button>
      </div>
      
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            className="h-64 flex items-center justify-center"
          >
            <div className="animate-spin w-10 h-10 border-2 border-primary border-t-transparent rounded-full"></div>
          </motion.div>
        ) : selectedTab === 'overview' && stats ? (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-bg/50 rounded-lg p-4">
                <div className="text-gray-400 text-sm mb-1">Total Trades</div>
                <div className="text-2xl font-bold text-white">{stats.totalTrades}</div>
                <div className="text-xs text-gray-500 mt-1">Lifetime</div>
              </div>
              
              <div className="bg-bg/50 rounded-lg p-4">
                <div className="text-gray-400 text-sm mb-1">Win Rate</div>
                <div className="text-2xl font-bold text-electric-ink">{stats.winRate.toFixed(1)}%</div>
                <div className="text-xs text-gray-500 mt-1">All-time</div>
              </div>
              
              <div className="bg-bg/50 rounded-lg p-4">
                <div className="text-gray-400 text-sm mb-1">Average PnL</div>
                <div className={`text-2xl font-bold ${stats.averagePnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {stats.averagePnl >= 0 ? '+' : ''}{stats.averagePnl.toFixed(1)}%
                </div>
                <div className="text-xs text-gray-500 mt-1">Per trade</div>
              </div>
              
              <div className="bg-bg/50 rounded-lg p-4">
                <div className="text-gray-400 text-sm mb-1">Open Positions</div>
                <div className="text-2xl font-bold text-white">{stats.openTrades}</div>
                <div className="text-xs text-gray-500 mt-1">Currently active</div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Performance Chart - Mockup for demo */}
              <div className="bg-bg/50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-white font-bold">Performance</h4>
                  <div className="text-xs text-gray-400">Last 7 days</div>
                </div>
                
                <div className="h-40 relative">
                  {/* Mock chart - would be replaced with actual chart library */}
                  <div className="absolute inset-0 flex items-end">
                    <div className="w-1/7 h-[35%] bg-primary/20 mx-0.5 relative" 
                      onMouseEnter={e => handleMouseEnter(e, 'Monday: +2.5%')}
                      onMouseLeave={handleMouseLeave}
                    >
                      <div className="absolute bottom-0 w-full h-[85%] bg-primary"></div>
                    </div>
                    <div className="w-1/7 h-[60%] bg-primary/20 mx-0.5 relative"
                      onMouseEnter={e => handleMouseEnter(e, 'Tuesday: +7.2%')}
                      onMouseLeave={handleMouseLeave}
                    >
                      <div className="absolute bottom-0 w-full h-[90%] bg-primary"></div>
                    </div>
                    <div className="w-1/7 h-[30%] bg-red-500/20 mx-0.5 relative"
                      onMouseEnter={e => handleMouseEnter(e, 'Wednesday: -1.8%')}
                      onMouseLeave={handleMouseLeave}
                    >
                      <div className="absolute bottom-0 w-full h-[60%] bg-red-500"></div>
                    </div>
                    <div className="w-1/7 h-[45%] bg-primary/20 mx-0.5 relative"
                      onMouseEnter={e => handleMouseEnter(e, 'Thursday: +3.4%')}
                      onMouseLeave={handleMouseLeave}
                    >
                      <div className="absolute bottom-0 w-full h-[80%] bg-primary"></div>
                    </div>
                    <div className="w-1/7 h-[70%] bg-primary/20 mx-0.5 relative"
                      onMouseEnter={e => handleMouseEnter(e, 'Friday: +8.9%')}
                      onMouseLeave={handleMouseLeave}
                    >
                      <div className="absolute bottom-0 w-full h-[95%] bg-primary"></div>
                    </div>
                    <div className="w-1/7 h-[50%] bg-primary/20 mx-0.5 relative"
                      onMouseEnter={e => handleMouseEnter(e, 'Saturday: +5.1%')}
                      onMouseLeave={handleMouseLeave}
                    >
                      <div className="absolute bottom-0 w-full h-[85%] bg-primary"></div>
                    </div>
                    <div className="w-1/7 h-[40%] bg-primary/20 mx-0.5 relative"
                      onMouseEnter={e => handleMouseEnter(e, 'Sunday: +3.2%')}
                      onMouseLeave={handleMouseLeave}
                    >
                      <div className="absolute bottom-0 w-full h-[80%] bg-primary"></div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-between text-xs text-gray-500">
                  <div>Mon</div>
                  <div>Tue</div>
                  <div>Wed</div>
                  <div>Thu</div>
                  <div>Fri</div>
                  <div>Sat</div>
                  <div>Sun</div>
                </div>
              </div>
              
              {/* Best/Worst Stats */}
              <div className="bg-bg/50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-white font-bold">Stats</h4>
                  <div className="text-xs text-gray-400">All-time</div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <TrendingUp className="text-green-400 mr-2" size={18} />
                      <div>
                        <div className="text-gray-300">Best Trade</div>
                        <div className="text-xs text-gray-500">ETH long - 2 days ago</div>
                      </div>
                    </div>
                    <div className="text-green-400 font-bold">+{stats.bestTrade.toFixed(1)}%</div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <TrendingDown className="text-red-400 mr-2" size={18} />
                      <div>
                        <div className="text-gray-300">Worst Trade</div>
                        <div className="text-xs text-gray-500">ARB short - 5 days ago</div>
                      </div>
                    </div>
                    <div className="text-red-400 font-bold">{stats.worstTrade.toFixed(1)}%</div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Clock className="text-gray-400 mr-2" size={18} />
                      <div>
                        <div className="text-gray-300">Avg Hold Time</div>
                        <div className="text-xs text-gray-500">All positions</div>
                      </div>
                    </div>
                    <div className="text-gray-300 font-bold">{6 + Math.floor(Math.random() * 10)}h</div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Zap className="text-electric-ink mr-2" size={18} />
                      <div>
                        <div className="text-gray-300">Signal Accuracy</div>
                        <div className="text-xs text-gray-500">Last 30 days</div>
                      </div>
                    </div>
                    <div className="text-electric-ink font-bold">{72 + Math.floor(Math.random() * 20)}%</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : selectedTab === 'trades' ? (
          <motion.div
            key="trades"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {trades.length === 0 ? (
              <div className="text-center py-10">
                <AlertTriangle className="mx-auto mb-2 text-amber-400" size={24} />
                <p className="text-gray-400">No trades found yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {trades.map(trade => (
                  <div 
                    key={trade.id}
                    className="bg-bg/50 rounded-lg p-4 border border-gray-800"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-primary-glow/40 flex items-center justify-center mr-3">
                          <span className="text-primary font-bold">{trade.token}</span>
                        </div>
                        
                        <div>
                          <div className="flex items-center">
                            <span className={`px-2 py-0.5 rounded text-xs mr-2 ${
                              trade.direction === 'long' 
                                ? 'bg-green-500/20 text-green-400' 
                                : 'bg-red-500/20 text-red-400'
                            }`}>
                              {trade.direction.toUpperCase()}
                            </span>
                            <span className={`text-sm ${trade.status === 'open' ? 'text-green-400' : 'text-gray-400'}`}>
                              {trade.status === 'open' ? 'OPEN' : 'CLOSED'}
                            </span>
                          </div>
                          <div className="text-sm text-gray-400 mt-1">
                            {formatTime(trade.timestamp)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className={`text-lg font-bold ${
                          parseFloat(trade.pnl) >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {trade.pnl}
                        </div>
                        <div className="text-xs text-gray-400">via {trade.source}</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      <div>
                        <div className="text-xs text-gray-500">Entry Price</div>
                        <div className="text-sm text-white">{trade.entryPrice}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Current/Exit Price</div>
                        <div className="text-sm text-white">{trade.currentPrice || '-'}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Confidence</div>
                        <div className="text-sm text-electric-ink">{Math.round(trade.confidence * 100)}%</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Status</div>
                        <div className="text-sm">
                          {trade.status === 'open' ? (
                            <span className="text-green-400">Active</span>
                          ) : (
                            <span className="text-gray-400">Completed</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="audit"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center p-3 bg-bg/70 rounded border border-gray-800">
              <Info className="text-gray-400 mr-3" size={18} />
              <div className="text-sm text-gray-300">
                The audit log records all reasoning and actions taken by Echo Agent.
              </div>
            </div>
            
            {trades.slice(0, 5).map((trade, index) => (
              <div 
                key={`audit-${trade.id}`}
                className="bg-bg/50 rounded-lg p-4 border border-gray-800"
              >
                <div className="flex items-center text-gray-400 text-xs mb-2">
                  <History size={14} className="mr-1" />
                  <span>{formatTime(trade.timestamp)}</span>
                </div>
                
                <h4 className="font-medium text-white mb-2">
                  {trade.direction === 'long' ? 'BUY' : 'SELL'} {trade.token} 
                  <span className="text-gray-400"> via </span>
                  <span className="text-primary">{trade.source}</span>
                </h4>
                
                <div className="space-y-2 text-sm text-gray-300">
                  <p>
                    <span className="text-electric-ink font-bold">Reasoning:</span> Signal detected from {trade.source} with {Math.round(trade.confidence * 100)}% confidence. 
                    Historical accuracy of source is {75 + (index * 3)}%, with strong social engagement metrics.
                  </p>
                  
                  <p>
                    <span className="text-electric-ink font-bold">Verification:</span> Onchain data confirms {index % 2 === 0 ? 'increasing volume' : 'whale accumulation'} and liquidity ratio of {(1.3 + (index * 0.2)).toFixed(1)}.
                  </p>
                  
                  <p>
                    <span className="text-electric-ink font-bold">Decision:</span> Executed {trade.direction} position sized at {5 + (index * 2)}% of portfolio with stop-loss at 
                    {trade.direction === 'long' ? '-10%' : '+10%'} and take-profit at {trade.direction === 'long' ? '+25%' : '-25%'}.
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Info tooltip */}
      <AnimatePresence>
        {hoverInfo && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              left: hoverInfo.x + 10, 
              top: hoverInfo.y + 10
            }}
            className="bg-bg border border-gray-700 rounded-md px-2 py-1 text-xs z-50"
          >
            {hoverInfo.text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EchoDashboard;