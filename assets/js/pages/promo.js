/* promo.html — promotion éphémère (chargé après data.js, app.js et modales.js).
   Modèle unique pour toutes les campagnes de UV_DATA.PROMOS : promo.html?id=…
   pour une campagne précise, sinon celle qui court. Le compte à rebours vise
   la fin réelle de la promotion, la même pour tous : ni le rechargement ni la
   session n'y changent rien. La page change d'état d'elle-même à l'échéance
   (à venir → active → dernière heure → terminée) et n'est jamais une impasse :
   hors promotion, les packs habituels restent proposés. Une campagne terminée,
   ou dont l'identifiant n'existe plus (lien d'un ancien e-mail), s'affiche
   « composté » : tampon « Terminée », offre éteinte, message en tête des packs. */
(function () {
  'use strict';
  const D = UV_DATA, { el, icone, euro, echapper, promos } = UV;

  const ID = UV.param('id');
  const PROMO = promos.trouver(ID);
  const INTROUVABLE = !!ID && !PROMO; // campagne retirée de data.js : terminée, sans date
  const PACKS = D.PACKS.filter((p) => !p.essai);
  const EN_PROMO = PROMO ? PACKS.filter((p) => Object.hasOwn(PROMO.bonus, p.id)) : [];
  const DEBUT = PROMO ? Date.parse(PROMO.debut) : 0;
  const FIN = PROMO ? promos.fin(PROMO) : 0;
  const URGENCE = 3600 * 1000; // dernière heure : le décompte passe à l'or
  const billet = el('#billet');

  /** « 19,99 € », « 15 crédits » : jamais coupés en fin de ligne. */
  const insecable = (s) => String(s).replace(/ /g, ' ');
  const credits = (n) => insecable(`${n} crédit${n > 1 ? 's' : ''}`);

  /* --- Dates, toujours à l'heure de Paris ------------------------------------ */
  const PARIS = { timeZone: 'Europe/Paris' };
  const jour = (t, annee) => new Date(t).toLocaleDateString('fr-FR',
    { ...PARIS, weekday: 'long', day: 'numeric', month: 'long', ...(annee ? { year: 'numeric' } : {}) });
  const horaire = (t) => new Date(t).toLocaleTimeString('fr-FR', { ...PARIS, hour: 'numeric', minute: '2-digit' })
    .replace(':', ' h ');
  const enListe = (mots) => new Intl.ListFormat('fr', { type: 'conjunction' }).format(mots);

  /** La part du titre entre *astérisques* passe en or, en grand. */
  const titre = (texte) => echapper(texte).replace(/\*([^*]+)\*/, '<span class="promo-titre-or">$1</span>');

  function etatA(t) {
    if (!PROMO) return INTROUVABLE ? 'terminee' : 'aucune';
    const e = promos.etat(PROMO, t);
    return e === 'active' && FIN - t <= URGENCE ? 'urgent' : e;
  }
  const enCours = (etat) => etat === 'active' || etat === 'urgent';

  /* --- Talon : l'offre et son échéance --------------------------------------- */
  function rendreTalon(etat) {
    const bonusMax = PROMO ? Math.max(...Object.values(PROMO.bonus)) : 0;
    const offre = {
      pastille: (PROMO && PROMO.pastille) || 'Promotion exclusive',
      titre: (PROMO && PROMO.titre) || 'Des crédits *en bonus* sur votre recharge',
    };
    const t = {
      active: { ...offre, accroche: `Jusqu’à ${credits(bonusMax)} offerts, versés sur votre solde avec votre pack.` },
      avenir: { ...offre, accroche: `Jusqu’à ${credits(bonusMax)} offerts sur votre recharge, dès le ${jour(DEBUT)} à ${horaire(DEBUT)}.` },
      // L'offre reste écrite, éteinte sous le tampon : on voit ce qui a pris fin.
      terminee: { ...offre, pastille: 'Promotion terminée', accroche: 'Les crédits offerts ne s’appliquent plus.' },
      aucune: {
        pastille: 'Promotions',
        titre: 'Aucune promotion en cours',
        accroche: 'Nos packs de crédits restent disponibles, sans abonnement ni date d’expiration.',
      },
    }[etat === 'urgent' ? 'active' : etat];

    el('#pastille').textContent = t.pastille;
    el('#pastille-icone').textContent = etat === 'terminee' ? 'timer_off' : 'stars';
    // Le tampon est décoratif : le titre dit lui-même que l'offre est close.
    el('#promo-titre').innerHTML = titre(t.titre) + (etat === 'terminee' ? '<span class="sr-only"> : offre terminée</span>' : '');
    el('#accroche').textContent = t.accroche;

    // Terminée : le cadran reste, à zéro et éteint — le temps est écoulé.
    const decompte = etat !== 'aucune';
    el('#decompte').hidden = !decompte;
    el('#decompte-icone').textContent = etat === 'terminee' ? 'timer_off' : 'timer';
    if (!decompte) return;
    el('#decompte-libelle').textContent = { avenir: 'Commence dans', terminee: 'Temps écoulé' }[etat] || 'Se termine dans';
    el('#echeance').textContent = etat === 'avenir' ? `Le ${jour(DEBUT)} à ${horaire(DEBUT)}`
      : etat !== 'terminee' ? `Jusqu’au ${jour(FIN)}, ${horaire(FIN)}`
      : PROMO ? `Terminée le ${jour(FIN)} à ${horaire(FIN)}` : '';
    if (etat === 'terminee') {
      el('#tuiles').innerHTML = tuiles(0);
      el('#jauge').style.setProperty('--promo-reste', 0);
      el('#tampon-date').textContent = PROMO
        ? new Date(FIN).toLocaleDateString('fr-FR', { ...PARIS, day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '.')
        : '';
    }
  }

  /* --- Volet : les packs ------------------------------------------------------
     En promotion, une pièce de bonus s'empile sur la pièce du pack (« 15 » + « 3 ») ;
     le pack mis en avant est celui dont le message revient le moins cher.
     Hors promotion, la liste habituelle, le pack populaire en vedette.
     Lecture vocale : « Évidence, 15 crédits plus 3 offerts, soit 18 crédits,
     1,11 € par message au lieu de 1,33 €, 19,99 € ». */
  function ligne(p, i, o) {
    const bonus = o.bonus;
    const total = p.credits + bonus;
    const avant = insecable(euro(p.prix / p.credits));
    const parMessage = insecable(euro(p.prix / total));
    // Confirmation d'achat (paiement.html), le bonus porté par l'adresse
    const lien = `paiement.html?pack=${p.id}${bonus ? `&promo=${encodeURIComponent(PROMO.id)}` : ''}`;
    const offert = bonus
      ? `<span aria-hidden="true">+</span>${credits(bonus)} offerts`
      : p.bonus ? `<span aria-hidden="true">+</span>${insecable(`${p.bonus} %`)} offerts` : '';
    return `
<li class="promo-ligne" style="--i: ${i}">
  ${o.vedette ? `<span class="forfait-badge" aria-hidden="true">${o.vedette}</span>` : ''}
  <a href="${lien}" class="promo-pack${o.vedette ? ' promo-pack-vedette' : ''}">
    <span class="promo-pile" aria-hidden="true">
      <span class="forfait-piece forfait-piece-credits${p.credits >= 100 ? ' forfait-piece-long' : ''}${o.vedette ? ' forfait-piece-eclat' : ''}">
        <span class="forfait-piece-valeur">${p.credits}</span>
        <span class="forfait-piece-mention">crédits</span>
      </span>
      ${bonus ? `<span class="promo-piece-bonus">+${bonus}</span>` : ''}
    </span>
    <span class="promo-pack-nom">
      ${p.nom}<span class="sr-only">${o.vedette ? `, ${o.vedette.replace('★ ', '')}` : ''}, ${credits(p.credits)}${bonus ? ` plus ${bonus} offerts, soit ${credits(total)}` : ''}, </span>
    </span>
    <span class="promo-pack-detail">
      ${bonus ? `<s class="promo-barre" aria-hidden="true">${avant}</s> ` : ''}${parMessage}<span aria-hidden="true"> / </span><span class="sr-only"> par </span>message${bonus ? `<span class="sr-only"> au lieu de ${avant}</span>` : ''}
    </span>
    <span class="promo-pack-prix">${insecable(euro(p.prix))}</span>
    ${offert ? `<span class="promo-pack-offert forfait-offert" aria-hidden="true">${offert}</span>` : ''}
    ${icone('chevron_right', 'promo-pack-fleche')}
  </a>
</li>`;
  }

  function rendreVolet(etat) {
    let liste, bonus, vedette, badge;
    if (enCours(etat)) {
      liste = EN_PROMO;
      bonus = (p) => PROMO.bonus[p.id];
      const cout = (p) => p.prix / (p.credits + bonus(p));
      vedette = liste.reduce((a, b) => (cout(b) < cout(a) ? b : a));
      badge = '★ Meilleure offre';
      el('#packs-titre').textContent = 'Choisissez votre pack';
      el('#packs-sous-titre').textContent = 'Les crédits offerts s’ajoutent à ceux du pack.';
    } else {
      liste = PACKS;
      bonus = () => 0;
      vedette = PACKS.find((p) => p.populaire);
      badge = vedette && vedette.badge;
      el('#packs-titre').textContent = 'Nos packs de crédits';
      el('#packs-sous-titre').textContent = etat === 'terminee'
        ? 'Au tarif habituel. Un crédit par message envoyé, les réponses sont gratuites.'
        : 'Un crédit par message envoyé, les réponses sont gratuites.';
    }
    el('#fin').hidden = etat !== 'terminee';
    el('#packs').innerHTML = liste
      .map((p, i) => ligne(p, i, { bonus: bonus(p), vedette: p === vedette ? badge : null }))
      .join('');
  }

  /* --- Conditions : les dates et les packs concernés, en toutes lettres ------- */
  function rendreConditions(etat) {
    const cgv = '<a href="info.html?sujet=cgv" class="font-semibold text-royal underline underline-offset-2">Conditions générales de vente</a>';
    el('#conditions').innerHTML = enCours(etat) || etat === 'avenir'
      ? `Offre valable du ${jour(DEBUT)}, ${horaire(DEBUT)}, au ${jour(FIN, true)}, ${horaire(FIN)} (heure de Paris),
         sur les packs ${enListe(EN_PROMO.map((p) => p.nom))}. Les crédits offerts sont versés avec le pack acheté. ${cgv}`
      : cgv;
  }

  /* --- Compte à rebours ---------------------------------------------------------
     Recalculé sur l'échéance à chaque seconde (aucune dérive ; un onglet remis
     au premier plan retrouve l'heure juste). Les jours disparaissent le dernier jour. */
  const UNITES = [['jour', 86400], ['heure', 3600], ['minute', 60], ['seconde', 1]];

  function tuiles(ms) {
    let reste = Math.ceil(ms / 1000);
    const parts = UNITES.map(([nom, duree]) => {
      const n = Math.floor(reste / duree);
      reste -= n * duree;
      return [nom, n];
    });
    return (parts[0][1] ? parts : parts.slice(1)).map(([nom, n]) => `
      <span class="promo-tuile">
        <span class="promo-tuile-chiffre">${String(n).padStart(2, '0')}</span>
        <span class="promo-tuile-unite">${nom}${n > 1 ? 's' : ''}</span>
      </span>`).join('');
  }

  const ANNONCES = {
    active: 'La promotion a commencé.',
    urgent: 'Plus qu’une heure pour profiter de la promotion.',
    terminee: 'La promotion est terminée. Nos packs de crédits restent disponibles.',
  };

  let etat = null;
  function battre() {
    const t = Date.now();
    const e = etatA(t);
    if (e !== etat) {
      // Le passage à la dernière heure ne touche ni aux textes ni aux packs.
      if (!(etat && enCours(etat) && enCours(e))) {
        rendreTalon(e);
        rendreVolet(e);
        rendreConditions(e);
      }
      if (etat && ANNONCES[e]) el('#annonce').textContent = ANNONCES[e];
      billet.dataset.etat = e;
      etat = e;
    }
    if (enCours(e) || e === 'avenir') {
      const cible = e === 'avenir' ? DEBUT : FIN;
      el('#tuiles').innerHTML = tuiles(cible - t);
      if (enCours(e)) el('#jauge').style.setProperty('--promo-reste', (FIN - t) / (FIN - DEBUT));
      setTimeout(battre, 1000 - (t % 1000) + 10); // calé sur la seconde pleine
    }
  }
  battre();
})();
