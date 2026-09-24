# unevoyante.fr — intégration des maquettes (V1)

Site statique intégrant en **Tailwind CSS** les maquettes fournies dans les dossiers
`accueil_*`, `fiche_voyant_*`, `tchat_*`, `cr_dits_*` et `stitch_*`.
Les dossiers de maquettes d'origine sont conservés tels quels, à titre de référence.

## Démarrer

```bash
npm install
npm run build
npm run serve
```

Puis ouvrir <http://localhost:5173>.

| Commande | Effet |
| --- | --- |
| `npm run build` | Compile `src/input.css` → `assets/css/app.css` (minifié) |
| `npm run dev` | Idem en mode surveillance, à lancer pendant le développement |
| `npm run serve` | Serveur statique sans dépendance sur le port 5173 |
| `npm run polices` | Télécharge Nunito et la police d'icônes réduite aux icônes du site dans `assets/fonts/` |
| `npm run polices -- --verifier` | Échoue si une icône employée dans le code manque à la police locale |
| `npm run sitemap` | Régénère `sitemap.xml` (pages indexables + une fiche `voyant-<id>.html` par praticien de `data.js`) |
| `npm run statique` | Construit **`dist/`, la version à déployer** : CSS, plan du site, pages pré-rendues (voir « Version publiée ») |
| `npm run serve:dist` | Sert `dist/` sur le port 5173, pour la contrôler avant déploiement |

> Le CSS compilé est versionné : le site s'ouvre aussi directement en double-cliquant
> `index.html`, sans installation.

### Version publiée (`dist/`)

Le dossier du projet est la **version de développement** : chaque page est construite en
JavaScript dans le navigateur. Un robot qui n'exécute pas le JS (Bing, aperçus des réseaux
sociaux, et Google lors de sa première lecture) n'y trouve qu'une coquille vide.

`npm run statique` produit **`dist/`**, le dossier à mettre en ligne :

- les pages indexables (accueil, catalogue, tarifs, FAQ, fonctionnement, contact,
  inscription) sont **pré-rendues** : `scripts/statique.js` exécute leurs scripts dans un DOM
  simulé (jsdom) et enregistre le HTML obtenu, en-tête et pied de page compris ;
- chaque praticien a **sa propre page, `voyant-<id>.html`**, pré-rendue de même, avec son
  titre, sa description et son adresse canonique. `voyant.html?id=…` reste valable et désigne
  cette page comme référence ;
- les autres pages (compte, tchat, crédits…) sont copiées telles quelles.

Dans le navigateur, les mêmes scripts rejouent ensuite le rendu avec l'état du visiteur
(crédits, favoris, thème) : l'affichage est identique à la version de développement. Toutes
les pages de `dist/` portent `data-statique` sur `<html>`, ce qui fait pointer les liens vers
les fiches pré-générées (`UV.lienVoyant()` dans `app.js` : **à utiliser pour tout nouveau lien
vers une fiche**).

`dist/` n'est pas versionné. Chez l'hébergeur (Netlify, Vercel, Cloudflare Pages…) :
commande de build **`npm ci && npm run statique`**, dossier publié **`dist`**, page
d'erreur **`404.html`**. Un script de page qui **ajoute** un élément au lieu de remplacer un
contenu doit vérifier qu'il n'existe pas déjà (voir `#ld-faq` dans `faq.js`) : dans `dist/`,
il s'exécute sur une page déjà rendue.

## Pages

