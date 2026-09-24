/* compte.html — script de la page (chargé après data.js, app.js et modales.js). */
(function () {
  'use strict';
  const D = UV_DATA;
  const { el, els, icone, euro, nombre, heure, monogramme, carteVoyant, ligneVoyant, filAriane, Store, toast, echapper } = UV;

  el('#ariane').innerHTML = filAriane([['Accueil', 'index.html'], ['Mon compte']]);

  /* --- Entête ---------------------------------------------------------------- */
  function rendreEntete() {
    const c = Store.compte;
    el('#bandeau-visiteur').classList.toggle('hidden', !!c);
    el('#avatar').textContent = c ? c.prenom[0].toUpperCase() : 'V';
    el('#titre-compte').textContent = c ? `Bonjour ${c.prenom}` : 'Bonjour, visiteur';
    el('#sous-titre-compte').textContent = c
      ? c.email
      : 'Compte non connecté — vos données restent sur cet appareil.';
  }

  /* --- Synthèse ---------------------------------------------------------------- */
  function rendreSynthese() {
    const convs = Object.entries(Store.all.conversations)
      .filter(([id, c]) => D.byId(id) && c.messages && c.messages.some((m) => m.de === 'moi'));
    const messages = convs.reduce((s, [, c]) => s + c.messages.filter((m) => m.de === 'moi').length, 0);
    /* [icône, teinte (src/input.css), libellé, chiffre, contexte] */
    const cartes = [
      ['monetization_on', 'tint-champagne', 'Solde de crédits', `${Store.credits}`, Store.credits > 0 ? 'Prêt à consulter' : 'Rechargez pour continuer'],
      ['forum', 'tint-amethyste', 'Conversations', `${convs.length}`, 'Historique conservé'],
      ['send', 'tint-sauge', 'Messages envoyés', `${messages}`, 'Depuis cet appareil'],
      ['stars', 'tint-ciel', 'Points de fidélité', `${Store.points}`, '1 point par message envoyé'],
      ['favorite', 'tint-rose', 'Praticiens favoris', `${Store.all.favoris.length}`, 'Accès rapide'],
    ];
    el('#synthese').innerHTML = cartes.map((c) => `
      <div class="card-tint stat-tile ${c[1]}">
        <span class="tint-chip">${icone(c[0], 'text-[24px]')}</span>
        <p class="stat-label">${c[2]}</p>
        <p class="stat-num">${c[3]}</p>
        <p class="stat-sub">${c[4]}</p>
      </div>`).join('');
  }

  /* --- Conversations -------------------------------------------------------------- */
  function conversations() {
    return Object.entries(Store.all.conversations)
      .filter(([id, c]) => D.byId(id) && c.messages && c.messages.some((m) => m.de === 'moi'))
      .sort((a, b) => b[1].maj - a[1].maj);
  }

  function rendreConversations() {
    const items = conversations();
    const vide = `
      <div class="p-8 text-center">
        <span class="material-symbols-outlined mb-2 text-[40px] text-line" aria-hidden="true">forum</span>
        <p class="mb-4 text-body-md text-muted">Aucune conversation pour le moment.</p>
        <a href="voyants.html" class="btn-ghost">Choisir un praticien</a>
      </div>`;

    el('#liste-conversations').innerHTML = items.length ? items.map(([id, c]) => {
      const v = D.byId(id);
      const dernier = c.messages[c.messages.length - 1];
      const envoyes = c.messages.filter((m) => m.de === 'moi').length;
      return `
      <div class="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-4 sm:p-5">
        ${monogramme(v, 'h-12 w-12 text-label-lg')}
        <div class="min-w-0 flex-1">
          <p class="flex flex-wrap items-baseline gap-x-2">
            <a href="${UV.lienVoyant(id)}" class="font-display text-label-lg font-semibold text-navy hover:text-royal">${v.prenom}</a>
            <span class="text-body-sm text-muted">${v.titre}</span>
          </p>
          <p class="truncate text-body-sm text-muted">${echapper(dernier.texte)}</p>
          <p class="mt-1 text-body-sm text-muted">${envoyes} message${envoyes > 1 ? 's' : ''} envoyé${envoyes > 1 ? 's' : ''} · ${heure(c.maj)}</p>
        </div>
        <a href="tchat.html?voyant=${id}" class="btn-ghost btn-sm shrink-0">Reprendre</a>
      </div>`;
    }).join('') : vide;

    el('#apercu-conversations').innerHTML = items.length
      ? items.slice(0, 4).map(([id]) => ligneVoyant(D.byId(id), false)).join('')
      : `<p class="rounded-md bg-ice p-4 text-body-sm text-muted">
           Aucune conversation encore. <a href="voyants.html" class="font-medium text-royal underline underline-offset-2">Choisissez un praticien</a> pour commencer.
         </p>`;
  }

  /* --- Favoris ------------------------------------------------------------------------ */
  function rendreFavoris() {
    const liste = Store.all.favoris.map((id) => D.byId(id)).filter(Boolean);
    el('#favoris-vide').classList.toggle('hidden', liste.length > 0);
    el('#liste-favoris').innerHTML = liste.map((v) => carteVoyant(v)).join('');
  }

  /* --- Achats -------------------------------------------------------------------------- */
  function rendreAchats() {
    const achats = [
      ['12 septembre 2026', 'Évidence', 15, 19.99],
      ['28 août 2026', 'Prévision', 6, 9.99],
      ['3 août 2026', 'Offre d’essai', 2, 4.99],
    ];
    el('#liste-achats').innerHTML = achats.map((a) => `
      <tr>
        <td class="px-5 py-3 text-muted">${a[0]}</td>
        <th scope="row" class="px-5 py-3 text-label-md text-navy">${a[1]}</th>
        <td class="px-5 py-3">${a[2]}</td>
        <td class="px-5 py-3 font-semibold text-navy">${euro(a[3])}</td>
        <td class="px-5 py-3">
          <button type="button" class="btn-link" data-facture>${icone('receipt_long', 'text-[16px]')} Télécharger</button>
        </td>
      </tr>`).join('');
    els('[data-facture]').forEach((b) => b.addEventListener('click', () =>
      toast('Facture générée (démonstration).', { icone: 'receipt_long' })));
  }

  /* --- Praticiens disponibles ------------------------------------------------------------ */
  el('#apercu-dispo').innerHTML = D.VOYANTS
    .filter((v) => v.statut === 'online').slice(0, 4)
    .map((v) => ligneVoyant(v, false)).join('');

  /* --- Onglets ---------------------------------------------------------------------------- */
  const noms = ['apercu', 'conversations', 'favoris', 'achats', 'confidentialite'];
  function ouvrir(nom) {
    if (!noms.includes(nom)) nom = 'apercu';
    noms.forEach((n) => {
      const p = el('#panneau-' + n);
      p.classList.toggle('hidden', n !== nom);
      if (n === nom && (n === 'apercu' || n === 'confidentialite')) p.classList.add('grid');
    });
    els('[data-onglet]').forEach((b) => {
      const actif = b.dataset.onglet === nom;
      b.setAttribute('aria-selected', String(actif));
      b.className = `shrink-0 border-b-2 px-4 py-3 text-label-md transition-colors ${
        actif ? 'border-royal text-royal' : 'border-transparent text-muted hover:text-navy'}`;
    });
    history.replaceState(null, '', '#' + nom);
  }
  els('[data-onglet]').forEach((b) => b.addEventListener('click', () => ouvrir(b.dataset.onglet)));

  /* --- Préférences ------------------------------------------------------------------------- */
  els('[data-pref]').forEach((c) => c.addEventListener('change', () =>
    toast('Préférence enregistrée.', { icone: 'tune' })));

  /* --- RGPD --------------------------------------------------------------------------------- */
  el('#exporter').addEventListener('click', () => {
    const donnees = JSON.stringify({ exporte: new Date().toISOString(), ...Store.all }, null, 2);
    const url = URL.createObjectURL(new Blob([donnees], { type: 'application/json' }));
    const a = document.createElement('a');
    a.href = url; a.download = 'unevoyante-mes-donnees.json';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast('Export généré.', { icone: 'download' });
  });

  el('#reinitialiser').addEventListener('click', () => {
    Store.reinitialiser();
    tout();
    toast('Démonstration réinitialisée : 3 crédits, aucune conversation.', { icone: 'restart_alt' });
  });

  /* --- Rendu global -------------------------------------------------------------------------- */
  function tout() {
    rendreEntete(); rendreSynthese(); rendreConversations(); rendreFavoris(); rendreAchats();
  }
  tout();
  ouvrir((location.hash || '#apercu').slice(1));
  document.addEventListener('uv:etat', () => { rendreEntete(); rendreSynthese(); });
})();
