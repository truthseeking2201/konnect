import { useState, useEffect, useCallback } from 'react';

interface EthereumProvider {
  request: (args: { method: string; params?: any[] }) => Promise<any>;
  on: (event: string, handler: (...args: any[]) => void) => void;
  removeListener: (event: string, handler: (...args: any[]) => void) => void;
  selectedAddress?: string;
  chainId?: string;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

export type ToastInfo = {
  type: 'success' | 'error' | 'info';
  message: string;
};

const useWalletConnector = () => {
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [hasProvider, setHasProvider] = useState<boolean | null>(null);
  const [toast, setToast] = useState<ToastInfo | null>(null);
  
  // Initialize provider check
  useEffect(() => {
    const checkProvider = async () => {
      setHasProvider(window.ethereum !== undefined);
    };
    
    checkProvider();
  }, []);
  
  // Track events for chain and account changes
  useEffect(() => {
    if (!window.ethereum) return;
    
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        setAddress(null);
        setToast({
          type: 'info',
          message: 'Wallet disconnected'
        });
      } else if (accounts[0] !== address) {
        setAddress(accounts[0]);
      }
    };
    
    const handleChainChanged = (newChainId: string) => {
      setChainId(newChainId);
      
      // Reload page on chain change as recommended by MetaMask
      window.location.reload();
    };
    
    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);
    
    // Check if already connected
    if (window.ethereum.selectedAddress) {
      setAddress(window.ethereum.selectedAddress);
      setChainId(window.ethereum.chainId || null);
    }
    
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [address]);
  
  // Analytics tracking
  const trackEvent = (name: string, params = {}) => {
    if (typeof window !== 'undefined') {
      console.log(`[Analytics] ${name}`, params);
    }
  };
  
  const connect = useCallback(async () => {
    if (!window.ethereum) {
      setToast({
        type: 'error',
        message: 'No wallet detected. Please install MetaMask or another web3 wallet.'
      });
      return false;
    }
    
    setIsConnecting(true);
    
    try {
      // Track attempt
      trackEvent('wallet_connect_attempt', { provider: 'metamask' });
      
      // Check for multiple connection attempts
      const lastAttempt = localStorage.getItem('lastConnectAttempt');
      const now = Date.now();
      
      if (lastAttempt && now - parseInt(lastAttempt) < 5000) {
        // Rate limit to prevent spam
        setToast({
          type: 'info',
          message: 'Whoa, slow down traveller. Please wait a moment before trying again.'
        });
        setIsConnecting(false);
        return false;
      }
      
      localStorage.setItem('lastConnectAttempt', now.toString());
      
      // Request accounts
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      
      // Update state if successful
      if (accounts.length > 0) {
        setAddress(accounts[0]);
        setChainId(window.ethereum.chainId || null);
        
        trackEvent('wallet_connected', { 
          address: accounts[0], 
          chainId: window.ethereum.chainId 
        });
        
        setToast({
          type: 'success',
          message: 'Wallet connected successfully!'
        });
        
        setIsConnecting(false);
        return true;
      }
      
      throw new Error('No accounts returned from wallet');
    } catch (error: any) {
      console.error('Wallet connection error:', error);
      
      // User rejected request (MetaMask error code 4001)
      if (error.code === 4001) {
        setToast({
          type: 'error',
          message: 'Connection cancelled. Please approve the connection request.'
        });
        
        trackEvent('error_toast', { code: 4001 });
      } else {
        setToast({
          type: 'error',
          message: 'Error connecting to wallet. Please try again.'
        });
        
        trackEvent('error_toast', { code: error.code || 'unknown' });
      }
      
      setIsConnecting(false);
      return false;
    }
  }, []);
  
  const clearToast = useCallback(() => {
    setToast(null);
  }, []);
  
  return {
    address,
    chainId,
    isConnected: !!address,
    isConnecting,
    hasProvider,
    connect,
    toast,
    clearToast
  };
};

export default useWalletConnector;