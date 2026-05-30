const CACHE_NAME = 'language-tools-v2';
const BASE_PATH = '/language-tools';
const OFFLINE_SHELL = [
  `${BASE_PATH}/index.html`,
  `${BASE_PATH}/conjugation.html`,
  `${BASE_PATH}/manifest.webmanifest`,
  `${BASE_PATH}/icon.svg`,
];

function isSuccessful(response) {
  return response && response.ok;
}

function shouldCachePath(pathname) {
  return pathname.startsWith(`${BASE_PATH}/`);
}

async function putInCache(request, response) {
  if (!isSuccessful(response)) {
    return response;
  }

  const cache = await caches.open(CACHE_NAME);
  await cache.put(request, response.clone());
  return response;
}

async function cacheUrls(urls) {
  const cache = await caches.open(CACHE_NAME);

  await Promise.all(
    urls.map(async (urlLike) => {
      try {
        const url = new URL(urlLike, self.location.origin);

        if (url.origin !== self.location.origin || !shouldCachePath(url.pathname)) {
          return;
        }

        const request = new Request(url.toString(), { credentials: 'same-origin' });
        const response = await fetch(request);

        if (isSuccessful(response)) {
          await cache.put(request, response.clone());

          if (url.pathname.endsWith('.json')) {
            await cache.put(url.pathname, response.clone());
          }
        }
      } catch {
        // Ignore individual caching failures and keep warming the rest.
      }
    })
  );
}

function toExportHtmlPath(pathname) {
  if (pathname === BASE_PATH || pathname === `${BASE_PATH}/`) {
    return `${BASE_PATH}/index.html`;
  }

  if (!pathname.startsWith(`${BASE_PATH}/`)) {
    return null;
  }

  if (/\.[^/]+$/.test(pathname)) {
    return pathname;
  }

  return `${pathname}.html`;
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    cacheUrls(OFFLINE_SHELL)
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('message', (event) => {
  if (event.data?.type !== 'CACHE_URLS' || !Array.isArray(event.data.urls)) {
    return;
  }

  event.waitUntil(cacheUrls(event.data.urls));
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') {
    return;
  }

  const url = new URL(request.url);

  if (url.origin !== self.location.origin) {
    return;
  }

  if (!shouldCachePath(url.pathname)) {
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => putInCache(request, response))
        .catch(async () => {
          const cachedResponse = await caches.match(request);
          if (cachedResponse) {
            return cachedResponse;
          }

          const exportHtmlPath = toExportHtmlPath(url.pathname);
          if (exportHtmlPath) {
            const exportedPage = await caches.match(exportHtmlPath);
            if (exportedPage) {
              return exportedPage;
            }
          }

          const homePage = await caches.match(`${BASE_PATH}/index.html`);
          if (homePage) {
            return homePage;
          }

          return Response.error();
        })
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(async (cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      try {
        const networkResponse = await fetch(request);
        return putInCache(request, networkResponse);
      } catch {
        if (url.pathname.endsWith('.json')) {
          const cachedJson = await caches.match(url.pathname);
          if (cachedJson) {
            return cachedJson;
          }
        }

        return Response.error();
      }
    })
  );
});