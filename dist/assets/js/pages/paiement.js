/* paiement.html — confirmation d'achat (chargé après data.js, app.js et modales.js).
   Ouverte par un pack de la page promo : paiement.html?pack=…&promo=…
   Le talon récapitule la commande (pièce du pack, pièce du bonus, total), le
   volet propose trois moyens : portefeuille express (Apple Pay sur les
   appareils Apple, Google Pay ailleurs), carte, PayPal. Paiement simulé, comme
   sur la page Crédits : rien n'est transmis.
   La promotion est relue chaque seconde et au moment de payer : si elle se
   termine pendant la commande, le récapitulatif se met à jour avant tout débit. */
(function () {
  'use strict';
  const D = UV_DATA, { el, els, icone, euro, promos, Store } = UV;

  const PACK = D.PACKS.find((p) => p.id === UV.param('pack'));
  const clePromo = UV.param('promo');
  const PROMO = clePromo ? promos.trouver(clePromo) : null;
  // « Changer de forfait » ramène au choix d'où l'on vient.
  const RETOUR = PROMO ? `promo.html?id=${encodeURIComponent(PROMO.id)}` : clePromo ? 'promo.html' : 'tarifs.html';
  // Sans pack reconnu, il n'y a rien à confirmer : retour au choix des packs.
  if (!PACK) {
    location.replace(RETOUR);
    return;
  }

  const billet = el('#billet');
  const insecable = (s) => String(s).replace(/ /g, ' ');
  const credits = (n) => insecable(`${n} crédit${n > 1 ? 's' : ''}`);
  const libelle = PACK.essai ? PACK.nom : `Pack ${PACK.nom}`;
  const annoncer = (texte) => { el('#annonce').textContent = texte; };

  el('#retour').href = RETOUR;

  /* --- État de la promotion pour ce pack ------------------------------------
     promo   : elle court et couvre ce pack → bonus appliqué
     echue   : demandée mais terminée, inconnue ou pas encore ouverte
     simple  : aucune promotion demandée, ou ce pack n'en fait pas partie */
  function etatPromo() {
    if (!clePromo) return 'simple';
    if (promos.bonus(PROMO, PACK)) return 'promo';
    return PROMO && promos.etat(PROMO) === 'active' ? 'simple' : 'echue';
  }
  const bonus = () => promos.bonus(PROMO, PACK);
  let bonusAffiche = 0; // celui du récapitulatif : le paiement versera celui-là
  let etat = null;

  /** Temps restant, à la minute près tant qu'il reste plus d'une heure. */
  function reste(ms) {
    const s = Math.ceil(ms / 1000);
    const [j, h, m, sec] = [Math.floor(s / 86400), Math.floor(s / 3600) % 24, Math.floor(s / 60) % 60, s % 60];
    const deux = (n) => String(n).padStart(2, '0');
    if (j) return insecable(`${j} j ${deux(h)} h ${deux(m)} min`);
    if (h) return insecable(`${h} h ${deux(m)} min`);
    return insecable(`${m} min ${deux(sec)} s`);
  }

  /* --- Récapitulatif : la même pile de pièces que sur la page promo --------- */
  function rendreRecap() {
    const b = bonus();
    bonusAffiche = b;
    const total = PACK.credits + b;
    el('#recap').innerHTML = `
      <span class="promo-pile" aria-hidden="true">
        <span class="forfait-piece forfait-piece-credits forfait-piece-xl forfait-piece-eclat${PACK.credits >= 100 ? ' forfait-piece-long' : ''}">
          <span class="forfait-piece-valeur">${PACK.credits}</span>
          <span class="forfait-piece-mention">crédits</span>
        </span>
        ${b ? `<span class="promo-piece-bonus">+${b}</span>` : ''}
      </span>
      <p class="paiement-recap-nom">
        ${libelle}
        <span class="paiement-recap-detail">${credits(PACK.credits)}${b ? ` <span class="whitespace-nowrap text-gold-300">+ ${b} offerts</span>` : ''}</span>
      </p>
      <p class="paiement-recap-prix">${insecable(euro(PACK.prix))}<span class="paiement-recap-ttc">TTC</span></p>
      <p class="paiement-recap-total">
        <strong>${credits(total)}</strong> au total · ${insecable(euro(PACK.prix / total))} / message
      </p>`;
    el('#carte-libelle').textContent = `Payer ${insecable(euro(PACK.prix))} par carte`;
  }

  /* --- Talon : pastille et ligne d'échéance selon l'état ------------------- */
  function rendreTalon(e) {
    const t = {
      promo: ['redeem', 'Promotion appliquée'],
      echue: ['timer_off', 'Promotion terminée'],
      simple: ['receipt_long', 'Votre commande'],
    }[e];
    el('#pastille-icone').textContent = t[0];
    el('#pastille').textContent = t[1];
    el('#echeance').hidden = e === 'simple';
    el('#echeance-icone').textContent = e === 'promo' ? 'timer' : 'timer_off';
    if (e === 'echue') el('#echeance-texte').textContent = 'La promotion n’est plus active : votre pack reste au tarif habituel.';
  }

  /* --- Horloge : échéance relue chaque seconde ------------------------------ */
  let horloge = 0;
  function battre() {
    const e = etatPromo();
    if (e !== etat) {
      if (etat === 'promo') annoncer('La promotion vient de se terminer : votre pack reste au tarif habituel.');
      etat = e;
      rendreRecap();
      rendreTalon(e);
    }
    if (e === 'promo') el('#echeance-texte').textContent = `Offre valable encore ${reste(promos.fin(PROMO) - Date.now())}`;
    else clearInterval(horloge); // une promotion terminée ne revient pas
  }
  battre();
  if (etat === 'promo') horloge = setInterval(battre, 1000);

  /* --- Portefeuille express : celui de l'appareil ---------------------------- */
  const APPLE = 'ApplePaySession' in window;
  el('#express').innerHTML = APPLE
    ? `<svg viewBox="0 0 24 24" class="h-[18px] w-[18px]" fill="currentColor" aria-hidden="true"><path d="M16.4 12.7c0-2.4 2-3.6 2.1-3.7-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.7.9-.8 0-1.9-.9-3.2-.8-1.6 0-3.1 1-4 2.4-1.7 3-.4 7.3 1.2 9.7.8 1.2 1.8 2.5 3 2.4 1.2 0 1.7-.8 3.2-.8s1.9.8 3.2.8c1.3 0 2.2-1.2 3-2.4.9-1.4 1.3-2.7 1.3-2.8-.1 0-2.6-1-2.6-3.8zM14 5.5c.7-.8 1.1-1.9 1-3-1 0-2.1.7-2.8 1.5-.6.7-1.2 1.8-1 2.9 1.1.1 2.2-.6 2.8-1.4z"/></svg>
       <span class="text-[17px] font-bold">Pay</span><span class="sr-only">Payer avec Apple Pay</span>`
    : `<span class="paiement-gpay" aria-hidden="true"><b>G</b><b>o</b><b>o</b><b>g</b><b>l</b><b>e</b> <span>Pay</span></span>
       <span class="sr-only">Payer avec Google Pay</span>`;

  /* --- Paiement simulé -------------------------------------------------------- */
  els('[data-moyen]').forEach((bouton) => bouton.addEventListener('click', () => {
    if (billet.dataset.etat !== 'commande') return;
    // Promotion terminée depuis l'affichage : la commande à jour d'abord.
    if (bonus() !== bonusAffiche) {
      battre();
      UV.toast('La promotion vient de se terminer : votre commande a été mise à jour.', { ton: 'alerte', icone: 'timer_off' });
      return;
    }
    const total = PACK.credits + bonusAffiche;
    billet.dataset.etat = 'traitement';
    els('[data-moyen]').forEach((b) => { b.disabled = true; });
    bouton.innerHTML = `${icone('progress_activity', 'animate-spin text-[20px]')} Paiement en cours…`;
    setTimeout(() => confirmer(total), 1300);
  }));

  /* Payé : le talon devient le reçu, le volet annonce le nouveau solde. */
  function confirmer(total) {
    clearInterval(horloge);
    Store.crediter(total);
    billet.dataset.etat = 'paye';
    el('#retour').hidden = true;
    el('#echeance').hidden = true;
    el('#pastille-icone').textContent = 'check_circle';
    el('#pastille').textContent = 'Paiement confirmé';
    el('#paiement-titre').textContent = 'Merci pour votre achat';
    el('#moyens').hidden = true;
    el('#confirmation').hidden = false;
    el('#confirmation-titre').textContent = `${credits(total)} ajoutés`;
    el('#confirmation-solde').innerHTML = `Votre nouveau solde : <strong class="text-navy">${credits(Store.credits)}</strong>, sans date d’expiration.`;
    el('#confirmation-titre').focus({ preventScroll: true });
    el('#confirmation').scrollIntoView({ behavior: 'smooth', block: 'center' });
    annoncer(`Paiement confirmé : ${total} crédits ajoutés. Nouveau solde : ${Store.credits} crédits.`);
  }
})();
