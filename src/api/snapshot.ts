// Mock API service for snapshots

export interface SnapshotData {
  pnl24h: string;
  token: string;
  influencer: string;
  confidence: number;
  ts: number;
}

const TOKENS = ['SOL', 'BTC', 'ETH', 'AVAX', 'MATIC', 'LINK', 'UNI', 'AAVE'];
const INFLUENCERS = ['@0xRamen', '@CryptoTori', '@ChainQuest', '@AlgoTrader', '@web3wizard'];

// Simple rate limiter
let lastRequestTime = 0;
const RATE_LIMIT_MS = 2000; // 2 seconds

export const getSnapshot = async (wallet: string): Promise<SnapshotData> => {
  // Check rate limit
  const now = Date.now();
  if (now - lastRequestTime < RATE_LIMIT_MS) {
    throw new Error('Rate limit exceeded');
  }
  lastRequestTime = now;
  
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 500));
  
  // Randomly fail with 429 rate limit (5% chance)
  if (Math.random() < 0.05) {
    const error = new Error('Too many requests');
    // @ts-ignore
    error.status = 429;
    throw error;
  }
  
  // Randomly fail with 500 server error (3% chance)
  if (Math.random() < 0.03) {
    const error = new Error('Server error');
    // @ts-ignore
    error.status = 500;
    throw error;
  }
  
  // Generate random PnL with positive bias
  const pnlValue = (Math.random() * 12 * (Math.random() > 0.3 ? 1 : -1)).toFixed(2);
  const pnl24h = (parseFloat(pnlValue) >= 0 ? '+' : '') + pnlValue;
  
  // Random token and influencer
  const token = TOKENS[Math.floor(Math.random() * TOKENS.length)];
  const influencer = INFLUENCERS[Math.floor(Math.random() * INFLUENCERS.length)];
  
  // Confidence score (70-100%)
  const confidence = 0.7 + Math.random() * 0.3;
  
  return {
    pnl24h,
    token,
    influencer,
    confidence,
    ts: Date.now()
  };
};

export default {
  getSnapshot
};