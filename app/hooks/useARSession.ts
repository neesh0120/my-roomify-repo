'use client';

import { useEffect, useState } from 'react';
export function useARSession() {
  const [isSupported, setIsSupported] = useState(false);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    if ('xr' in navigator) {
      navigator.xr?.isSessionSupported('immersive-ar').then((supported) => {
        setIsSupported(supported);
      });
    }
  }, []);

  const startSession = async () => {
    if (!isSupported) return;
    
    try {
      const xrSession = await (navigator as any).xr?.requestSession('immersive-ar', {
        requiredFeatures: ['hit-test', 'dom-overlay'],
        domOverlay: { root: document.getElementById('ar-overlay') },
      });
      setSession(xrSession);

      xrSession.addEventListener('end', () => {
        setSession(null);
      });
    } catch (error) {
      console.error('Error starting AR session:', error);
    }
  };

  const endSession = () => {
    if (session) {
      session.end();
    }
  };

  return {
    isSupported,
    isActive: !!session,
    startSession,
    endSession
  };
}
