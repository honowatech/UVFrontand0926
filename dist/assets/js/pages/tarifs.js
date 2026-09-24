/* tarifs.html — script de la page (chargé après data.js, app.js et modales.js). */
(function () {
  'use strict';
  const D = UV_DATA, { el, els, icone, euro, accordeon, filAriane } = UV;

  el('#ariane').innerHTML = filAriane([['Accueil', 'index.html'], ['Tarifs']]);

  // La règle de prix ouvre en marine ; les deux garanties suivent en teintes de la charte.
  el('#principes').innerHTML = [
    ['sell', 'tint-nuit', '1 crédit = 1 message', 'Seuls vos messages sont facturés. Les réponses du praticien sont gratuites, quelle que soit leur longueur.'],
    ['event_busy', 'tint-champagne', 'Aucune expiration', 'Vos crédits restent acquis indéfiniment. Aucun abonnement, aucun prélèvement automatique.'],
    ['savings', 'tint-sauge', 'Satisfait ou remboursé', 'Les crédits non utilisés sont remboursables sous 14 jours, sans justification.'],
  ].map(([ic, ton, titre, texte]) => {
    const nuit = ton === 'tint-nuit';
    return `
    <div class="card-tint ${ton} p-5 sm:p-6">
      ${icone(ic, 'tint-mark')}
      <div class="relative">
        <span class="tint-chip mb-4 h-12 w-12">${icone(ic, 'text-[24px]')}</span>
        <h2 class="mb-1 text-label-lg ${nuit ? 'text-white' : 'text-navy'}">${titre}</h2>
        <p class="text-body-sm leading-relaxed ${nuit ? 'text-white/75' : 'text-muted'}">${texte}</p>
      </div>
    </div>`;
  }).join('');

  /* --- Packs ---------------------------------------------------------------- */
  const bonusMax = Math.max(...D.PACKS.map((p) => p.bonus || 0));
  el('#packs-accroche').innerHTML = `${icone('stars', 'text-[18px]')} Jusqu’à +${bonusMax}&nbsp;% de crédits offerts`;

  // Cartes au vocabulaire de la modale des forfaits ; entrée en cascade au défilement.
  const ESSAI = D.PACKS.find((p) => p.essai);
  el('#essai').innerHTML = `<a href="credits.html?pack=${ESSAI.id}" class="btn-link">
    ${ESSAI.nom} · ${ESSAI.credits} crédits pour ${euro(ESSAI.prix)} ${icone('chevron_right', 'text-[16px]')}</a>`;

  el('#packs').innerHTML = D.PACKS.filter((p) => !p.essai).map((p, i) => `
    <div class="relative pt-3" data-reveal style="animation-delay: ${i * 70}ms">
      ${p.badge ? `<span class="absolute left-1/2 top-0 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-gold-cta px-3 py-1 text-label-sm font-bold text-navy shadow-sm">${p.badge}</span>` : ''}
      <div class="pack-carte ${p.populaire ? 'carte-or' : ''}">
        <div class="flex items-center gap-4">
          <span class="forfait-piece forfait-piece-credits forfait-piece-xl${p.credits >= 100 ? ' forfait-piece-long' : ''}${p.populaire ? ' forfait-piece-eclat' : ''}" aria-hidden="true">
            <span class="forfait-piece-valeur">${p.credits}</span>
            <span class="forfait-piece-mention">crédits</span>
          </span>
          <p class="min-w-0 font-display text-h-md font-extrabold leading-tight text-navy lg:text-[19px] xl:text-h-md">${p.nom}</p>
        </div>
        <p class="sr-only">${p.credits} crédits${p.bonus ? `, ${p.bonus} % de crédits offerts` : ''}</p>
        <div class="mt-5 border-t border-line pt-4">
          <p class="font-display text-h-md font-extrabold text-navy">${euro(p.prix)}</p>
          <p class="text-body-sm text-muted">soit ${euro(p.prix / p.credits)} / message</p>
          ${p.bonus ? `<p class="forfait-offert" aria-hidden="true">+${p.bonus}&nbsp;% offerts</p>` : ''}
        </div>
        <div class="mt-auto pt-5">
          <a href="credits.html?pack=${p.id}" class="${p.populaire ? 'btn-gold' : 'btn-ghost'} w-full">Choisir</a>
        </div>
      </div>
    </div>`).join('');

  /* --- Simulateur ------------------------------------------------------------ */
  let cout = 1;
  const curseur = el('#questions');

  function calculer() {
    const q = +curseur.value;
    const besoin = q * cout;
    el('#questions-valeur').textContent = q;
    el('#res-credits').textContent = besoin;

    // Plus petit pack couvrant le besoin, sinon le plus grand
    const tries = D.PACKS.slice().sort((a, b) => a.credits - b.credits);
    const pack = tries.find((p) => p.credits >= besoin) || tries[tries.length - 1];

    el('#res-pack').textContent = pack.nom;
    el('#res-prix').textContent = euro(pack.prix);
    el('#res-unite').textContent = euro(pack.prix / pack.credits * cout);

    // Le pack conseillé n'est mémorisé qu'en arrivant sur la page Crédits
    el('#choisir-pack').href = `credits.html?pack=${pack.id}`;
  }

  curseur.addEventListener('input', calculer);
  els('[data-cout]').forEach((b) => b.addEventListener('click', () => {
    cout = +b.dataset.cout;
    els('[data-cout]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    calculer();
  }));
  calculer();

  /* --- FAQ ------------------------------------------------------------------- */
  el('#faq').innerHTML = accordeon(D.FAQ.filter((f) => f.cat === 'Crédits'));
})();
