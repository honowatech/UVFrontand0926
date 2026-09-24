/* credits.html — script de la page (chargé après data.js, app.js et modales.js). */
(function () {
  'use strict';
  const D = UV_DATA, { el, els, icone, euro, filAriane, Store, toast } = UV;

  el('#ariane').innerHTML = filAriane([['Accueil', 'index.html'], ['Mes crédits']]);

  const PACKS = D.PACKS.filter((p) => !p.essai);
  const ESSAI = D.PACKS.find((p) => p.essai);
  // Offre ciblée réservée depuis sa modale (credits.html?offre=vert) : portée
  // par l'adresse, jamais mémorisée comme pack préféré, achetable une seule fois.
  const cleOffre = UV.param('offre');
  const OFFRE = cleOffre && Object.hasOwn(D.OFFRES, cleOffre) ? D.OFFRES[cleOffre] : null;
  let offreUtilisee = false;
  // Pack choisi ailleurs — modale « Liste des forfaits », page Tarifs —
  // (credits.html?pack=certitude) : mémorisé, puis retiré de l'adresse.
  const packDemande = D.PACKS.find((p) => p.id === UV.param('pack'));
  if (packDemande) {
    Store.set({ packChoisi: packDemande.id });
    const url = new URL(location.href);
    url.searchParams.delete('pack');
    history.replaceState(history.state, '', url);
  }
  const packMemorise = () => D.PACKS.find((p) => p.id === Store.all.packChoisi) || PACKS.find((p) => p.populaire);
  let choisi = OFFRE || packMemorise();
  const libelle = (p) => (p === OFFRE || p.essai ? p.nom : `Pack ${p.nom}`);

  // Complément accepté dans la modale d'upsell (credits.html?complement=plus20) :
  // s'ajoute au pack ou à l'offre, quel qu'il soit ; retirable, acheté une seule fois.
  const cleComplement = UV.param('complement');
  let complement = cleComplement && Object.hasOwn(D.COMPLEMENTS, cleComplement) ? D.COMPLEMENTS[cleComplement] : null;
  const arriveeAvecComplement = !!complement;
  const commande = () => ({
    credits: choisi.credits + (complement ? complement.credits : 0),
    prix: choisi.prix + (complement ? complement.prix : 0),
  });
  const sansParametre = (nom) => {
    const url = new URL(location.href);
    url.searchParams.delete(nom);
    history.replaceState(history.state, '', url);
  };
  let enConfirmation = false; // « Crédits ajoutés » affiché : pas de second achat par erreur

  /* --- Rendu des packs ------------------------------------------------------ */
  /* Offre ciblée : pleine largeur, en tête de la grille, avec la même anatomie
     qu'un pack (libellé, crédits, prix, coût par message, état de sélection). */
  function carteOffre() {
    const actif = choisi === OFFRE;
    const cadre = actif ? 'border-gold bg-gold-50 shadow-gold'
      : offreUtilisee ? 'cursor-default border-line bg-surface'
      : 'border-line bg-surface hover:border-royal-200 hover:shadow-card';
    const pastille = offreUtilisee ? `${icone('check_circle', 'text-[18px]')} Offre utilisée`
      : actif ? 'Offre sélectionnée' : 'Sélectionner';
    return `
<div class="relative pt-3 sm:col-span-2 lg:col-span-4">
  <span class="absolute left-5 top-0 z-10 inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-gold-cta px-3 py-1 text-label-sm font-semibold text-navy">
    ${icone('stars', 'text-[14px]')} Réservée pour vous
  </span>
  <button type="button" role="radio" aria-checked="${actif}" data-pack="offre" ${offreUtilisee ? 'disabled' : ''}
          class="flex w-full flex-col gap-4 rounded-lg border-2 p-5 pt-6 text-left transition-all sm:flex-row sm:items-center sm:gap-6 ${cadre}">
    <span class="flex min-w-0 flex-1 items-center gap-4">
      <span class="forfait-piece forfait-piece-credits forfait-piece-xl${OFFRE.credits >= 100 ? ' forfait-piece-long' : ''}${offreUtilisee ? '' : ' forfait-piece-eclat'}" aria-hidden="true">
        <span class="forfait-piece-valeur">${OFFRE.credits}</span>
        <span class="forfait-piece-mention">crédits</span>
      </span>
      <span class="min-w-0">
        <span class="block font-display text-h-md font-extrabold leading-tight text-navy">${OFFRE.nom}</span>
        <span class="mt-1 block text-body-sm text-muted">${euro(OFFRE.prix / OFFRE.credits)} / message</span>
        <span class="sr-only">, ${OFFRE.credits} crédits, ${OFFRE.bonus} % de crédits offerts</span>
      </span>
    </span>
    <span class="flex items-baseline justify-between gap-6 border-t border-line pt-4 sm:block sm:border-0 sm:pt-0 sm:text-right">
      <span class="whitespace-nowrap font-display text-h-md font-bold leading-none text-navy">${euro(OFFRE.prix)}</span>
      <span class="forfait-offert" aria-hidden="true">+${OFFRE.bonus}&nbsp;% offerts</span>
    </span>
    <span class="flex min-h-[44px] shrink-0 items-center justify-center gap-1.5 rounded-full px-5 text-label-md font-semibold sm:w-48 ${
      actif ? 'bg-gold-cta text-navy' : offreUtilisee ? 'bg-ice text-muted' : 'border border-line text-royal'}">${pastille}</span>
  </button>
</div>`;
  }

  function rendrePacks() {
    el('#packs').innerHTML = (OFFRE ? carteOffre() : '') + PACKS.map((p) => {
      const actif = p.id === choisi.id;
      return `
<div class="relative pt-3">
  ${p.badge ? `<span class="absolute left-1/2 top-0 z-10 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1 text-label-sm font-semibold ${
    p.populaire ? 'bg-gold-cta text-navy' : 'bg-navy text-white'}">${p.badge}</span>` : ''}
  <button type="button" role="radio" aria-checked="${actif}" data-pack="${p.id}"
          class="flex w-full flex-col rounded-lg border-2 p-5 text-left transition-all ${
            actif ? 'border-gold bg-gold-50 shadow-gold' : 'border-line bg-surface hover:border-royal-200 hover:shadow-card'}">
    <!-- Pièce d'or portant les crédits, nom en vedette à côté (comme dans la
         modale des forfaits) ; la coche de sélection passe dans le bouton. -->
    <span class="mb-3 flex items-center gap-4 border-b border-line pb-3">
      <span class="forfait-piece forfait-piece-credits forfait-piece-xl${p.credits >= 100 ? ' forfait-piece-long' : ''}${p.populaire ? ' forfait-piece-eclat' : ''}" aria-hidden="true">
        <span class="forfait-piece-valeur">${p.credits}</span>
        <span class="forfait-piece-mention">crédits</span>
      </span>
      <span class="min-w-0 font-display text-h-md font-extrabold leading-tight text-navy lg:text-[19px] xl:text-h-md">${p.nom}</span>
    </span>
    <span class="flex flex-wrap items-baseline justify-between gap-2">
      <span class="whitespace-nowrap font-display text-h-md font-bold leading-none text-navy">${euro(p.prix)}</span>
      <span class="text-body-sm text-muted">${euro(p.prix / p.credits)} / message</span>
    </span>
    ${p.bonus ? `<span class="forfait-offert" aria-hidden="true">+${p.bonus}&nbsp;% offerts</span>` : ''}
    <span class="sr-only">, ${p.credits} crédits${p.bonus ? `, ${p.bonus} % de crédits offerts` : ''}</span>
    <span class="mt-5 flex min-h-[44px] w-full items-center justify-center gap-1.5 rounded-full px-4 text-label-md font-semibold ${
      actif ? 'bg-gold-cta text-navy' : 'border border-line text-royal'}">
      ${actif ? `${icone('check', 'text-[18px]')} Pack sélectionné` : 'Sélectionner'}
    </span>
  </button>
</div>`;
    }).join('');

    els('[data-pack]').forEach((b) => b.addEventListener('click', () => {
      if (b.dataset.pack === 'offre') {
        choisi = OFFRE;
      } else {
        choisi = D.PACKS.find((p) => p.id === b.dataset.pack);
        Store.set({ packChoisi: choisi.id });
      }
      rendrePacks(); rendreRecap();
    }));
  }

  /* --- Récapitulatif ---------------------------------------------------------- */
  function rendreRecap() {
    const total = commande();
    el('#recap-pack').textContent = `${libelle(choisi)} · ${choisi.credits} crédits`;
    el('#recap-prix').textContent = euro(choisi.prix);

    const ligne = el('#recap-complement');
    ligne.classList.toggle('hidden', !complement);
    ligne.classList.toggle('flex', !!complement);
    if (complement) {
      el('#recap-complement-libelle').textContent = `+${complement.credits} crédits en plus`;
      el('#recap-complement-prix').textContent = euro(complement.prix);
      el('#retirer-complement').setAttribute('aria-label', `Retirer les ${complement.credits} crédits en plus`);
    }

    el('#recap-tva').textContent = euro(total.prix - total.prix / 1.2);
    el('#recap-total').textContent = euro(total.prix);
    el('#recap-detail').textContent = `${total.credits} crédits immédiatement utilisables`;
    // Absent pendant la confirmation « Crédits ajoutés » : le bouton le recrée.
    const payer = el('#payer-label');
    if (payer) payer.textContent = `Payer ${euro(total.prix)}`;
  }

  // Le client peut toujours revenir sur le complément accepté dans la modale.
  el('#retirer-complement').addEventListener('click', () => {
    if (enConfirmation) return;
    const retire = complement;
    complement = null;
    sansParametre('complement');
    rendreRecap();
    el('#recap-titre').focus({ preventScroll: true });
    toast(`${retire.credits} crédits en plus retirés de votre commande.`, { icone: 'remove_shopping_cart' });
  });

  el('#offre-essai').addEventListener('click', () => {
    choisi = ESSAI;
    Store.set({ packChoisi: ESSAI.id });
    rendrePacks(); rendreRecap();
    toast('Offre d’essai sélectionnée : 2 crédits pour 4,99 €.', { ton: 'or', icone: 'auto_awesome' });
    el('#payer').scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  /* --- Moyens de paiement ------------------------------------------------------ */
  els('[data-moyen]').forEach((l) => l.addEventListener('click', () => {
    els('[data-moyen]').forEach((x) => {
      const actif = x === l;
      x.className = `flex cursor-pointer items-center gap-3 rounded-md border-2 p-4 transition-colors ${
        actif ? 'border-royal bg-royal-50' : 'border-line bg-surface hover:border-royal-200'}`;
    });
    el('#formulaire-carte').classList.toggle('hidden', l.dataset.moyen !== 'carte');
  }));

  /* --- Paiement simulé ----------------------------------------------------------- */
  el('#payer').addEventListener('click', () => {
    if (enConfirmation) return; // « Crédits ajoutés » affiché : pas de second achat par erreur
    if (!el('#cgv').checked) {
      toast('Merci d’accepter les CGV pour finaliser la commande.', { ton: 'alerte', icone: 'gavel' });
      el('#cgv').focus();
      return;
    }

    const b = el('#payer');
    b.disabled = true;
    b.innerHTML = `<span class="material-symbols-outlined animate-spin text-[20px]" aria-hidden="true">progress_activity</span> Paiement en cours…`;

    setTimeout(() => {
      const offre = choisi === OFFRE;
      const avecComplement = !!complement;
      const total = commande();
      Store.crediter(total.credits);
      enConfirmation = true;
      b.disabled = false;
      b.innerHTML = `${icone('check_circle', 'text-[20px]')} Crédits ajoutés`;

      // Offre et complément consommés : retirés de l'adresse (un rechargement
      // ne les rend pas). Le récapitulatif les montre jusqu'à la fin de la confirmation.
      if (offre) {
        offreUtilisee = true;
        sansParametre('offre');
        rendrePacks();
      }
      if (avecComplement) sansParametre('complement');

      const retour = UV.param('retour');
      toast(`${total.credits} crédits ajoutés. Nouveau solde : ${Store.credits}.`, {
        ton: 'or', icone: 'auto_awesome', duree: 5000,
        action: retour ? 'Reprendre' : 'Consulter',
        href: retour ? `tchat.html?voyant=${retour}` : 'voyants.html',
      });

      setTimeout(() => {
        if (offre) choisi = packMemorise();
        if (avecComplement) complement = null;
        enConfirmation = false;
        b.innerHTML = `${icone('lock', 'text-[20px]')} <span id="payer-label"></span>`;
        rendrePacks();
        rendreRecap();
      }, 3000);

      confettis();
    }, 1300);
  });

  /* Petite célébration discrète, purement décorative */
  function confettis() {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const zone = document.createElement('div');
    zone.className = 'pointer-events-none fixed inset-0 z-[95] overflow-hidden';
    zone.setAttribute('aria-hidden', 'true');
    for (let i = 0; i < 24; i++) {
      const p = document.createElement('span');
      const g = ['#D8B45A', '#F0D48A', '#C9A24A', '#1F3C88'][i % 4];
      p.style.cssText = `position:absolute;top:-12px;left:${Math.random() * 100}%;width:7px;height:11px;
        background:${g};border-radius:2px;opacity:.9;
        animation:uv-conf ${1.4 + Math.random()}s cubic-bezier(.3,.7,.4,1) ${Math.random() * .35}s forwards;`;
      zone.appendChild(p);
    }
    const s = document.createElement('style');
    s.textContent = '@keyframes uv-conf{to{transform:translateY(105vh) rotate(560deg);opacity:0}}';
    zone.appendChild(s);
    document.body.appendChild(zone);
    setTimeout(() => zone.remove(), 2600);
  }

  /* --- Comparatif ------------------------------------------------------------------ */
  el('#comparatif').innerHTML = D.PACKS.map((p) => `
    <tr class="${p.id === choisi.id ? 'bg-gold-50' : ''}">
      <th scope="row" class="px-5 py-3 text-label-md text-navy">${p.nom}</th>
      <td class="px-5 py-3">${p.credits}</td>
      <td class="px-5 py-3 font-semibold text-navy">${euro(p.prix)}</td>
      <td class="px-5 py-3">${euro(p.prix / p.credits)}</td>
      <td class="px-5 py-3 text-muted">${p.credits} messages</td>
    </tr>`).join('');

  rendrePacks();
  rendreRecap();

  // Arrivée depuis une modale (offre, pack, complément) : on confirme la
  // commande, puis on amène au paiement (même geste que l'offre d'essai).
  const arrivee = commande();
  const plus = arriveeAvecComplement ? `, avec ${complement.credits} crédits en plus` : '';
  const pour = `${arrivee.credits} crédits pour ${euro(arrivee.prix)}`;
  let message = null;
  if (OFFRE) {
    message = [`${OFFRE.nom} réservée${plus} : ${pour}.`, 'redeem'];
  } else if (packDemande) {
    const accord = packDemande.essai ? 'sélectionnée' : 'sélectionné';
    message = [`${libelle(packDemande)} ${accord}${plus} : ${pour}.`, 'auto_awesome'];
  } else if (arriveeAvecComplement) {
    message = [`${complement.credits} crédits en plus ajoutés : ${pour}.`, 'auto_awesome'];
  }
  if (message) {
    toast(message[0], { ton: 'or', icone: message[1] });
    setTimeout(() => el('#payer').scrollIntoView({ behavior: 'smooth', block: 'center' }), 350);
  }
})();