| Fichier | Maquette d'origine |
| --- | --- |
| `index.html` | `accueil_unevoyante.fr_1` (mobile) + `accueil_unevoyante.fr_2` (desktop) |
| `voyants.html` | *ajout* — catalogue complet appelé par « Voir tous les voyants (24) » |
| `voyant.html` | `fiche_voyant_l_a_*` (mobile) + `fiche_voyant_desktop_l_a_*` |
| `tchat.html` | `tchat_l_a_*`, `tchat_desktop_l_a_*`, `tchat_0_cr_dit_l_a_*` |
| `credits.html` | `cr_dits_unevoyante.fr` (mobile) + `cr_dits_desktop_unevoyante.fr` |
| `inscription.html` | `stitch_unevoyante_mobile_login` |
| `connexion.html` | *ajout* — pendant de l'inscription |
| `compte.html` | *ajout* — cible de l'onglet « Compte » de la barre mobile |
| `tarifs.html`, `faq.html` | *ajouts* — cibles des liens du menu principal |
| `comment-ca-marche.html` | *ajout* — lien du pied de page (retiré du menu principal) |
| `contact.html` | *ajout* — formulaire de contact (envoi simulé), lien « Nous contacter » du pied de page. Le motif s'ouvre sur l'invite « Motif de votre demande » et doit être choisi avant l'envoi ; il reste présélectionnable : `contact.html?motif=paiement` (`general`, `paiement`, `praticien`, `presse`). Une valeur inconnue laisse l'invite en place |
| `modales.html` | *outil de développement* — un bouton par modale du site, pour les consulter une à une (lien « Modales » du tiroir mobile et du pied de page). Lien direct : `modales.html?ouvrir=promo-vert`, `?ouvrir=forfaits`, `?ouvrir=upsell` |
| `info.html?sujet=…` | Destination unique des pages secondaires hors périmètre V1 (mentions légales, CGV, confidentialité, charte, cookies, journal, partenaire) |
| `404.html` | Toute adresse inconnue (servie par `scripts/serve.js`, à configurer chez l'hébergeur) : recherche et liens vers les pages principales. Son `<base href="/">` la rend valable à n'importe quelle profondeur d'adresse |

Chaque vue mobile et sa variante desktop ont été **fusionnées en une seule page responsive**
plutôt que dupliquées, la maquette mobile servant de base et la maquette desktop de cible
à partir de `lg:`.

## Architecture

```
index.html, voyants.html, …     Pages (une par vue)
src/input.css                   Point d'entrée : la liste ordonnée des @import ci-dessous
src/css/jetons.css              Palettes claire et nuit, ombres, dégradés (seule source des couleurs)
src/css/polices.css, base.css   @font-face ; styles de base (titres, focus, icônes)
src/css/composants/*.css        Un fichier par composant (boutons, cartes, modales, forfaits…)
src/css/utilitaires.css         Utilitaires maison (@layer utilities)
src/css/animations.css          Transitions de page, mouvements des modales
src/css/theme-nuit.css          Cas que la bascule de palette ne couvre pas
src/css/tactile.css             Particularités d'iOS
tailwind.config.js              Tokens issus de DESIGN.md
assets/css/app.css              CSS compilé
assets/fonts/                   Polices locales (Nunito, Material Symbols réduite) + icones.txt
assets/js/data.js               Données : 24 praticiens, packs, paliers de fidélité, offres ciblées, compléments, avis, FAQ
assets/js/app.js                Magasin d'état, en-tête / pied / barre d'onglets, composants
assets/js/modales.js            Socle des modales et catalogue (chargé par toutes les pages, après app.js)
assets/js/pages/<page>.js       Script propre à chaque page (index.js pour index.html…), chargé en dernier
scripts/serve.js                Serveur de développement
scripts/polices.js              Téléchargement des polices (npm run polices)
scripts/sitemap.js              Génération de sitemap.xml (npm run sitemap)
scripts/statique.js             Construction de dist/, pages pré-rendues (npm run statique)
robots.txt, sitemap.xml         Indexation
manifest.webmanifest            Installation sur l'écran d'accueil (icônes dans assets/img)
```

**Ordre des styles** : `src/input.css` importe les fichiers dans l'ordre de la cascade
(le CLI Tailwind les assemble en un seul `app.css`, identique à l'ancienne feuille unique).
Un nouveau composant s'ajoute dans `src/css/composants/` puis dans la liste d'imports, à sa
place et non par ordre alphabétique : plusieurs règles comptent sur leur position (les cartes
de packs après la carte dorée, la couche nuit après les utilitaires).

**Scripts** : chaque page charge `data.js`, `app.js`, `modales.js` puis son propre fichier
dans `assets/js/pages/`. Seul le court script du thème reste écrit dans le `<head>`, car il
doit s'exécuter avant le premier rendu. Les scripts restent des scripts classiques et non des
modules ES : ces derniers ne se chargent pas depuis `file://`, ce qui casserait l'ouverture du
site par double-clic.

## Charte graphique

- **Police unique : Nunito** (celle du logotype), graisse 800 pour les titres et le logo,
  400/600/700 pour le texte et l'interface. Les jetons `font-display` / `font-sans`
  pointent tous deux vers Nunito ; les tailles `h-xl-m` / `h-lg-m` couvrent les titres mobiles.
- **Logo** : `UV.logo(classes)` reproduit le logotype (bas de casse, drapeau tricolore sur le
  « t ») dans l'en-tête, le tiroir mobile et le pied de page. Le favicon reprend le même motif.
  Sous 640 px, l'en-tête affiche le **sigle « UV »**, drapeau hissé sur le V
  (`UV.logo(classes, href, true)`) : le logotype complet ne laissait pas la place aux commandes
  (bascule jour/nuit, crédits, inscription, menu) et débordait déjà à 360 px.
- Couleurs, rayons, ombres et statuts restent ceux de `DESIGN.md` (marine, or champagne, glace).

### Thème clair / nuit

**Sans choix du visiteur, le site suit son système** (`prefers-color-scheme`), y compris
en direct quand le système bascule le soir. Le bouton de l'en-tête enregistre un choix
explicite (`clair` ou `nuit`) en `localStorage` sous `unevoyante.theme`, qui l'emporte
ensuite toujours. La même règle est appliquée par le court script placé dans le `<head>` de
chaque page, avant le premier rendu (donc sans flash blanc), puis par `themeCourant()` dans
`app.js`. Une **icône unique** dans l'en-tête — lune
le jour, soleil la nuit — bascule d'un thème à l'autre, identique sur mobile et sur desktop ;
elle annonce la destination, pas l'état courant.

La bascule ne passe **par aucune classe `dark:` dans les pages**. Toutes les couleurs de la
charte sont des variables CSS en canaux RVB (`--uv-ink`, `--uv-surface`, `--uv-gold`…),
définies pour `:root` et redéfinies pour `.dark` dans `src/css/jetons.css` ; `tailwind.config.js`
les branche sous la forme `rgb(var(--uv-…) / <alpha-value>)`, si bien que `text-navy/70` ou
`bg-ice/60` suivent le thème sans être touchés. Trois points méritent l'attention :

- Certaines couleurs jouent **deux rôles** : `navy` est l'encre ET le fond du chrome, `royal`
  la couleur des liens ET le fond des bulles. D'où les sections `textColor` / `backgroundColor`
  distinctes dans la config — elles ne sont pas redondantes avec `colors`.
- Une carte, un champ ou un panneau s'écrit **`bg-surface`** (blanc le jour, marine la nuit),
  le fond de page **`bg-ground`**. **`bg-white` reste blanc dans les deux thèmes** : il est
  réservé au verre posé sur le chrome (`bg-white/10`…) et aux plaques des marques de paiement
  (`data-uv-blanc`, dont les encres sont des couleurs de marque). Un `bg-white` opaque sur une
  carte serait donc une fuite de lumière en nuit — l'audit ci-dessous la signale.
- L'or reste l'or la nuit : sur les fonds dorés, l'encre revient à `--uv-ink-fixe`, le marine
  de la charte, seule couleur jamais redéfinie sous `.dark`.

**Contrôle** : `http://localhost:5173/scripts/audit-theme.html` recharge les pages dans les
deux thèmes — plus les modales ouvertes (`modales.html?ouvrir=…`) et la page Crédits avec
l'offre appliquée — et relève les fonds clairs restés clairs en mode nuit ainsi que les
contrastes sous le seuil AA. Référence au passage à `bg-surface` : 38 combinaisons,
0 fuite, 0 contraste insuffisant en nuit (5 icônes décoratives dorées ou vertes sous le seuil
en clair, choix de charte).

### iPhone : hauteur visible, clavier, encoche

Safari iOS ne se comporte comme aucun autre navigateur sur trois points, et la vue tchat —
seule vue calée sur la hauteur de l'écran — les cumulait.

- **`100vh` désigne le viewport « large »**, barres d'outils masquées : la page est toujours
  plus haute que la zone visible, d'où une bande de fond sous le contenu et un débord de
  défilement qui décale les blocs. Les pages utilisent donc `100dvh` (`body.min-h-screen`).
- **Le clavier ne redimensionne pas la page** : Safari rétrécit le *visual viewport* et fait
  glisser le document derrière, sans rien dire au CSS. `viewportReel()` dans `app.js` mesure
  cette zone et publie `--uv-vh` (hauteur visible), `--uv-vv-top` (décalage imposé) et
  `--uv-kb` (hauteur du clavier), plus la classe `uv-clavier` sur `<html>`. La vue tchat se
  calcule sur `--uv-vh` ; clavier ouvert, la barre d'onglets s'efface et l'en-tête se recolle
  au haut de la zone visible.
- **Un champ sous 16 px déclenche un zoom** à la prise de focus, qui décroche les éléments
  fixes et ne revient pas seul. Les champs passent à 16 px sur pointeur grossier
  (`@media (pointer: coarse)`), sans changer le rendu desktop.

S'y ajoutent : espace réservé sous la barre d'onglets incluant l'encoche (`--tabbar-total`,
et non `--tabbar-h`), écartement de l'encoche en paysage, `overscroll-behavior: contain` sur
les listes défilantes, suppression du voile gris au toucher et du délai de double-tap,
`interactive-widget=resizes-content` dans le `<meta viewport>`, et pas de focus automatique
sur la zone de saisie en mobile.

L'en-tête, le pied de page et la barre d'onglets mobile sont des **Web Components**
(`<uv-header>`, `<uv-footer>`, `<uv-tabbar>`) définis une seule fois dans `app.js` :
un seul endroit à modifier pour toutes les pages.

L'état (crédits, compte, conversations, favoris) est conservé en `localStorage` sous la
clé `unevoyante.state.v2`. Il se réinitialise depuis **Mon compte → Confidentialité** :
3 crédits et la conversation de démonstration avec Léa (5 messages échangés, définis dans
`DEMO_TCHAT` de `data.js`).

## Navigation ouverte, sans blocage

C'est la contrainte structurante du projet :

- **Aucun lien mort** : les 39 liens internes résolvent vers une page existante.
- **Aucune connexion obligatoire** : tchat, catalogue, fiches et compte sont consultables
  en visiteur. `connexion.html` et `inscription.html` proposent explicitement de continuer
  sans compte, et renvoient sur la page d'origine via `?next=`.
- **Solde à zéro non bloquant** : l'encart de recharge apparaît comme dans la maquette
  `tchat_0_cr_dit`, mais l'en-tête, le pied de page, la barre d'onglets et tous les liens
  restent actifs, avec des sorties explicites vers le catalogue et l'accueil.
- **Aucune modale captive** : le tiroir mobile, le bandeau cookies et les modales se ferment
  au clic extérieur et à `Échap` ; une modale rend en plus le focus là où il était.
- **Retour toujours possible** : fil d'Ariane sur les pages de second niveau, bouton retour
  sur les vues mobiles, bouton « haut de page » sur les pages longues.
- Les filtres du catalogue s'inscrivent dans l'URL : liens partageables et retour arrière
  fonctionnel.

## Modales

Toutes les modales passent par le socle `UV.modale()` de `assets/js/modales.js` : `<dialog>`
natif ouvert par `showModal()` (focus contenu, arrière-plan inerte), **feuille collée en bas**
sur mobile, **carte centrée** dès 640 px et sur téléphone en paysage. Le focus va au panneau et
jamais au bouton principal, pour qu'une touche Entrée tapée dans la foulée ne déclenche rien.
Styles dans `src/css/composants/modales.css`, thème nuit dans `src/css/theme-nuit.css`. Chaque modale est
consultable depuis `modales.html`.

### Promo clients VERT

- **Déclenchement** : à l'ouverture du tchat, 600 ms après l'affichage, **une fois par session**
  (`sessionStorage`, clé `unevoyante.offre.vert`), et jamais dans un onglet en arrière-plan :
  le décompte attend que la page soit visible.
- **Compte à rebours réel** de 15 s, calé sur une échéance (aucune dérive) : texte, jauge
  dorée, puis passage en « urgent » sur les 5 dernières secondes. À zéro, l'offre expire pour
  de bon et la modale propose les packs habituels — pas d'impasse, pas de fausse urgence qui
  se réinitialiserait au rechargement.
- **« Je récupère mes 15 crédits »** réserve l'offre, propose l'upsell (voir plus bas), puis mène
  au paiement, l'offre présélectionnée : `credits.html?offre=vert&retour=<praticien>`. Aucun
  débit sans moyen de paiement ni CGV.
  Sur la page Crédits, l'offre apparaît en tête des packs (« Réservée pour vous »), n'est
  jamais mémorisée comme pack préféré et ne s'achète qu'une fois : elle est retirée de
  l'adresse après paiement.
- **Contenu** dans `UV_DATA.OFFRES.vert` (crédits, prix, bonus, durée). Le segment VERT sera
  attribué par le back-office ; la maquette présente l'offre à tous les visiteurs.

### Liste des forfaits

- **Déclenchement** : la pastille crédits de l'en-tête, sur toutes les pages (icône et solde
  sur mobile, « 3 crédits » dès 640 px). C'est un lien vers `credits.html` que `app.js`
  intercepte pour ouvrir la modale : sans `modales.js`, ou en « ouvrir dans un nouvel onglet »,
  il mène simplement à la page Crédits.
