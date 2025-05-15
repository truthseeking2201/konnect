import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, X, Copy, ChevronDown, ChevronUp } from 'lucide-react';
import SyntaxHighlighter from 'react-syntax-highlighter';
// We're using a theme that matches our design system
import { atomOneDark } from 'react-syntax-highlighter/dist/cjs/styles/hljs';

interface DebugAIConsoleProps {
  data: any;
  isDev?: boolean;
}

const DebugAIConsole: React.FC<DebugAIConsoleProps> = ({ data, isDev = process.env.NODE_ENV === 'development' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  
  // Don't render in production
  if (!isDev) return null;
  
  const toggleConsole = () => {
    setIsOpen(!isOpen);
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={toggleConsole}
        className="bg-primary text-bg p-3 rounded-full shadow-lg hover:bg-primary/90 transition-colors"
        aria-label="Toggle Debug Console"
      >
        <Terminal size={20} />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: 20, height: 0 }}
            className="fixed bottom-16 right-4 w-[90vw] max-w-xl bg-bg border border-surface rounded-lg shadow-xl"
          >
            <div className="flex justify-between items-center p-4 border-b border-gray-800">
              <div className="flex items-center">
                <Terminal size={16} className="text-primary mr-2" />
                <h3 className="text-sm font-mono font-bold">Debug AI Console</h3>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={copyToClipboard}
                  className="text-gray-400 hover:text-primary p-1"
                  aria-label="Copy JSON data"
                >
                  {isCopied ? (
                    <span className="text-xs text-green-400">Copied!</span>
                  ) : (
                    <Copy size={16} />
                  )}
                </button>
                <button
                  onClick={toggleConsole}
                  className="text-gray-400 hover:text-primary p-1"
                  aria-label="Close console"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
            
            <div className="p-4 max-h-[60vh] overflow-auto">
              <SyntaxHighlighter
                language="json"
                style={atomOneDark}
                customStyle={{
                  background: 'transparent',
                  padding: '0',
                  fontSize: '12px'
                }}
              >
                {JSON.stringify(data, null, 2)}
              </SyntaxHighlighter>
            </div>
            
            <div className="flex justify-center p-2 border-t border-gray-800">
              <button
                onClick={toggleConsole}
                className="text-gray-400 hover:text-primary flex items-center text-xs"
              >
                {isOpen ? (
                  <>
                    <ChevronDown size={14} className="mr-1" />
                    Close
                  </>
                ) : (
                  <>
                    <ChevronUp size={14} className="mr-1" />
                    Open
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DebugAIConsole;