/* modales.html — script de la page (chargé après data.js, app.js et modales.js). */
(function () {
  'use strict';
  const { el, els, icone, toast, filAriane } = UV;

  el('#ariane').innerHTML = filAriane([['Accueil', 'index.html'], ['Modales']]);

  /* Une entrée par modale. `ouvrir` reste vide tant que la modale n'est pas conçue ;
     `declencheur` indique où elle apparaît d'elle-même sur le site. */
  const MODALES = [
    {
      id: 'forfaits', label: 'Liste des forfaits',
      declencheur: 'Pastille crédits de l’en-tête · toutes les pages',
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

  // Lien direct vers une modale : modales.html?ouvrir=promo-vert
  const directe = MODALES.find((m) => m.id === UV.param('ouvrir'));
  if (directe && directe.ouvrir) directe.ouvrir();
})();
