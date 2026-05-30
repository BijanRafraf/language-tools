'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const BASE_PATH = '/language-tools';

function collectSameOriginResourceUrls() {
  const urls = new Set<string>();

  urls.add(window.location.href);
  urls.add(`${window.location.origin}${BASE_PATH}/manifest.webmanifest`);
  urls.add(`${window.location.origin}${BASE_PATH}/icon.svg`);

  for (const entry of performance.getEntriesByType('resource')) {
    if (!('name' in entry) || typeof entry.name !== 'string') {
      continue;
    }

    try {
      const url = new URL(entry.name);
      if (url.origin === window.location.origin && url.pathname.startsWith(`${BASE_PATH}/`)) {
        urls.add(url.toString());
      }
    } catch {
      // Ignore malformed resource URLs.
    }
  }

  return Array.from(urls);
}

export function PwaRegistration() {
  const pathname = usePathname();

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      return;
    }

    if (!('serviceWorker' in navigator)) {
      return;
    }

    void navigator.serviceWorker.register(`${BASE_PATH}/sw.js`, {
      scope: `${BASE_PATH}/`,
    }).catch(() => {
      // Ignore registration failures and keep the app usable online.
    });
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      return;
    }

    if (!('serviceWorker' in navigator)) {
      return;
    }

    const warmCache = async () => {
      try {
        const registration = await navigator.serviceWorker.ready;
        const worker = registration.active ?? registration.waiting ?? registration.installing;
        if (!worker) {
          return;
        }

        worker.postMessage({
          type: 'CACHE_URLS',
          urls: collectSameOriginResourceUrls(),
        });
      } catch {
        // Ignore cache warming failures and keep the app usable online.
      }
    };

    if (document.readyState === 'complete') {
      void warmCache();
      return;
    }

    const handleLoad = () => {
      void warmCache();
    };

    window.addEventListener('load', handleLoad, { once: true });

    return () => {
      window.removeEventListener('load', handleLoad);
    };
  }, [pathname]);

  return null;
}