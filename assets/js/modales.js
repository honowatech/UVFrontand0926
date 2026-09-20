/* =============================================================================
   unevoyante.fr — Modales
   • Socle commun : <dialog> natif ouvert par showModal() — focus contenu,
     arrière-plan inerte, feuille en bas sur mobile, carte centrée dès 640 px,
     thème clair / nuit porté par les jetons (styles dans src/input.css).
   • Catalogue : chaque modale expose ouvrir() ; celles qui apparaissent
     d'elles-mêmes exposent aussi proposer(), qui porte leur règle d'apparition.

   Fidèle au principe du site : une modale n'est jamais captive. Échap, un clic
   sur le voile et un bouton explicite la referment, et le focus revient là où
   il était. À charger après data.js et app.js.
   ========================================================================== */
(function (global) {
  'use strict';

  const D = global.UV_DATA;
  const { el, icone, euro } = global.UV;
  const RACINE = document.documentElement;

  const mouvementReduit = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  /** Clic ordinaire : ni bouton du milieu, ni touche « nouvel onglet ». */
  const clicSimple = (e) => e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;
  /** Espaces insécables : « 17,99 € » et « 50 % » ne se coupent jamais. */
  const insecable = (s) => String(s).replace(/ /g, '\u00A0');

  /* ==========================================================================
     1. SOCLE
     ========================================================================== */
  /**
   * Ouvre une modale et renvoie { dialogue, panneau, fermer }, ou null si une
   * autre modale est déjà ouverte (elles ne s'empilent pas).
   *   contenu       HTML du panneau (racine : .modale-panneau)
   *   titre         id de l'élément qui nomme la modale (aria-labelledby)
   *   description   id facultatif du texte qui la décrit (aria-describedby)
   *   classe        classe(s) propre(s) à la modale
   *   apresFermeture(raison)  'echap' | 'voile' | la raison passée à fermer()
   */
  function modale(o) {
    if (el('dialog.modale[open]')) return null;

    const dialogue = document.createElement('dialog');
    dialogue.className = `modale ${o.classe || ''}`.trim();
    dialogue.setAttribute('aria-labelledby', o.titre);
    if (o.description) dialogue.setAttribute('aria-describedby', o.description);
    dialogue.innerHTML = o.contenu;
    document.body.appendChild(dialogue);

    const retourFocus = document.activeElement;
    let raison = null;
    let nettoyee = false;

    // Ménage de fin, appelé une seule fois : juste après close(), sans attendre
    // l'événement « close », que certains navigateurs ne délivrent qu'au rendu
    // suivant (onglet masqué, page qui ne se dessine pas).
    function nettoyer() {
      if (nettoyee) return;
      nettoyee = true;
      RACINE.classList.remove('uv-modale-ouverte', 'uv-gouttiere');
      dialogue.remove();
      if (retourFocus && retourFocus.isConnected && retourFocus !== document.body) {
        retourFocus.focus({ preventScroll: true });
      }
      if (o.apresFermeture) o.apresFermeture(raison || 'echap');
    }

    /** `instantane` : sans animation de sortie, pour enchaîner sur une autre
        modale (upsell) sans laisser l'écran vide entre les deux. */
    function fermer(motif, instantane) {
      if (raison) return;
      raison = motif || 'fermer';
      const terminer = () => {
        if (dialogue.open) dialogue.close();
        nettoyer();
      };
      if (instantane) return terminer();
      dialogue.classList.add('est-sortante');
      dialogue.addEventListener('animationend', (e) => { if (e.target === dialogue) terminer(); });
      setTimeout(terminer, mouvementReduit() ? 0 : 280); // filet si l'animation ne se termine pas
    }

    // Échap : sortie animée plutôt que fermeture sèche. La touche est traitée
    // ici (tous les navigateurs et vues intégrées ne transmettent pas la
    // demande de fermeture au <dialog>) ; « cancel » couvre les autres
    // demandes, comme le geste retour d'Android. Si le navigateur ferme sans
    // passer par fermer(), l'événement « close » fait le ménage.
    dialogue.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape' || e.defaultPrevented) return;
      e.preventDefault();
      fermer('echap');
    });
    dialogue.addEventListener('cancel', (e) => { e.preventDefault(); fermer('echap'); });

    // Clic sur le voile : l'appui doit aussi avoir commencé dehors, sans quoi
    // une sélection de texte relâchée hors du panneau fermerait la modale.
    let appuiDehors = false;
    dialogue.addEventListener('pointerdown', (e) => { appuiDehors = e.target === dialogue; });
    dialogue.addEventListener('click', (e) => { if (e.target === dialogue && appuiDehors) fermer('voile'); });

    dialogue.addEventListener('close', nettoyer);

    // Verrou de défilement ; gouttière réservée seulement si la page en avait une.
    RACINE.classList.toggle('uv-gouttiere', global.innerWidth > RACINE.clientWidth);
    RACINE.classList.add('uv-modale-ouverte');
    dialogue.showModal();

    // Focus sur le panneau, jamais sur le bouton principal : une touche Entrée
    // tapée dans la foulée (zone de saisie du tchat) ne doit rien déclencher.
    const panneau = el('.modale-panneau', dialogue);
    if (panneau) panneau.focus({ preventScroll: true });

    return { dialogue, panneau, fermer };
  }

  /** Constellation : même motif que le ciel de l'accueil (opacité au choix). */
  function ciel(opacite) {
    return `
<svg aria-hidden="true" class="pointer-events-none absolute inset-0 -z-10 h-full w-full text-gold ${opacite || 'opacity-40'}"
     viewBox="0 0 400 240" fill="none" preserveAspectRatio="xMidYMid slice">
  <circle cx="36" cy="44" r="1.5" fill="currentColor"/><circle cx="88" cy="92" r="2" fill="currentColor"/>
  <circle cx="58" cy="176" r="1" fill="currentColor"/><circle cx="104" cy="214" r="1.5" fill="currentColor"/>
  <circle cx="318" cy="30" r="2.5" fill="currentColor"/><circle cx="366" cy="82" r="1.5" fill="currentColor"/>
  <circle cx="306" cy="150" r="1.5" fill="currentColor"/><circle cx="352" cy="208" r="2" fill="currentColor"/>
  <circle cx="210" cy="18" r="1" fill="currentColor"/>
  <path d="M36 44 L88 92 L58 176 M318 30 L366 82 L306 150 L352 208"
        stroke="currentColor" stroke-dasharray="3 3" stroke-width=".75"/>
</svg>`;
  }

  /* ==========================================================================
     2. PROMO CLIENTS VERT
     Offre flash proposée à l'ouverture du tchat. Le compte à rebours est réel :
     à zéro l'offre expire, et elle ne revient pas dans la session — une
     urgence qui se réinitialiserait au rechargement ne serait pas crédible.
     Le bouton principal mène au paiement, l'offre présélectionnée
     (credits.html?offre=vert) : aucun débit sans moyen de paiement ni CGV.
     ========================================================================== */
  const promoVert = (() => {
    const O = D.OFFRES.vert;
    const SESSION = 'unevoyante.offre.vert';
    const DELAI = 600; // le tchat s'affiche d'abord : la modale glisse par-dessus

    const minutes = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

    function ouvrir(options) {
      const opts = options || {};
      const retour = opts.retour ? `retour=${encodeURIComponent(opts.retour)}` : '';
      const lienOffre = `credits.html?offre=${O.id}${retour ? '&' + retour : ''}`;
      const lienPacks = `credits.html${retour ? '?' + retour : ''}`;
      const prix = insecable(euro(O.prix));

      const m = modale({
        titre: 'promo-vert-titre',
        description: 'promo-vert-description',
        classe: 'promo-vert',
        apresFermeture: () => cancelAnimationFrame(image),
        contenu: `
<div class="modale-panneau" tabindex="-1" data-etat="active">

  <!-- En-tête nuit : compte à rebours et valeur de l'offre -->
  <div class="promo-entete">
    ${ciel()}
    <span aria-hidden="true" class="promo-lueur absolute left-1/2 top-[64%] -z-10 h-36 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/25 blur-3xl"></span>

    <p class="promo-minuteur" role="timer">
      ${icone('timer', 'text-[18px] text-gold')}
      <span data-minuteur>Votre offre expire dans <span class="promo-chiffres" data-chiffres>${minutes(O.duree)}</span></span>
    </p>

    <p class="promo-valeur mt-5 flex flex-col items-center">
      <span class="promo-chiffre-valeur text-gradient-gold">${O.credits}</span>
      <span class="mt-2 pl-[0.3em] text-label-lg font-extrabold uppercase tracking-[0.3em] text-gold-300">crédits</span>
    </p>

    <!-- Jauge : se vide en même temps que le compte à rebours -->
    <span aria-hidden="true" class="absolute inset-x-0 bottom-0 h-1 bg-white/10">
      <span class="block h-full origin-left bg-gold-cta" data-jauge></span>
    </span>
  </div>

  <!-- Offre et décision -->
  <div class="modale-pied text-center">
    <h2 id="promo-vert-titre" class="text-h-md" data-titre>Offre spéciale pour vous</h2>

    <p class="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-2" data-prix>
      <span class="whitespace-nowrap font-display text-h-lg font-extrabold text-navy">${prix}</span>
      <span class="badge-promo px-3 py-1.5 text-label-md">${icone('stars', 'text-[16px]')} ${insecable(`${O.bonus} %`)} de crédits en plus</span>
    </p>
    <p class="mt-3 hidden text-body-md text-muted" data-expiree>
      Nos packs de crédits restent disponibles, sans engagement ni abonnement.
    </p>

    <a href="${lienOffre}" class="btn-gold btn-lg mt-6 w-full max-[359px]:px-5" data-principal>
      Je récupère mes ${O.credits} crédits ${icone('arrow_forward', 'text-[20px] max-[359px]:hidden')}
    </a>
    <button type="button" class="mt-2 inline-flex min-h-[44px] w-full items-center justify-center rounded-full text-label-md font-bold text-muted transition-colors hover:text-navy" data-refus>
      Non merci
    </button>

    <p id="promo-vert-description" class="sr-only">
      ${O.credits} crédits pour ${prix}, soit ${insecable(`${O.bonus} %`)} de crédits en plus. Offre valable ${O.duree} secondes.
    </p>
    <p class="sr-only" aria-live="polite" data-annonce></p>
  </div>
</div>`,
      });
      if (!m) return null;

      const { panneau, fermer } = m;
      const q = (sel) => el(sel, panneau);
      const principal = q('[data-principal]');
      const jauge = q('[data-jauge]');
      const chiffres = q('[data-chiffres]');
      const annonce = q('[data-annonce]');

      /* --- Compte à rebours -------------------------------------------------
         Calé sur une échéance plutôt que sur des tics : aucune dérive, et
         l'onglet mis en arrière-plan retrouve l'heure juste au retour. */
      const total = O.duree * 1000;
      const echeance = performance.now() + total;
      let affiche = O.duree;
      // Rouverte depuis l'upsell : l'offre est déjà réservée, pas de décompte.
      let image = opts.reservee ? 0 : requestAnimationFrame(battre);

      function battre() {
        const restant = Math.max(0, echeance - performance.now());
        jauge.style.transform = `scaleX(${restant / total})`;
        const s = Math.ceil(restant / 1000);
        if (s !== affiche && s > 0) {
          affiche = s;
          chiffres.textContent = minutes(s);
          if (s <= 5 && panneau.dataset.etat === 'active') {
            panneau.dataset.etat = 'urgent';
            annonce.textContent = 'Plus que 5 secondes pour profiter de l’offre.';
          }
        }
        if (restant === 0) return expirer();
        image = requestAnimationFrame(battre);
      }

      function minuteur(nomIcone, texte) {
        q('.promo-minuteur .material-symbols-outlined').textContent = nomIcone;
        q('[data-minuteur]').textContent = texte;
      }

      /* À zéro : l'offre expire pour de bon, mais la modale ne devient pas une
         impasse — le bouton principal mène aux packs habituels. */
      function expirer() {
        panneau.dataset.etat = 'expiree';
        minuteur('timer_off', 'Offre expirée');
        q('[data-titre]').textContent = 'Cette offre a expiré';
        q('[data-prix]').classList.add('hidden');
        q('[data-expiree]').classList.remove('hidden');
        principal.href = lienPacks;
        principal.className = 'btn-ghost btn-lg mt-6 w-full max-[359px]:px-5';
        principal.innerHTML = `Voir les packs de crédits ${icone('arrow_forward', 'text-[20px] max-[359px]:hidden')}`;
        q('[data-refus]').textContent = 'Fermer';
        annonce.textContent = 'L’offre a expiré. Les packs de crédits restent disponibles.';
      }

      function reserver() {
        cancelAnimationFrame(image);
        panneau.dataset.etat = 'reservee';
        minuteur('check_circle', 'Offre réservée');
        jauge.style.transform = 'scaleX(1)';
      }
      if (opts.reservee) reserver();

      principal.addEventListener('click', (e) => {
        if (panneau.dataset.etat === 'expiree') return;
        // Ouverture dans un nouvel onglet : la modale reste, le décompte aussi.
        if (!clicSimple(e)) return;
        reserver();
        // Upsell avant le paiement ; la croix y ramène ici, offre toujours réservée.
        e.preventDefault();
        fermer('upsell', true);
        upsell.ouvrir({
          achat: { libelle: 'votre offre spéciale', lien: lienOffre },
          precedente: () => ouvrir({ ...opts, reservee: true }),
        });
      });

      q('[data-refus]').addEventListener('click', () => fermer('refus'));

      // Retour arrière depuis la page de paiement : la page est restaurée telle
      // quelle (cache de navigation), modale « réservée » comprise. On la retire.
      addEventListener('pageshow', (e) => { if (e.persisted) fermer('retour'); }, { once: true });

      return m;
    }

    const dejaProposee = () => {
      try { return !!sessionStorage.getItem(SESSION); } catch (e) { return false; }
    };

    /** Règle d'apparition : une fois par session, jamais dans un onglet caché. */
    function proposer(options) {
      if (dejaProposee()) return;
      const lancer = () => {
        // Onglet ouvert en arrière-plan : le décompte attendra qu'on le regarde.
        if (document.visibilityState !== 'visible') {
          document.addEventListener('visibilitychange', lancer, { once: true });
          return;
        }
        setTimeout(() => {
          if (dejaProposee()) return;
          if (document.visibilityState !== 'visible') return lancer();
          try { sessionStorage.setItem(SESSION, String(Date.now())); } catch (e) { /* session non mémorisable */ }
          ouvrir(options);
        }, DELAI);
      };
      lancer();
    }

    return { ouvrir, proposer };
  })();

  /* ==========================================================================
     3. LISTE DES FORFAITS
     Ouverte par la pastille crédits de l'en-tête, sur toutes les pages. Chaque
     pack mène au paiement, présélectionné (credits.html?pack=…) : on choisit
     ici, on confirme le moyen de paiement et les CGV sur la page Crédits.
     ========================================================================== */
  const forfaits = (() => {
    const PACKS = D.PACKS.filter((p) => !p.essai);

    const solde = (n) => (n === 0
      ? 'Vous n’avez plus de crédits'
      : `Il vous reste <strong class="font-extrabold">${n} crédit${n > 1 ? 's' : ''}</strong>`);

    /* Une ligne : pièce d'or portant les crédits · nom en vedette et coût par
       message · prix et bonus offert en vert. Lecture vocale : « Certitude,
       pack populaire, 25 crédits, 1,20 € par message, 29,99 €, 67 % offerts ». */
    function ligne(p, retour, i) {
      return `
<li class="forfait-ligne" style="--i: ${i}">
  ${p.badge ? `<span class="forfait-badge" aria-hidden="true">${p.badge}</span>` : ''}
  <a href="credits.html?pack=${p.id}${retour}" class="forfait${p.populaire ? ' forfait-populaire' : ''}" data-pack="${p.id}">
    <span class="forfait-piece forfait-piece-credits${p.credits >= 100 ? ' forfait-piece-long' : ''}${p.populaire ? ' forfait-piece-eclat' : ''}" aria-hidden="true">
      <span class="forfait-piece-valeur">${p.credits}</span>
      <span class="forfait-piece-mention">crédits</span>
    </span>
    <span class="min-w-0 flex-1">
      <span class="block font-display text-h-md font-extrabold leading-tight text-navy max-[359px]:text-[18px]">${p.nom}</span>
      <span class="sr-only">${p.populaire ? ', pack populaire' : ''}, ${p.credits} crédits, soit </span>
      <span class="mt-0.5 block whitespace-nowrap text-body-sm text-muted">
        ${insecable(euro(p.prix / p.credits))}<span aria-hidden="true"> / </span><span class="sr-only"> par </span>message
      </span>
    </span>
    <span class="shrink-0 text-right">
      <span class="block whitespace-nowrap font-display text-h-sm font-extrabold leading-tight text-navy">${insecable(euro(p.prix))}</span>
      ${p.bonus ? `<span class="forfait-offert"><span aria-hidden="true">+</span>${p.bonus}${insecable(' %')} offerts<span class="sr-only"> en crédits</span></span>` : ''}
    </span>
  </a>
</li>`;
    }

    function ouvrir(options) {
      const opts = options || {};
      const { Store, pageCourante } = global.UV;
      // Depuis le tchat, « Reprendre » ramènera à la conversation après paiement.
      const voyant = 'retour' in opts ? opts.retour
        : pageCourante() === 'tchat.html' ? Store.all.dernierVoyant : null;
      const retour = voyant ? `&retour=${encodeURIComponent(voyant)}` : '';
      const n = Store.credits;

      const m = modale({
        titre: 'forfaits-titre',
        description: 'forfaits-solde forfaits-description',
        classe: 'modale-forfaits',
        contenu: `
<div class="modale-panneau" tabindex="-1">
  <!-- En-tête : lueur champagne, solde annoncé en toutes lettres -->
  <div class="forfaits-entete">
    ${ciel('opacity-20')}
    <button type="button" class="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full text-muted transition-colors hover:bg-ice hover:text-navy" data-fermer aria-label="Fermer">
      ${icone('close', 'text-[22px]')}
    </button>
    <p id="forfaits-solde" class="forfaits-solde${n === 0 ? ' forfaits-solde-vide' : ''}">${solde(n)}</p>
    <h2 id="forfaits-titre" class="mt-1 text-h-lg-m">Rechargez vos crédits</h2>
    <p id="forfaits-description" class="mx-auto mt-1 max-w-xs text-body-md text-muted">Poursuivez votre consultation sans interruption</p>
  </div>

  <ul class="mt-5 flex flex-col gap-3 px-6 sm:px-8" role="list" aria-label="Packs de crédits">
    ${PACKS.map((p, i) => ligne(p, retour, i)).join('')}
  </ul>

  <p class="modale-pied flex items-center justify-center gap-1.5 text-body-sm text-muted">
    ${icone('lock', 'text-[16px] text-royal')} Paiement sécurisé · Sans abonnement
  </p>
</div>`,
      });
      if (!m) return null;

      el('[data-fermer]', m.panneau).addEventListener('click', () => m.fermer('fermer'));

      // Choix d'un pack : upsell avant le paiement ; la croix ramène à cette liste.
      m.panneau.querySelectorAll('[data-pack]').forEach((a) => a.addEventListener('click', (e) => {
        if (!clicSimple(e)) return;
        e.preventDefault();
        const p = PACKS.find((x) => x.id === a.dataset.pack);
        m.fermer('upsell', true);
        upsell.ouvrir({
          achat: { libelle: `votre Pack ${p.nom}`, lien: a.getAttribute('href') },
          precedente: () => ouvrir(opts),
        });
      }));
      return m;
    }

    return { ouvrir };
  })();

  /* ==========================================================================
     4. UPSELL — offre complémentaire
     Au moment de valider une offre (modale promo) ou un pack (liste des
     forfaits), un complément est proposé EN PLUS de l'achat en cours.
       Accepter        → paiement, complément ajouté (…&complement=plus20)
       Non merci       → paiement de l'achat initial, sans complément
       Croix, Échap,   → retour à la modale d'origine : rien n'est perdu,
       clic sur le voile  pas de navigation surprise
     Rien n'est débité ici : tout se confirme, et se retire, sur la page Crédits.
     ========================================================================== */
  const upsell = (() => {
    const C = D.COMPLEMENTS.plus20;
    const avecComplement = (lien) => `${lien}${lien.includes('?') ? '&' : '?'}complement=${C.id}`;

    const ATOUTS = [
      ['auto_awesome', 'Réponses plus complètes'],
      ['shield', 'Évitez la coupure au moment clé'],
      ['timer', 'Offre affichée maintenant'],
    ];

    /**
     * achat       { libelle: 'votre Pack Certitude', lien: 'credits.html?pack=certitude' }
     * precedente  rouvre la modale d'origine (croix, Échap, voile) ; facultatif
     */
    function ouvrir(options) {
      const opts = options || {};
      const achat = opts.achat || { libelle: 'votre achat', lien: 'credits.html' };
      const prix = insecable(euro(C.prix));

      const m = modale({
        titre: 'upsell-titre',
        description: 'upsell-contexte upsell-prix',
        classe: 'modale-upsell',
        apresFermeture: (raison) => {
          if (['croix', 'echap', 'voile'].includes(raison) && opts.precedente) opts.precedente();
        },
        contenu: `
<div class="modale-panneau" tabindex="-1">

  <!-- En-tête nuit : ce qui s'ajoute, et pour combien -->
  <div class="promo-entete">
    ${ciel()}
    <span aria-hidden="true" class="promo-lueur absolute left-1/2 top-[62%] -z-10 h-32 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/25 blur-3xl"></span>

    <div class="flex w-full items-start gap-2">
      <span class="w-10 shrink-0" aria-hidden="true"></span>
      <p id="upsell-contexte" class="flex min-h-10 flex-1 items-center justify-center gap-1.5 text-label-md text-white/85">
        ${icone('redeem', 'text-[18px] text-gold shrink-0')}
        <span>En plus de ${achat.libelle}</span>
      </p>
      <button type="button" class="-mr-2 -mt-1 grid h-10 w-10 shrink-0 place-items-center rounded-full text-white/75 transition-colors hover:bg-white/10 hover:text-white" data-croix aria-label="Fermer cette offre">
        ${icone('close', 'text-[22px]')}
      </button>
    </div>

    <h2 id="upsell-titre" class="upsell-valeur text-gradient-gold">+${C.credits} crédits</h2>
    <p id="upsell-prix" class="mt-2 text-body-md text-white/75">
      pour seulement <strong class="whitespace-nowrap font-extrabold text-white">${prix}</strong>
    </p>
  </div>

  <!-- Atouts, garanties et décision -->
  <div class="modale-pied text-center">
    <ul class="upsell-atouts" role="list">
      ${ATOUTS.map(([nom, texte]) => `
      <li class="upsell-atout">
        <span class="upsell-atout-icone">${icone(nom, 'text-[20px]')}</span>
        <span>${texte}</span>
      </li>`).join('')}
    </ul>

    <ul class="upsell-garanties" role="list">
      <li class="font-semibold text-navy">${icone('lock', 'text-[16px] text-online')} Paiement ${insecable('100 %')} sécurisé</li>
      <li>${icone('bolt', 'text-[16px] text-royal')} Approbation instantanée</li>
      <li>${icone('done_all', 'text-[16px] text-royal')} Compatible tous packs</li>
    </ul>

    <a href="${avecComplement(achat.lien)}" class="btn-gold btn-lg mt-6 w-full" data-accepter>Accepter</a>
    <a href="${achat.lien}" class="mt-2 inline-flex min-h-[44px] items-center justify-center px-2 text-body-md text-muted underline underline-offset-4 transition-colors hover:text-navy" data-refuser>
      Non merci, continuer sans mon cadeau
    </a>
    <p class="flex items-center justify-center gap-1.5 text-body-sm text-muted">
      ${icone('verified_user', 'text-[16px] text-royal')} Sans engagement
    </p>
  </div>
</div>`,
      });
      if (!m) return null;

      el('[data-croix]', m.panneau).addEventListener('click', () => m.fermer('croix'));
      // Retour arrière depuis la page de paiement (cache de navigation) : on retire la modale.
      addEventListener('pageshow', (e) => { if (e.persisted) m.fermer('retour', true); }, { once: true });
      return m;
    }

    return { ouvrir };
  })();

  /* --- API publique -------------------------------------------------------- */
  global.UV.modale = modale;
  global.UV.modales = { promoVert, forfaits, upsell };
})(window);
