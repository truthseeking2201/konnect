import React from 'react';
import { motion } from 'framer-motion';
import { neuralNodeAnimation, neuralConnectionAnimation, dataFlowAnimation } from '@/utils/animations';

interface NeuralLoaderProps {
  isVisible: boolean;
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  className?: string;
}

const NeuralLoader: React.FC<NeuralLoaderProps> = ({
  isVisible = true,
  size = 'md',
  message = 'Connecting to neural network',
  className = '',
}) => {
  if (!isVisible) return null;
  
  const dimensions = {
    sm: { width: 80, height: 80 },
    md: { width: 120, height: 120 },
    lg: { width: 160, height: 160 },
  };
  
  const { width, height } = dimensions[size];
  
  // Node positions
  const nodes = [
    { id: 1, cx: width * 0.2, cy: height * 0.2, r: width * 0.06, delay: 0 },
    { id: 2, cx: width * 0.5, cy: height * 0.15, r: width * 0.05, delay: 0.2 },
    { id: 3, cx: width * 0.8, cy: height * 0.25, r: width * 0.055, delay: 0.1 },
    { id: 4, cx: width * 0.15, cy: height * 0.5, r: width * 0.055, delay: 0.3 },
    { id: 5, cx: width * 0.4, cy: height * 0.45, r: width * 0.07, delay: 0.15 },
    { id: 6, cx: width * 0.65, cy: height * 0.55, r: width * 0.05, delay: 0.25 },
    { id: 7, cx: width * 0.85, cy: height * 0.6, r: width * 0.06, delay: 0.35 },
    { id: 8, cx: width * 0.25, cy: height * 0.85, r: width * 0.05, delay: 0.4 },
    { id: 9, cx: width * 0.55, cy: height * 0.8, r: width * 0.06, delay: 0.45 },
    { id: 10, cx: width * 0.8, cy: height * 0.75, r: width * 0.05, delay: 0.5 },
  ];
  
  // Connections between nodes
  const connections = [
    { id: 1, from: 1, to: 2, delay: 0 },
    { id: 2, from: 2, to: 3, delay: 0.1 },
    { id: 3, from: 1, to: 4, delay: 0.2 },
    { id: 4, from: 2, to: 5, delay: 0.3 },
    { id: 5, from: 3, to: 6, delay: 0.4 },
    { id: 6, from: 4, to: 5, delay: 0.5 },
    { id: 7, from: 5, to: 6, delay: 0.6 },
    { id: 8, from: 6, to: 7, delay: 0.7 },
    { id: 9, from: 4, to: 8, delay: 0.8 },
    { id: 10, from: 5, to: 9, delay: 0.9 },
    { id: 11, from: 6, to: 10, delay: 1.0 },
    { id: 12, from: 8, to: 9, delay: 1.1 },
    { id: 13, from: 9, to: 10, delay: 1.2 },
  ];
  
  // Data flow paths (selected connections)
  const dataFlows = [2, 5, 7, 10, 13];
  
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative">
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
          {/* Connections between nodes */}
          {connections.map(connection => {
            const fromNode = nodes.find(n => n.id === connection.from);
            const toNode = nodes.find(n => n.id === connection.to);
            
            if (!fromNode || !toNode) return null;
            
            return (
              <motion.line
                key={`connection-${connection.id}`}
                x1={fromNode.cx}
                y1={fromNode.cy}
                x2={toNode.cx}
                y2={toNode.cy}
                stroke="rgba(99, 102, 241, 0.6)"
                strokeWidth={width * 0.01}
                initial="hidden"
                animate="visible"
                exit="exit"
                custom={connection.delay}
                variants={neuralConnectionAnimation}
              />
            );
          })}
          
          {/* Data flow animations */}
          {dataFlows.map(flowId => {
            const connection = connections.find(c => c.id === flowId);
            if (!connection) return null;
            
            const fromNode = nodes.find(n => n.id === connection.from);
            const toNode = nodes.find(n => n.id === connection.to);
            
            if (!fromNode || !toNode) return null;
            
            return (
              <motion.circle
                key={`flow-${flowId}`}
                cx={fromNode.cx}
                cy={fromNode.cy}
                r={width * 0.02}
                fill="rgba(59, 130, 246, 0.9)"
                initial="hidden"
                animate="visible"
                variants={dataFlowAnimation}
              >
                <animateMotion
                  path={`M0,0 L${toNode.cx - fromNode.cx},${toNode.cy - fromNode.cy}`}
                  dur="2s"
                  repeatCount="indefinite"
                />
              </motion.circle>
            );
          })}
          
          {/* Neural nodes */}
          {nodes.map(node => (
            <motion.circle
              key={`node-${node.id}`}
              cx={node.cx}
              cy={node.cy}
              r={node.r}
              fill="rgba(99, 102, 241, 0.9)"
              initial="hidden"
              animate={["visible", "pulse"]}
              exit="exit"
              custom={node.delay}
              variants={neuralNodeAnimation}
              className="neural-node"
              style={{
                filter: 'drop-shadow(0 0 6px rgba(99, 102, 241, 0.7))'
              }}
            />
          ))}
        </svg>
      </div>
      
      {message && (
        <motion.div 
          className="mt-4 text-sm text-blue-300 font-mono"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {message}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            ...
          </motion.span>
        </motion.div>
      )}
    </div>
  );
};

export default NeuralLoader;