- **Contenu** : le solde (« Il vous reste 2 crédits », ton d'alerte à zéro), puis les 4 packs de
  `UV_DATA.PACKS` hors offre d'essai — nom, bonus, crédits, coût par message **calculé**
  (prix ÷ crédits, jamais saisi) et prix.
- **Direction visuelle** : l'or est la matière des crédits. Jeton d'or portant le solde sous une
  lueur champagne et un fragment de la constellation du site ; une pièce d'or par pack, frappée
  de son bonus (chiffre en vedette, « + » et « % » en exposant, mention « offerts », grènetis),
  sur un bloc au gris doux de la charte ; pack `populaire` sur fond champagne, liseré en dégradé
  or, halo et éclat qui traverse sa pièce toutes les 4 s (sauf mouvement réduit). Tout le
  reste reste sobre (surface, encre marine) pour que l'or porte seul l'envie. Les lignes entrent
  en cascade (sauf mouvement réduit). En nuit, les pièces gardent leur encre marine, la lueur
  est plus retenue et la constellation plus présente.
- **Choix d'un pack** : chaque ligne propose l'upsell, puis mène au paiement, pack présélectionné :
  `credits.html?pack=<id>`, plus `&retour=<praticien>` depuis le tchat. La page Crédits mémorise
  le pack, le retire de l'adresse, le confirme et descend jusqu'au bouton « Payer ». La page
  Tarifs utilise les mêmes liens (sans upsell).
- **Grille tarifaire unique** (modale, Crédits, Tarifs) : Prévision 6 crédits 9,99 € (+20 %),
  Évidence 15 crédits 19,99 € (+50 %), Certitude 25 crédits 29,99 € (+67 %, populaire),
  Résolution 55 crédits 49,99 € (+120 %), plus l'offre d'essai (2 crédits, 4,99 €). Le bonus est
  calculé sur le tarif de base d'environ 2 € le crédit.
- **Même vocabulaire partout** : la pièce d'or est un composant partagé, `UV.piece(bonus, eclat)`
  (`app.js`), utilisé par la modale, les cartes de la page Crédits (packs et offre spéciale) et
  celles de la page Tarifs ; `.carte-or` (`src/css/composants/forfaits.css`) habille le pack mis en avant. Sur Tarifs,
  les 4 packs occupent la grille — nom en capitales dorées, volume en vedette, pièce du bonus,
  accroche « Jusqu'à +120 % de crédits offerts » calculée sur la grille, entrée en cascade — et
  l'offre d'essai, moins avantageuse, passe en lien discret sous la grille, comme sur Crédits.

### Upsell — offre complémentaire

Quand le client valide une offre promo ou un pack **depuis une modale**, la modale d'origine
cède la place à l'upsell (`UV.modales.upsell`) : **+20 crédits pour 16,99 €, en plus** de l'achat
en cours (rappelé en tête : « En plus de votre Pack Certitude »).

| Action | Effet |
| --- | --- |
| **Accepter** | Paiement de l'achat initial **et** du complément : `…&complement=plus20` |
| **Non merci, continuer sans mon cadeau** | Paiement de l'achat initial seul |
| Croix, `Échap`, clic sur le voile | Retour à la modale d'origine, sans navigation ; la promo y revient « réservée », sans nouveau décompte |

Sur la page Crédits, le complément s'affiche sous le pack dans le récapitulatif (crédits, prix,
TVA et total recalculés). Il suit tout changement de pack (« compatible tous packs »), **se retire
d'un clic** et ne s'achète qu'une fois : il quitte l'adresse au paiement. Contenu dans
`UV_DATA.COMPLEMENTS.plus20`. Les achats lancés directement depuis les pages Crédits et Tarifs
ne déclenchent pas l'upsell.

