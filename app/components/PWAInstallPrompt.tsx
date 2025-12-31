'use client';

import { useState, useEffect } from 'react';

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log('✅ Already installed as PWA');
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      console.log('✅ beforeinstallprompt event fired');
      
      // Show prompt after 1 second
      setTimeout(() => {
        setShowPrompt(true);
      }, 1000);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    console.log('📲 Triggering install prompt...');
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('🎉 User accepted PWA installation');
      setShowPrompt(false);
    } else {
      console.log('❌ User declined PWA installation');
    }
    
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    console.log('🙈 User dismissed install prompt');
    setShowPrompt(false);
  };

  // Debug: Check PWA readiness
  useEffect(() => {
    console.log('🔍 PWA Check:');
    console.log('- Installable:', 'beforeinstallprompt' in window);
    console.log('- Standalone mode:', window.matchMedia('(display-mode: standalone)').matches);
    console.log('- Manifest:', document.querySelector('link[rel="manifest"]')?.getAttribute('href'));
  }, []);

  if (!showPrompt) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '1rem',
      left: '1rem',
      right: '1rem',
      maxWidth: '500px',
      margin: '0 auto',
      background: 'rgba(15, 23, 42, 0.95)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(59, 130, 246, 0.3)',
      borderRadius: '1rem',
      padding: '1.5rem',
      zIndex: 9999,
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
      animation: 'slideUp 0.5s ease-out'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ 
            width: '44px', 
            height: '44px', 
            background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
            borderRadius: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.25rem'
          }}>
            📲
          </div>
          <div>
            <h3 style={{ margin: 0, color: 'white', fontWeight: '600' }}>Install WeatherFlow</h3>
            <p style={{ margin: '0.25rem 0 0', color: '#94a3b8', fontSize: '0.875rem' }}>
              Get faster access & work offline
            </p>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
            fontSize: '1.5rem',
            padding: '0.25rem',
            borderRadius: '0.25rem'
          }}
          aria-label="Close"
        >
          ×
        </button>
      </div>
      
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button
          onClick={handleInstall}
          style={{
            flex: 1,
            background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
            color: 'white',
            border: 'none',
            borderRadius: '0.75rem',
            padding: '0.875rem',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          Install App
        </button>
        <button
          onClick={handleDismiss}
          style={{
            padding: '0.875rem 1.5rem',
            background: 'rgba(255, 255, 255, 0.1)',
            color: '#94a3b8',
            border: 'none',
            borderRadius: '0.75rem',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          Later
        </button>
      </div>
      
      <p style={{ 
        margin: '0.75rem 0 0', 
        fontSize: '0.75rem', 
        color: '#64748b',
        textAlign: 'center'
      }}>
        Adds to home screen • Works offline • No app store needed
      </p>
    </div>
  );
}