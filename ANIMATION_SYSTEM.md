# Echo Application Animation System

This document describes the animation and transition system created for the Echo application, designed to provide a futuristic, web3-style user experience.

## Animation Utilities

### `/src/utils/animations.ts`

The core animation utilities file that contains Framer Motion variants for different animation types:

- Page transitions (fade, slide, scale, blur)
- Item transitions for staggered animations
- Neural network node and connection animations
- Data flow animations
- Loading spinners
- Glitch effects
- Particles
- Progress bars
- Digital rain (Matrix-style)
- Circular loaders
- Ripple effects

## Loader Components

### `/src/components/Loaders/`

A collection of specialized loading components that provide engaging visual feedback during various operations:

1. **CircularLoader.tsx** - A futuristic circular loader with glowing effects
2. **DataFlowLoader.tsx** - Data flow visualization with moving particles along paths
3. **DigitalRainLoader.tsx** - Matrix-style digital rain effect with Japanese characters
4. **GlitchText.tsx** - Cyberpunk-style glitching text effect with customizable intensity
5. **NeuralLoader.tsx** - Neural network visualization with animated nodes and connections
6. **ParticleLoader.tsx** - Particle field loader with flowing particles and ripple effects

All loaders include:
- Configurable options for size, colors, and intensity
- Animated ellipsis for loading messages
- Customizable messages

## Transition Components

### `/src/components/PageTransition.tsx`

A wrapper component for page transitions using Framer Motion's `AnimatePresence` for smooth transitions between pages or state changes with types:
- Fade transition
- Slide transition
- Scale transition
- Blur transition

### `/src/components/AppTransitionManager.tsx`

A container component that manages transitions between different app states with:
- Full-screen transition overlays
- Step-specific animations
- Loading indicators for operations
- Progress tracking

### `/src/components/WalletConnectionTransition.tsx`

A specialized component for wallet connection animations:
- Particle animation during connection
- Address reveal effect
- Success confirmation
- Connected state visualization

### `/src/components/ProgressBar.tsx`

A stylized progress bar component with:
- Determinate and indeterminate states
- Customizable colors and sizes
- Particle trailing effect
- Percentage display
- Glow effects

## Integration

These components are integrated into the application's main flow:

1. **Global Page Transitions** - Applied in `_app.tsx` for transitions between different routes
2. **Step Transitions** - Applied in `index.tsx` for moving between different stages of the application flow
3. **Component Animations** - Applied to individual components with staggered animations
4. **Loading States** - Displayed during async operations
5. **Success Animations** - Shown when operations complete successfully

## Performance Considerations

The animations are designed with performance in mind:
- CSS-based animations for simple effects
- Hardware-accelerated properties (transform, opacity)
- Conditional rendering to avoid unnecessary animations
- Optimization for mobile devices
- Properly timed transitions to avoid jank

## Usage

To use these animations in other components:

```tsx
import { motion } from 'framer-motion';
import { itemTransitions } from '@/utils/animations';

const MyComponent = () => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={itemTransitions}
    >
      My animated content
    </motion.div>
  );
};
```

For page transitions:

```tsx
import PageTransition from '@/components/PageTransition';

const MyPage = () => {
  return (
    <PageTransition transitionType="blur">
      Page content
    </PageTransition>
  );
};
```

For loading states:

```tsx
import { CircularLoader } from '@/components/Loaders';

const MyComponent = () => {
  const [loading, setLoading] = useState(false);
  
  return (
    <>
      {loading && <CircularLoader isVisible message="Loading data..." />}
      {!loading && <div>Content loaded</div>}
    </>
  );
};
```