### Paliers de fidélité

- **Déclenchement** : la barre de progression du pied du tchat, sous la zone de saisie
  (« Plus que 5 messages avant +3 crédits offerts », les crédits restants étant convertis en
  messages au tarif du praticien courant). Elle s'efface quand le clavier est ouvert, où la
  hauteur revient à la saisie.
- **Grille** : 10 crédits consommés → +1 crédit offert, 30 → +3, 60 → +5, 100 → +7, 150 → +10,
  puis **+10 tous les 50 crédits consommés**, sans fin. Les paliers se lisent sur les crédits
  **consommés**, cumulés depuis toujours : le compteur n'est jamais remis à zéro, et la barre ne
  montre que la progression **dans le palier en cours**.
- **Versement automatique** : `Store.consommer(n)` (`app.js`) débite le message, détecte le
  palier franchi et crédite la récompense en une seule écriture — rien à réclamer. Le tchat
  annonce le palier (jauge pleine, libellé « Palier atteint · +3 crédits offerts », notification
  dorée) pendant 2,2 s, puis l'affichage se recale sur le palier suivant. Aucune modale ni
  confettis : la récompense se constate, elle n'interrompt pas la consultation.
- **Contenu** dans `UV_DATA.PALIERS` et `UV_DATA.PALIER_RECURRENT` ; toute la lecture (palier
  visé, restant, progression, libellés) passe par `UV.fidelite` (`app.js`), partagé par le tchat
  et la modale.
