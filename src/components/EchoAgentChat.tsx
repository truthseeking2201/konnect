import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { SendHorizonal, CornerDownLeft, Bot, X, Minimize2, Maximize2, User, Zap, Command, HelpCircle, BarChart3, Settings, ChevronRight, AlertCircle } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: number;
}

interface EchoAgentChatProps {
  isWalletConnected: boolean;
  selectedRisk?: 'conservative' | 'balanced' | 'aggressive';
  onCommand?: (command: string) => void;
}

const EchoAgentChat: React.FC<EchoAgentChatProps> = ({ 
  isWalletConnected, 
  selectedRisk,
  onCommand 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Introductory message when chat is first opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const introMessage = {
        id: `msg_${Date.now()}`,
        text: `👋 Hello! I'm Echo, your AI trading agent. How can I assist you today? ${selectedRisk ? `I'm currently set to ${selectedRisk.toUpperCase()} risk mode.` : ''}`,
        sender: 'agent' as const,
        timestamp: Date.now()
      };
      setMessages([introMessage]);
    }
  }, [isOpen, messages.length, selectedRisk]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Handle sending a message
  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: `msg_user_${Date.now()}`,
      text: inputValue,
      sender: 'user' as const,
      timestamp: Date.now()
    };
    
    setMessages([...messages, userMessage]);
    setInputValue('');
    setIsTyping(true);
    
    // Check for commands
    if (inputValue.startsWith('/')) {
      handleCommand(inputValue);
    } else {
      // Simulate agent response
      simulateAgentResponse(inputValue);
    }
  };
  
  // Handle user commands
  const handleCommand = (command: string) => {
    const cmd = command.toLowerCase();
    
    // Pass command to parent if specified
    if (onCommand) {
      onCommand(cmd);
    }
    
    // Handle local commands
    setTimeout(() => {
      let responseText = '';
      
      if (cmd === '/help') {
        responseText = `
Here are some commands you can use:
- /help - Show this help message
- /status - Check the current status of Echo
- /risk - View your risk settings
- /signals - List recent signals
- /clear - Clear chat history
`;
      } else if (cmd === '/clear') {
        setMessages([]);
        responseText = 'Chat history cleared.';
      } else if (cmd === '/status') {
        responseText = `
Echo Agent Status:
- Active: Yes
- Risk Level: ${selectedRisk || 'Not set'}
- Wallet Connected: ${isWalletConnected ? 'Yes' : 'No'}
- Trades Today: ${Math.floor(Math.random() * 5)}
- Current P&L: ${(Math.random() * 20 - 5).toFixed(2)}%
`;
      } else if (cmd === '/risk') {
        if (selectedRisk === 'conservative') {
          responseText = 'You are currently using the CONSERVATIVE risk profile. This means I will only execute trades with high confidence scores and limit your daily risk exposure to 3% of your portfolio.';
        } else if (selectedRisk === 'balanced') {
          responseText = 'You are currently using the BALANCED risk profile. This offers a moderate risk-reward balance with daily risk exposure capped at 5% of your portfolio.';
        } else if (selectedRisk === 'aggressive') {
          responseText = 'You are currently using the AGGRESSIVE risk profile. This maximizes potential returns but accepts higher volatility, with daily risk exposure up to 10% of your portfolio.';
        } else {
          responseText = 'You have not set a risk profile yet. Please select one to activate Echo\'s trading capabilities.';
        }
      } else {
        responseText = `Command not recognized: ${cmd}. Type /help for a list of available commands.`;
      }
      
      // Add agent response
      const agentMessage: Message = {
        id: `msg_agent_${Date.now()}`,
        text: responseText,
        sender: 'agent' as const,
        timestamp: Date.now()
      };
      
      setMessages(prevMessages => [...prevMessages, agentMessage]);
      setIsTyping(false);
    }, 1000);
  };
  
  // Simulate agent response based on user query
  const simulateAgentResponse = (query: string) => {
    // Sample responses based on common questions
    const responses = [
      {
        keywords: ['what', 'you', 'do'],
        response: `I'm Echo, an AI-powered trading agent that executes trades based on social signals and market data. I can analyze influencer calls, assess signal quality, and execute trades automatically with custom risk parameters.`
      },
      {
        keywords: ['how', 'work'],
        response: `I work by monitoring social signals from Twitter, Telegram and Konnect, evaluating their quality based on source reputation, social engagement, and onchain confirmation. When a high-quality signal matches your risk profile, I can execute trades with predefined stop-loss and take-profit levels.`
      },
      {
        keywords: ['risk', 'profile', 'level'],
        response: `Your current risk profile is set to ${selectedRisk || 'NONE'}. Risk profiles determine trading frequency, position sizes, stop-loss levels, and the confidence threshold required for trades. You can change your risk profile in the main settings.`
      },
      {
        keywords: ['performance', 'stats', 'winning'],
        response: `My current performance metrics:\n- Win Rate: ${(60 + Math.random() * 20).toFixed(1)}%\n- Avg. Hold Time: ${(12 + Math.random() * 24).toFixed(1)} hours\n- Best Trade: +${(25 + Math.random() * 30).toFixed(1)}%\n- Signal accuracy: ${(70 + Math.random() * 20).toFixed(1)}%`
      }
    ];
    
    // Find matching response or generate a default one
    let responseText = '';
    const lowerQuery = query.toLowerCase();
    
    for (const item of responses) {
      if (item.keywords.some(keyword => lowerQuery.includes(keyword))) {
        responseText = item.response;
        break;
      }
    }
    
    // Default response if no match
    if (!responseText) {
      responseText = "I understand you're asking about " + query.substring(0, 30) + "... I'm still learning about this topic. For now, I can help with basic questions about my trading capabilities, risk profiles, and performance statistics. Try asking about those or use /help to see available commands.";
    }
    
    // Add typing delay for realism
    setTimeout(() => {
      const agentMessage: Message = {
        id: `msg_agent_${Date.now()}`,
        text: responseText,
        sender: 'agent' as const,
        timestamp: Date.now()
      };
      
      setMessages(prevMessages => [...prevMessages, agentMessage]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000); // Variable response time between 1.5-2.5s
  };
  
  // Format timestamp
  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Animation for the chat button
  const buttonControls = useAnimation();
  
  // Periodic animation to attract attention
  useEffect(() => {
    const sequence = async () => {
      // Wait a while
      await new Promise(resolve => setTimeout(resolve, 10000));
      
      // Start animation sequence
      await buttonControls.start({
        scale: [1, 1.1, 1],
        rotate: [0, 5, -5, 0],
        transition: { duration: 1.2 }
      });
      
      // Repeat
      sequence();
    };
    
    sequence();
    
    return () => buttonControls.stop();
  }, [buttonControls]);

  return (
    <>
      {/* Chat button */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          onClick={() => {
            setIsOpen(!isOpen);
            setIsMinimized(false);
            buttonControls.stop();
          }}
          className="bg-gradient-to-br from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white p-4 rounded-full shadow-lg shadow-indigo-500/30 border-2 border-indigo-400/30 relative transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={buttonControls}
          aria-label="Open Echo Agent Chat"
        >
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-full bg-indigo-400/20 blur-md -z-10"></div>
          
          {/* Pulse rings */}
          <motion.div 
            className="absolute inset-0 rounded-full border-2 border-indigo-400/50"
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [1, 0, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "loop" 
            }}
          />
          
          <Bot size={28} className="text-blue-50" />
        </motion.button>
      </div>
      
      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, height: isMinimized ? 'auto' : 550 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              height: isMinimized ? 65 : 550
            }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
            className="fixed bottom-24 right-6 w-[90vw] max-w-md bg-gradient-to-br from-indigo-950/90 to-blue-950/90 backdrop-blur-lg border border-indigo-500/40 rounded-xl shadow-2xl shadow-indigo-500/20 z-50 flex flex-col overflow-hidden"
          >
            {/* Accent line at top */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 via-indigo-300 to-blue-500 z-10"></div>
            
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {/* Glowing orbs */}
              <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-1/4 right-1/3 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl"></div>
              
              {/* Grid lines */}
              <div className="absolute inset-0 opacity-5">
                <div className="h-px w-full bg-gradient-to-r from-transparent via-blue-300 to-transparent" style={{ top: '15%' }}></div>
                <div className="h-px w-full bg-gradient-to-r from-transparent via-blue-300 to-transparent" style={{ top: '45%' }}></div>
                <div className="h-px w-full bg-gradient-to-r from-transparent via-blue-300 to-transparent" style={{ top: '75%' }}></div>
                <div className="w-px h-full bg-gradient-to-b from-transparent via-blue-300 to-transparent" style={{ left: '25%' }}></div>
                <div className="w-px h-full bg-gradient-to-b from-transparent via-blue-300 to-transparent" style={{ left: '75%' }}></div>
              </div>
            </div>
            
            {/* Header */}
            <div className="flex justify-between items-center px-4 py-3 relative z-10 border-b border-indigo-600/30">
              <div className="flex items-center">
                <motion.div 
                  className="bg-gradient-to-br from-blue-500 to-indigo-600 p-1.5 rounded-full mr-3 shadow-md shadow-indigo-500/20"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 5, repeat: Infinity, repeatType: "loop" }}
                >
                  <Bot size={20} className="text-white" />
                </motion.div>
                <div>
                  <h3 className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-indigo-200">
                    ECHO AGENT <span className="text-blue-200/70 font-normal text-xs">v1.0</span>
                  </h3>
                  
                  <div className="flex items-center text-xs">
                    <span className="text-blue-300/70 font-mono">STATUS:</span>
                    {selectedRisk ? (
                      <div className="flex items-center">
                        <motion.div
                          className="w-1.5 h-1.5 bg-green-400 rounded-full mx-2"
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                        <span className="text-green-400 font-medium tracking-wide">{selectedRisk.toUpperCase()}</span>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <motion.div
                          className="w-1.5 h-1.5 bg-amber-400 rounded-full mx-2"
                          animate={{ opacity: [1, 0.5, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                        <span className="text-amber-400 font-medium tracking-wide">STANDBY</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <motion.button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="text-blue-300 hover:text-blue-100 p-1.5 bg-blue-800/30 hover:bg-blue-700/30 rounded-full transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={isMinimized ? "Expand chat" : "Minimize chat"}
                >
                  {isMinimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
                </motion.button>
                <motion.button
                  onClick={() => setIsOpen(false)}
                  className="text-blue-300 hover:text-blue-100 p-1.5 bg-blue-800/30 hover:bg-blue-700/30 rounded-full transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Close chat"
                >
                  <X size={14} />
                </motion.button>
              </div>
            </div>
            
            {/* Messages area (hidden when minimized) */}
            {!isMinimized && (
              <div className="flex-1 p-4 overflow-y-auto custom-scrollbar relative">
                {/* Subtle grid background */}
                <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(rgba(99,102,241,0.15)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                
                <AnimatePresence>
                  {messages.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="h-full flex flex-col items-center justify-center text-center px-6"
                    >
                      <motion.div
                        animate={{ 
                          y: [0, -10, 0],
                          opacity: [0.7, 1, 0.7]
                        }}
                        transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                        className="mb-4"
                      >
                        <Bot size={32} className="text-indigo-400" />
                      </motion.div>
                      <h4 className="text-blue-300 font-bold mb-2">Echo Neural Interface</h4>
                      <p className="text-blue-200/60 text-sm mb-4">
                        I&apos;m your AI trading assistant. Ask me about signals, trading strategies, or market conditions.
                      </p>
                      <div className="grid grid-cols-2 gap-3 w-full mb-2">
                        {[
                          { command: "/help", icon: <HelpCircle size={14} className="mr-1.5" />, desc: "Show all commands" },
                          { command: "/status", icon: <Zap size={14} className="mr-1.5" />, desc: "View agent status" },
                          { command: "/risk", icon: <AlertCircle size={14} className="mr-1.5" />, desc: "Check risk settings" },
                          { command: "/stats", icon: <BarChart3 size={14} className="mr-1.5" />, desc: "View performance" }
                        ].map(cmd => (
                          <motion.button
                            key={cmd.command}
                            onClick={() => setInputValue(cmd.command)}
                            className="flex items-center justify-between bg-indigo-900/30 hover:bg-indigo-800/40 px-3 py-2 rounded-lg border border-indigo-500/20 text-left text-xs"
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="flex items-center text-blue-300">
                              {cmd.icon}
                              <span className="font-mono">{cmd.command}</span>
                            </div>
                            <ChevronRight size={12} className="text-blue-400/50" />
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  ) : (
                    messages.map((message, index) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ type: "spring", duration: 0.5, delay: index * 0.1 }}
                        className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <motion.div 
                          className={`
                            max-w-[85%] rounded-xl p-3.5 shadow-lg relative
                            ${message.sender === 'user' 
                              ? 'bg-gradient-to-br from-blue-600/40 to-indigo-600/40 text-blue-50 border border-blue-500/30' 
                              : 'bg-gradient-to-br from-indigo-900/50 to-blue-900/50 text-blue-100 border border-indigo-500/30'}
                          `}
                          whileHover={{ scale: 1.01 }}
                        >
                          <div className={`flex items-center mb-1.5 text-xs ${
                            message.sender === 'user' ? 'justify-end text-blue-300/80' : 'justify-start text-indigo-300/80'
                          }`}>
                            {message.sender === 'user' ? (
                              <>
                                <span className="font-medium">You</span>
                                <div className="w-5 h-5 ml-1.5 bg-blue-500/30 rounded-full flex items-center justify-center">
                                  <User size={12} className="text-blue-300" />
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="w-5 h-5 mr-1.5 bg-indigo-500/30 rounded-full flex items-center justify-center">
                                  <Bot size={12} className="text-indigo-300" />
                                </div>
                                <span className="font-medium">Echo</span>
                              </>
                            )}
                            <span className="mx-2">•</span>
                            <span className="font-mono">{formatTimestamp(message.timestamp)}</span>
                          </div>
                          
                          <div className={`whitespace-pre-line ${message.sender === 'agent' ? 'leading-relaxed' : ''}`}>
                            {message.text}
                          </div>
                          
                          {/* Decorative highlight */}
                          <div className={`absolute ${message.sender === 'user' ? 'top-0 right-0' : 'top-0 left-0'} w-5 h-5 overflow-hidden`}>
                            <div className={`
                              w-5 h-5 transform rotate-45 translate-x-2.5 -translate-y-2.5
                              ${message.sender === 'user' 
                                ? 'bg-blue-500/30' 
                                : 'bg-indigo-500/30'}
                            `}></div>
                          </div>
                        </motion.div>
                      </motion.div>
                    ))
                  )}
                  
                  {/* Typing indicator */}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex mb-4"
                    >
                      <div className="bg-gradient-to-br from-indigo-900/50 to-blue-900/50 text-blue-100 rounded-xl p-3 flex items-center border border-indigo-500/30 shadow-lg">
                        <div className="flex space-x-1.5">
                          <motion.div 
                            className="w-2.5 h-2.5 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full"
                            animate={{ scale: [0.5, 1.2, 0.5], opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop", delay: 0 }}
                          />
                          <motion.div 
                            className="w-2.5 h-2.5 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full"
                            animate={{ scale: [0.5, 1.2, 0.5], opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop", delay: 0.2 }}
                          />
                          <motion.div 
                            className="w-2.5 h-2.5 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full"
                            animate={{ scale: [0.5, 1.2, 0.5], opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop", delay: 0.4 }}
                          />
                        </div>
                        <span className="ml-3 text-sm bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-indigo-200 font-medium">
                          Echo is processing...
                        </span>
                      </div>
                    </motion.div>
                  )}
                  
                  {/* Element to scroll to */}
                  <div ref={messagesEndRef} />
                </AnimatePresence>
              </div>
            )}
            
            {/* Input area (hidden when minimized) */}
            {!isMinimized && (
              <div className="p-4 border-t border-indigo-600/30 bg-gradient-to-r from-indigo-950/50 to-blue-950/50 backdrop-blur-sm relative">
                {/* Accent shine line */}
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent"></div>
                
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center"
                >
                  <motion.div
                    className="relative flex-1"
                    whileFocus={{ scale: 1.02 }}
                  >
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Ask Echo something or type / for commands..."
                      className="w-full bg-indigo-900/30 border border-indigo-500/30 rounded-xl px-4 py-3 text-blue-100 placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-medium shadow-inner"
                    />
                    
                    {inputValue.startsWith('/') && (
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <Command size={16} className="text-indigo-400" />
                      </div>
                    )}
                  </motion.div>
                  
                  <motion.button
                    type="submit"
                    disabled={!inputValue.trim()}
                    className={`
                      ml-3 p-3 rounded-xl shadow-md
                      ${inputValue.trim() 
                        ? 'bg-gradient-to-br from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white border border-indigo-400/30' 
                        : 'bg-indigo-900/50 text-indigo-400/50 cursor-not-allowed border border-indigo-500/20'}
                    `}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {inputValue.startsWith('/') ? 
                      <CornerDownLeft size={18} className="text-blue-200" /> : 
                      <SendHorizonal size={18} className="text-blue-200" />
                    }
                  </motion.button>
                </form>
                
                {/* Command suggestions */}
                <AnimatePresence>
                  {inputValue.startsWith('/') && (
                    <motion.div 
                      className="mt-2 bg-indigo-900/70 border border-indigo-500/30 rounded-lg text-xs overflow-hidden backdrop-blur-sm shadow-lg"
                      initial={{ opacity: 0, y: 10, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      exit={{ opacity: 0, y: 10, height: 0 }}
                    >
                      {[
                        { command: "/help", icon: <HelpCircle size={14} className="mr-1.5" />, desc: "Show all available commands" },
                        { command: "/status", icon: <Zap size={14} className="mr-1.5" />, desc: "Check Echo's current status and mode" },
                        { command: "/risk", icon: <AlertCircle size={14} className="mr-1.5" />, desc: "View active risk profile settings" },
                        { command: "/stats", icon: <BarChart3 size={14} className="mr-1.5" />, desc: "Show performance statistics" },
                        { command: "/clear", icon: <X size={14} className="mr-1.5" />, desc: "Clear the conversation history" },
                        { command: "/settings", icon: <Settings size={14} className="mr-1.5" />, desc: "Adjust agent parameters" }
                      ].filter(cmd => cmd.command.startsWith(inputValue)).map(cmd => (
                        <motion.div 
                          key={cmd.command}
                          className="p-2.5 hover:bg-indigo-800/50 cursor-pointer flex items-center justify-between border-b border-indigo-700/30 last:border-b-0"
                          onClick={() => setInputValue(cmd.command)}
                          whileHover={{ x: 2 }}
                        >
                          <div className="flex items-center">
                            <span className="text-indigo-300 font-mono font-bold flex items-center">
                              {cmd.icon}
                              {cmd.command}
                            </span>
                          </div>
                          <span className="text-blue-300/60">{cmd.desc}</span>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default EchoAgentChat;