import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CircularLoader, NeuralLoader, ParticleLoader, DataFlowLoader, DigitalRainLoader, GlitchText } from './Loaders';
import PageTransition from './PageTransition';

interface AppTransitionManagerProps {
  children: React.ReactNode;
  currentStep: number;
  isTransitioning?: boolean;
  loadingType?: 'neural' | 'particle' | 'dataflow' | 'digital' | 'circular';
  transitionMessage?: string;
}

const AppTransitionManager: React.FC<AppTransitionManagerProps> = ({
  children,
  currentStep,
  isTransitioning = false,
  loadingType = 'neural',
  transitionMessage,
}) => {
  const [previousStep, setPreviousStep] = useState(currentStep);
  const [showLoader, setShowLoader] = useState(false);
  const [customMessage, setCustomMessage] = useState<string | undefined>(transitionMessage);

  const defaultMessages = useMemo(() => ({
    1: 'Initializing wallet connection',
    2: 'Building risk profile matrix',
    3: 'Preparing deposit engine',
    4: 'Activating neural trading protocol',
  }), []);

  // Update the loader state and message based on props
  useEffect(() => {
    if (isTransitioning) {
      setShowLoader(true);
      setCustomMessage(transitionMessage || defaultMessages[currentStep as keyof typeof defaultMessages] || `Loading step ${currentStep}`);
    } else {
      setShowLoader(false);
    }

    if (currentStep !== previousStep) {
      setPreviousStep(currentStep);
    }
  }, [currentStep, previousStep, isTransitioning, transitionMessage, defaultMessages, setCustomMessage, setShowLoader, setPreviousStep]);

  // Select the appropriate loader based on the step and type
  const renderLoader = () => {
    // Match loader type to current transition
    const loaderTypes = {
      1: 'particle', // Connect wallet - particle effect
      2: 'neural',   // Risk selection - neural network visualization 
      3: 'dataflow', // Deposit - data flow visualization
      4: 'digital',  // Active - digital rain for success
    };

    const currentLoaderType = loadingType || loaderTypes[currentStep as keyof typeof loaderTypes] || 'circular';
    const message = customMessage || `Loading step ${currentStep}`;

    switch (currentLoaderType) {
      case 'neural':
        return <NeuralLoader isVisible={true} message={message} />;
      case 'particle':
        return <ParticleLoader isVisible={true} message={message} />;
      case 'dataflow':
        return <DataFlowLoader isVisible={true} message={message} type="radial" />;
      case 'digital':
        return <DigitalRainLoader isVisible={true} message={message} />;
      case 'circular':
      default:
        return <CircularLoader isVisible={true} message={message} size="lg" glowEffect={true} />;
    }
  };

  return (
    <div className="relative w-full h-full">
      {/* Main content with page transition */}
      <PageTransition 
        transitionKey={currentStep} 
        transitionType="blur"
        isActive={!showLoader}
      >
        {children}
      </PageTransition>

      {/* Fullscreen loader overlay */}
      <AnimatePresence>
        {showLoader && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-bg/80 backdrop-blur-md"
          >
            <div className="flex flex-col items-center justify-center p-8 rounded-xl bg-surface/30 border border-primary/20 shadow-lg">
              {renderLoader()}

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8"
              >
                <GlitchText 
                  text={currentStep === 4 ? "TRANSACTION COMPLETE" : "PROCESSING"} 
                  className="text-lg font-mono font-bold text-primary tracking-wider"
                  intensity="medium"
                />
              </motion.div>
            </div>

            {/* Step indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="absolute bottom-8 left-0 right-0 flex justify-center"
            >
              <div className="flex space-x-2">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={`step-${step}`}
                    className={`h-1 w-8 rounded-full ${
                      step === currentStep
                        ? 'bg-primary'
                        : step < currentStep
                        ? 'bg-primary/50'
                        : 'bg-gray-700'
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AppTransitionManager;