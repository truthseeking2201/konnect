import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useAnimation, useSpring } from 'framer-motion';
import { SendHorizonal, CornerDownLeft, Bot, X, Minimize2, Maximize2, User, Zap, Command, HelpCircle, BarChart3, Settings, ChevronRight, AlertCircle, Brain, Sparkles, Activity } from 'lucide-react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';

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

// Neural Network Visualizer Component
const NeuralNetworkVisualizer = () => {
  const nodesRef = useRef<THREE.Points>(null);
  const edgesRef = useRef<THREE.LineSegments>(null);
  const nodeCount = 30;
  
  // Create nodes and connections
  const { nodes, edges } = useMemo(() => {
    const nodePositions = new Float32Array(nodeCount * 3);
    const nodeColors = new Float32Array(nodeCount * 3);
    
    // Create nodes in a network-like pattern
    for (let i = 0; i < nodeCount; i++) {
      const radius = 1.5 + Math.random() * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      // Convert spherical to cartesian coordinates for a more 3D look
      nodePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      nodePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      nodePositions[i * 3 + 2] = radius * Math.cos(phi);
      
      // Blue to indigo gradient for nodes
      nodeColors[i * 3] = 0.1 + Math.random() * 0.3;      // R (low for blue-indigo)
      nodeColors[i * 3 + 1] = 0.2 + Math.random() * 0.4;  // G (moderate for blue-indigo)
      nodeColors[i * 3 + 2] = 0.8 + Math.random() * 0.2;  // B (high for blue-indigo)
    }
    
    // Create edges connecting nodes (not all nodes, just some connections)
    const edgeConnections: number[] = [];
    const edgeColors: number[] = [];
    
    // Connect nodes that are close to each other
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        // Calculate distance between nodes
        const dx = nodePositions[i * 3] - nodePositions[j * 3];
        const dy = nodePositions[i * 3 + 1] - nodePositions[j * 3 + 1];
        const dz = nodePositions[i * 3 + 2] - nodePositions[j * 3 + 2];
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
        
        // Connect if nodes are close enough (adjust threshold as needed)
        if (distance < 2.5 && Math.random() > 0.5) {
          edgeConnections.push(i * 3, i * 3 + 1, i * 3 + 2, j * 3, j * 3 + 1, j * 3 + 2);
          
          // Edge color (blue-indigo gradient)
          edgeColors.push(
            0.2, 0.3, 0.8,  // Start color (blue-indigo)
            0.3, 0.4, 0.9   // End color (brighter blue-indigo)
          );
        }
      }
    }
    
    return {
      nodes: {
        positions: nodePositions,
        colors: nodeColors
      },
      edges: {
        positions: new Float32Array(edgeConnections),
        colors: new Float32Array(edgeColors)
      }
    };
  }, []);
  
  // Animation
  useFrame(({ clock }) => {
    if (nodesRef.current && edgesRef.current) {
      // Rotate neural network
      nodesRef.current.rotation.y = clock.getElapsedTime() * 0.1;
      edgesRef.current.rotation.y = clock.getElapsedTime() * 0.1;
      
      // Pulse effect
      const pulse = Math.sin(clock.getElapsedTime() * 2) * 0.05 + 1;
      nodesRef.current.scale.set(pulse, pulse, pulse);
      edgesRef.current.scale.set(pulse, pulse, pulse);
    }
  });
  
  return (
    <>
      <ambientLight intensity={0.5} />
      
      {/* Neural network nodes */}
      <points ref={nodesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={nodes.positions.length / 3}
            array={nodes.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={nodes.colors.length / 3}
            array={nodes.colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.15}
          vertexColors
          transparent
          opacity={0.8}
          sizeAttenuation
        />
      </points>
      
      {/* Neural connections */}
      <lineSegments ref={edgesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={edges.positions.length / 3}
            array={edges.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={edges.colors.length / 3}
            array={edges.colors}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={0.4}
          linewidth={1}
        />
      </lineSegments>
    </>
  );
};

// Voice-like waveform animation
const VoiceWaveform = ({ isActive }: { isActive: boolean }) => {
  return (
    <div className="flex items-center h-3 space-x-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={i}
          className="w-0.5 bg-blue-400 rounded-full"
          initial={{ height: 3 }}
          animate={{
            height: isActive ? [3, 6 + i * 3, 3] : 3,
          }}
          transition={{
            duration: 0.4 + i * 0.1,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: i * 0.1
          }}
        />
      ))}
    </div>
  );
};

