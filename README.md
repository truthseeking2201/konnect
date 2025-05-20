# KONNECT - Advanced Trading Platform

## Risk Terrain Visualizer

This project introduces an advanced 3D Risk Selection experience with terrain visualization to provide users with an interactive and visually engaging way to select their risk profiles.

## Features

- **Interactive 3D Terrain Visualization**: Dynamically rendered based on the selected risk level
- **Real-time Particle Effects**: Visual feedback that changes based on risk profile
- **Smooth Transitions**: Animated transitions between different risk levels
- **Detailed Information Panel**: Pop-up panel that provides more context about each risk profile
- **Keyboard Navigation**: Full accessibility support

## Components

### RiskTerrainVisualizer

A Three.js-powered component that generates a dynamic 3D terrain reflecting the selected risk level:

- Conservative: Low, gentle terrain with blue coloring and minimal particles
- Balanced: Moderate peaks with indigo coloring and medium particle activity
- Aggressive: High, volatile terrain with purple coloring and intense particle effects

### RiskToggleRail3D

An enhanced version of the original RiskToggleRail component that incorporates:

- 3D terrain visualization
- Contextual highlighting and animations
- Detailed information panels
- Improved hover effects
- Risk-specific color schemes

## Testing the Risk Profile Selector

Visit the `/risk-profile` page to see and test the new Risk Profile Selector:

```
http://localhost:3000/risk-profile
```

## Implementation Details

### Technologies Used

- **Three.js**: For 3D terrain visualization
- **React**: Component architecture
- **Framer Motion**: For UI animations
- **WebGL Shaders**: For advanced terrain effects
- **React Spring**: For smooth property transitions

### Performance Considerations

The 3D visualization is optimized for performance with:

- Dynamic level-of-detail based on device capabilities
- Efficient particle system
- WebGL acceleration
- Throttled animations on lower-end devices

## Development

To run the project locally:

```bash
npm run dev
```

Then open [http://localhost:3000/risk-profile](http://localhost:3000/risk-profile) to view the new Risk Profile Selector.

When clicking **Connect Wallet**, wait for the demo connection animation to finish (about three seconds). Once the success message appears the next steps of the demo become available.

## Credits

Design and implementation by the KONNECT team.