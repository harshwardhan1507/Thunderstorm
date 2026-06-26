'use client';

import { useEffect } from 'react';

export const PWARegister: React.FC = () => {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      return;
    }
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      // Register service worker
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('PWA ServiceWorker registered successfully with scope:', reg.scope);
        })
        .catch((err) => {
          console.error('PWA ServiceWorker registration failed:', err);
        });
    }
  }, []);

  return null;
};
