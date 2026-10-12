/* modales.html — script de la page (chargé après data.js, app.js et modales.js). */
(function () {
  'use strict';
  const { el, els, icone, toast, filAriane, Store } = UV;

  el('#ariane').innerHTML = filAriane([['Accueil', 'index.html'], ['Modales']]);

  /* Une entrée par modale. `ouvrir` reste vide tant que la modale n'est pas conçue ;
     `declencheur` indique où elle apparaît d'elle-même sur le site. */
  const MODALES = [
    {
      id: 'forfaits', label: 'Liste des forfaits',
      declencheur: 'Pastille crédits de l’en-tête · toutes les pages (sauf nouvel inscrit : l’offre de bienvenue)',
      ouvrir: () => UV.modales.forfaits.ouvrir(),
    },
    {
      id: 'promo-vert', label: 'Promo pour les clients VERT',
      declencheur: 'Ouverture du tchat · une fois par session',
      ouvrir: () => UV.modales.promoVert.ouvrir(),
    },
    {
      id: 'fidelite', label: 'Paliers de fidélité',
      declencheur: 'Barre de progression · pied du tchat',
      ouvrir: () => UV.modales.fidelite.ouvrir(),
    },
    {
      id: 'promo-credits-num-adresse', label: 'Promo pour crédits vs Num + Adresse',
      declencheur: 'Offre du jour · déclenchement à définir',
      ouvrir: () => UV.modales.promoMobile.ouvrir(),
    },
    {
      id: 'confirmation', label: 'Confirmation · type réutilisable',
      declencheur: 'Après une action réussie · ex. cadeau de l’offre du jour',
      ouvrir: () => UV.confirmation({
        surtitre: 'Cadeau récupéré',
        titre: '3\u00A0crédits ajoutés à votre solde',
        message: 'Ils sont disponibles tout de suite, pour la consultation de votre choix.',
        recu: [['Numéro vérifié', '06\u00A012\u00A034\u00A056\u00A078'], ['Nouveau solde', '6\u00A0crédits']],
      }),
    },
    {
      id: 'upsell', label: 'Upsell · +20 crédits en plus',
      declencheur: 'Validation d’une offre promo ou d’un pack depuis une modale',
      // Exemple : proposé en plus du Pack Certitude
      ouvrir: () => UV.modales.upsell.ouvrir({ achat: { libelle: 'votre Pack Certitude', lien: 'credits.html?pack=certitude' } }),
    },
    {
      id: 'suppression-compte', label: 'Suppression du compte',
      declencheur: 'Mon compte · onglet Confidentialité (aperçu sans effet ici)',
      ouvrir: () => UV.modales.suppressionCompte.ouvrir({ apercu: true }),
    },
  ];

  el('#modales').innerHTML = MODALES.map((m) => `
    <div>
      <button type="button" data-modale="${m.id}" class="btn-ghost w-full justify-between whitespace-normal py-3 text-left"
              aria-describedby="modale-${m.id}-info">
        ${m.label} ${icone('open_in_new', 'text-[20px] shrink-0')}
      </button>
      <p id="modale-${m.id}-info" class="mt-2 flex items-center gap-1.5 px-5 text-body-sm text-muted">
        ${m.ouvrir
          ? `${icone('bolt', 'text-[16px] text-gold')} ${m.declencheur}`
          : `${icone('construction', 'text-[16px]')} À concevoir`}
      </p>
    </div>`).join('');

  els('[data-modale]').forEach((b) => b.addEventListener('click', () => {
    const m = MODALES.find((x) => x.id === b.dataset.modale);
    if (m.ouvrir) return m.ouvrir();
    toast(`« ${m.label} » : modale pas encore conçue.`, { icone: 'construction' });
  }));

  /* --- Pages promo -------------------------------------------------------------
     La page générique (la promotion qui court, sinon la prochaine), la vue de
     confirmation d'achat qui la suit, puis le lien de chaque campagne, avec
     son état et sa période : une campagne ajoutée dans data.js apparaît ici
     d'elle-même. */
  const ETATS = {
    active: ['timer', 'text-online', 'En cours'],
    avenir: ['schedule', 'text-royal', 'À venir'],
    terminee: ['timer_off', 'text-muted', 'Terminée'],
  };
  const jour = (iso) => new Date(iso).toLocaleDateString('fr-FR',
    { timeZone: 'Europe/Paris', day: 'numeric', month: 'short', year: 'numeric' });
  const code = (texte) => `<code class="rounded bg-ice px-1.5 py-0.5 font-semibold text-navy">${texte}</code>`;

  const lienPromo = (id, href, libelle, infos) => `
    <div>
      <a href="${href}" class="btn-ghost w-full justify-between whitespace-normal py-3 text-left" aria-describedby="${id}-info">
        ${libelle} ${icone('arrow_forward', 'text-[20px] shrink-0')}
      </a>
      <div id="${id}-info" class="mt-2 flex flex-col gap-1.5 px-5 text-body-sm text-muted">${infos}</div>
    </div>`;

  /** Confirmation d'achat, avec le dernier pack de la campagne affichée. */
  function confirmation() {
    const p = UV.promos.trouver() || UV_DATA.PROMOS[0];
    const pack = p ? Object.keys(p.bonus).pop() : 'certitude';
    const href = `paiement.html?pack=${pack}${p ? `&promo=${encodeURIComponent(p.id)}` : ''}`;
    return lienPromo('paiement', href, 'Confirmation d’achat', `
      <p class="flex items-center gap-1.5">${icone('credit_card', 'text-[16px] text-gold')} Après le clic sur un pack de la page promo</p>
      <p>${code(href)}</p>`);
  }

  el('#promos').innerHTML = [
    lienPromo('promo', 'promo.html', 'Page promo', `
      <p class="flex items-center gap-1.5">${icone('sell', 'text-[16px] text-gold')} Promotion en cours, sinon la prochaine annoncée</p>
      <p>${code('promo.html')} · ${code('/promo')} en ligne</p>`),
    confirmation(),
    // Page d'atterrissage : servie à l'adresse courte /landing (src/dist.htaccess)
    lienPromo('landing', 'landing.html', 'Page landing', `
      <p class="flex items-center gap-1.5">${icone('waving_hand', 'text-[16px] text-gold')} Inscription en deux étapes · 3 questions offertes</p>
      <p>${code('landing.html')} · ${code('/landing')} en ligne</p>`),
    // Offre de bienvenue : le premier forfait d'un nouvel inscrit, à la place
    // de la liste des forfaits (pastille crédits), sans upsell.
    lienPromo('bienvenue', 'bienvenue.html', 'Offre de bienvenue', `
      <p class="flex items-center gap-1.5">${icone('redeem', 'text-[16px] text-gold')} Pastille crédits · nouvel inscrit, jusqu’à son premier forfait</p>
      <p>${code('bienvenue.html')} · ${code('bienvenue.html?retour=claire')} depuis le tchat</p>
      <p id="bienvenue-simulation" class="flex flex-wrap items-center gap-x-3 gap-y-1"></p>`),
    ...UV_DATA.PROMOS.map((p) => {
      const [nom, ton, etat] = ETATS[UV.promos.etat(p)];
      return lienPromo(`promo-${p.id}`, `promo.html?id=${encodeURIComponent(p.id)}`, `Campagne · ${p.id}`, `
        <p class="flex items-center gap-1.5">${icone(nom, `text-[16px] ${ton}`)} ${etat} · du ${jour(p.debut)} au ${jour(p.fin)}</p>
        <p>${code(`promo.html?id=${p.id}`)}</p>`);
    }),
  ].join('');

  /* Simulation du parcours « nouvel inscrit » : l'état qui suit la création d'un
     compte (inscription.html, landing), où la pastille crédits mène à l'offre
     de bienvenue ; le premier forfait pris, la liste des forfaits revient. */
  function rendreSimulation() {
    const zone = el('#bienvenue-simulation');
    if (!zone) return;
    const nouveau = Store.nouveauClient;
    zone.innerHTML = nouveau
      ? `<span class="flex items-center gap-1.5">${icone('check_circle', 'text-[16px] text-online')} Nouvel inscrit : la pastille crédits mène ici</span>
         <button type="button" class="btn-link" data-simulation="fin">Marquer le premier forfait pris</button>`
      : `<button type="button" class="btn-link" data-simulation="debut">${icone('person', 'text-[16px]')} Simuler un nouvel inscrit</button>`;
  }
  rendreSimulation();
  document.addEventListener('uv:etat', rendreSimulation);
  el('#promos').addEventListener('click', (e) => {
    const b = e.target.closest('[data-simulation]');
    if (!b) return;
    if (b.dataset.simulation === 'debut') {
      Store.inscription(Store.compte || { prenom: 'Sophie', email: 'sophie@exemple.fr' });
      toast('Nouvel inscrit : la pastille crédits mène à l’offre de bienvenue.', { ton: 'or', icone: 'redeem' });
    } else {
      Store.premierForfaitPris();
      toast('Premier forfait pris : la liste des forfaits revient.', { icone: 'check_circle' });
    }
  });

  // Lien direct vers une modale : modales.html?ouvrir=promo-vert
  const directe = MODALES.find((m) => m.id === UV.param('ouvrir'));
  if (directe && directe.ouvrir) directe.ouvrir();
})();
