'use client';

import { useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';

export const useDeepLinking = (
  syncToUrl: () => Record<string, string | number | boolean | null>,
  restoreFromUrl: (params: Record<string, string>) => void
) => {
  const searchParams = useSearchParams();
  const isRestoredRef = useRef(false);

  // Restore state from URL parameters on mount
  useEffect(() => {
    if (isRestoredRef.current || !searchParams) return;
    
    const params: Record<string, string> = {};
    searchParams.forEach((val, key) => {
      params[key] = val;
    });

    if (Object.keys(params).length > 0) {
      restoreFromUrl(params);
    }
    isRestoredRef.current = true;
  }, [searchParams, restoreFromUrl]);

  // Update the URL query parameters to reflect the current state
  const updateUrl = () => {
    const data = syncToUrl();
    const urlParams = new URLSearchParams();
    
    Object.entries(data).forEach(([key, val]) => {
      if (val !== null && val !== undefined && val !== '') {
        urlParams.set(key, val.toString());
      }
    });

    const queryStr = urlParams.toString();
    const newUrl = queryStr 
      ? `${window.location.pathname}?${queryStr}`
      : window.location.pathname;

    window.history.replaceState({ ...window.history.state, as: newUrl, url: newUrl }, '', newUrl);
  };

  return { updateUrl };
};
