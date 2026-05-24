#!/usr/bin/env node

import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '../out');
const BASE_PATH = '/language-tools';
const PORT = Number.parseInt(process.env.PORT || '3000', 10);

const CONTENT_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.gif': 'image/gif',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

function sendFile(res, filePath) {
  const ext = extname(filePath).toLowerCase();
  const contentType = CONTENT_TYPES[ext] || 'application/octet-stream';

  res.writeHead(200, {
    'Content-Type': contentType,
    'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable',
  });

  createReadStream(filePath).pipe(res);
}

function sendNotFound(res) {
  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Not found');
}

function resolveExportPath(requestPath) {
  const normalizedPath = normalize(requestPath).replace(/^\.(\/|$)/, '');
  const safePath = normalizedPath.replace(/^\/+/, '');

  const directPath = join(OUT_DIR, safePath);
  if (existsSync(directPath) && statSync(directPath).isFile()) {
    return directPath;
  }

  if (!extname(safePath)) {
    const htmlPath = join(OUT_DIR, `${safePath}.html`);
    if (existsSync(htmlPath) && statSync(htmlPath).isFile()) {
      return htmlPath;
    }

    const nestedIndexPath = join(OUT_DIR, safePath, 'index.html');
    if (existsSync(nestedIndexPath) && statSync(nestedIndexPath).isFile()) {
      return nestedIndexPath;
    }
  }

  return null;
}

const server = createServer((req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname;

  if (pathname === '/') {
    res.writeHead(302, { Location: `${BASE_PATH}/` });
    res.end();
    return;
  }

  if (pathname === BASE_PATH) {
    res.writeHead(302, { Location: `${BASE_PATH}/` });
    res.end();
    return;
  }

  if (!pathname.startsWith(`${BASE_PATH}/`)) {
    sendNotFound(res);
    return;
  }

  const exportPath = pathname.slice(BASE_PATH.length + 1);
  const resolvedPath = resolveExportPath(exportPath || 'index.html');

  if (!resolvedPath) {
    sendNotFound(res);
    return;
  }

  sendFile(res, resolvedPath);
});

server.listen(PORT, () => {
  console.log(`Serving static export at http://localhost:${PORT}${BASE_PATH}/`);
});
