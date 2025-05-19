import { Variants } from 'framer-motion';

// Page transition variants
export const pageTransitions: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1.0], // Custom cubic bezier for smooth feel
      when: 'beforeChildren',
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.1, 0.25, 1.0],
    },
  },
};

// Staggered children variants
export const itemTransitions: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1.0],
    }
  },
  exit: { 
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.2,
    }
  },
};

// Fade transitions
export const fadeTransitions: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      duration: 0.6,
    }
  },
  exit: { 
    opacity: 0,
    transition: {
      duration: 0.4,
    }
  },
};

// Slide transitions
export const slideTransitions: Variants = {
  hidden: { x: '-100%', opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: {
      duration: 0.6,
      type: 'spring',
      stiffness: 100,
      damping: 20,
    }
  },
  exit: { 
    x: '100%',
    opacity: 0,
    transition: {
      duration: 0.4,
    }
  },
};

// Scale transitions
export const scaleTransitions: Variants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: {
      duration: 0.4,
      type: 'spring',
      stiffness: 300,
      damping: 25,
    }
  },
  exit: { 
    scale: 0.8,
    opacity: 0,
    transition: {
      duration: 0.3,
    }
  },
};

// Blur transitions
export const blurTransitions: Variants = {
  hidden: { filter: 'blur(12px)', opacity: 0, scale: 0.95 },
  visible: { 
    filter: 'blur(0px)', 
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
    }
  },
  exit: { 
    filter: 'blur(8px)',
    opacity: 0,
    scale: 0.96,
    transition: {
      duration: 0.3,
    }
  },
};

// Neural network node animation
export const neuralNodeAnimation: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: (custom: number) => ({
    scale: 1,
    opacity: 1,
    transition: {
      delay: custom * 0.1,
      duration: 0.3,
      type: 'spring',
      stiffness: 200,
      damping: 15,
    }
  }),
  pulse: {
    scale: [1, 1.05, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: 'reverse',
    }
  },
  exit: {
    scale: 0,
    opacity: 0,
    transition: {
      duration: 0.2,
    }
  }
};

// Neural connection animation
export const neuralConnectionAnimation: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (custom: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      delay: custom * 0.05 + 0.2,
      pathLength: { 
        duration: 0.8, 
        ease: 'easeInOut' 
      },
      opacity: { 
        duration: 0.2, 
        ease: 'easeIn' 
      }
    }
  }),
  pulse: {
    opacity: [1, 0.6, 1],
    transition: {
      duration: 3,
      repeat: Infinity,
      repeatType: 'reverse',
    }
  },
  exit: {
    pathLength: 0,
    opacity: 0,
    transition: {
      duration: 0.4,
    }
  }
};

// Data flow animation
export const dataFlowAnimation: Variants = {
  hidden: { 
    pathOffset: 0,
    opacity: 0 
  },
  visible: { 
    pathOffset: 1,
    opacity: [0, 1, 1, 0],
    transition: {
      pathOffset: {
        duration: 2.5,
        ease: 'linear',
        repeat: Infinity,
      },
      opacity: {
        duration: 2.5,
        times: [0, 0.2, 0.8, 1],
        repeat: Infinity,
      }
    }
  }
};

// Loading spinner animation
export const spinnerAnimation: Variants = {
  hidden: { opacity: 0, rotate: 0 },
  visible: { 
    opacity: 1,
    rotate: 360,
    transition: {
      rotate: {
        duration: 1.5,
        ease: 'linear',
        repeat: Infinity,
      },
      opacity: {
        duration: 0.3,
      }
    }
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.3,
    }
  }
};

// Glitch animation
export const glitchAnimation: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    x: [0, -2, 2, -1, 0, 2, -2, 0],
    y: [0, 1, -1, 2, -2, 1, 0],
    transition: {
      x: {
        duration: 0.4,
        repeat: Infinity,
        repeatType: 'mirror',
        ease: 'easeInOut',
        times: [0, 0.14, 0.28, 0.42, 0.56, 0.7, 0.84, 1]
      },
      y: {
        duration: 0.4,
        repeat: Infinity,
        repeatType: 'mirror',
        ease: 'easeInOut',
        times: [0, 0.14, 0.28, 0.42, 0.56, 0.7, 1]
      },
      opacity: {
        duration: 0.3
      }
    }
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2
    }
  }
};

// Particles animation
export const particleAnimation = (direction: 'up' | 'down' | 'left' | 'right' = 'up'): Variants => {
  let xEnd = 0;
  let yEnd = 0;
  
  switch (direction) {
    case 'up':
      yEnd = -100;
      break;
    case 'down':
      yEnd = 100;
      break;
    case 'left':
      xEnd = -100;
      break;
    case 'right':
      xEnd = 100;
      break;
  }
  
  return {
    hidden: { 
      x: 0, 
      y: 0, 
      opacity: 0 
    },
    visible: {
      x: [0, xEnd / 2, xEnd],
      y: [0, yEnd / 2, yEnd],
      opacity: [0, 1, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeOut',
      }
    }
  };
};

// Progress bar animation
export const progressBarAnimation: Variants = {
  hidden: { width: '0%' },
  visible: (custom: number) => ({
    width: `${custom}%`,
    transition: {
      duration: 0.8,
      ease: 'easeOut',
    }
  }),
  indeterminate: {
    width: ['0%', '100%'],
    x: ['-100%', '100%'],
    transition: {
      width: {
        duration: 1.5,
        ease: 'linear',
        repeat: Infinity,
      },
      x: {
        duration: 1.5,
        ease: 'linear',
        repeat: Infinity,
      }
    }
  }
};

// Futuristic circular loader variants
export const circularLoaderAnimation = {
  hidden: { 
    opacity: 0, 
    rotate: 0,
    pathLength: 0
  },
  visible: {
    opacity: 1,
    rotate: 360,
    pathLength: [0, 0.5, 1],
    transition: {
      rotate: {
        duration: 2,
        ease: 'linear',
        repeat: Infinity,
      },
      pathLength: {
        duration: 2,
        times: [0, 0.5, 1],
        repeat: Infinity,
      },
      opacity: {
        duration: 0.3,
      }
    }
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.3,
    }
  }
};

// Digital rain animation (Matrix-style)
export const digitalRainAnimation: Variants = {
  hidden: { y: -20, opacity: 0 },
  visible: (custom: number) => ({
    y: 20,
    opacity: [0, 1, 0],
    transition: {
      y: {
        duration: 1.5 + (custom * 0.5),
        repeat: Infinity,
      },
      opacity: {
        duration: 1.5 + (custom * 0.5),
        times: [0, 0.1, 1],
        repeat: Infinity,
      },
      delay: custom * 0.3
    }
  })
};

// Ripple animation
export const rippleAnimation: Variants = {
  hidden: { 
    scale: 0.5, 
    opacity: 0 
  },
  visible: {
    scale: [0.5, 1.5],
    opacity: [1, 0],
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'easeOut',
    }
  }
};