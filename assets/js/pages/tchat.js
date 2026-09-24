/* tchat.html — script de la page (chargé après data.js, app.js et modales.js). */
(function () {
  'use strict';
  const D = UV_DATA;
  const { el, icone, etoiles, monogramme, note, nombre, heure, Store, toast, echapper, STATUTS, ligneVoyant } = UV;

  /* --- Praticien courant ---------------------------------------------------- */
  const demande = UV.param('voyant');
  const v = D.byId(demande) || D.byId(Store.all.dernierVoyant) || D.VOYANTS[0];
  Store.set({ dernierVoyant: v.id });
  document.title = `${v.prenom} — Mes tchats | unevoyante.fr`;

  const st = STATUTS[v.statut];
  const COUT = v.credits;

  /* --- Amorçage de la conversation ------------------------------------------ */
  const conv = Store.conversation(v.id);
  if (!conv.messages.length) {
    conv.messages.push({
      de: 'eux',
      texte: `Bonjour, je suis ${v.prenom}. Je vous écoute : quelle est votre question ?`,
      t: Date.now() - 1000 * 60 * 4,
    });
  }
  Store.marquerLu(v.id);

  /* --- Entête de conversation ------------------------------------------------ */
  el('#entete-conv').innerHTML = `
<a href="tchat.html" class="grid h-10 w-10 shrink-0 place-items-center rounded-full text-royal transition-colors hover:bg-tint lg:hidden" aria-label="Retour à mes tchats">
  ${icone('arrow_back', 'text-[22px]')}
</a>
<a href="voyant.html?id=${v.id}" class="shrink-0">${monogramme(v, 'h-11 w-11 text-label-lg')}</a>
<div class="min-w-0 flex-1">
  <p class="flex min-w-0 items-center gap-2">
    <a href="voyant.html?id=${v.id}" class="truncate font-display text-h-sm font-extrabold text-navy hover:text-royal">${v.prenom}</a>
    ${v.top ? `<span class="badge-top shrink-0">${icone('verified', 'text-[13px] text-gold')} Certifiée</span>` : ''}
  </p>
  <p class="flex items-center gap-1.5 truncate text-body-sm text-muted">
    <span class="${st.dot}"></span> ${st.label} · ${COUT} crédit${COUT > 1 ? 's' : ''} / message
  </p>
</div>
<a href="voyant.html?id=${v.id}" class="btn-link shrink-0 max-sm:hidden">
  Voir la fiche ${icone('open_in_new', 'text-[16px]')}
</a>`;

  /* --- Bandeau d'information ------------------------------------------------- */
  el('#cout-message').textContent = `${COUT} crédit${COUT > 1 ? 's' : ''}`;
  if (Store.all.astuces.bandeauTchat) el('#bandeau-info').classList.add('hidden');
  el('#fermer-bandeau').addEventListener('click', () => {
    el('#bandeau-info').classList.add('hidden');
    Store.set({ astuces: { ...Store.all.astuces, bandeauTchat: true } });
  });

  /* --- Rendu du fil ---------------------------------------------------------- */
  function bulle(m) {
    if (m.de === 'moi') {
      return `<div class="flex flex-col items-end gap-1">
        <div class="bubble-me">${echapper(m.texte)}</div>
        <span class="flex items-center gap-1 pr-1 text-body-sm text-muted">${heure(m.t)} · Vu
          ${icone('done_all', 'text-[14px] text-royal')}</span>
      </div>`;
    }
    return `<div class="flex items-end gap-2.5">
      ${monogramme(v, 'h-8 w-8 text-body-sm', false)}
      <div class="flex flex-col gap-1">
        <div class="bubble-them">${echapper(m.texte)}</div>
        <span class="pl-1 text-body-sm text-muted">${heure(m.t)}</span>
      </div>
    </div>`;
  }

  function rendreFil() {
    const c = Store.conversation(v.id);
    el('#fil').innerHTML =
      `<div class="flex justify-center"><span class="bubble-system">Aujourd'hui</span></div>` +
      c.messages.map(bulle).join('');
    descendre();
    majSolde();
  }

  function descendre(doux) {
    const f = el('#fil');
    f.scrollTo({ top: f.scrollHeight, behavior: doux ? 'smooth' : 'auto' });
  }

  /* --- Indicateur de saisie --------------------------------------------------- */
  function indicateur(actif) {
    const existant = el('#indicateur');
    if (!actif) { if (existant) existant.remove(); return; }
    if (existant) return;
    const d = document.createElement('div');
    d.id = 'indicateur';
    d.className = 'flex items-end gap-2.5';
    d.innerHTML = `${monogramme(v, 'h-8 w-8 text-body-sm', false)}
      <span class="inline-flex items-center gap-2 rounded-lg rounded-bl-sm border border-line bg-surface px-4 py-3 shadow-sm">
        <span class="flex gap-1" aria-hidden="true">
          <span class="typing-dot h-1.5 w-1.5 rounded-full bg-royal"></span>
          <span class="typing-dot h-1.5 w-1.5 rounded-full bg-royal" style="animation-delay:.2s"></span>
          <span class="typing-dot h-1.5 w-1.5 rounded-full bg-royal" style="animation-delay:.4s"></span>
        </span>
        <span class="text-body-sm italic text-muted">${v.prenom} affine son ressenti…</span>
      </span>`;
    el('#fil').appendChild(d);
    descendre(true);
  }

  /* --- Solde ------------------------------------------------------------------ */
  function majSolde() {
    const vide = Store.credits < COUT;
    el('#encart-solde').classList.toggle('hidden', !vide);
    el('#envoyer').disabled = vide;
    el('#saisie').disabled = vide;
    el('#saisie').placeholder = vide
      ? 'Rechargez pour continuer la discussion'
      : 'Posez votre question…';
    el('#texte-solde').textContent = Store.credits === 0
      ? `${v.prenom} vous attend : rechargez pour recevoir sa réponse.`
      : `Il vous reste ${Store.credits} crédit${Store.credits > 1 ? 's' : ''}, or un message chez ${v.prenom} en coûte ${COUT}.`;
    majFidelite();
    rendreProfil();
  }
  document.addEventListener('uv:etat', majSolde);

  /* --- Envoi d'un message ------------------------------------------------------ */
  const saisie = el('#saisie');
  saisie.addEventListener('input', () => {
    saisie.style.height = 'auto';
    saisie.style.height = Math.min(saisie.scrollHeight, 128) + 'px';
  });
  saisie.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); el('#formulaire').requestSubmit(); }
  });

  el('#formulaire').addEventListener('submit', (e) => {
    e.preventDefault();
    const texte = saisie.value.trim();
    if (!texte) { saisie.focus(); return; }

    const palier = Store.consommer(COUT);
    if (palier === false) {
      toast('Solde insuffisant : rechargez pour envoyer ce message.', { ton: 'alerte', icone: 'monetization_on', action: 'Recharger', href: 'credits.html' });
      majSolde();
      return;
    }

    // Palier franchi : la jauge se remplit, le libellé annonce la récompense —
    // déjà versée au solde — et l'affichage se recale seul après 2,2 s.
    if (palier) {
      const offert = `+${palier.credits} crédit${palier.credits > 1 ? 's' : ''} offert${palier.credits > 1 ? 's' : ''}`;
      celebration = true;
      el('#fidelite-jauge').style.transform = 'scaleX(1)';
      el('#fidelite-texte').textContent = `Palier atteint · ${offert}`;
      toast(`Palier atteint : ${palier.credits} crédit${palier.credits > 1 ? 's' : ''} offert${palier.credits > 1 ? 's' : ''}. Nouveau solde : ${Store.credits}.`,
        { ton: 'or', icone: 'auto_awesome', duree: 5000 });
      setTimeout(() => { celebration = false; majFidelite(); }, 2200);
    }

    Store.ajouterMessage(v.id, { de: 'moi', texte, t: Date.now() });

    saisie.value = '';
    saisie.style.height = 'auto';
    rendreFil();
    rendreListe();

    // Réponse simulée du praticien
    setTimeout(() => {
      indicateur(true);
      setTimeout(() => {
        indicateur(false);
        const c = Store.conversation(v.id);
        const dejaDites = c.messages.filter((m) => m.de === 'eux').length - 1;
        const reponse = v.reponses[dejaDites % v.reponses.length];
        Store.ajouterMessage(v.id, { de: 'eux', texte: reponse, t: Date.now() });
        rendreFil();
        rendreListe();
      }, 2200);
    }, 700);
  });

  /* --- Fidélité ------------------------------------------------------------------
     La barre ne montre que le palier en cours : ce qui est déjà acquis n'a plus
     à être parcouru. Au franchissement, l'affichage se fige quelques secondes
     sur la récompense (`celebration`) avant de se recaler sur le palier suivant. */
  let celebration = false;

  function majFidelite() {
    if (celebration) return;
    const e = UV.fidelite.etat(Store.consommes);
    const l = UV.fidelite.libelles(Store.consommes, COUT);
    const rail = el('#fidelite-rail');
    el('#fidelite-texte').textContent = l.court;
    el('#fidelite-detail').textContent = l.longue;
    el('#fidelite').title = l.longue;
    rail.setAttribute('aria-valuemin', e.precedent);
    rail.setAttribute('aria-valuemax', e.seuil);
    rail.setAttribute('aria-valuenow', e.consommes);
    rail.setAttribute('aria-valuetext', l.longue);
    el('#fidelite-jauge').style.transform = `scaleX(${e.progression})`;
  }
  el('#fidelite').addEventListener('click', () => {
    if (UV.modales.fidelite) UV.modales.fidelite.ouvrir();
  });

  /* --- Liste des conversations --------------------------------------------------- */
  function conversationsOuvertes() {
    const ids = Object.keys(Store.all.conversations).filter((id) => D.byId(id));
    if (!ids.includes(v.id)) ids.push(v.id);
    return ids
      .map((id) => ({ v: D.byId(id), c: Store.all.conversations[id] }))
      .sort((a, b) => (b.c ? b.c.maj : 0) - (a.c ? a.c.maj : 0));
  }

  function rendreListe() {
    const q = el('#recherche-conv').value.trim().toLowerCase();
    const items = conversationsOuvertes()
      .filter((o) => !q || (o.v.prenom + ' ' + o.v.titre).toLowerCase().includes(q));

    el('#nb-conversations').textContent = conversationsOuvertes().length;

    const suggestions = D.VOYANTS
      .filter((x) => x.statut === 'online' && !items.some((o) => o.v.id === x.id))
      .slice(0, 4);

    el('#liste-conversations').innerHTML =
      items.map((o) => ligneVoyant(o.v, o.v.id === v.id)).join('') +
      (suggestions.length ? `
        <p class="px-3 pb-2 pt-5 text-label-sm uppercase tracking-wider text-muted">Suggestions en ligne</p>
        ${suggestions.map((x) => ligneVoyant(x, false)).join('')}` : '') +
      `<a href="voyants.html" class="mt-3 flex items-center justify-center gap-1.5 rounded-md px-3 py-3 text-label-md text-royal hover:bg-ice">
         ${icone('search', 'text-[18px]')} Parcourir les 24 praticiens</a>`;
  }
  el('#recherche-conv').addEventListener('input', rendreListe);

  /* --- Colonne de profil (desktop) ------------------------------------------------ */
  function rendreProfil() {
    const zone = el('#colonne-profil');
    if (!zone) return;
    zone.innerHTML = `
<div class="card-tint tint-azur p-5 text-center sm:p-6">
  <div class="mb-3 flex justify-center">${monogramme(v, 'h-20 w-20 text-[28px]')}</div>
  <h2 class="text-h-md"><a href="voyant.html?id=${v.id}" class="hover:text-royal">${v.prenom}</a></h2>
  ${v.top ? `<p class="mt-2"><span class="badge bg-gold-cta text-navy">${icone('star', 'icon-fill text-[14px]')} TOP VOYANTE</span></p>` : ''}
  <p class="mt-3 flex items-center justify-center gap-2 text-body-md">
    ${etoiles(v.note, 'text-[14px]')} <strong class="font-semibold">${note(v.note)}</strong>
    <span class="text-muted">(${nombre(v.avis)} avis)</span>
  </p>
  <div class="mt-4 flex flex-wrap justify-center gap-2">
    ${v.tags.slice(0, 3).map((t) => `<span class="tag bg-surface text-royal">${t}</span>`).join('')}
  </div>
  <p class="quote mt-5 italic text-muted">« ${echapper(v.accroche)} »</p>
  <a href="voyant.html?id=${v.id}" class="btn-link mt-4 justify-center">Voir la fiche complète</a>
</div>

<div class="card-tint tint-amethyste p-5 sm:p-6">
  <p class="mb-2 flex items-center gap-2 text-label-lg font-bold text-navy">
    <span class="tint-chip h-9 w-9">${icone('shield', 'text-[20px]')}</span> Confidentialité &amp; charte
  </p>
  <p class="text-body-sm leading-relaxed text-muted">
    Vos échanges sont protégés par le secret professionnel et anonymisés.
    <a href="info.html?sujet=charte" class="font-medium text-royal underline underline-offset-2">Lire la charte</a>.
  </p>
</div>

<div class="rounded-lg border border-line bg-tint p-5">
  <p class="mb-1 text-label-sm uppercase tracking-wider text-royal">Conseil guidance</p>
  <p class="text-body-sm leading-relaxed text-royal-800">
    Précisez les prénoms et dates de naissance pour obtenir une lecture divinatoire plus détaillée.
  </p>
</div>`;
    UV.majCredits();
  }

  /* --- Démarrage -------------------------------------------------------------------- */
  rendreFil();
  rendreListe();
  rendreProfil();
  majFidelite();

  // Sur mobile, la liste s'affiche seulement si aucune conversation n'est ciblée
  if (!demande && window.innerWidth < 1024) {
    const liste = el('#colonne-liste');
    liste.classList.remove('hidden');
    liste.classList.add('flex', 'px-4', 'py-4');
    // Les 2 rem de py-4 sont retranchés de la vue application, sinon la page
    // déborde de 32 px : sur iOS, ce débord suffit à faire glisser tout le bloc.
    liste.style.setProperty('--uv-app-marge', '2rem');
    el('#colonne-fil').classList.add('hidden', 'lg:flex');
  }

  // Pas de focus automatique sur mobile : il ouvre le clavier (ou déclenche un
  // défilement de révélation) avant même que l'utilisateur ait lu la page.
  if (window.matchMedia('(min-width: 1024px)').matches) saisie.focus({ preventScroll: true });

  // Promo clients VERT : proposée à l'ouverture du tchat, une fois par session.
  // Après paiement, « Reprendre » ramène à cette conversation.
  UV.modales.promoVert.proposer({ retour: v.id });
})();