// Thinking process animation
const ThinkingProcess = () => {
  const steps = [
    "Analyzing context",
    "Retrieving data",
    "Processing signals",
    "Synthesizing response"
  ];
  
  const [currentStep, setCurrentStep] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % steps.length);
    }, 1500);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="w-full">
      {steps.map((step, index) => (
        <motion.div
          key={step}
          className={`flex items-center text-[10px] ${index === currentStep ? 'text-blue-300' : 'text-indigo-300/50'}`}
          animate={{
            opacity: index === currentStep ? 1 : 0.7
          }}
        >
          <motion.div 
            className={`h-1.5 w-1.5 rounded-full mr-1.5 ${index === currentStep ? 'bg-blue-400' : 'bg-indigo-400/30'}`}
            animate={{
              scale: index === currentStep ? [1, 1.3, 1] : 1
            }}
            transition={{
              duration: 0.8,
              repeat: index === currentStep ? Infinity : 0
            }}
          />
          <span className="font-mono">{step}</span>
          {index === currentStep && (
            <span className="ml-1 font-mono">
              <Typewriter text="..." delay={200} />  
            </span>
          )}
          {index < currentStep && (
            <motion.div 
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              className="ml-1"
            >
              <Sparkles size={8} className="text-green-400" />
            </motion.div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

// Typewriter effect
const Typewriter = ({ text, delay = 150 }: { text: string, delay?: number }) => {
  const [displayText, setDisplayText] = useState('');
  
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayText(text.substring(0, i + 1));
        i++;
      } else {
        i = 0;
        setDisplayText('');
      }
    }, delay);
    
    return () => clearInterval(timer);
  }, [text, delay]);
  
  return <span>{displayText}</span>;
};

// Echo 3D Avatar component
const EchoAvatar = ({ mood = 'neutral' }: { mood?: 'neutral' | 'thinking' | 'excited' | 'analyzing' }) => {
  // Animation based on mood
  const avatarAnimation = useAnimation();
  
  useEffect(() => {
    switch(mood) {
      case 'thinking':
        avatarAnimation.start({
          rotate: [0, -5, 0, 5, 0],
          y: [0, -3, -1, -2, 0],
          transition: { duration: 3, repeat: Infinity }
        });
        break;
      case 'excited':
        avatarAnimation.start({
          scale: [1, 1.1, 1, 1.05, 1],
          rotate: [0, 5, -5, 5, 0],
          transition: { duration: 1.5, repeat: Infinity }
        });
        break;
      case 'analyzing':
        avatarAnimation.start({
          y: [0, -2, 0],
          scale: [1, 1.02, 1],
          transition: { duration: 2, repeat: Infinity }
        });
        break;
      default: // neutral
        avatarAnimation.start({
          y: [0, -1, 0],
          rotate: [0, 2, 0, -2, 0],
          transition: { duration: 4, repeat: Infinity }
        });
    }
  }, [mood, avatarAnimation]);
  
  return (
    <motion.div
      animate={avatarAnimation}
      className="relative w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-indigo-600/90 to-blue-600/90 border border-indigo-400/30 shadow-lg"
    >
      {/* Base shape */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-8 h-8">
          {/* Head shape */}
          <div className="absolute top-0 left-0 right-0 h-6 w-6 mx-auto bg-blue-100 rounded-full flex items-center justify-center shadow-sm">
            {/* Eyes */}
            <div className="flex space-x-2">
              <motion.div 
                className="h-1.5 w-1.5 rounded-full bg-indigo-600"
                animate={mood === 'thinking' ? {
                  scaleY: [1, 0.4, 1],
                  transition: { duration: 1.5, repeat: Infinity }
                } : {}}
              />
              <motion.div 
                className="h-1.5 w-1.5 rounded-full bg-indigo-600"
                animate={mood === 'thinking' ? {
                  scaleY: [1, 0.4, 1],
                  transition: { duration: 1.5, delay: 0.2, repeat: Infinity }
                } : {}}
              />
            </div>
          </div>
          
          {/* Body with neural pattern */}
          <div className="absolute bottom-0 left-0 right-0 h-5 w-5 mx-auto bg-blue-200 rounded-lg rounded-t-none overflow-hidden">
            <div className="absolute inset-0 opacity-40 overflow-hidden">
              <div className="absolute top-0 left-0 w-4 h-0.5 bg-indigo-600 rounded transform -rotate-45"></div>
              <div className="absolute top-1 left-1 w-3 h-0.5 bg-indigo-600 rounded transform rotate-45"></div>
              <div className="absolute top-2 right-1 w-2 h-0.5 bg-indigo-600 rounded"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Ambient glow */}
      <motion.div 
        className="absolute inset-0 bg-blue-400/20 rounded-lg"
        animate={{
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{
          duration: 2,
          repeat: Infinity
        }}
      />
      
      {/* Mood-specific effects */}
      {mood === 'excited' && (
        <>
          <motion.div 
            className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-blue-300"
            animate={{
              y: [-4, -8, -4],
              opacity: [0.4, 0.8, 0.4]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity
            }}
          />
          <motion.div 
            className="absolute -bottom-1 -left-1 h-2 w-2 rounded-full bg-indigo-300"
            animate={{
              y: [0, -4, 0],
              opacity: [0.3, 0.7, 0.3]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: 0.5
            }}
          />
        </>
      )}
      
      {mood === 'analyzing' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div 
            className="w-6 h-6 border-2 border-blue-300 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>
      )}
    </motion.div>
  );
};

