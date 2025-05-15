import React from 'react';
import { motion } from 'framer-motion';
import { Wallet2, SlidersHorizontal, Building2, BarChart } from 'lucide-react';

interface ProgressTunnelProps {
  currentStep: number;
  steps?: Array<{id: number, label: string, icon?: React.FC<any>}>;
}

const ProgressTunnel: React.FC<ProgressTunnelProps> = ({ 
  currentStep = 1,
  steps: customSteps
}) => {
  const defaultSteps = [
    { id: 1, label: 'Connect', icon: Wallet2 },
    { id: 2, label: 'Risk', icon: SlidersHorizontal },
    { id: 3, label: 'Deposit', icon: Building2 },
    { id: 4, label: 'Active', icon: BarChart }
  ];
  
  const steps = customSteps || defaultSteps;
  
  return (
    <div className="sticky top-0 z-20 backdrop-blur-sm bg-bg/80 py-4 border-b border-surface">
      <div className="container-grid">
        <div className="flex justify-between items-center">
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center">
              <div 
                className={`
                  relative mb-2 rounded-full p-3
                  ${currentStep === step.id ? 'bg-primary-glow' : ''}
                  ${currentStep > step.id ? 'bg-primary/10 text-primary' : 'bg-surface text-white'}
                `}
              >
                {currentStep === step.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute inset-0 rounded-full bg-primary/10"
                  />
                )}
                
                <motion.div
                  initial={false}
                  animate={
                    currentStep >= step.id 
                      ? { y: 0, opacity: 1 } 
                      : { y: -6, opacity: 0.6 }
                  }
                  transition={{
                    type: 'spring',
                    stiffness: 70,
                    damping: 12
                  }}
                >
                  {step.icon ? React.createElement(step.icon, { 
                    size: 24, 
                    className: currentStep >= step.id ? 'text-primary' : 'text-gray-400'
                  }) : null}
                </motion.div>
              </div>
              
              <span 
                className={`text-sm font-medium ${
                  currentStep >= step.id ? 'text-primary' : 'text-gray-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          ))}
          
          <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-full -z-10">
            <div className="container-grid">
              <div className="relative h-1 w-full bg-surface rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ 
                    width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`
                  }}
                  transition={{ duration: 0.6, ease: 'easeInOut' }}
                  className="absolute h-full bg-primary"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressTunnel;