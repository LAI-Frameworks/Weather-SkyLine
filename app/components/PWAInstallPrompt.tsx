'use client';

import { useState, useEffect } from 'react';

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [visitedBefore, setVisitedBefore] = useState(false);

  useEffect(() => {
    // Check if user visited before
    const hasVisited = localStorage.getItem('weatherAppVisited');
    setVisitedBefore(!!hasVisited);
    
    // Mark as visited
    localStorage.setItem('weatherAppVisited', 'true');
    
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Only show prompt if:
      // 1. User has visited before (not first time)
      // 2. On mobile devices
      // 3. Not already installed
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      
      if (hasVisited && isMobile && !isStandalone) {
        // Wait 3 seconds before showing
        setTimeout(() => {
          setShowPrompt(true);
        }, 3000);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setShowPrompt(false);
      localStorage.setItem('pwaInstalled', 'true');
    }
    
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwaPromptDismissed', Date.now().toString());
  };

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowPrompt(false);
      return;
    }
    
    // Check if dismissed recently
    const dismissed = localStorage.getItem('pwaPromptDismissed');
    if (dismissed) {
      const daysSinceDismissed = (Date.now() - parseInt(dismissed)) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 3) { // 3 days instead of 7
        setShowPrompt(false);
      }
    }
    
    // Check if already installed
    if (localStorage.getItem('pwaInstalled') === 'true') {
      setShowPrompt(false);
    }
  }, []);

  // Don't show on desktop immediately, only after user interaction
  const isDesktop = !/iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
  if (!showPrompt || (isDesktop && !visitedBefore)) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '1rem',
      left: '1rem',
      right: '1rem',
      maxWidth: '500px',
      margin: '0 auto',
      zIndex: 9999,
      animation: 'slideUp 0.3s ease-out'
    }}>
      {/* ... rest of your JSX stays the same ... */}
    </div>
  );
}