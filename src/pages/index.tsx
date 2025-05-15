import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import CanvasDepthGalaxy from '@/components/CanvasDepthGalaxy';
import HeroDock from '@/components/HeroDock';
import ProgressTunnel from '@/components/ProgressTunnel';
import RiskToggleRail from '@/components/RiskToggleRail';
import RealtimeNanoHub from '@/components/RealtimeNanoHub';
import FaqAccordion from '@/components/FaqAccordion';
import FooterGlyphBar from '@/components/FooterGlyphBar';
import DebugAIConsole from '@/components/DebugAIConsole';
import Toast from '@/components/Toast';
import OnboardingGuide from '@/components/OnboardingGuide';
import DepositNeuralFrame from '@/components/DepositNeuralFrame';

type RiskLevel = 'conservative' | 'balanced' | 'aggressive';

export default function Home() {
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
  
  // Auto proceed to deposit flow after risk selection in demo mode
  useEffect(() => {
    if (autoDemo && currentStep === 3 && selectedRisk) {
      const depositTimer = setTimeout(() => {
        // Auto-complete deposit flow after 8 seconds
        setTimeout(() => {
          handleDepositComplete();
        }, 8000);
      }, 2000);
      
      return () => clearTimeout(depositTimer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoDemo, currentStep, selectedRisk]);
  
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
        
        setWalletToast({
          type: 'success',
          message: 'Wallet connected successfully!'
        });
      }, 1500);
    }
  };
  
  // Clear toast
  const clearToast = () => {
    setWalletToast(null);
  };
  
  // Handle risk selection - with simulated data
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
    
    // Simulate PnL data refresh
    setTimeout(() => {
      // This will trigger a re-render of RealtimeNanoHub with fresh data
      setAddress('0x7F5Ec7A125eB1F31536d431E27bd6d27C00Af3E2');
    }, 500);
  };
  
  // Handle deposit completion
  const handleDepositComplete = () => {
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
    simulatedData: {
      pnl24h: selectedRisk === 'conservative' ? "+2.53" :
              selectedRisk === 'balanced' ? "+5.85" : 
              selectedRisk === 'aggressive' ? "+10.27" : "+0.00",
      token: selectedRisk === 'conservative' ? "BTC" :
             selectedRisk === 'balanced' ? "ETH" : 
             selectedRisk === 'aggressive' ? "SOL" : "---",
      confidence: selectedRisk === 'conservative' ? 0.82 :
                  selectedRisk === 'balanced' ? 0.75 : 
                  selectedRisk === 'aggressive' ? 0.91 : 0
    }
  };
  
  return (
    <>
      <Head>
        <title>Konstellation Echo Lite | Neon Singularity</title>
        <meta name="description" content="Your portal to algorithmic trading in the Konstellation ecosystem" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <main>
        {/* 3D Galaxy Background */}
        <CanvasDepthGalaxy 
          starCount={900}
          highlightTokens={highlightedTokens}
          onReady={() => setIsGalaxyReady(true)}
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
        
        {/* Show components based on current step */}
        {isConnected && (
          <>
            {/* Realtime Data Section */}
            <RealtimeNanoHub walletAddress={address || undefined} />
            
            {/* Risk Toggle Section */}
            <RiskToggleRail 
              onSelect={handleRiskSelect}
              selected={selectedRisk || undefined}
            />
            
            {/* Neural Deposit Interface - show when risk is selected */}
            <DepositNeuralFrame
              isVisible={currentStep === 3 && !!selectedRisk}
              walletAddress={address || undefined}
              selectedRisk={selectedRisk || undefined}
              onComplete={handleDepositComplete}
            />
            
            {/* FAQ Section */}
            <FaqAccordion />
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
          
          {/* Echo Agent Link */}
          <Link
            href="/echo-agent"
            className="bg-primary/20 border border-primary text-primary px-3 py-1 rounded-full text-xs font-mono flex items-center"
          >
            🤖 Try Echo Agent
          </Link>
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
      </main>
    </>
  );
}