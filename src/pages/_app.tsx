import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useEffect } from 'react';

export default function App({ Component, pageProps }: AppProps) {
  // For analytics tracking
  useEffect(() => {
    // Track initial page view
    const trackEvent = (name: string, params = {}) => {
      if (typeof window !== 'undefined') {
        // In production, this would be connected to a real analytics provider
        console.log(`[Analytics] ${name}`, params);
      }
    };
    
    // Get device FPS estimate
    let deviceFps = 60;
    try {
      if (typeof window !== 'undefined') {
        const testFps = () => {
          let frames = 0;
          let lastTime = performance.now();
          
          const countFrame = () => {
            frames++;
            const now = performance.now();
            if (now - lastTime >= 1000) {
              deviceFps = frames;
              frames = 0;
              lastTime = now;
            } else {
              requestAnimationFrame(countFrame);
            }
          };
          
          requestAnimationFrame(countFrame);
        };
        
        testFps();
      }
    } catch (e) {
      console.error('FPS detection error:', e);
    }
    
    trackEvent('paint_galaxy', { deviceFps });
  }, []);
  
  return (
    <>
      <Head>
        <title>Konstellation Echo Lite | Neon Singularity</title>
        <meta name="description" content="Your portal to algorithmic trading in the Konstellation ecosystem" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#0D1117" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}