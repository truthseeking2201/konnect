import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Shield, Zap, AlertTriangle, Info } from 'lucide-react';

// Import components
import CanvasDepthGalaxy from '@/components/CanvasDepthGalaxy';
import HeroDock from '@/components/HeroDock';
import ProgressTunnel from '@/components/ProgressTunnel';
import RiskToggleRail from '@/components/RiskToggleRail';
import FooterGlyphBar from '@/components/FooterGlyphBar';
import DebugAIConsole from '@/components/DebugAIConsole';
import Toast from '@/components/Toast';
import OnboardingGuide from '@/components/OnboardingGuide';
import SignalEngine from '@/components/SignalEngine';
import TradeAgent from '@/components/TradeAgent';
import EchoDashboard from '@/components/EchoDashboard';
import EchoAgentChat from '@/components/EchoAgentChat';

type RiskLevel = 'conservative' | 'balanced' | 'aggressive';

interface Signal {
  id: string;
  source: string;
  sourceType: 'twitter' | 'telegram' | 'konnect';
  token: string;
  confidence: number;
  direction: 'long' | 'short';
  timestamp: number;
  pnlHistory: number[];
  socialEngagement: number;
  onchainConfirmation: number;
}

export default function EchoAgent() {
  // App state management
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRisk, setSelectedRisk] = useState<RiskLevel | null>(null);
  const [isGalaxyReady, setIsGalaxyReady] = useState(false);
  const [highlightedTokens, setHighlightedTokens] = useState<any[]>([]);
  
  // Wallet connection simulation
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);
  
  // Signal and trading state
  const [selectedSignal, setSelectedSignal] = useState<Signal | null>(null);
  const [lastTrade, setLastTrade] = useState<any | null>(null);
  
  // UI state
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [autoDemo, setAutoDemo] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoDemo, isConnected]);
  
  // Auto-select risk profile after wallet connection
  useEffect(() => {
    if (autoDemo && isConnected && !selectedRisk) {
      const riskTimer = setTimeout(() => {
        handleRiskSelect('balanced');
      }, 3000);
      
      return () => clearTimeout(riskTimer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoDemo, isConnected, selectedRisk]);
  
  // Handle wallet connection - simulated
  const handleConnectWallet = async () => {
    if (!isConnected && !isConnecting) {
      setIsConnecting(true);
      console.log("[Analytics] wallet_connect_attempt", { provider: 'metamask' });
      
      // Simulate connection delay
      setTimeout(() => {
        // Successful connection
        setIsConnected(true);
        setIsConnecting(false);
        setAddress('0x7F5Ec7A125eB1F31536d431E27bd6d27C00Af3E2');
        setCurrentStep(2);
        
        console.log("[Analytics] wallet_connected", { 
          address: '0x7F5Ec7A125eB1F31536d431E27bd6d27C00Af3E2', 
          chainId: '0x1' 
        });
        
        setToast({
          type: 'success',
          message: 'Wallet connected successfully!'
        });
      }, 1500);
    }
  };
  
  // Clear toast
  const clearToast = () => {
    setToast(null);
  };
  
  // Handle risk selection
  const handleRiskSelect = (risk: RiskLevel) => {
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
    
    // Show success toast
    setToast({
      type: 'success',
      message: `${risk.charAt(0).toUpperCase() + risk.slice(1)} risk profile activated`
    });
  };
  
  // Handle signal selection
  const handleSelectSignal = (signal: Signal) => {
    setSelectedSignal(signal);
    
    // Show info toast
    setToast({
      type: 'info',
      message: `Analyzing ${signal.token} signal from ${signal.source}...`
    });
  };
  
  // Handle trade execution
  const handleTrade = (tradeDetails: any) => {
    setLastTrade(tradeDetails);
    
    // Show success toast
    setToast({
      type: 'success',
      message: `${tradeDetails.direction.toUpperCase()} trade executed: ${tradeDetails.token}`
    });
  };
  
  // Debug data for development mode
  const debugData = {
    userState: {
      address: address,
      isConnected: isConnected,
      currentStep: currentStep,
      selectedRisk: selectedRisk
    },
    appState: {
      isGalaxyReady: isGalaxyReady,
      highlightedTokens: highlightedTokens
    },
    selectedSignal: selectedSignal,
    lastTrade: lastTrade
  };
  
  return (
    <>
      <Head>
        <title>Konstellation Echo | AI Trading Agent</title>
        <meta name="description" content="Echo - your AI-powered trading agent that executes high-conviction trades based on social signals" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <main>
        {/* 3D Galaxy Background */}
        <CanvasDepthGalaxy 
          starCount={1200} // More stars for a denser visualization
          highlightTokens={highlightedTokens}
          onReady={() => setIsGalaxyReady(true)}
        />
        
        {/* Hero Section with Wallet Connect */}
        <section className="min-h-[40vh] flex flex-col">
          <div className="container-grid py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center">
                <span className="text-primary mr-2">Echo</span> 
                <Bot className="text-electric-ink" size={36} />
                <span className="text-white ml-2">Agent</span>
              </h1>
              
              <p className="text-gray-300 mb-8 max-w-xl mx-auto">
                Your AI-powered trading agent that executes high-conviction trades by 
                analyzing social signals, tracking influencer alpha, and using 
                Konnect&apos;s reputation system.
              </p>
              
              <div className="flex flex-wrap gap-4 justify-center mb-8">
                <div className="flex items-center bg-bg/50 px-4 py-2 rounded-full">
                  <Shield className="text-primary mr-2" size={18} />
                  <span className="text-gray-300 text-sm">Autonomous Execution</span>
                </div>
                
                <div className="flex items-center bg-bg/50 px-4 py-2 rounded-full">
                  <Zap className="text-electric-ink mr-2" size={18} />
                  <span className="text-gray-300 text-sm">Real-time Signals</span>
                </div>
                
                <div className="flex items-center bg-bg/50 px-4 py-2 rounded-full">
                  <Bot className="text-primary mr-2" size={18} />
                  <span className="text-gray-300 text-sm">Explainable AI</span>
                </div>
              </div>
              
              <div className="flex justify-center">
                <button
                  onClick={handleConnectWallet}
                  disabled={isConnected || isConnecting}
                  className={`
                    px-6 py-3 rounded-lg text-lg font-bold 
                    ${isConnected 
                      ? 'bg-green-500/20 text-green-400 cursor-default' 
                      : isConnecting 
                        ? 'bg-primary/70 text-white cursor-wait'
                        : 'bg-primary hover:bg-primary/90 text-white'}
                    transition-colors
                  `}
                >
                  {isConnecting ? (
                    <div className="flex items-center">
                      <div className="animate-spin mr-2 w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                      Connecting...
                    </div>
                  ) : isConnected ? (
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                      Wallet Connected
                    </div>
                  ) : (
                    'Connect Wallet to Start'
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        </section>
        
        {/* Progress Tracker */}
        <ProgressTunnel 
          currentStep={currentStep}
          steps={[
            { id: 1, label: 'Connect', icon: undefined },
            { id: 2, label: 'Risk', icon: undefined },
            { id: 3, label: 'Activate', icon: undefined }
          ]}
        />
        
        {/* Show components based on current step */}
        {isConnected && (
          <>
            {/* Risk Toggle Section */}
            <RiskToggleRail 
              onSelect={handleRiskSelect}
              selected={selectedRisk || undefined}
            />
            
            {/* Echo Agent Interface - show when risk is selected */}
            {selectedRisk && (
              <div className="container-grid py-10">
                <h2 className="text-2xl font-space font-bold mb-8 text-center">
                  Echo <span className="text-primary">Trading Dashboard</span>
                </h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column - Signal Engine */}
                  <div className="lg:col-span-1">
                    <SignalEngine 
                      isActive={!!selectedRisk}
                      selectedRisk={selectedRisk}
                      onSelectSignal={handleSelectSignal}
                    />
                  </div>
                  
                  {/* Right Column - Trade Agent + Dashboard */}
                  <div className="lg:col-span-2">
                    <TradeAgent 
                      selectedSignal={selectedSignal}
                      isActive={!!selectedRisk}
                      riskProfile={selectedRisk}
                      onTrade={handleTrade}
                    />
                    
                    <EchoDashboard 
                      isActive={!!selectedRisk}
                      selectedRisk={selectedRisk}
                      walletAddress={address || undefined}
                    />
                  </div>
                </div>
                
                {/* Safety Warning */}
                <div className="mt-8 bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 flex items-start">
                  <AlertTriangle className="text-amber-400 mr-3 mt-1 flex-shrink-0" size={24} />
                  <div>
                    <h4 className="text-amber-400 font-bold mb-1">Risk Disclosure</h4>
                    <p className="text-gray-300 text-sm">
                      Echo Agent is a demonstration of AI-assisted trading concepts. In a production environment, 
                      all trades would be executed using real funds with actual financial risk. Always conduct your 
                      own research before engaging in cryptocurrency trading.
                    </p>
                  </div>
                </div>
                
                {/* Information Block */}
                <div className="mt-6 bg-primary/10 border border-primary/30 rounded-lg p-4 flex items-start">
                  <Info className="text-primary mr-3 mt-1 flex-shrink-0" size={24} />
                  <div>
                    <h4 className="text-primary font-bold mb-1">How Echo Works</h4>
                    <p className="text-gray-300 text-sm">
                      Echo feeds on the information premium by surfacing alpha early and executing intelligently in real-time. 
                      The agent integrates social signals, monitors influencer reputation, and applies advanced risk management techniques.
                      Click the Echo chat button in the bottom right corner to learn more or to give specific instructions to your agent.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Chat Interface */}
            <EchoAgentChat 
              isWalletConnected={isConnected}
              selectedRisk={selectedRisk || undefined}
            />
          </>
        )}
        
        {/* Footer */}
        <FooterGlyphBar />
        
        {/* Debug Console (dev only) */}
        <DebugAIConsole data={debugData} />
        
        {/* Control Buttons */}
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
          <button
            onClick={() => setAutoDemo(!autoDemo)}
            className="bg-primary-glow border border-primary text-primary px-3 py-1 rounded-full text-xs font-mono"
          >
            {autoDemo ? '🔄 Auto-Demo: ON' : '▶️ Auto-Demo: OFF'}
          </button>
          
          {/* Help Button */}
          <button
            onClick={() => setShowOnboarding(true)}
            className="bg-electric-ink/20 border border-electric-ink text-electric-ink px-3 py-1 rounded-full text-xs font-mono"
          >
            ❓ How to Use
          </button>
        </div>
        
        {/* Toast Notifications */}
        {toast && (
          <Toast 
            message={toast.message}
            type={toast.type}
            onClose={clearToast}
          />
        )}
        
        {/* Onboarding Guide */}
        {showOnboarding && (
          <OnboardingGuide 
            currentStep={currentStep}
            isWalletConnected={isConnected}
            onClose={() => setShowOnboarding(false)}
            guideType="echoAgent"
          />
        )}
      </main>
    </>
  );
}