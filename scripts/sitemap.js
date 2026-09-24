/* Plan du site — npm run sitemap
   ---------------------------------------------------------------------------
   Écrit sitemap.xml à la racine :
   - toutes les pages HTML qui ne portent pas <meta name="robots" content="noindex"> ;
   - une entrée par praticien (voyant.html?id=…), lue dans assets/js/data.js :
     le plan suit le catalogue sans être tenu à la main.
   La date de modification est celle du dernier commit du fichier, ou
   aujourd'hui pour un fichier modifié et pas encore commité. */
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { execFileSync } = require('child_process');

const RACINE = path.join(__dirname, '..');
const SITE = 'https://unevoyante.fr/';
const AUJOURDHUI = new Date().toISOString().slice(0, 10);

const git = (...args) => {
  try {
    return execFileSync('git', args, { cwd: RACINE, encoding: 'utf8' }).trim();
  } catch {
    return '';
  }
};

function dateDe(...fichiers) {
  // Un fichier modifié mais pas encore commité date d'aujourd'hui.
  const dates = fichiers.map((f) => (git('status', '--porcelain', '--', f) ? '' : git('log', '-1', '--format=%cs', '--', f)));
  return dates.includes('') ? AUJOURDHUI : dates.sort().pop();
}

// data.js s'exécute dans le navigateur (window.UV_DATA) : on lui fournit un window.
const bac = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(RACINE, 'assets/js/data.js'), 'utf8'), bac);
const { VOYANTS } = bac.window.UV_DATA;

const PRIORITES = { 'index.html': '1.0', 'voyants.html': '0.9', 'tarifs.html': '0.8' };

const entrees = fs.readdirSync(RACINE)
  .filter((f) => f.endsWith('.html') && f !== '404.html' && f !== 'voyant.html')
  .filter((f) => !/<meta name="robots" content="[^"]*noindex/.test(fs.readFileSync(path.join(RACINE, f), 'utf8')))
  .sort((a, b) => (PRIORITES[b] || '0.5').localeCompare(PRIORITES[a] || '0.5') || a.localeCompare(b))
  .map((f) => ({ loc: SITE + (f === 'index.html' ? '' : f), lastmod: dateDe(f), priority: PRIORITES[f] || '0.5' }));

const dateFiches = dateDe('voyant.html', 'assets/js/data.js');
for (const v of VOYANTS) {
  entrees.push({ loc: `${SITE}voyant.html?id=${encodeURIComponent(v.id)}`, lastmod: dateFiches, priority: '0.7' });
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entrees.map((e) => `  <url><loc>${e.loc.replace(/&/g, '&amp;')}</loc><lastmod>${e.lastmod}</lastmod><priority>${e.priority}</priority></url>`).join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(RACINE, 'sitemap.xml'), xml);
console.log(`sitemap.xml : ${entrees.length} adresses (${VOYANTS.length} fiches praticiens).`);
