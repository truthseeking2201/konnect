import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  items?: FaqItem[];
}

const defaultFaqs: FaqItem[] = [
  {
    id: 'what-is-echo',
    question: 'What is Echo Lite?',
    answer: 'Echo Lite is an algorithmic trading solution that leverages social sentiment and on-chain data to execute trades with zero user intervention. Our "Neon Singularity" update introduces transparent decision paths and improved UI/UX.'
  },
  {
    id: 'how-risks',
    question: 'How do risk profiles work?',
    answer: 'Each risk profile has specific stop-loss settings and maximum trade frequencies. Conservative uses 5% SL with up to 3 trades/day, Balanced uses 10% SL with up to 6 trades/day, and Aggressive uses 20% SL with up to 10 trades/day.'
  },
  {
    id: 'signal-source',
    question: 'Where do trading signals come from?',
    answer: 'Our algorithm analyzes over 50 data points including social media sentiment from verified influencers, on-chain metrics, technical indicators, and exchange order flow patterns to generate high-confidence trade signals.'
  },
  {
    id: 'security',
    question: 'Is my wallet secure with Echo Lite?',
    answer: 'Echo Lite uses non-custodial smart contracts with limited permissions. We only request trading approvals for specific token pairs and amounts, never full wallet access. All contracts are audited by CertiK and ChainSecurity.'
  }
];

const FaqAccordion: React.FC<FaqAccordionProps> = ({ items = defaultFaqs }) => {
  const [openId, setOpenId] = useState<string | null>(null);
  
  // For analytics
  const trackEvent = (name: string, params = {}) => {
    if (typeof window !== 'undefined') {
      console.log(`[Analytics] ${name}`, params);
    }
  };
  
  const toggleItem = (id: string) => {
    if (openId === id) {
      setOpenId(null);
    } else {
      setOpenId(id);
      trackEvent('faq_expand', { id });
    }
  };
  
  // Handle keyboard interactions
  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleItem(id);
    }
  };
  
  return (
    <div className="container-grid py-10">
      <h2 className="text-2xl font-space font-bold mb-8">
        Frequently Asked <span className="text-primary">Questions</span>
      </h2>
      
      <div className="space-y-4">
        {items.map((item) => (
          <div 
            key={item.id}
            className="bg-surface rounded-lg overflow-hidden"
          >
            <div
              className="flex justify-between items-center p-5 cursor-pointer"
              onClick={() => toggleItem(item.id)}
              onKeyDown={(e) => handleKeyDown(e, item.id)}
              tabIndex={0}
              role="button"
              aria-expanded={openId === item.id}
              aria-controls={`faq-content-${item.id}`}
            >
              <h3 className="font-medium text-lg">{item.question}</h3>
              <motion.div
                animate={{ rotate: openId === item.id ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={20} className="text-primary" />
              </motion.div>
            </div>
            
            <AnimatePresence>
              {openId === item.id && (
                <motion.div
                  id={`faq-content-${item.id}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="p-5 pt-0 border-t border-gray-800">
                    <p className="text-gray-300">{item.answer}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FaqAccordion;