import React, { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { pageTransitions } from '@/utils/animations';

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
  isActive?: boolean;
  transitionKey?: string | number;
  transitionType?: 'default' | 'fade' | 'slide' | 'scale' | 'blur';
}

const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  className = '',
  isActive = true,
  transitionKey,
  transitionType = 'default',
}) => {
  // Select the appropriate transition variant based on the type
  const getTransitionVariants = () => {
    switch (transitionType) {
      case 'fade':
        return {
          hidden: { opacity: 0 },
          visible: { 
            opacity: 1,
            transition: {
              duration: 0.5,
              when: 'beforeChildren',
              staggerChildren: 0.1,
            }
          },
          exit: { 
            opacity: 0,
            transition: {
              duration: 0.3,
            }
          }
        };
      case 'slide':
        return {
          hidden: { x: '-100%', opacity: 0 },
          visible: { 
            x: 0, 
            opacity: 1,
            transition: {
              duration: 0.5,
              type: 'spring',
              stiffness: 100,
              damping: 20,
              when: 'beforeChildren',
              staggerChildren: 0.1,
            }
          },
          exit: { 
            x: '100%',
            opacity: 0,
            transition: {
              duration: 0.3,
            }
          }
        };
      case 'scale':
        return {
          hidden: { scale: 0.8, opacity: 0 },
          visible: { 
            scale: 1, 
            opacity: 1,
            transition: {
              duration: 0.4,
              type: 'spring',
              stiffness: 300,
              damping: 25,
              when: 'beforeChildren',
              staggerChildren: 0.1,
            }
          },
          exit: { 
            scale: 0.8,
            opacity: 0,
            transition: {
              duration: 0.3,
            }
          }
        };
      case 'blur':
        return {
          hidden: { filter: 'blur(12px)', opacity: 0, scale: 0.95 },
          visible: { 
            filter: 'blur(0px)', 
            opacity: 1,
            scale: 1,
            transition: {
              duration: 0.5,
              when: 'beforeChildren',
              staggerChildren: 0.1,
            }
          },
          exit: { 
            filter: 'blur(8px)',
            opacity: 0,
            scale: 0.96,
            transition: {
              duration: 0.3,
            }
          }
        };
      default:
        return pageTransitions;
    }
  };

  // Generate a stable key if not provided
  const key = transitionKey !== undefined ? transitionKey : 'page-transition';

  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div
          key={key}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={getTransitionVariants()}
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PageTransition;