import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle, X, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  duration?: number;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, duration = 5000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Allow animation to complete
    }, duration);
    
    return () => clearTimeout(timer);
  }, [duration, onClose]);
  
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} className="text-green-400" />;
      case 'error':
        return <AlertCircle size={20} className="text-red-400" />;
      case 'info':
        return <Info size={20} className="text-blue-400" />;
    }
  };
  
  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-900/20 border-green-500';
      case 'error':
        return 'bg-red-900/20 border-red-500';
      case 'info':
        return 'bg-blue-900/20 border-blue-500';
    }
  };
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 80 }}
          transition={{ 
            duration: 0.26,
            ease: [0.34, 1.56, 0.64, 1] // ease-out-back
          }}
          className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 min-w-[300px] max-w-md 
                      ${getBgColor()} border rounded-md shadow-lg z-50`}
        >
          <div className="p-4 flex items-start">
            <div className="mr-3 mt-0.5">
              {getIcon()}
            </div>
            <div className="flex-1">
              <p className="text-white">{message}</p>
            </div>
            <button 
              onClick={() => {
                setIsVisible(false);
                setTimeout(onClose, 300);
              }}
              className="text-gray-400 hover:text-white"
              aria-label="Close notification"
            >
              <X size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;