/* bienvenue.html — offre de bienvenue (chargé après data.js, app.js et modales.js).
   Le tout premier forfait d'un nouvel inscrit : 15 crédits à prix découverte,
   sans upsell. La pastille crédits de l'en-tête y mène tant que ce premier
   forfait n'est pas pris (Store.nouveauClient) ; une fois payé, la liste des
   forfaits classiques reprend la main. Paiement simulé (1,3 s), comme sur les
   pages Crédits et Confirmation d'achat : rien n'est transmis.
   bienvenue.html?retour=<praticien> : depuis le tchat, « Reprendre » ramène à
   la conversation après paiement. */
(function () {
  'use strict';
  const D = UV_DATA, { el, els, icone, euro, Store } = UV;

  const OFFRE = D.OFFRES.bienvenue;
  const RETOUR = D.byId(UV.param('retour'));
  const carte = el('#carte');
  const insecable = (s) => String(s).replace(/ /g, ' ');
  const credits = (n) => insecable(`${n} crédit${n > 1 ? 's' : ''}`);
  const annoncer = (texte) => { el('#annonce').textContent = texte; };
  const prenom = () => (Store.compte && Store.compte.prenom) || '';
  const remise = Math.round((1 - OFFRE.prix / OFFRE.prixBase) * 100);

  /* --- Volet de l'offre ------------------------------------------------------ */
  el('#salut').textContent = prenom() ? `Bienvenue ${prenom()},` : 'Bienvenue parmi nous,';
  el('#bienvenue-titre').innerHTML = `Continuez avec <span class="bienvenue-or text-gradient-gold">${OFFRE.credits} messages</span> pour
    <span class="bienvenue-or text-gradient-gold">${insecable(euro(OFFRE.prix))}</span> au lieu de <s class="bienvenue-barre">${insecable(euro(OFFRE.prixBase))}</s>`;

  // La pièce des crédits (celle des forfaits), la remise frappée dessus comme
  // la pièce de bonus des promotions, puis le prix et le coût par message.
  el('#recap').innerHTML = `
    <span class="promo-pile" aria-hidden="true">
      <span class="forfait-piece forfait-piece-credits forfait-piece-xl forfait-piece-eclat">
        <span class="forfait-piece-valeur">${OFFRE.credits}</span>
        <span class="forfait-piece-mention">crédits</span>
      </span>
      <span class="promo-piece-bonus bienvenue-remise">−${remise}${insecable(' %')}</span>
    </span>
    <span class="min-w-0">
      <span class="bienvenue-prix">${insecable(euro(OFFRE.prix))} <s class="bienvenue-barre">${insecable(euro(OFFRE.prixBase))}</s></span>
      <span class="bienvenue-cout">soit ${insecable(euro(OFFRE.prix / OFFRE.credits))} le message,
        <span class="whitespace-nowrap">au lieu de ${insecable(euro(OFFRE.prixBase / OFFRE.credits))}</span></span>
      <span class="sr-only">${OFFRE.credits} crédits, ${remise} % de remise</span>
    </span>`;
  el('#payer-libelle').textContent = `Payer — ${insecable(euro(OFFRE.prix))}`;

  if (RETOUR) {
    el('#retour').hidden = false;
    el('#retour-texte').textContent = `${RETOUR.prenom} vous attend : vos crédits seront disponibles dans la conversation.`;
  }

  /* --- Carte bancaire : mise en forme et validation --------------------------- */
  const numero = el('#numero');
  const expiration = el('#expiration');
  const cvv = el('#cvv');
  const chiffres = (s) => s.replace(/\D/g, '');

  /** Somme de Luhn : écarte les fautes de frappe, sans rien transmettre. */
  function luhn(n) {
    let somme = 0, double = false;
    for (let i = n.length - 1; i >= 0; i--) {
      let d = +n[i];
      if (double) { d *= 2; if (d > 9) d -= 9; }
      somme += d;
      double = !double;
    }
    return somme % 10 === 0;
  }
  const marque = (n) => (/^4/.test(n) ? 'visa' : /^(5[1-5]|2[2-7])/.test(n) ? 'mastercard' : null);
  const MARQUES = {
    visa: '<span data-uv-blanc class="paiement-visa">VISA</span><span class="sr-only">Visa</span>',
    mastercard: '<span data-uv-blanc class="paiement-mc"><i></i><i></i></span><span class="sr-only">Mastercard</span>',
  };

  const valide = {
    numero() {
      const n = chiffres(numero.value);
      return n.length >= 13 && n.length <= 19 && luhn(n);
    },
    expiration() {
      const m = /^(\d{2})\/(\d{2})$/.exec(expiration.value);
      if (!m) return false;
      const mois = +m[1], an = 2000 + +m[2];
      if (mois < 1 || mois > 12) return false;
      const now = new Date();
      return an > now.getFullYear() || (an === now.getFullYear() && mois >= now.getMonth() + 1);
    },
    cvv() { return /^\d{3,4}$/.test(cvv.value); },
  };
  const marquer = (champ, ok) => champ.closest('[data-saisie]').toggleAttribute('data-valide', ok);

  numero.addEventListener('input', () => {
    const n = chiffres(numero.value).slice(0, 19);
    numero.value = n.replace(/(\d{4})(?=\d)/g, '$1 ');
    const m = marque(n);
    el('#marque').hidden = !m;
    el('#marque').innerHTML = m ? MARQUES[m] : '';
    marquer(numero, valide.numero());
  });
  expiration.addEventListener('input', () => {
    let v = chiffres(expiration.value).slice(0, 4);
    if (v.length >= 3) v = `${v.slice(0, 2)}/${v.slice(2)}`;
    expiration.value = v;
    marquer(expiration, valide.expiration());
  });
  cvv.addEventListener('input', () => {
    cvv.value = chiffres(cvv.value).slice(0, 4);
    marquer(cvv, valide.cvv());
  });

  const erreur = el('#erreur');
  function dire(message, champ) {
    erreur.textContent = message;
    erreur.hidden = false;
    champ.focus();
    annoncer(message);
  }

  el('#formulaire').addEventListener('submit', (e) => {
    e.preventDefault();
    if (carte.dataset.etat !== 'commande') return;
    if (!valide.numero()) return dire('Vérifiez le numéro de votre carte.', numero);
    if (!valide.expiration()) {
      return dire(expiration.value.length === 5
        ? 'Cette carte semble expirée, ou la date est incorrecte.'
        : 'Indiquez la date d’expiration, au format MM/AA.', expiration);
    }
    if (!valide.cvv()) return dire('Le code de sécurité (CVV) compte 3 chiffres, au dos de la carte.', cvv);
    erreur.hidden = true;
    payer(el('#payer'), 'Paiement en cours…');
  });

  el('#paypal').addEventListener('click', () => {
    if (carte.dataset.etat !== 'commande') return;
    erreur.hidden = true;
    payer(el('#paypal'), 'Connexion à PayPal…');
  });

  /* --- Paiement simulé ---------------------------------------------------------- */
  function payer(bouton, libelle) {
    carte.dataset.etat = 'traitement';
    els('#moyens button, #moyens input').forEach((c) => { c.disabled = true; });
    bouton.innerHTML = `${icone('progress_activity', 'animate-spin text-[20px]')} ${libelle}`;
    annoncer(libelle);
    setTimeout(confirmer, 1300);
  }

  /* Payé : les crédits sont versés, le premier forfait est pris (la pastille
     crédits revient aux forfaits classiques), le volet annonce le nouveau solde. */
  function confirmer() {
    Store.crediter(OFFRE.credits);
    Store.premierForfaitPris();
    carte.dataset.etat = 'paye';
    el('#pastille-icone').textContent = 'check_circle';
    el('#pastille').textContent = 'Paiement confirmé';
    el('#salut').textContent = prenom() ? `Merci ${prenom()},` : 'Merci,';
    el('#bienvenue-titre').textContent = 'Votre offre de bienvenue est activée';
    el('#sous-titre').textContent = 'Bonne première consultation';
    el('#retour').hidden = true;
    el('#moyens').hidden = true;

    const confirmation = el('#confirmation');
    confirmation.hidden = false;
    el('#confirmation-titre').textContent = `${credits(OFFRE.credits)} ajoutés`;
    el('#confirmation-solde').innerHTML = `Votre nouveau solde : <strong class="text-navy">${credits(Store.credits)}</strong>, sans date d’expiration.`;
    if (RETOUR) {
      const suite = el('#suite');
      suite.href = `tchat.html?voyant=${encodeURIComponent(RETOUR.id)}`;
      suite.innerHTML = `Reprendre avec ${RETOUR.prenom} ${icone('arrow_forward', 'text-[20px]')}`;
    }
    el('#confirmation-titre').focus({ preventScroll: true });
    confirmation.scrollIntoView({ behavior: 'smooth', block: 'center' });
    annoncer(`Paiement confirmé : ${OFFRE.credits} crédits ajoutés. Nouveau solde : ${Store.credits} crédits.`);
  }
})();