- **Modale « Vos paliers de fidélité »** : les cinq paliers listés, chacun avec son état — acquis
  (pastille verte, badge « Obtenu »), palier visé (liseré doré des packs mis en avant, « Plus que
  5 »), à venir — puis la règle récurrente en dernière ligne. La pièce d'or des forfaits est
  reprise telle quelle, frappée des crédits offerts : la fidélité est de la même matière que les
  crédits. Pas de bouton d'achat.

## Compléments apportés aux maquettes

Les maquettes couvraient 6 vues ; les manques suivants ont été comblés pour que le parcours
tienne debout :

- **Catalogue de 24 praticiens** avec recherche, 14 filtres, 5 tris et orientation par
  mots-clés — les maquettes n'en montraient que 6 sans page de destination.
- **Fiche praticien pilotée par les données** : les 24 profils fonctionnent, avec bio,
  spécialités, horaires de la semaine, avis et praticiens similaires.
- **Tchat réellement fonctionnel** : débit des crédits à l'envoi, indicateur de saisie,
  réponses propres à chaque praticien, thèmes pré-remplissant la saisie, liste des
  conversations avec recherche et non-lus.
- **Tarifs différenciés** : certains praticiens facturent 2 ou 3 crédits par message,
  répercuté partout (fiche, tchat, simulateur).