// Interactive particle effect for animations
const ParticleEffect = ({ x, y, color = '#4F46E5' }: { x: number, y: number, color?: string }) => {
  const particles = Array.from({ length: 6 });
  
  return (
    <div className="absolute pointer-events-none" style={{ left: x, top: y }}>
      {particles.map((_, i) => {
        const angle = (Math.PI * 2 * i) / particles.length;
        const distance = 10 + Math.random() * 20;
        const duration = 0.6 + Math.random() * 0.8;
        const size = 2 + Math.random() * 3;
        
        return (
          <motion.div 
            key={i}
            className="absolute rounded-full"
            style={{
              width: size,
              height: size,
              backgroundColor: color,
              boxShadow: `0 0 4px ${color}`,
            }}
            initial={{ opacity: 0.8, scale: 1, x: 0, y: 0 }}
            animate={{
              opacity: 0,
              scale: 0,
              x: Math.cos(angle) * distance,
              y: Math.sin(angle) * distance
            }}
            transition={{ duration: duration }}
          />
        );
      })}
    </div>
  );
};

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
  const [avatarMood, setAvatarMood] = useState<'neutral' | 'thinking' | 'excited' | 'analyzing'>('neutral');
  const [particleEffects, setParticleEffects] = useState<{x: number, y: number, id: string}[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingInputRef = useRef<HTMLInputElement>(null);
  
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
  
  // Handle sending a message with animated effects
  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    // Get input element position for particle effect
    if (typingInputRef.current) {
      const rect = typingInputRef.current.getBoundingClientRect();
      // Add particle effect
      setParticleEffects(prev => [
        ...prev,
        {x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, id: `particle_${Date.now()}`}
      ]);
      
      // Remove particle effect after animation completes
      setTimeout(() => {
        setParticleEffects(prev => prev.filter(p => p.id !== `particle_${Date.now()}`));
      }, 1000);
    }
    
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
    
    // Set avatar to thinking mode when processing
    setAvatarMood('thinking');
    
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
      
      // Return to neutral mood
      setAvatarMood('neutral');
    }, 1000);
  };
  
  // Simulate agent response based on user query with mood changes
  const simulateAgentResponse = (query: string) => {
    // Sample responses based on common questions
    const responses = [
      {
        keywords: ['what', 'you', 'do'],
        response: `I'm Echo, an AI-powered trading agent that executes trades based on social signals and market data. I can analyze influencer calls, assess signal quality, and execute trades automatically with custom risk parameters.`,
        mood: 'excited' as const
      },
      {
        keywords: ['how', 'work'],
        response: `I work by monitoring social signals from Twitter, Telegram and Konnect, evaluating their quality based on source reputation, social engagement, and onchain confirmation. When a high-quality signal matches your risk profile, I can execute trades with predefined stop-loss and take-profit levels.`,
        mood: 'analyzing' as const
      },
      {
        keywords: ['risk', 'profile', 'level'],
        response: `Your current risk profile is set to ${selectedRisk || 'NONE'}. Risk profiles determine trading frequency, position sizes, stop-loss levels, and the confidence threshold required for trades. You can change your risk profile in the main settings.`,
        mood: 'neutral' as const
      },
      {
        keywords: ['performance', 'stats', 'winning'],
        response: `My current performance metrics:\n- Win Rate: ${(60 + Math.random() * 20).toFixed(1)}%\n- Avg. Hold Time: ${(12 + Math.random() * 24).toFixed(1)} hours\n- Best Trade: +${(25 + Math.random() * 30).toFixed(1)}%\n- Signal accuracy: ${(70 + Math.random() * 20).toFixed(1)}%`,
        mood: 'excited' as const
      }
    ];
    
    // Find matching response or generate a default one
    let responseText = '';
    let mood: 'neutral' | 'thinking' | 'excited' | 'analyzing' = 'neutral';
    const lowerQuery = query.toLowerCase();
    
    for (const item of responses) {
      if (item.keywords.some(keyword => lowerQuery.includes(keyword))) {
        responseText = item.response;
        mood = item.mood;
        break;
      }
    }
    
    // Default response if no match
    if (!responseText) {
      responseText = "I understand you're asking about " + query.substring(0, 30) + "... I'm still learning about this topic. For now, I can help with basic questions about my trading capabilities, risk profiles, and performance statistics. Try asking about those or use /help to see available commands.";
      mood = 'thinking';
    }
    
    // First set analyzing mood while thinking
    setAvatarMood('analyzing');
    
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
      
      // Set final mood based on response
      setAvatarMood(mood);
      
      // Add a particle effect when the message appears
      const messagesContainer = document.querySelector('.messages-container');
      if (messagesContainer) {
        const rect = messagesContainer.getBoundingClientRect();
        setParticleEffects(prev => [
          ...prev,
          {x: rect.left + 100, y: rect.bottom - 50, id: `particle_${Date.now()}_response`}
        ]);
        
        // Remove particle effect after animation completes
        setTimeout(() => {
          setParticleEffects(prev => prev.filter(p => p.id !== `particle_${Date.now()}_response`));
        }, 1000);
      }
    }, 2500 + Math.random() * 1500); // Variable response time between 2.5-4s for more thinking time
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
      {/* Chat button with enhanced effects */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          onClick={() => {
            setIsOpen(!isOpen);
            setIsMinimized(false);
            buttonControls.stop();
            
            // Create particle effect on button click
            const button = document.querySelector('.echo-chat-button');
            if (button) {
              const rect = button.getBoundingClientRect();
              setParticleEffects(prev => [
                ...prev,
                {x: rect.left + rect.width/2, y: rect.top + rect.height/2, id: `particle_${Date.now()}_button`}
              ]);
              
              setTimeout(() => {
                setParticleEffects(prev => 
                  prev.filter(p => p.id !== `particle_${Date.now()}_button`)
                );
              }, 1000);
            }
          }}
          className="echo-chat-button bg-gradient-to-br from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white p-4 rounded-full shadow-lg shadow-indigo-500/40 border-2 border-indigo-400/40 relative transition-all duration-300"
          whileHover={{ scale: 1.05, rotate: [0, -5, 5, 0] }}
          whileTap={{ scale: 0.95 }}
          animate={buttonControls}
          aria-label="Open Echo Agent Chat"
        >
          {/* Enhanced glow effect */}
          <div className="absolute inset-0 rounded-full bg-indigo-400/30 blur-md -z-10"></div>
          
          {/* Multiple pulse rings with staggered timing */}
          <motion.div 
            className="absolute inset-0 rounded-full border-2 border-indigo-400/60"
            animate={{ 
              scale: [1, 1.6, 1],
              opacity: [1, 0, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "loop" 
            }}
          />
          <motion.div 
            className="absolute inset-0 rounded-full border border-blue-400/40"
            animate={{ 
              scale: [1, 1.8, 1],
              opacity: [0.7, 0, 0.7]
            }}
            transition={{ 
              duration: 2.5,
              repeat: Infinity,
              repeatType: "loop",
              delay: 0.3
            }}
          />
          
          {/* Neural network icon instead of simple bot */}
          <div className="relative">
            <Brain size={28} className="text-blue-50" />
            <motion.div 
              className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-blue-300"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity
              }}
            />
          </div>
        </motion.button>
      </div>
      
      {/* Particle effects container */}
      {particleEffects.map(particle => (
        <ParticleEffect 
          key={particle.id}
          x={particle.x}
          y={particle.y}
          color={particle.id.includes('button') ? '#4F46E5' : '#60A5FA'}
        />
      ))}
      
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
              <div className="flex-1 p-4 overflow-y-auto custom-scrollbar relative messages-container">
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
                                <div className="mr-2 flex items-center">
                                  <EchoAvatar mood={avatarMood} />
                                </div>
                                <div className="flex flex-col">
                                  <span className="font-medium">Echo</span>
                                  <VoiceWaveform isActive={false} />
                                </div>
                              </>
                            )}
                            <span className="mx-2">•</span>
                            <span className="font-mono">{formatTimestamp(message.timestamp)}</span>
                          </div>
                          
                          <div className={`whitespace-pre-line ${message.sender === 'agent' ? 'leading-relaxed message-appear-animation' : ''}`}>
                            {message.sender === 'agent' ? (
                              <div className="relative">
                                {message.text}
                                
                                {/* Add subtle glowing particles to agent messages */}
                                {Array.from({ length: 3 }).map((_, i) => (
                                  <motion.div
                                    key={i}
                                    className="absolute rounded-full bg-blue-400/30"
                                    style={{
                                      width: 3 + Math.random() * 3,
                                      height: 3 + Math.random() * 3,
                                      top: `${Math.random() * 100}%`,
                                      left: `${Math.random() * 100}%`,
                                      filter: 'blur(1px)'
                                    }}
                                    animate={{
                                      opacity: [0, 0.7, 0],
                                      y: [0, -10, -20]
                                    }}
                                    transition={{
                                      duration: 2 + Math.random() * 2,
                                      repeat: Infinity,
                                      delay: Math.random() * 2
                                    }}
                                  />
                                ))}
                              </div>
                            ) : message.text}
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
                  
                  {/* Neural network visualization and typing indicator */}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex mb-4 w-full"
                    >
                      <div className="bg-gradient-to-br from-indigo-900/60 to-blue-900/60 text-blue-100 rounded-xl p-4 flex flex-col items-center border border-indigo-500/40 shadow-lg w-3/4 overflow-hidden relative">
                        {/* Neural network visualization background */}
                        <div className="absolute inset-0 overflow-hidden">
                          <div className="absolute top-0 bottom-0 left-0 right-0 opacity-20">
                            <Canvas>
                              <NeuralNetworkVisualizer />                             
                            </Canvas>
                          </div>
                        </div>
                        
                        {/* Glowing accent border */}
                        <div className="absolute inset-0 rounded-xl border border-indigo-400/20 pointer-events-none"></div>
                        
                        {/* Echo avatar and thinking animation */}
                        <div className="flex items-center mb-2">
                          <motion.div
                            className="relative"
                            animate={{ 
                              y: [0, -3, 0],
                            }}
                            transition={{ 
                              duration: 3,
                              repeat: Infinity,
                              repeatType: "reverse",
                              ease: "easeInOut"
                            }}
                          >
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 relative">
                              <Brain size={20} className="text-blue-50" />
                              
                              {/* Pulsing ring */}
                              <motion.div 
                                className="absolute inset-0 rounded-full border-2 border-indigo-400/50"
                                animate={{ 
                                  scale: [1, 1.4, 1],
                                  opacity: [0.7, 0, 0.7]
                                }}
                                transition={{ 
                                  duration: 2,
                                  repeat: Infinity,
                                  repeatType: "loop" 
                                }}
                              />
                            </div>
                            
                            {/* Floating particles */}
                            <motion.div 
                              className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-blue-400"
                              animate={{
                                y: [-4, -8, -4],
                                opacity: [0.4, 0.8, 0.4],
                                scale: [0.8, 1.2, 0.8]
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                repeatType: "loop"
                              }}
                            />
                            <motion.div 
                              className="absolute -bottom-1 -left-1 h-2 w-2 rounded-full bg-indigo-400"
                              animate={{
                                y: [0, -4, 0],
                                opacity: [0.3, 0.7, 0.3],
                                scale: [0.6, 1, 0.6]
                              }}
                              transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                repeatType: "loop",
                                delay: 0.5
                              }}
                            />
                          </motion.div>
                          
                          <div className="ml-3 flex flex-col">
                            <span className="font-medium text-blue-200">Echo AI</span>
                            <div className="flex items-center">
                              <VoiceWaveform isActive={true} />
                              <span className="text-xs text-indigo-300 ml-2 font-mono">processing query...</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Contextual thinking status */}
                        <div className="w-full flex flex-col space-y-1 mt-1 bg-indigo-950/30 rounded-lg p-2 border border-indigo-500/20">
                          <div className="flex items-center text-xs text-indigo-300/80">
                            <Activity size={12} className="mr-1.5" />
                            <span className="font-mono">NEURAL ENGINE</span>
                            
                            <motion.div 
                              className="ml-auto bg-blue-500/20 rounded-full px-2 text-blue-300 text-[10px] font-mono flex items-center"
                              animate={{
                                opacity: [0.7, 1, 0.7]
                              }}
                              transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                repeatType: "loop"
                              }}
                            >
                              <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-400 mr-1"></span>
                              ACTIVE
                            </motion.div>
                          </div>
                          
                          <ThinkingProcess />
                        </div>
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
                      ref={typingInputRef}
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Ask Echo something or type / for commands..."
                      className="w-full bg-indigo-900/30 border border-indigo-500/30 rounded-xl px-4 py-3 text-blue-100 placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-medium shadow-inner"
                    />
                    
                    {/* Interactive text suggestions when typing */}
                    {inputValue && !inputValue.startsWith('/') && (
                      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                        <div className="relative w-full h-full">
                          {['risk', 'performance', 'signals', 'alpha'].map((term, i) => {
                            if (inputValue.toLowerCase().includes(term.substring(0, 2)) && 
                                !inputValue.toLowerCase().includes(term)) {
                              const randomX = 20 + Math.random() * 200;
                              const randomY = (i * 15) % 30;
                              
                              return (
                                <motion.div 
                                  key={term}
                                  className="absolute text-indigo-400/30 font-medium"
                                  style={{ left: randomX, top: randomY }}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 0.5, y: 0 }}
                                  exit={{ opacity: 0 }}
                                >
                                  {term}
                                </motion.div>
                              );
                            }
                            return null;
                          })}
                        </div>
                      </div>
                    )}
                    
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

// Add styled classes to enable animations
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  .message-appear-animation {
    animation: messageAppear 0.5s ease-out forwards;
  }
  
  @keyframes messageAppear {
    0% { opacity: 0; transform: translateY(10px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  
  .glitch-effect {
    position: relative;
  }
  
  .glitch-effect::before,
  .glitch-effect::after {
    content: attr(data-text);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0.8;
  }
  
  .glitch-effect::before {
    left: 2px;
    text-shadow: -1px 0 rgba(255, 0, 0, 0.5);
    animation: glitch-anim-1 2s infinite linear alternate-reverse;
  }
  
  .glitch-effect::after {
    left: -2px;
    text-shadow: -1px 0 rgba(0, 0, 255, 0.5);
    animation: glitch-anim-2 3s infinite linear alternate-reverse;
  }
`;
document.head.appendChild(styleSheet);

export default EchoAgentChat;