/* index.html — script de la page (chargé après data.js, app.js et modales.js). */
(function () {
  'use strict';
  const D = UV_DATA, { el, els, icone, carteVoyant, accordeon, monogramme, echapper } = UV;

  /* --- Filtres + tri : entièrement fonctionnels, sans rechargement -------- */
  const FILTRES = [
    { id: 'tous', label: 'Tous' },
    { id: 'en-ligne', label: 'En ligne', dot: true },
    ...D.SPECIALITES.slice(0, 6).map((s) => ({ id: s.id, label: s.label })),
    { id: '1-credit', label: '1 crédit' },
  ];
  let filtreActif = 'tous';

  el('#filtres').innerHTML = FILTRES.map((f) => `
    <button type="button" class="chip" data-f="${f.id}" aria-pressed="${f.id === 'tous'}">
      ${f.dot ? '<span class="dot-online"></span>' : ''}${f.label}
    </button>`).join('');

  function selection() {
    let liste = D.VOYANTS.slice();
    if (filtreActif === 'en-ligne') liste = liste.filter((v) => v.statut === 'online');
    else if (filtreActif === '1-credit') liste = liste.filter((v) => v.credits === 1);
    else if (filtreActif !== 'tous') liste = liste.filter((v) => v.specialites.includes(filtreActif));

    const ordre = { online: 0, busy: 1, offline: 2 };
    const tri = el('#tri').value;
    liste.sort((a, b) => {
      if (tri === 'note') return b.note - a.note || b.avis - a.avis;
      if (tri === 'avis') return b.avis - a.avis;
      if (tri === 'prix') return a.credits - b.credits || b.note - a.note;
      return ordre[a.statut] - ordre[b.statut] || (b.top - a.top) || b.note - a.note;
    });
    return liste;
  }

  function rendre() {
    const liste = selection().slice(0, 6);
    el('#grille').innerHTML = liste.map((v) => carteVoyant(v, { classe: 'carte-agent' })).join('');
    el('#vide').classList.toggle('hidden', liste.length > 0);
    el('#grille').classList.toggle('hidden', liste.length === 0);
  }

  els('#filtres .chip').forEach((b) => b.addEventListener('click', () => {
    filtreActif = b.dataset.f;
    els('#filtres .chip').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    rendre();
  }));
  el('#tri').addEventListener('change', rendre);
  el('#reset-filtres').addEventListener('click', () => {
    filtreActif = 'tous';
    els('#filtres .chip').forEach((x) => x.setAttribute('aria-pressed', String(x.dataset.f === 'tous')));
    el('#tri').value = 'dispo';
    rendre();
  });

  el('#nb-en-ligne').textContent = D.VOYANTS.filter((v) => v.statut === 'online').length;
  rendre();

  /* --- Étapes ------------------------------------------------------------- */
  el('#etapes').innerHTML = D.ETAPES.map((e) => `
    <li class="card-pad flex flex-col" data-reveal>
      <span class="mb-5 grid h-12 w-12 place-items-center rounded-full bg-gold-soft font-display text-h-sm font-bold text-navy shadow-sm">${e.n}</span>
      <h3 class="mb-2 text-h-sm">${e.titre}</h3>
      <p class="text-body-md leading-relaxed text-muted">${e.texte}</p>
    </li>`).join('');

  /* --- Statistiques -------------------------------------------------------- */
  el('#stats').innerHTML = D.STATS.map((s) => `
    <div data-reveal>
      <dt class="text-gradient-gold font-display text-[28px] font-extrabold leading-tight tracking-tight lg:text-[36px]">${s.valeur}</dt>
      <dd class="mt-0.5 text-body-sm font-semibold text-white/75">${s.libelle}</dd>
    </div>`).join('');

  /* --- Confiance ----------------------------------------------------------- */
  el('#confiance').innerHTML = D.CONFIANCE.map((c) => `
    <article class="card-tint card-hover ${c.ton} flex flex-col items-start p-8" data-reveal>
      <span class="tint-chip mb-6 h-14 w-14">${icone(c.icon, 'text-[30px]')}</span>
      <h3 class="mb-2 text-h-sm">${c.titre}</h3>
      <p class="text-body-md leading-relaxed text-muted">${c.texte}</p>
    </article>`).join('');

  /* --- FAQ ----------------------------------------------------------------- */
  el('#faq').innerHTML = accordeon(D.FAQ.slice(0, 4));

  /* --- Reprise de conversation -------------------------------------------- */
  const convs = Object.entries(UV.Store.all.conversations)
    .filter(([, c]) => c.messages && c.messages.some((m) => m.de === 'moi'))
    .sort((a, b) => b[1].maj - a[1].maj)
    .slice(0, 6);

  if (convs.length) {
    el('#reprendre').classList.remove('hidden');
    el('#reprendre-liste').innerHTML = convs.map(([id, c]) => {
      const v = D.byId(id); if (!v) return '';
      const dernier = c.messages[c.messages.length - 1];
      return `<a href="tchat.html?voyant=${id}"
                 class="card flex w-[260px] shrink-0 items-center gap-3 p-3 transition-colors hover:bg-ice">
        ${monogramme(v, 'h-11 w-11 text-label-lg')}
        <span class="min-w-0">
          <span class="block truncate font-display text-label-lg font-semibold">${v.prenom}</span>
          <span class="block truncate text-body-sm text-muted">${echapper(dernier.texte)}</span>
        </span>
      </a>`;
    }).join('');
  }
})();
