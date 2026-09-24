/* Serveur statique minimal — aucune dépendance.
   Usage : npm run serve   (puis http://localhost:5173) */
const http = require('http');
const fs = require('fs');
const path = require('path');

const RACINE = path.join(__dirname, '..');
const PORT = process.env.PORT || 5173;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.json': 'application/json; charset=utf-8',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.webmanifest': 'application/manifest+json',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
};

http.createServer((req, res) => {
  let rel = decodeURIComponent(req.url.split('?')[0]);
  if (rel === '/') rel = '/index.html';

  const fichier = path.join(RACINE, rel);
  if (!fichier.startsWith(RACINE)) {
    res.writeHead(403).end('Interdit');
    return;
  }

  fs.readFile(fichier, (err, data) => {
    if (err) {
      // Toute URL inconnue retombe sur la page 404 du site : jamais d'impasse.
      fs.readFile(path.join(RACINE, '404.html'), (e2, page) => {
        res.writeHead(404, { 'Content-Type': TYPES['.html'] });
        res.end(e2 ? 'Page introuvable' : page);
      });
      return;
    }
    res.writeHead(200, {
      'Content-Type': TYPES[path.extname(fichier).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-cache',
    });
    res.end(data);
  });
}).listen(PORT, () => {
  console.log(`unevoyante.fr → http://localhost:${PORT}`);
});