- **Simulateur de budget** sur la page Tarifs.
- **Espace compte** : solde, historique, favoris, achats, préférences, export RGPD.
- Confort : préchargement des liens au survol, transitions de page (View Transitions),
  révélation au défilement, notifications, lien d'évitement, focus clavier visible,
  respect de `prefers-reduced-motion`.

## Performance et référencement

### Polices hébergées localement

Nunito et Material Symbols sont servies depuis `assets/fonts/` et **préchargées** dans le
`<head>` de chaque page : plus aucune requête vers Google (ni connexion tierce à ouvrir avant
le premier rendu, ni adresse IP de visiteur transmise hors du site).

La police d'icônes était la version complète, tous axes variables : **4 Mo** téléchargés à
chaque première visite, et icônes invisibles jusqu'à 3 s (`display=block`). Elle est désormais
réduite aux icônes réellement employées et à ses seuls axes utiles (opsz 24, wght 400, GRAD 0,
FILL 0/1) : **≈ 22 Ko**. Poids d'une première visite : environ 4 Mo → 50 à 240 Ko selon la page.

⚠️ **Après l'ajout d'une icône**, relancer `npm run polices`, sans quoi son nom s'afficherait
en toutes lettres. `npm run polices -- --verifier` le signale. Les icônes tirées des données
(`data.js`) sont détectées comme les autres.

