/* info.html — script de la page (chargé après data.js, app.js et modales.js). */
(function () {
  'use strict';
  const { el, icone, filAriane } = UV;

  /* Chaque sujet reste une destination réelle, jamais un lien mort. */
  const SUJETS = {
    'mentions-legales': ['Légal', 'Mentions légales',
      'Éditeur, hébergeur, directeur de publication et coordonnées de la société exploitant unevoyante.fr.',
      ['Identité de l’éditeur et numéro RCS', 'Coordonnées de l’hébergeur', 'Directeur de la publication', 'Propriété intellectuelle des contenus', 'Médiateur de la consommation']],
    'cgv': ['Légal', 'Conditions générales de vente',
      'Règles d’achat et d’utilisation des crédits, droit de rétractation et conditions de remboursement.',
      ['Objet et champ d’application', 'Achat et validité des crédits', 'Absence d’abonnement et de reconduction', 'Droit de rétractation de 14 jours', 'Réclamations et remboursements']],
    'confidentialite': ['Légal', 'Politique de confidentialité',
      'Données collectées, finalités, durées de conservation et exercice de vos droits RGPD.',
      ['Données collectées et finalités', 'Base légale des traitements', 'Durées de conservation', 'Vos droits : accès, rectification, effacement', 'Contact du délégué à la protection des données']],
    'charte': ['Éthique', 'Charte déontologique',
      'Les engagements que chaque praticien signe avant d’être référencé sur la plateforme.',
      ['Interdiction du diagnostic médical et psychologique', 'Interdiction des pronostics de jeux d’argent', 'Absence de pression et de relance commerciale', 'Refus des consultations de mineurs', 'Procédure de signalement et de suspension']],
    'cookies': ['Légal', 'Gestion des cookies',
      'Cookies strictement nécessaires, mesure d’audience facultative et modification de vos choix.',
      ['Cookies nécessaires au fonctionnement', 'Mesure d’audience anonyme, désactivée par défaut', 'Absence de cookies publicitaires', 'Modifier vos préférences à tout moment']],
    'journal': ['Éditorial', 'Journal ésotérique',
      'Articles de fond sur le tarot, l’astrologie, la numérologie et la pratique de la guidance.',
      ['Comprendre les arcanes du Tarot de Marseille', 'Ce que les nœuds lunaires racontent', 'Numérologie : lire ses cycles personnels', 'Reconnaître une pratique éthique']],
    'partenaire': ['Recrutement', 'Devenir praticien partenaire',
      'Processus de candidature, consultation test anonyme et conditions de rémunération.',
      ['Critères de sélection', 'Déroulé de la consultation test', 'Signature de la charte déontologique', 'Rémunération et rythme de versement']],
  };

  const cle = UV.param('sujet');
  const s = SUJETS[cle] || ['Information', 'Page introuvable',
    'Cette adresse ne correspond à aucune page de la maquette. Voici par où continuer.',
    []];

  document.title = `${s[1]} | unevoyante.fr`;
  el('#categorie').textContent = s[0];
  el('#titre').textContent = s[1];
  el('#chapeau').textContent = s[2];
  el('#ariane').innerHTML = filAriane([['Accueil', 'index.html'], [s[1]]]);

  el('#apercu').innerHTML = s[3].length
    ? `<h2>Ce que cette page contiendra</h2><ul>${s[3].map((p) => `<li>${p}</li>`).join('')}</ul>`
    : '';

  el('#parcours').innerHTML = [
    ['index.html', 'home', 'Accueil', 'Le parcours complet depuis la page d’accueil'],
    ['voyants.html', 'person_search', 'Catalogue', 'Les 24 praticiens, filtres et recherche actifs'],
    ['tchat.html', 'forum', 'Tchat', 'Conversation réelle, débit de crédits inclus'],
    ['credits.html', 'monetization_on', 'Crédits', 'Packs, paiement simulé et rechargement'],
  ].map((p) => `
    <a href="${p[0]}" class="flex items-center gap-3 rounded-md border border-line bg-surface p-4 transition-colors hover:bg-ice">
      ${icone(p[1], 'text-[24px] text-royal shrink-0')}
      <span><strong class="block text-label-md text-navy">${p[2]}</strong>
        <span class="text-body-sm text-muted">${p[3]}</span></span>
    </a>`).join('');

  el('#autres').innerHTML = Object.entries(SUJETS)
    .filter(([k]) => k !== cle)
    .map(([k, v]) => `
      <a href="info.html?sujet=${k}" class="flex items-center justify-between gap-2 rounded px-3 py-2.5 text-label-md text-navy transition-colors hover:bg-ice">
        ${v[1]} ${icone('chevron_right', 'text-[18px] text-muted')}
      </a>`).join('');
})();
