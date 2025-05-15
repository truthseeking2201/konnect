import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, DollarSign, PlusCircle, ChevronDown, ChevronUp, Check, ExternalLink } from 'lucide-react';

interface DepositPanelProps {
  isVisible: boolean;
  walletAddress?: string;
  selectedRisk?: string;
  onComplete: () => void;
}

const DepositPanel: React.FC<DepositPanelProps> = ({ 
  isVisible, 
  walletAddress, 
  selectedRisk = 'balanced',
  onComplete 
}) => {
  const [amount, setAmount] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'deposit' | 'summary'>('deposit');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showLeverageInfo, setShowLeverageInfo] = useState(false);
  
  // Token selection
  const [selectedToken, setSelectedToken] = useState<'USDC' | 'ETH' | 'USDT'>('USDC');
  const [showTokenDropdown, setShowTokenDropdown] = useState(false);
  
  const tokenOptions = [
    { id: 'USDC', name: 'USDC', icon: '💵', balance: '5,245.00', color: 'text-blue-400' },
    { id: 'ETH', name: 'ETH', icon: '💎', balance: '3.42', color: 'text-purple-400' },
    { id: 'USDT', name: 'USDT', icon: '💰', balance: '2,500.00', color: 'text-green-400' }
  ];
  
  // Adaptive text suggestion based on selected risk
  const suggestedAmount = 
    selectedRisk === 'conservative' ? '500' :
    selectedRisk === 'balanced' ? '1000' :
    selectedRisk === 'aggressive' ? '2500' : '1000';
  
  // Reset panel when it becomes visible
  useEffect(() => {
    if (isVisible) {
      setAmount('');
      setActiveTab('deposit');
      setShowSuccess(false);
      setIsProcessing(false);
    }
  }, [isVisible]);
  
  // Handle deposit submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate processing delay
    setTimeout(() => {
      setIsProcessing(false);
      setShowSuccess(true);
      
      // Simulate transaction completion
      setTimeout(() => {
        setActiveTab('summary');
      }, 1500);
    }, 2000);
  };
  
  // Handle final confirmation
  const handleConfirm = () => {
    // Complete the deposit flow
    onComplete();
  };
  
  if (!isVisible) return null;
  
  // Calculate expected APY based on risk profile
  const expectedApy = 
    selectedRisk === 'conservative' ? '12-18%' :
    selectedRisk === 'balanced' ? '20-35%' :
    selectedRisk === 'aggressive' ? '40-65%' : '20-35%';
  
  // Calculate expected daily revenue
  const dailyRevenuePercent = 
    selectedRisk === 'conservative' ? 0.05 :
    selectedRisk === 'balanced' ? 0.08 :
    selectedRisk === 'aggressive' ? 0.15 : 0.08;
  
  const parsedAmount = parseFloat(amount.replace(/,/g, '')) || 0;
  const dailyRevenue = (parsedAmount * dailyRevenuePercent).toFixed(2);
  
  // Leverage multiplier based on risk profile
  const leverageMultiplier = 
    selectedRisk === 'conservative' ? 1 :
    selectedRisk === 'balanced' ? 2 :
    selectedRisk === 'aggressive' ? 3 : 2;
  
  // Calculate available balance for selected token
  const selectedTokenObj = tokenOptions.find(t => t.id === selectedToken);
  const availableBalance = selectedTokenObj?.balance || '0.00';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="container-grid py-10"
    >
      <div className="bg-surface rounded-xl p-6 border border-primary-glow shadow-lg shadow-primary-glow/20 max-w-xl mx-auto">
        {/* Tabs */}
        <div className="flex mb-6 border-b border-gray-800">
          <button
            className={`pb-3 px-4 font-medium ${
              activeTab === 'deposit' 
                ? 'text-primary border-b-2 border-primary' 
                : 'text-gray-400 hover:text-gray-300'
            }`}
            onClick={() => !showSuccess && setActiveTab('deposit')}
          >
            Deposit
          </button>
          <button
            className={`pb-3 px-4 font-medium ${
              activeTab === 'summary' 
                ? 'text-primary border-b-2 border-primary' 
                : 'text-gray-400 hover:text-gray-300'
            }`}
            onClick={() => showSuccess && setActiveTab('summary')}
          >
            Summary
          </button>
        </div>
        
        {activeTab === 'deposit' && (
          <AnimatePresence mode="wait">
            {showSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-6"
              >
                <div className="w-16 h-16 bg-primary/20 rounded-full mx-auto flex items-center justify-center mb-4">
                  <Check className="text-primary" size={32} strokeWidth={3} />
                </div>
                <h3 className="text-xl font-space font-bold text-white mb-2">Deposit Successful!</h3>
                <p className="text-gray-300 mb-6">
                  Your funds are now being deployed into the algorithm.
                </p>
                <button
                  onClick={() => setActiveTab('summary')}
                  className="bg-primary text-bg py-2 px-6 rounded-md font-medium flex items-center justify-center mx-auto"
                >
                  View Summary <ArrowRight size={16} className="ml-2" />
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="deposit-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
              >
                <div className="mb-6">
                  <label className="block text-gray-400 mb-2 text-sm">Deposit Amount</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <DollarSign className="text-gray-400" size={18} />
                    </div>
                    <input
                      type="text"
                      value={amount}
                      onChange={(e) => {
                        // Allow only numbers and commas
                        const value = e.target.value.replace(/[^0-9,]/g, '');
                        setAmount(value);
                      }}
                      placeholder={`Suggested: $${suggestedAmount}`}
                      className="bg-bg border border-gray-700 text-white rounded-md py-3 pl-10 pr-20 w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center">
                      <div className="relative">
                        <button 
                          type="button"
                          onClick={() => setShowTokenDropdown(!showTokenDropdown)}
                          className="h-full px-3 flex items-center bg-bg border-l border-gray-700 rounded-r-md focus:outline-none"
                        >
                          <span className="mr-1">{selectedTokenObj?.icon}</span>
                          <span className={`font-medium ${selectedTokenObj?.color}`}>{selectedToken}</span>
                          {showTokenDropdown ? <ChevronUp size={14} className="ml-1" /> : <ChevronDown size={14} className="ml-1" />}
                        </button>
                        
                        {showTokenDropdown && (
                          <div className="absolute right-0 mt-2 w-48 bg-bg border border-gray-700 rounded-md shadow-xl z-10">
                            {tokenOptions.map((token) => (
                              <button
                                key={token.id}
                                type="button"
                                onClick={() => {
                                  setSelectedToken(token.id as any);
                                  setShowTokenDropdown(false);
                                }}
                                className="w-full text-left px-4 py-2 hover:bg-surface flex items-center"
                              >
                                <span className="mr-2">{token.icon}</span>
                                <span className={`font-medium ${token.color}`}>{token.name}</span>
                                {selectedToken === token.id && <Check size={14} className="ml-auto text-primary" />}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-gray-400">
                    <span>Available: {availableBalance} {selectedToken}</span>
                    <button 
                      type="button" 
                      onClick={() => setAmount(availableBalance.replace(/,/g, ''))}
                      className="text-electric-ink"
                    >
                      MAX
                    </button>
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="flex justify-between items-center">
                    <label className="block text-gray-400 mb-2 text-sm">Leverage</label>
                    <button
                      type="button"
                      onClick={() => setShowLeverageInfo(!showLeverageInfo)}
                      className="text-electric-ink text-xs"
                    >
                      What is this?
                    </button>
                  </div>
                  
                  {showLeverageInfo && (
                    <div className="bg-bg/60 border border-gray-800 rounded-md p-3 mb-3 text-xs text-gray-300">
                      Leverage allows you to amplify your position size with borrowed funds.
                      Higher leverage means higher potential returns but also increased risk.
                      Your risk profile automatically determines the appropriate leverage.
                    </div>
                  )}
                  
                  <div className="bg-bg/60 border border-gray-800 rounded-md p-4 flex justify-between items-center">
                    <div>
                      <div className="font-space font-medium text-white">{leverageMultiplier}x</div>
                      <div className="text-xs text-gray-400">Based on {selectedRisk} risk profile</div>
                    </div>
                    <div className="text-right">
                      <div className="font-space font-medium text-white">
                        ${parsedAmount ? (parsedAmount * leverageMultiplier).toLocaleString() : '0.00'}
                      </div>
                      <div className="text-xs text-gray-400">Effective position</div>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-gray-400 mb-2 text-sm">Expected Returns</label>
                  <div className="bg-bg/60 border border-gray-800 rounded-md p-4 grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-gray-400">Daily (est.)</div>
                      <div className="font-space font-medium text-white">${dailyRevenue}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">APY Range</div>
                      <div className="font-space font-medium text-primary">{expectedApy}</div>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-800 pt-6 text-center">
                  <button
                    type="submit"
                    disabled={isProcessing || !parsedAmount}
                    className={`
                      w-full py-3 rounded-md font-medium flex items-center justify-center
                      ${parsedAmount ? 'bg-primary text-bg' : 'bg-gray-700 text-gray-400 cursor-not-allowed'}
                    `}
                  >
                    {isProcessing ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-bg" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing Deposit
                      </>
                    ) : (
                      <>Deposit Now</>
                    )}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        )}
        
        {activeTab === 'summary' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-lg font-space font-medium text-white mb-4">Position Summary</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between py-2 border-b border-gray-800">
                  <span className="text-gray-400">Deposit Amount</span>
                  <span className="text-white font-medium">${parsedAmount.toLocaleString()} {selectedToken}</span>
                </div>
                
                <div className="flex justify-between py-2 border-b border-gray-800">
                  <span className="text-gray-400">Leverage</span>
                  <span className="text-white font-medium">{leverageMultiplier}x</span>
                </div>
                
                <div className="flex justify-between py-2 border-b border-gray-800">
                  <span className="text-gray-400">Effective Position</span>
                  <span className="text-white font-medium">${(parsedAmount * leverageMultiplier).toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between py-2 border-b border-gray-800">
                  <span className="text-gray-400">Risk Profile</span>
                  <span className="text-primary font-medium capitalize">{selectedRisk}</span>
                </div>
                
                <div className="flex justify-between py-2 border-b border-gray-800">
                  <span className="text-gray-400">Expected APY</span>
                  <span className="text-primary font-medium">{expectedApy}</span>
                </div>
                
                <div className="flex justify-between py-2">
                  <span className="text-gray-400">Est. Daily Revenue</span>
                  <span className="text-white font-medium">${dailyRevenue}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-bg/60 rounded-md p-4 border border-gray-800">
              <div className="flex items-start">
                <div className="bg-primary/20 rounded-full p-2 mr-3">
                  <PlusCircle size={20} className="text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-white mb-1">Your position is now live</h4>
                  <p className="text-gray-400 text-sm">
                    The algorithm started trading with your deposit. You can track performance in real-time on the dashboard.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <button
                onClick={handleConfirm}
                className="bg-primary text-bg py-3 px-8 rounded-md font-medium inline-flex items-center"
              >
                View Dashboard <ArrowRight size={16} className="ml-2" />
              </button>
              
              <div className="mt-4">
                <a 
                  href="#" 
                  className="inline-flex items-center text-sm text-electric-ink hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View transaction on explorer <ExternalLink size={14} className="ml-1" />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default DepositPanel;