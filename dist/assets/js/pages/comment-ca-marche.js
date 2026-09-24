/* comment-ca-marche.html — script de la page (chargé après data.js, app.js et modales.js). */
(function () {
  'use strict';
  const D = UV_DATA, { el, icone, filAriane } = UV;

  el('#ariane').innerHTML = filAriane([['Accueil', 'index.html'], ['Comment ça marche']]);

  el('#etapes').innerHTML = D.ETAPES.map((e) => `
    <li class="card-pad p-8" data-reveal>
      <span class="mb-6 grid h-14 w-14 place-items-center rounded-full bg-gold-soft font-display text-h-md font-bold text-navy shadow-sm">${e.n}</span>
      <h2 class="mb-2 text-h-sm">${e.titre}</h2>
      <p class="text-body-md leading-relaxed text-muted">${e.texte}</p>
    </li>`).join('');

  const DETAIL = [
    ['person_search', 'Vous choisissez, personne ne choisit pour vous',
     'Aucune mise en relation automatique. Vous parcourez les 24 fiches, vous lisez les avis, vous comparez les tarifs et les créneaux. Un praticien hors ligne peut recevoir votre message : il y répondra à son retour.'],
    ['edit_note', 'Vous écrivez votre question à votre rythme',
     'Rien ne se déclenche pendant que vous rédigez. Vous pouvez relire, corriger, refermer la page et revenir plus tard : le brouillon reste dans la conversation et aucun crédit n’est engagé.'],
    ['monetization_on', 'Un crédit est débité au moment de l’envoi',
     'C’est le seul instant où votre solde bouge. Le montant est affiché juste à côté du bouton d’envoi, et le nouveau solde s’inscrit dans le fil de discussion pour que rien ne soit ambigu.'],
    ['mark_chat_read', 'La réponse arrive par écrit, en quelques minutes',
     'Le praticien répond dans le fil. Sa réponse n’est jamais facturée : vous ne payez que vos propres messages. Une réponse peut compter plusieurs paragraphes sans coût supplémentaire.'],
    ['history', 'L’historique vous appartient',
     'Toutes vos conversations restent accessibles depuis Mes tchats, sans limite de durée. Vous pouvez relire une prédiction six mois plus tard pour vérifier ce qui s’est réalisé.'],
    ['restart_alt', 'Vous reprenez quand vous voulez',
     'Pas de séance qui se ferme, pas de créneau à réserver. Une conversation reste ouverte indéfiniment : vous écrivez ce soir, vous relancez dans trois semaines si vous le souhaitez.'],
  ];

  el('#detail').innerHTML = DETAIL.map((d) => `
    <li class="relative" data-reveal>
      <span class="absolute -left-[41px] grid h-8 w-8 place-items-center rounded-full border-2 border-line bg-surface">
        ${icone(d[0], 'text-[18px] text-royal')}
      </span>
      <h3 class="mb-1.5 text-h-sm">${d[1]}</h3>
      <p class="max-w-2xl text-body-md leading-relaxed text-muted">${d[2]}</p>
    </li>`).join('');

  const INCLUS = [
    'Une réponse écrite, personnalisée et argumentée, quelle que soit sa longueur.',
    'La possibilité de relancer le praticien dans la même conversation.',
    'L’historique complet, consultable et relisible sans limite de durée.',
    'Le libre choix du praticien, changeable à tout moment sans frais.',
    'Un anonymat réel : le praticien ne connaît que le prénom que vous avez choisi.',
  ];
  const EXCLUS = [
    'Aucun diagnostic médical, psychologique ou psychiatrique.',
    'Aucun conseil financier réglementé, ni pronostic de jeux d’argent.',
    'Aucune promesse de résultat : la voyance reste un service de guidance.',
    'Aucune consultation pour les personnes mineures.',
    'Aucune relance commerciale ni revente de vos données.',
  ];

  el('#inclus').innerHTML = INCLUS.map((t) => `
    <li class="flex gap-2.5">${icone('check', 'text-[20px] shrink-0 text-online')}<span>${t}</span></li>`).join('');
  el('#exclus').innerHTML = EXCLUS.map((t) => `
    <li class="flex gap-2.5">${icone('remove', 'text-[20px] shrink-0 text-muted')}<span>${t}</span></li>`).join('');

  el('#reassurance').innerHTML = D.CONFIANCE.map((c) => `
    <div data-reveal>
      <span class="mb-5 grid h-12 w-12 place-items-center rounded-lg bg-white/10">${icone(c.icon, 'text-[26px] text-gold-300')}</span>
      <h2 class="mb-2 font-display text-h-sm text-white">${c.titre}</h2>
      <p class="text-body-md leading-relaxed text-white/70">${c.texte}</p>
    </div>`).join('');
})();
