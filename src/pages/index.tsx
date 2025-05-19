import React, { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import CanvasDepthGalaxy from '@/components/CanvasDepthGalaxy';
import HeroDock from '@/components/HeroDock';
import ProgressTunnel from '@/components/ProgressTunnel';
import RiskToggleRail from '@/components/RiskToggleRail';
import RealtimeNanoHub from '@/components/RealtimeNanoHub';
import FaqAccordion from '@/components/FaqAccordion';
import FooterGlyphBar from '@/components/FooterGlyphBar';
import Toast from '@/components/Toast';
import OnboardingGuide from '@/components/OnboardingGuide';
import DepositNeuralFrame from '@/components/DepositNeuralFrame';
import AppTransitionManager from '@/components/AppTransitionManager';
import WalletConnectionTransition from '@/components/WalletConnectionTransition';
import GlitchText from '@/components/Loaders/GlitchText';
import { itemTransitions } from '@/utils/animations';

type RiskLevel = 'conservative' | 'balanced' | 'aggressive';

export default function Home() {
  console.log('🔄 Home component rendering');
  
  // Hardcoded state to demonstrate the flow
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRisk, setSelectedRisk] = useState<RiskLevel | null>(null);
  const [isGalaxyReady, setIsGalaxyReady] = useState(false);
  const [highlightedTokens, setHighlightedTokens] = useState<any[]>([]);
  
  // Wallet connection simulation
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [walletToast, setWalletToast] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);
  
  // Onboarding guide state
  const [showOnboarding, setShowOnboarding] = useState(true);
  
  // Parameter to control auto demo mode
  const [autoDemo, setAutoDemo] = useState(false);
  
  // Transition state
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionMessage, setTransitionMessage] = useState('');
  
  // State logging after initializations
  useEffect(() => {
    console.log('📊 Initial State:', {
      currentStep,
      isConnected,
      isConnecting,
      isGalaxyReady,
      selectedRisk,
      address
    });
  }, [currentStep, isConnected, isConnecting, isGalaxyReady, selectedRisk, address]);
  
  // Add effect to track isConnected changes
  useEffect(() => {
    console.log('🎯 isConnected changed:', { isConnected });
  }, [isConnected]);
  
  // Handle wallet connection - simulated
  const handleConnectWallet = useCallback(async () => {
    console.log('🔌 handleConnectWallet called');
    if (!isConnected && !isConnecting) {
      console.log('🔌 Setting isConnecting = true');
      setIsConnecting(true);
      console.log("[Analytics] wallet_connect_attempt", { provider: 'metamask' });
    }
  }, [isConnected, isConnecting, setIsConnecting]);
  
  // Handle wallet connected
  const handleWalletConnected = useCallback(() => {
    console.log('✅ handleWalletConnected called');
    setIsConnected(true);
    setIsConnecting(false);
    setAddress('0x7F5Ec7A125eB1F31536d431E27bd6d27C00Af3E2');
    setCurrentStep(2);
    
    console.log('✅ New state after connection:', { 
      isConnected: true,
      isConnecting: false,
      address: '0x7F5Ec7A125eB1F31536d431E27bd6d27C00Af3E2',
      currentStep: 2
    });
    
    console.log("[Analytics] wallet_connected", { 
      address: '0x7F5Ec7A125eB1F31536d431E27bd6d27C00Af3E2', 
      chainId: '0x1' 
    });
    
    setWalletToast({
      type: 'success',
      message: 'Wallet connected successfully!'
    });
  }, [setIsConnected, setIsConnecting, setAddress, setCurrentStep, setWalletToast]);
  
  // Clear toast
  const clearToast = () => {
    setWalletToast(null);
  };
  
  // Handle risk selection - with simulated data
  const handleRiskSelect = useCallback((risk: RiskLevel) => {
    console.log("[Analytics] risk_selected", { level: risk });
    setSelectedRisk(risk);
    setCurrentStep(3);
    
    // Highlight corresponding tokens based on risk profile
    if (risk === 'conservative') {
      setHighlightedTokens([{ symbol: 'BTC', color: '#3095FF' }]);
    } else if (risk === 'balanced') {
      setHighlightedTokens([
        { symbol: 'ETH', color: '#62A1FF' },
        { symbol: 'LINK', color: '#14F1FF' }
      ]);
    } else {
      setHighlightedTokens([
        { symbol: 'SOL', color: '#E8FF65' },
        { symbol: 'AVAX', color: '#FF4776' }
      ]);
    }
    
    // Simulate PnL data refresh
    setTimeout(() => {
      // This will trigger a re-render of RealtimeNanoHub with fresh data
      setAddress('0x7F5Ec7A125eB1F31536d431E27bd6d27C00Af3E2');
    }, 500);
  }, [setSelectedRisk, setCurrentStep, setHighlightedTokens, setAddress]);
  
  // Handle deposit completion
  const handleDepositComplete = useCallback(() => {
    console.log("[Analytics] deposit_completed", { 
      amount: 1000, 
      token: 'USDC',
      risk: selectedRisk
    });
    
    // Move to step 4 (completed)
    setCurrentStep(4);
    
    // Show completion toast
    setWalletToast({
      type: 'success',
      message: 'Position is now active and trading!'
    });
  }, [setCurrentStep, setWalletToast, selectedRisk]);
  
  // Setup demo flow with automated transitions for presentation
  useEffect(() => {
    // Automatically mark galaxy as ready after 1 second
    const galaxyReadyTimer = setTimeout(() => {
      setIsGalaxyReady(true);
      console.log("Galaxy ready!");
      
      // Analytics tracking
      console.log("[Analytics] paint_galaxy", { deviceFps: 60 });
      
      // If auto demo is enabled, automatically connect wallet after 2 seconds
      if (autoDemo) {
        const connectTimer = setTimeout(() => {
          if (!isConnected) {
            handleConnectWallet();
          }
        }, 2000);
        
        return () => clearTimeout(connectTimer);
      }
    }, 1000);
    
    return () => clearTimeout(galaxyReadyTimer);
  }, [autoDemo, isConnected, handleConnectWallet, setIsGalaxyReady]);
  
  // Auto-select risk profile after wallet connection
  useEffect(() => {
    if (autoDemo && isConnected && !selectedRisk) {
      setIsTransitioning(true);
      setTransitionMessage('Analyzing optimal risk profiles');
      
      const riskTimer = setTimeout(() => {
        handleRiskSelect('balanced');
        setIsTransitioning(false);
      }, 3000);
      
      return () => clearTimeout(riskTimer);
    }
  }, [autoDemo, isConnected, selectedRisk, handleRiskSelect, setIsTransitioning, setTransitionMessage]);
  
  // Auto proceed to deposit flow after risk selection in demo mode
  useEffect(() => {
    if (autoDemo && currentStep === 3 && selectedRisk) {
      const depositTimer = setTimeout(() => {
        setIsTransitioning(true);
        setTransitionMessage('Preparing neural deposit protocol');
        
        // Auto-complete deposit flow after 8 seconds
        setTimeout(() => {
          handleDepositComplete();
          setIsTransitioning(false);
        }, 5000);
      }, 2000);
      
      return () => clearTimeout(depositTimer);
    }
  }, [autoDemo, currentStep, selectedRisk, handleDepositComplete, setIsTransitioning, setTransitionMessage]);
  
  // After all the hooks and effects, but before the return statement
  // Add a debug component that will render regardless of connection state
  const DebugPanel = () => {
    return (
      <div className="fixed top-20 right-4 z-[1000] bg-black/80 p-4 border border-red-500 text-white font-mono text-xs">
        <div className="font-bold mb-2">Debug Panel</div>
        <div>currentStep: {currentStep}</div>
        <div>isConnected: {isConnected ? 'true' : 'false'}</div>
        <div>isConnecting: {isConnecting ? 'true' : 'false'}</div>
        <div>isGalaxyReady: {isGalaxyReady ? 'true' : 'false'}</div>
        <div>
          <button 
            onClick={() => {
              console.log('🔧 Force setting isConnected = true');
              setIsConnected(true);
              setCurrentStep(2);
              setAddress('0x7F5Ec7A125eB1F31536d431E27bd6d27C00Af3E2');
              setWalletToast({
                type: 'success',
                message: 'Debug: Wallet connected!'
              });
            }}
            className="mt-2 bg-red-500 hover:bg-red-600 px-2 py-1 rounded"
          >
            Force Connect
          </button>
        </div>
      </div>
    );
  };
  
  return (
    <>
      {/* Add the debug panel */}
      <DebugPanel />
      
      <Head>
        <title>Konstellation Echo Lite | Neon Singularity</title>
        <meta name="description" content="Your portal to algorithmic trading in the Konstellation ecosystem" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      {/* App transition manager wraps the entire app to handle step transitions */}
      <AppTransitionManager 
        currentStep={currentStep}
        isTransitioning={isTransitioning}
        transitionMessage={transitionMessage}
      >
        <main>
          {/* 3D Galaxy Background */}
          <CanvasDepthGalaxy 
            starCount={2500}
            highlightTokens={highlightedTokens}
            onReady={() => {
              console.log('🌌 Galaxy onReady callback');
              setIsGalaxyReady(true);
            }}
          />
          
          {/* Hero Section with Wallet Connect */}
          <section className="min-h-screen flex flex-col">
            <HeroDock 
              onConnectWallet={handleConnectWallet}
              isWalletConnected={isConnected}
            />
          </section>
          
          {/* Progress Tracker */}
          <ProgressTunnel currentStep={currentStep} />
          
          {/* Modified the AnimatePresence to ensure content shows */}
          <AnimatePresence mode="wait">
            {isConnected ? (
              <motion.div
                key="connected-content"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1,
                      duration: 0.3 // Slightly longer for debugging
                    }
                  },
                  exit: { opacity: 0 }
                }}
                className="border-4 border-red-500 pt-4 mt-4" // Make it very obvious
              >
                {/* Content Section Header - make it obvious */}
                <div className="container-grid mb-8">
                  <h2 className="text-2xl font-bold text-white text-center bg-blue-800 py-2 rounded-lg">
                    Connected Wallet Content
                  </h2>
                </div>
                
                {/* Realtime Data Section */}
                <motion.div 
                  variants={itemTransitions}
                  className="border-2 border-blue-500 m-2" // Make component boundaries clear
                >
                  <RealtimeNanoHub walletAddress={address || undefined} />
                </motion.div>
                
                {/* Risk Toggle Section */}
                <motion.div 
                  variants={itemTransitions}
                  className="border-2 border-green-500 m-2" // Make component boundaries clear
                >
                  <RiskToggleRail 
                    onSelect={handleRiskSelect}
                    selected={selectedRisk || undefined}
                  />
                </motion.div>
                
                {/* Neural Deposit Interface - show when risk is selected */}
                <AnimatePresence>
                  {currentStep === 3 && !!selectedRisk && (
                    <motion.div
                      key="deposit-panel"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                    >
                      <DepositNeuralFrame
                        isVisible={true}
                        walletAddress={address || undefined}
                        selectedRisk={selectedRisk || undefined}
                        onComplete={handleDepositComplete}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Success state for step 4 */}
                <AnimatePresence>
                  {currentStep === 4 && (
                    <motion.div
                      key="success-state"
                      className="container-grid my-12 text-center"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ 
                        duration: 0.6,
                        type: 'spring',
                        stiffness: 100,
                        damping: 15
                      }}
                    >
                      <div className="neo-card p-8 mb-8">
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          <GlitchText 
                            text="POSITION ACTIVE" 
                            className="text-2xl font-bold font-mono mb-4"
                            intensity="low"
                          />
                          
                          <p className="text-blue-300 mb-4">
                            Your position is now active and the neural trading engine is optimizing your returns.
                          </p>
                          
                          <div className="flex justify-center space-x-4 mt-6">
                            <Link href="/echo-agent" className="neo-button">
                              Open Dashboard
                            </Link>
                            <button onClick={() => setCurrentStep(1)} className="py-3 px-4 border border-indigo-500/30 rounded-xl text-blue-400 hover:bg-indigo-900/30 transition-colors">
                              Start Over
                            </button>
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* FAQ Section */}
                <motion.div variants={itemTransitions}>
                  <FaqAccordion />
                </motion.div>
              </motion.div>
            ) : (
              <motion.div 
                key="pre-connect-info"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="container-grid text-center text-white py-10"
              >
                <p className="bg-black/30 p-4 rounded-lg mb-4">
                  Please connect your wallet to access the trading interface
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Footer */}
          <FooterGlyphBar />
          
          {/* Control Buttons */}
          <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
            <motion.button
              onClick={() => setAutoDemo(!autoDemo)}
              className="bg-primary-glow border border-primary text-primary px-3 py-1 rounded-full text-xs font-mono"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {autoDemo ? '🔄 Auto-Demo: ON' : '▶️ Auto-Demo: OFF'}
            </motion.button>
            
            {/* Help Button */}
            <motion.button
              onClick={() => setShowOnboarding(true)}
              className="bg-electric-ink/20 border border-electric-ink text-electric-ink px-3 py-1 rounded-full text-xs font-mono"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ❓ How to Use
            </motion.button>
            
            {/* Echo Agent Link */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/echo-agent"
                className="bg-primary/20 border border-primary text-primary px-3 py-1 rounded-full text-xs font-mono flex items-center"
              >
                🤖 Try Echo Agent
              </Link>
            </motion.div>
          </div>
          
          {/* Toast Notifications */}
          {walletToast && (
            <Toast 
              message={walletToast.message}
              type={walletToast.type}
              onClose={clearToast}
            />
          )}
          
          {/* Onboarding Guide */}
          {showOnboarding && (
            <OnboardingGuide 
              currentStep={currentStep}
              isWalletConnected={isConnected}
              onClose={() => setShowOnboarding(false)}
            />
          )}
          
          {/* Wallet Connection Transition */}
          <AnimatePresence>
            {isConnecting && (
              <WalletConnectionTransition 
                isConnecting={isConnecting}
                onConnected={handleWalletConnected}
                walletAddress="0x7F5Ec7A125eB1F31536d431E27bd6d27C00Af3E2"
              />
            )}
          </AnimatePresence>
        </main>
      </AppTransitionManager>
    </>
  );
}