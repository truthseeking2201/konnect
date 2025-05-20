import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import RiskToggleRail3D from '../components/RiskToggleRail3D';
import { motion } from 'framer-motion';

type RiskLevel = 'conservative' | 'balanced' | 'aggressive';

const RiskProfilePage = () => {
  const [selectedRisk, setSelectedRisk] = useState<RiskLevel>('balanced');

  const handleRiskChange = (risk: RiskLevel) => {
    setSelectedRisk(risk);
    console.log('Risk profile selected:', risk);
  };

  return (
    <>
      <Head>
        <title>KONNECT - Risk Profile Selection</title>
        <meta name="description" content="Choose your risk profile for KONNECT trading" />
      </Head>

      <div className="min-h-screen bg-bg py-12">
        <div className="container-grid">
          <header className="mb-16">
            <nav className="flex justify-between items-center">
              <Link href="/" className="text-2xl font-space font-bold text-blue-400">
                KONNECT
              </Link>
              <button 
                onClick={() => console.warn('Connect Wallet functionality not implemented on this page.')}
                className="neo-button text-sm px-5 py-2"
              >
                Connect Wallet
              </button>
            </nav>
          </header>

          <main>
            {/* Add a comment about risk persistence */}
            {/* TODO: Implement persistence for selectedRisk (e.g., via Context API or localStorage) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl md:text-5xl font-space font-bold mb-4">
                Configure Your <span className="text-blue-400">Trading Profile</span>
              </h1>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Set your risk tolerance and trading preferences to customize how the KONNECT AI will 
                manage your portfolio. This affects trade frequency, position sizing, and stop-loss settings.
              </p>
            </motion.div>

            <RiskToggleRail3D onSelect={handleRiskChange} selected={selectedRisk} />

            <div className="mt-16 flex justify-center">
              <Link href="/">
                <motion.button
                  className="neo-button px-10 py-4 text-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Save & Continue
                </motion.button>
              </Link>
            </div>
          </main>

          <footer className="mt-24 text-center text-gray-400 text-sm">
            <p>© 2025 KONNECT - Advanced Trading Platform</p>
            <div className="flex justify-center items-center space-x-6 mt-4">
              <Link href="/terms" className="hover:text-blue-400 transition-colors">
                Terms
              </Link>
              <Link href="/privacy" className="hover:text-blue-400 transition-colors">
                Privacy
              </Link>
              <a
                href="https://docs.konstellation.tech"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-400 transition-colors"
              >
                Documentation
              </a>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
};

export default RiskProfilePage;