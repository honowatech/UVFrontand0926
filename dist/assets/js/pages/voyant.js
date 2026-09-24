/* voyant.html — script de la page (chargé après data.js, app.js et modales.js). */
(function () {
  'use strict';
  const D = UV_DATA;
  const { el, els, icone, etoiles, monogramme, note, nombre, filAriane, carteVoyant, Store, toast, echapper, STATUTS } = UV;

  /* --- Résolution du praticien : jamais d'erreur, on retombe sur un profil - */
  // Page pré-générée (dist/voyant-<id>.html) : le praticien est inscrit dans
  // la page. Sinon voyant.html?id=…, puis le dernier profil consulté.
  const id = document.body.dataset.voyant || UV.param('id') || Store.all.dernierVoyant || 'claire';
  const v = D.byId(id) || D.VOYANTS[0];
  if (!D.byId(id)) {
    toast('Ce praticien n’existe plus : voici un profil équivalent.', { icone: 'info' });
  }
  Store.set({ dernierVoyant: v.id });
  document.title = `${v.prenom} — ${v.titre} | unevoyante.fr`;

  /* Référencement : une adresse canonique par praticien — sa page
     pré-générée, que voyant.html?id=… désigne aussi comme référence — et une
     description qui lui est propre. Figées dans le HTML par `npm run statique`,
     reposées ici à l'identique. */
  const canonique = `https://unevoyante.fr/voyant-${encodeURIComponent(v.id)}.html`;
  /** Balise du <head> repérée par un attribut (rel, property…), créée au besoin. */
  const balise = (tag, attr, valeur) => {
    let b = document.head.querySelector(`${tag}[${attr}="${valeur}"]`);
    if (!b) {
      b = document.head.appendChild(document.createElement(tag));
      b.setAttribute(attr, valeur);
    }
    return b;
  };
  balise('link', 'rel', 'canonical').href = canonique;
  balise('meta', 'property', 'og:url').content = canonique;
  balise('meta', 'property', 'og:title').content = `${v.prenom} — ${v.titre}`;
  const resume = `${v.prenom}, ${v.titre} : ${v.resume} Consultation par tchat, ${v.credits > 1 ? `${v.credits} crédits` : '1 crédit'} par message.`;
  el('meta[name="description"]').content = resume;
  balise('meta', 'property', 'og:description').content = resume;

  const st = STATUTS[v.statut];
  const dispo = v.statut !== 'offline';
  const avis = D.avisDe(v);

  el('#ariane').innerHTML = filAriane([['Accueil', 'index.html'], ['Voyants', 'voyants.html'], [v.prenom]]);

  const badgeTop = v.top
    ? `<span class="badge-top">${icone('star', 'icon-fill text-[14px] text-gold')} TOP VOYANTE</span>` : '';

  /* --- Entête mobile ------------------------------------------------------- */
  el('#entete-mobile').innerHTML = `
<div aria-hidden="true" class="pointer-events-none absolute inset-0 opacity-20">
  <svg viewBox="0 0 390 220" class="h-full w-full text-gold-300" fill="none">
    <path d="M20 40L120 90L230 30L340 80" stroke="currentColor" stroke-dasharray="3 4"/>
    <circle cx="20" cy="40" r="2" fill="currentColor"/><circle cx="120" cy="90" r="2.5" fill="currentColor"/>
    <circle cx="230" cy="30" r="2" fill="currentColor"/><circle cx="340" cy="80" r="2.5" fill="currentColor"/>
  </svg>
</div>
<div class="shell relative flex flex-col items-center text-center">
  <div class="mb-4 flex w-full items-center justify-between">
    <a href="voyants.html" class="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20" aria-label="Retour au catalogue">
      ${icone('arrow_back', 'text-[22px]')}
    </a>
    <div class="flex gap-2">
      <button type="button" class="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20" data-partager aria-label="Partager ce profil">
        ${icone('ios_share', 'text-[20px]')}
      </button>
      <button type="button" class="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20" data-favori aria-label="Ajouter aux favoris">
        <span class="material-symbols-outlined text-[20px]" aria-hidden="true">favorite</span>
      </button>
    </div>
  </div>
  ${monogramme(v, 'h-24 w-24 text-[34px] ring-white/20')}
  <h1 class="mt-4 text-h-lg-m text-white">${v.prenom}</h1>
  ${v.top ? `<span class="badge mt-2 bg-gold-cta text-navy">${icone('star', 'icon-fill text-[14px]')} TOP</span>` : ''}
  <p class="mt-2 text-body-md text-white/80">${v.titre}</p>
</div>`;

  /* --- Chiffres clés ------------------------------------------------------- */
  el('#chiffres').innerHTML = `
<div class="px-2"><dt class="flex items-center justify-center gap-1 text-label-lg font-bold text-navy">${note(v.note)} ${icone('star', 'icon-fill text-[16px] text-gold')}</dt><dd class="text-body-sm text-muted">${nombre(v.avis)} avis</dd></div>
<div class="px-2"><dt class="text-label-lg font-bold text-navy">${nombre(v.consultations)}</dt><dd class="text-body-sm text-muted">consultations</dd></div>
<div class="px-2"><dt class="text-label-lg font-bold text-navy">${v.experience} ans</dt><dd class="text-body-sm text-muted">d'expérience</dd></div>`;

  /* --- Statut mobile ------------------------------------------------------- */
  el('#statut-mobile').innerHTML = `
<div class="card flex flex-wrap items-center justify-between gap-x-3 gap-y-2 p-4">
  <span class="flex flex-wrap items-center gap-x-2 gap-y-1 text-body-md">
    <span class="flex items-center gap-2 whitespace-nowrap"><span class="${st.dot}"></span>
    <strong class="font-bold text-navy">${st.label}</strong></span>
    <span class="whitespace-nowrap text-muted">· répond en ${v.delai} env.</span>
  </span>
  <span class="inline-flex shrink-0 items-center gap-1 rounded-full bg-ice px-3 py-1.5 text-label-sm">
    ${icone('monetization_on', 'text-[16px] text-gold')} ${v.credits} crédit${v.credits > 1 ? 's' : ''} / msg
  </span>
</div>`;

  /* --- Entête desktop ------------------------------------------------------ */
  // Carte sombre dans les deux thèmes : encre claire en dur, comme le bandeau
  // mobile — badge TOP en or plein, statut en clair à côté de sa pastille.
  el('#entete-desktop').innerHTML = `
<svg aria-hidden="true" class="pointer-events-none absolute inset-0 h-full w-full text-gold opacity-40"
     viewBox="0 0 800 180" fill="none" preserveAspectRatio="xMidYMid slice">
  <circle cx="470" cy="30" r="1.5" fill="currentColor"/><circle cx="560" cy="70" r="2" fill="currentColor"/>
  <circle cx="640" cy="28" r="2.5" fill="currentColor"/><circle cx="730" cy="84" r="2" fill="currentColor"/>
  <circle cx="690" cy="150" r="1.5" fill="currentColor"/><circle cx="770" cy="24" r="1" fill="currentColor"/>
  <circle cx="420" cy="150" r="1" fill="currentColor"/>
  <path d="M470 30 L560 70 L640 28 L730 84 L690 150" stroke="currentColor" stroke-dasharray="3 3" stroke-width=".75"/>
</svg>
<div class="relative flex gap-6">
  ${monogramme(v, 'h-[76px] w-[76px] text-[30px]')}
  <div class="min-w-0 flex-1">
    <div class="mb-1 flex flex-wrap items-center gap-3">
      <h1 class="text-h-lg text-white">${v.prenom}</h1>
      ${v.top ? `<span class="badge bg-gold-cta text-navy">${icone('star', 'icon-fill text-[14px]')} TOP VOYANTE</span>` : ''}
      ${!v.top ? `<span class="flex items-center gap-2 text-label-md text-white"><span class="${st.dot}"></span> ${st.label}</span>` : ''}
    </div>
    <p class="mb-3 text-body-md text-gold-300">${v.titre}</p>
    <div class="mb-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-body-md text-white/75">
      <span class="flex items-center gap-2">${etoiles(v.note)} <strong class="font-semibold text-white">${note(v.note)}</strong> (${nombre(v.avis)} avis)</span>
      <span><strong class="font-semibold text-white">${nombre(v.consultations)}</strong> consultations</span>
      <span><strong class="font-semibold text-white">${v.experience} ans</strong> d'expérience</span>
    </div>
    <div class="flex flex-wrap gap-2">${v.tags.map((t) => `<span class="tag bg-white/10 text-white">${t}</span>`).join('')}</div>
  </div>
</div>`;

  /* --- Spécialités, bio, engagements --------------------------------------- */
  el('#specialites').innerHTML = v.specialites.map((s) => {
    const sp = D.SPECIALITES.find((x) => x.id === s);
    return `<a href="voyants.html?specialite=${s}" class="chip hover:border-royal hover:bg-tint">
      ${icone(sp ? sp.icon : 'auto_awesome', 'text-[16px] text-royal')}${sp ? sp.label : s}</a>`;
  }).join('');

  el('#bio').innerHTML = v.bio.map((p, i) =>
    `<p class="${i > 1 ? 'hidden' : ''}" data-bio-p>${p}</p>`).join('');

  if (v.bio.length <= 2) el('#lire-suite').classList.add('hidden');
  el('#lire-suite').addEventListener('click', function () {
    const caches = els('[data-bio-p].hidden');
    if (caches.length) {
      caches.forEach((p) => p.classList.remove('hidden'));
      this.innerHTML = `Réduire ${icone('expand_less', 'text-[18px]')}`;
    } else {
      els('[data-bio-p]').forEach((p, i) => { if (i > 1) p.classList.add('hidden'); });
      this.innerHTML = `Lire la suite ${icone('expand_more', 'text-[18px]')}`;
      el('#bio').scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  });

  // Mention reprise de l'ancien site : une photo d'illustration doit être signalée.
  if (v.photo) {
    el('#mention-photo').innerHTML = icone('photo_camera', 'text-[16px]') +
      (v.photoReelle ? 'Photo réelle' : 'Photo d’illustration ne représentant pas le praticien');
  } else {
    el('#mention-photo').remove();
  }

  el('#accroche').textContent = '« ' + v.accroche + ' »';

  el('#engagements').innerHTML = [
    ['verified_user', 'Praticien vérifié', 'Identité contrôlée et consultation test validée par notre comité.'],
    ['lock', 'Anonymat garanti', 'Ce praticien ne connaît ni votre nom, ni votre e-mail, ni vos coordonnées.'],
    ['schedule', 'Délai de réponse', `Environ ${v.delai} en période d'activité.`],
    ['gavel', 'Charte déontologique', 'Aucun diagnostic médical, aucune pression, aucun rappel commercial.'],
  ].map((e) => `
    <li class="flex gap-3">
      <span class="tint-chip h-10 w-10 shrink-0">${icone(e[0], 'text-[20px]')}</span>
      <span><strong class="block text-label-md text-navy">${e[1]}</strong>
        <span class="text-body-sm text-muted">${e[2]}</span></span>
    </li>`).join('');

  /* --- Avis ---------------------------------------------------------------- */
  el('#nb-avis').textContent = nombre(v.avis);
  el('#nb-avis').setAttribute('aria-label', `${nombre(v.avis)} avis`);
  el('#avis-note').textContent = note(v.note) + ' / 5';
  el('#avis-etoiles').innerHTML = etoiles(v.note);
  el('#avis-sous-titre').textContent =
    `Note globale calculée sur ${nombre(v.avis)} consultations certifiées.`;
  el('#avis-liste').innerHTML = avis.map((a) => `
    <article class="rounded-md border border-line bg-ice/50 p-4">
      <header class="mb-2 flex items-start justify-between gap-3">
        <span class="flex items-center gap-2.5">
          <span class="grid h-9 w-9 place-items-center rounded-full bg-royal font-display text-label-md text-white">${a.auteur[0]}</span>
          <span><strong class="block text-label-md text-navy">${a.auteur}</strong>
            <span class="text-body-sm text-muted">${a.date}</span></span>
        </span>
        ${etoiles(a.note, 'text-[13px]')}
      </header>
      <p class="text-body-sm italic leading-relaxed text-muted">${a.texte}</p>
    </article>`).join('');

  /* --- Horaires ------------------------------------------------------------ */
  // Au pré-rendu (npm run statique), aucun jour n'est « aujourd'hui » : la page
  // figée ne dépend pas du jour du build ; le navigateur marque le bon jour.
  const jourAuj = window.UV_PRERENDU ? -1 : (new Date().getDay() + 6) % 7;
  el('#horaires').innerHTML = D.JOURS.map((j, i) => {
    const h = v.horaires[i];
    const auj = i === jourAuj;
    return `<li class="flex items-center justify-between gap-3 px-1 py-3 ${auj ? 'rounded-md bg-tint px-3' : ''}">
      <span class="flex items-center gap-2 ${h ? 'text-navy' : 'text-muted'}">
        <span class="${auj ? 'font-semibold' : ''}">${j}</span>
        ${auj ? '<span class="badge bg-royal text-[10px] text-white">AUJOURD\'HUI</span>' : ''}
      </span>
      <span class="${h ? 'text-label-md text-navy' : 'text-body-sm italic text-muted'}">${h || 'Indisponible'}</span>
    </li>`;
  }).join('');

  /* --- Colonne latérale ---------------------------------------------------- */
  const favori = Store.estFavori(v.id);
  const ctaPrincipal = dispo
    ? `<a href="tchat.html?voyant=${v.id}" class="btn-gold btn-lg w-full">
         ${icone('chat_bubble', 'text-[20px]')} Commencer la discussion</a>`
    : `<a href="tchat.html?voyant=${v.id}" class="btn-navy btn-lg w-full">
         ${icone('edit_note', 'text-[20px]')} Laisser un message</a>`;

  el('#aside').innerHTML = `
<div class="card-pad">
  <p class="mb-4 flex items-center gap-2 text-body-md">
    <span class="${st.dot}"></span><strong class="font-semibold text-navy">${st.label}</strong>
    <span class="text-muted">· répond en ${v.delai}</span>
  </p>

  <div class="mb-4 flex items-center justify-center gap-2 rounded-md border border-line bg-ice py-4">
    ${icone('monetization_on', 'text-[24px] text-gold')}
    <span class="font-display text-h-md font-bold text-navy">${v.credits} crédit${v.credits > 1 ? 's' : ''}</span>
    <span class="text-body-md text-muted">/ message</span>
  </div>

  ${v.promo ? `<p class="mb-4 text-center"><span class="badge-promo">${icone('stars', 'text-[14px]')} ${v.promo}</span></p>` : ''}

  <div class="flex flex-col gap-2.5">
    ${ctaPrincipal}
    <button type="button" class="btn-ghost w-full" data-favori>
      <span class="material-symbols-outlined text-[20px] ${favori ? 'icon-fill' : ''}" aria-hidden="true">favorite</span>
      <span data-favori-label>${favori ? 'Retiré des favoris' : 'Ajouter aux favoris'}</span>
    </button>
    ${!dispo ? `<button type="button" class="btn-quiet w-full" data-uv-notifier="${v.id}">Me prévenir de son retour</button>` : ''}
  </div>

  <ul class="mt-6 space-y-3 border-t border-line pt-5 text-body-sm text-muted">
    <li class="flex items-center gap-2.5">${icone('verified_user', 'text-[20px] text-royal')} Praticien vérifié &amp; certifié</li>
    <li class="flex items-center gap-2.5">${icone('lock', 'text-[20px] text-royal')} Anonymat garanti à 100 %</li>
    <li class="flex items-center gap-2.5">${icone('credit_card', 'text-[20px] text-royal')} Paiement sécurisé par carte</li>
  </ul>

  <p class="mt-5 rounded-md bg-gold-50 p-3 text-center text-body-sm text-gold-800">
    ${icone('auto_awesome', 'text-[16px] align-middle')} 3 crédits offerts à l'inscription
  </p>
</div>

<div class="card-tint tint-champagne p-5 sm:p-6">
  <h2 class="mb-2 text-label-lg text-navy">Solde &amp; recharge</h2>
  <p class="mb-4 text-body-sm text-muted">
    Vous disposez de <strong class="font-semibold text-navy"><span data-uv-credits>0</span> crédit<span data-uv-credits-s></span></strong>,
    soit <strong class="font-semibold text-navy"><span id="nb-messages">0</span> message<span id="nb-messages-s"></span></strong> chez ${v.prenom}.
  </p>
  <a href="credits.html" class="btn-quiet w-full">Recharger mon solde</a>
</div>

<div class="card-tint tint-rose p-5 sm:p-6">
  <p class="quote italic">« ${echapper(v.accroche)} »</p>
  <p class="mt-3 text-body-sm text-muted">— ${v.prenom}, ${v.titre.toLowerCase()}</p>
</div>`;

  /* --- Barre d'action mobile ------------------------------------------------ */
  el('#barre-mobile').innerHTML = `
<div class="flex items-center gap-3">
  <div class="min-w-0 flex-1">
    <p class="flex items-center gap-1.5 truncate text-label-md text-navy">
      <span class="${st.dot}"></span> ${v.prenom} · ${st.label}
    </p>
    <p class="text-body-sm text-muted">${v.credits} crédit${v.credits > 1 ? 's' : ''} / message</p>
  </div>
  <a href="tchat.html?voyant=${v.id}" class="btn-gold shrink-0">
    ${dispo ? 'Discuter' : 'Écrire'} ${icone('chat_bubble', 'text-[18px]')}
  </a>
</div>`;

  function majMessages() {
    const n = Math.floor(Store.credits / v.credits);
    const e1 = el('#nb-messages'); if (e1) e1.textContent = n;
    const e2 = el('#nb-messages-s'); if (e2) e2.textContent = n > 1 ? 's' : '';
  }
  majMessages();
  document.addEventListener('uv:etat', majMessages);

  /* --- Favoris & partage ---------------------------------------------------- */
  els('[data-favori]').forEach((b) => b.addEventListener('click', () => {
    const ajoute = Store.basculerFavori(v.id);
    els('[data-favori-label]').forEach((l) => { l.textContent = ajoute ? 'Retiré des favoris' : 'Ajouter aux favoris'; });
    els('[data-favori] .material-symbols-outlined').forEach((i) => i.classList.toggle('icon-fill', ajoute));
    toast(ajoute ? `${v.prenom} ajouté à vos favoris.` : `${v.prenom} retiré de vos favoris.`,
      { icone: 'favorite', action: 'Voir', href: 'compte.html#favoris' });
  }));

  els('[data-partager]').forEach((b) => b.addEventListener('click', async () => {
    const url = location.href;
    if (navigator.share) {
      try { await navigator.share({ title: `${v.prenom} · unevoyante.fr`, url }); return; } catch (e) { /* annulé */ }
    }
    try { await navigator.clipboard.writeText(url); toast('Lien du profil copié.', { icone: 'link' }); }
    catch (e) { toast('Copiez le lien depuis la barre d’adresse.', { icone: 'link' }); }
  }));

  /* --- Onglets --------------------------------------------------------------- */
  const panneaux = { apropos: el('#panneau-apropos'), avis: el('#panneau-avis'), dispo: el('#panneau-dispo') };
  function ouvrir(nom) {
    Object.entries(panneaux).forEach(([k, p]) => {
      p.classList.toggle('hidden', k !== nom);
      p.classList.toggle('flex', k === nom);
    });
    els('[data-onglet]').forEach((b) => {
      const actif = b.dataset.onglet === nom;
      b.setAttribute('aria-selected', String(actif));
      b.className = 'pill-tab';
    });
  }
  els('[data-onglet]').forEach((b) => b.addEventListener('click', () => ouvrir(b.dataset.onglet)));
  ouvrir(location.hash === '#avis' ? 'avis' : location.hash === '#dispo' ? 'dispo' : 'apropos');

  /* --- Praticiens similaires -------------------------------------------------- */
  const proches = D.VOYANTS
    .filter((x) => x.id !== v.id)
    .map((x) => ({ x, s: x.specialites.filter((s) => v.specialites.includes(s)).length }))
    .filter((o) => o.s > 0)
    .sort((a, b) => b.s - a.s || b.x.note - a.x.note)
    .slice(0, 3)
    .map((o) => o.x);
  el('#similaires').innerHTML = (proches.length ? proches : D.VOYANTS.slice(0, 3))
    .map((x) => carteVoyant(x)).join('');
})();
