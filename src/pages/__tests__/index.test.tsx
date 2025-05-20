import { render, screen } from '@testing-library/react';
import Home from '../index';

// Mock heavy components used in Home to keep tests lightweight
jest.mock('@/components/CanvasDepthGalaxy', () => () => <div data-testid="canvas" />);
jest.mock('@/components/HeroDock', () => (props: any) => (
  <button onClick={props.onConnectWallet} aria-label="Connect Wallet">
    {props.isWalletConnected ? 'Wallet Connected' : 'Connect Wallet'}
  </button>
));
jest.mock('@/components/ProgressTunnel', () => () => <div />);
jest.mock('@/components/RiskToggleRail', () => () => <div />);
jest.mock('@/components/RealtimeNanoHub', () => () => <div />);
jest.mock('@/components/FaqAccordion', () => () => <div />);
jest.mock('@/components/FooterGlyphBar', () => () => <div />);
jest.mock('@/components/Toast', () => () => <div />);
jest.mock('@/components/OnboardingGuide', () => () => <div />);
jest.mock('@/components/DepositNeuralFrame', () => () => <div />);
jest.mock('@/components/AppTransitionManager', () => ({ children }: any) => <div>{children}</div>);
jest.mock('@/components/WalletConnectionTransition', () => () => <div />);
jest.mock('@/components/Loaders/GlitchText', () => (props: any) => <div>{props.text}</div>);

describe('Home Page', () => {
  it('renders Connect Wallet button', () => {
    render(<Home />);
    const button = screen.getByRole('button', { name: /connect wallet/i });
    expect(button).toBeInTheDocument();
  });
});