### Indexation

| Élément | Où |
| --- | --- |
| Adresse canonique, Open Graph, carte Twitter | `<head>` de chaque page indexable. Domaine supposé : `https://unevoyante.fr/` |
| Fiche praticien | Page pré-générée `voyant-<id>.html` (dans `dist/`), canonique vers elle-même ; titre, description et Open Graph propres au praticien |
| Contenu lisible sans JavaScript | Pages indexables de `dist/` : de 5 à 14 fois plus de texte que la version de développement (ex. fiche : 69 → 871 mots) |
| `noindex` | `compte`, `connexion`, `tchat`, `credits`, `info`, `modales`, `404`. Ces pages ne sont **pas** bloquées dans `robots.txt`, sinon les robots ne liraient pas le `noindex` |
| Données structurées | `Organization` + `WebSite` (avec recherche) sur l'accueil, `FAQPage` sur la FAQ (générée depuis `UV_DATA.FAQ`) |
| Visuel de partage | `assets/img/og-image.jpg` (1200 × 630) |
| Icônes d'application | `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`, `icon-maskable-512.png` (dérivées du favicon) |

`sitemap.xml` est à régénérer (`npm run sitemap`) quand une page ou un praticien est ajouté.

## Limites connues

- Données et paiement **simulés** : aucun appel réseau, aucune donnée transmise.
  La page de paiement et le formulaire de contact l'indiquent explicitement à l'utilisateur.
- Les pages secondaires (mentions légales, CGV, confidentialité, charte, cookies,
  journal, partenaire) redirigent vers `info.html`, qui annonce le périmètre V1 et propose
  la suite de la navigation. Contenus à rédiger lors d'une prochaine itération.
- Pages pré-rendues avec l'état par défaut (visiteur, 3 crédits) : un visiteur qui revient
  voit ses propres valeurs (solde, favoris) remplacer celles-ci dès l'exécution des scripts.
- Les filtres du catalogue (`voyants.html?specialite=…`) ne sont pas pré-rendus : seule la
  liste complète l'est, ce qui suffit pour que chaque fiche soit découverte.
