/* Polices hébergées localement — npm run polices
   ---------------------------------------------------------------------------
   Télécharge dans assets/fonts/ :
   - Nunito (police variable, graisses 200 à 1000), latin et latin étendu,
     romain et italique ;
   - Material Symbols Outlined réduite aux SEULES icônes utilisées par le site,
     axes figés sur ce que le CSS emploie (opsz 24, wght 400, GRAD 0, FILL 0..1).

   Les icônes sont retrouvées en croisant chaque mot du code (pages HTML et
   assets/js, sous-dossiers compris) avec la liste officielle des noms Material Symbols : une icône
   tirée des données (data.js) est donc prise en compte comme une icône écrite
   en dur. Un faux positif (« input », « html »…) ne coûte que quelques octets.

   À relancer après l'ajout d'une icône : sans cela, son nom s'afficherait en
   toutes lettres. `npm run polices -- --verifier` échoue si une icône manque,
   sans rien télécharger d'autre que la liste officielle. */
const fs = require('fs');
const path = require('path');

const RACINE = path.join(__dirname, '..');
const SORTIE = path.join(RACINE, 'assets/fonts');
const MANIFESTE = path.join(SORTIE, 'icones.txt');
const VERIFIER = process.argv.includes('--verifier');

// Sans navigateur moderne déclaré, Google Fonts renvoie du TTF au lieu du WOFF2.
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0 Safari/537.36';
const LISTE_OFFICIELLE = 'https://raw.githubusercontent.com/google/material-design-icons/master/variablefont/MaterialSymbolsOutlined%5BFILL,GRAD,opsz,wght%5D.codepoints';

async function texte(url) {
  const r = await fetch(url, { headers: { 'user-agent': UA } });
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  return r.text();
}

async function binaire(url, fichier) {
  const r = await fetch(url, { headers: { 'user-agent': UA } });
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  fs.writeFileSync(path.join(SORTIE, fichier), Buffer.from(await r.arrayBuffer()));
  console.log(`  ${fichier.padEnd(28)} ${(fs.statSync(path.join(SORTIE, fichier)).size / 1024).toFixed(1)} Ko`);
}

/** Blocs @font-face de la feuille Google : { sousEnsemble, style, url }. */
function blocs(css) {
  return [...css.matchAll(/\/\*\s*([\w-]+)\s*\*\/\s*@font-face\s*{([^}]*)}/g)].map(([, sousEnsemble, corps]) => ({
    sousEnsemble,
    style: /font-style:\s*(\w+)/.exec(corps)[1],
    url: /url\(([^)]+)\)/.exec(corps)[1],
  }));
}

function icones(noms) {
  const sources = [
    ...fs.readdirSync(RACINE).filter((f) => f.endsWith('.html')).map((f) => path.join(RACINE, f)),
    ...fs.readdirSync(path.join(RACINE, 'assets/js'), { recursive: true })
      .filter((f) => f.endsWith('.js')).map((f) => path.join(RACINE, 'assets/js', f)),
  ];
  const mots = new Set(sources.flatMap((f) => fs.readFileSync(f, 'utf8').match(/[a-z][a-z0-9_]+/g) || []));
  return [...mots].filter((m) => noms.has(m)).sort();
}

(async () => {
  const noms = new Set((await texte(LISTE_OFFICIELLE)).split('\n').map((l) => l.split(' ')[0]).filter(Boolean));
  const liste = icones(noms);

  if (VERIFIER) {
    const presentes = new Set(fs.existsSync(MANIFESTE) ? fs.readFileSync(MANIFESTE, 'utf8').split('\n') : []);
    const manquantes = liste.filter((n) => !presentes.has(n));
    if (manquantes.length) {
      console.error(`Icônes absentes de la police locale : ${manquantes.join(', ')}\n→ npm run polices`);
      process.exit(1);
    }
    console.log(`Police d'icônes à jour (${liste.length} noms).`);
    return;
  }

  fs.mkdirSync(SORTIE, { recursive: true });

  console.log('Nunito');
  const nunito = blocs(await texte('https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap'));
  for (const b of nunito.filter((b) => b.sousEnsemble === 'latin' || b.sousEnsemble === 'latin-ext')) {
    await binaire(b.url, `nunito-${b.sousEnsemble}${b.style === 'italic' ? '-italic' : ''}.woff2`);
  }

  console.log(`Material Symbols (${liste.length} icônes)`);
  const symboles = await texte(`https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0..1,0&icon_names=${liste.join(',')}&display=block`);
  await binaire(/url\(([^)]+)\)/.exec(symboles)[1], 'material-symbols.woff2');
  fs.writeFileSync(MANIFESTE, liste.join('\n') + '\n');

  console.log('Terminé. Les @font-face correspondants sont dans src/input.css.');
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
