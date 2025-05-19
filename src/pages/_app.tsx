import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { AnimatePresence, motion } from 'framer-motion';
import { CircularLoader } from '@/components/Loaders';
import PageTransition from '@/components/PageTransition';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // Handle route change loading animations
  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);
    
    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);
    
    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);
  
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
      
      {/* Full page loading animation */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-bg/80 backdrop-blur-md"
          >
            <div className="p-8 rounded-xl bg-surface/30 border border-primary/20 shadow-lg">
              <CircularLoader isVisible={true} message="Navigating..." size="lg" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Page transitions */}
      <PageTransition transitionKey={router.pathname} transitionType="blur">
        <Component {...pageProps} />
      </PageTransition>
    </>
  );
}