/* Version publiée — npm run statique
   ---------------------------------------------------------------------------
   Produit dist/, le dossier à déployer :
   - les pages indexables pré-rendues : leurs scripts (data.js, app.js,
     modales.js, script de la page) sont exécutés dans un DOM simulé (jsdom)
     et le HTML obtenu est enregistré. Un robot qui n'exécute pas le
     JavaScript lit donc le catalogue, les fiches, la FAQ, l'en-tête et le
     pied de page ; dans le navigateur, les mêmes scripts rejouent le rendu
     avec l'état du visiteur (crédits, favoris…) ;
   - une page par praticien, voyant-<id>.html, pré-rendue de même ;
   - les autres pages (compte, tchat, crédits…) telles quelles ;
   - assets/, robots.txt, sitemap.xml, manifest.webmanifest, et .htaccess
     (copie de src/dist.htaccess : configuration Apache du serveur).
   Toutes les pages de dist/ portent data-statique sur <html> : les liens vers
   les fiches y visent voyant-<id>.html (UV.lienVoyant).

   Le dossier du projet reste la version de développement, rendue en JS et
   ouvrable par double-clic. dist/ EST versionné : le serveur se met à jour par
   git pull, sans étape de build. Relancer npm run statique avant chaque commit
   qui touche au site. La sortie est déterministe : sans changement de source,
   aucun fichier de dist/ ne change. */
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { JSDOM, VirtualConsole } = require('jsdom');

const RACINE = path.join(__dirname, '..');
const DIST = path.join(RACINE, 'dist');
const SITE = 'https://unevoyante.fr/';

/** Pages pré-rendues. Les pages privées (noindex) ou dépendantes de l'état du
    visiteur n'y gagneraient rien : elles sont copiées telles quelles. */
const PRE_RENDUES = ['index.html', 'voyants.html', 'tarifs.html', 'faq.html', 'comment-ca-marche.html', 'contact.html', 'inscription.html'];
const COMMUNS = ['assets/js/data.js', 'assets/js/app.js', 'assets/js/modales.js'];
const COPIES = ['assets', 'robots.txt', 'sitemap.xml', 'manifest.webmanifest'];

const lire = (f) => fs.readFileSync(path.join(RACINE, f), 'utf8');
const marquer = (html) => html.replace(/<html lang="fr">/, '<html lang="fr" data-statique>');

/** Exécute les scripts de la page dans jsdom et renvoie le HTML rendu. */
async function rendre(source, url) {
  const erreurs = [];
  const console = new VirtualConsole();
  console.on('jsdomError', (e) => erreurs.push(e.message));
  console.on('error', (...a) => erreurs.push(a.join(' ')));

  const dom = new JSDOM(source, { url, runScripts: 'outside-only', pretendToBeVisual: true, virtualConsole: console });
  const w = dom.window;
  const doc = w.document;

  // Ce que jsdom n'implémente pas et que les scripts consultent au chargement.
  w.matchMedia = (media) => ({ matches: false, media, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} });
  w.scrollTo = () => {};
  w.HTMLElement.prototype.scrollIntoView = () => {};
  // Signale aux scripts qu'ils figent la page : rien qui dépende de l'instant.
  w.UV_PRERENDU = true;

  // <html> reçoit au chargement des classes et variables propres à l'écran
  // du visiteur (thème, hauteur visible…) : on rendra l'original.
  const racine = [...doc.documentElement.attributes].map((a) => [a.name, a.value]);

  const pageJs = /<script src="(assets\/js\/pages\/[\w-]+\.js)"><\/script>/.exec(source);
  for (const f of [...COMMUNS, ...(pageJs ? [pageJs[1]] : [])]) {
    try {
      w.eval(lire(f));
    } catch (e) {
      erreurs.push(`${f} : ${e.message}`);
    }
  }
  // app.js démarre au DOMContentLoaded ; le bandeau cookies (1,2 s) et les
  // autres minuteries ne doivent pas figurer dans la page : on n'attend pas.
  await new Promise((ok) => (doc.readyState === 'complete' ? ok() : w.addEventListener('load', ok)));
  await new Promise((ok) => w.setTimeout(ok, 50));

  if (erreurs.length) {
    w.close();
    throw new Error(`${url}\n  ${erreurs.join('\n  ')}`);
  }

  // Éléments éphémères : notifications, modales, préchargements.
  doc.querySelectorAll('#uv-toasts, dialog, link[rel="prefetch"]').forEach((e) => e.remove());
  for (const a of [...doc.documentElement.attributes]) doc.documentElement.removeAttribute(a.name);
  for (const [n, v] of racine) doc.documentElement.setAttribute(n, v);

  const html = dom.serialize();
  w.close();
  return html;
}

(async () => {
  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(DIST);
  for (const c of COPIES) fs.cpSync(path.join(RACINE, c), path.join(DIST, c), { recursive: true });
  fs.copyFileSync(path.join(RACINE, 'src/dist.htaccess'), path.join(DIST, '.htaccess'));

  const pages = fs.readdirSync(RACINE).filter((f) => f.endsWith('.html'));
  for (const f of pages) {
    const source = marquer(lire(f));
    const sortie = PRE_RENDUES.includes(f) ? await rendre(source, SITE + (f === 'index.html' ? '' : f)) : source;
    fs.writeFileSync(path.join(DIST, f), sortie);
  }

  // Une page par praticien, à partir du gabarit voyant.html.
  const bac = { window: {} };
  vm.runInNewContext(lire('assets/js/data.js'), bac);
  const gabarit = marquer(lire('voyant.html'));
  for (const v of bac.window.UV_DATA.VOYANTS) {
    const source = gabarit.replace('<body class=', `<body data-voyant="${v.id}" class=`);
    fs.writeFileSync(path.join(DIST, `voyant-${v.id}.html`), await rendre(source, `${SITE}voyant-${v.id}.html`));
  }

  console.log(`dist/ : ${pages.length} pages dont ${PRE_RENDUES.length} pré-rendues, ${bac.window.UV_DATA.VOYANTS.length} fiches praticiens.`);
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
