/* =============================================================================
   unevoyante.fr — Socle applicatif
   • Magasin d'état persistant (crédits, compte, conversations, favoris)
   • En-tête, pied de page et barre d'onglets partagés (Web Components)
   • Fabriques de composants réutilisés par plusieurs pages
   • Notifications, accordéons, bandeau cookies, préchargement des liens

   Principe directeur : AUCUN écran ne bloque la navigation. Pas de connexion
   obligatoire, pas de modale captive, pas d'impasse. Un solde à zéro propose
   une recharge mais laisse tout le site accessible.
   ========================================================================== */
(function (global) {
  'use strict';

  const D = global.UV_DATA;

  /* ==========================================================================
     1. MAGASIN D'ÉTAT
     ========================================================================== */
  const CLE = 'unevoyante.state.v2';

  /** Conversation de démonstration avec Claire, horodatée par rapport à maintenant. */
  function conversationDemo() {
    const maintenant = Date.now();
    const messages = (D.DEMO_TCHAT || []).map((m) => ({
      de: m.de, texte: m.texte, t: maintenant - m.ilYA * 60000,
    }));
    if (!messages.length) return {};
    return { claire: { messages, nonLus: 0, maj: messages[messages.length - 1].t } };
  }

  function etatInitial() {
    return {
      credits: 3,
      consommes: 2,                     // crédits consommés depuis toujours (jamais remis à zéro) :
                                        // deux messages déjà envoyés dans la conversation de démonstration
      compte: null,                     // { prenom, email } — facultatif, jamais bloquant
      favoris: [],
      conversations: conversationDemo(), // { [voyantId]: { messages:[], nonLus:number, maj:number } }
      dernierVoyant: 'claire',
      packChoisi: 'certitude',
      cookies: null,                    // 'essentiels' | 'tous' — null tant que non choisi
      astuces: {},                      // bandeaux d'information refermés
    };
  }

  function lire() {
    try {
      const brut = localStorage.getItem(CLE);
      if (!brut) return etatInitial();
      const lu = { ...etatInitial(), ...JSON.parse(brut) };
      // Les anciennes lignes « crédit débité » ne sont plus affichées dans le fil.
      Object.values(lu.conversations || {}).forEach((c) => {
        if (c && Array.isArray(c.messages)) c.messages = c.messages.filter((m) => m.de !== 'systeme');
      });
      return lu;
    } catch (e) {
      return etatInitial();
    }
  }

  let etat = lire();

  function ecrire() {
    try {
      localStorage.setItem(CLE, JSON.stringify(etat));
    } catch (e) { /* navigation privée : on continue en mémoire */ }
    document.dispatchEvent(new CustomEvent('uv:etat', { detail: etat }));
  }

  /* --- Paliers de fidélité -------------------------------------------------
     Les paliers se lisent sur les crédits CONSOMMÉS (D.PALIERS, puis la règle
     récurrente sans fin) : rien à réclamer, la récompense tombe dans le solde
     au franchissement. Défini avant le magasin, qui s'en sert pour créditer.
     Tout part d'`etat(consommes)` : le palier visé, le précédent — la barre
     du tchat ne montre que la part parcourue DANS le palier en cours. */
  const fidelite = (() => {
    const DERNIER = D.PALIERS[D.PALIERS.length - 1];

    /** « 5 crédits » ne se coupe jamais en fin de ligne. */
    const credits = (n) => `${n} crédit${n > 1 ? 's' : ''}`;

    function etat(consommes) {
      const n = Math.max(0, consommes || 0);
      const suivant = D.PALIERS.find((p) => p.seuil > n);
      // Au-delà du dernier palier listé : le palier en cours est le prochain
      // multiple du pas, à partir de ce dernier seuil (150, 200, 250…).
      const franchis = suivant ? 0 : Math.floor((n - DERNIER.seuil) / D.PALIER_RECURRENT.pas);
      const precedent = suivant
        ? (D.PALIERS[D.PALIERS.indexOf(suivant) - 1] || { seuil: 0 }).seuil
        : DERNIER.seuil + franchis * D.PALIER_RECURRENT.pas;
      const seuil = suivant ? suivant.seuil : precedent + D.PALIER_RECURRENT.pas;
      return {
        consommes: n,
        precedent,
        seuil,
        recompense: suivant ? suivant.credits : D.PALIER_RECURRENT.credits,
        restant: seuil - n,
        progression: (n - precedent) / (seuil - precedent),
        recurrent: !suivant,
      };
    }

    /** Les paliers listés, chacun avec son état : 'obtenu' | 'actuel' | 'avenir'. */
    function liste(consommes) {
      const e = etat(consommes);
      return D.PALIERS.map((p) => ({
        ...p,
        etat: p.seuil <= e.consommes ? 'obtenu' : p.seuil === e.seuil ? 'actuel' : 'avenir',
      }));
    }

    /** Le palier franchi en passant de `avant` à `apres` crédits consommés,
        zone récurrente comprise, ou null. */
    function franchi(avant, apres) {
      const palier = D.PALIERS.find((p) => p.seuil > avant && p.seuil <= apres);
      if (palier) return { seuil: palier.seuil, credits: palier.credits };
      const pas = D.PALIER_RECURRENT.pas;
      const rang = Math.floor(Math.max(avant - DERNIER.seuil, 0) / pas) + 1;
      const seuil = DERNIER.seuil + rang * pas;
      if (seuil > avant && seuil <= apres) return { seuil, credits: D.PALIER_RECURRENT.credits };
      return null;
    }

    /** Deux formulations du même état : `court` s'affiche, `longue` se lit
        (lecteurs d'écran, infobulle) et détaille la récompense attendue. */
    function libelles(consommes, cout = 1) {
      const e = etat(consommes);
      // Le court compte en messages : `cout` est le prix d'un message, en
      // crédits, chez le praticien courant.
      const messages = Math.ceil(e.restant / Math.max(1, cout));
      const offert = `+${credits(e.recompense)} offert${e.recompense > 1 ? 's' : ''}`;
      const court = e.consommes === 0
        ? `Fidélité : ${offert} dès ${credits(e.seuil)} consommés`
        : messages === 1
          ? `Plus qu’1 message avant ${offert}`
          : `Plus que ${messages} messages avant ${offert}`;
      return {
        court,
        longue: `${credits(e.restant)} restant à consommer pour atteindre le palier de ${credits(e.seuil)} `
          + `consommés et toucher une récompense de ${credits(e.recompense)}.`,
      };
    }

    return { etat, liste, franchi, libelles };
  })();

  const Store = {
    get all() { return etat; },
    get credits() { return etat.credits; },
    get consommes() { return etat.consommes; },
    get compte() { return etat.compte; },
    get connecte() { return !!etat.compte; },

    set(patch) { etat = { ...etat, ...patch }; ecrire(); return etat; },

    crediter(n) { etat.credits = Math.max(0, etat.credits + n); ecrire(); return etat.credits; },
    debiter(n) {
      if (etat.credits < n) return false;
      etat.credits -= n; etat.consommes += n; ecrire(); return true;
    },
    /** Débit d'une consultation, récompense de fidélité comprise : renvoie le
        palier franchi ({ seuil, credits }), null si aucun, false si le solde
        ne suffit pas. Une seule écriture : l'appelant voit le solde définitif. */
    consommer(n) {
      if (etat.credits < n) return false;
      const avant = etat.consommes;
      etat.credits -= n;
      etat.consommes = avant + n;
      const palier = fidelite.franchi(avant, etat.consommes);
      if (palier) etat.credits += palier.credits;
      ecrire();
      return palier;
    },

    connexion(compte) {
      const nouveau = !etat.compte;
      etat.compte = compte;
      if (nouveau && etat.credits < 3) etat.credits = 3;
      ecrire();
    },
    deconnexion() { etat.compte = null; ecrire(); },

    basculerFavori(id) {
      const i = etat.favoris.indexOf(id);
      if (i >= 0) etat.favoris.splice(i, 1); else etat.favoris.push(id);
      ecrire();
      return i < 0;
    },
    estFavori(id) { return etat.favoris.includes(id); },

    conversation(id) {
      if (!etat.conversations[id]) {
        etat.conversations[id] = { messages: [], nonLus: 0, maj: Date.now() };
      }
      return etat.conversations[id];
    },
    ajouterMessage(id, msg) {
      const c = Store.conversation(id);
      c.messages.push(msg);
      c.maj = Date.now();
      ecrire();
      return c;
    },
    marquerLu(id) {
      const c = Store.conversation(id);
      c.nonLus = 0; ecrire();
    },
    reinitialiser() {
      etat = etatInitial();
      ecrire();
    },
  };

  /* ==========================================================================
     2. OUTILS
     ========================================================================== */
  const el = (sel, racine) => (racine || document).querySelector(sel);
  const els = (sel, racine) => Array.from((racine || document).querySelectorAll(sel));

  const euro = (n) => n.toFixed(2).replace('.', ',') + ' €';
  const nombre = (n) => n.toLocaleString('fr-FR').replace(/ /g, ' ');
  const note = (n) => n.toFixed(1).replace('.', ',');

  const heure = (d) => new Date(d).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  function param(nom, defaut) {
    return new URLSearchParams(location.search).get(nom) || defaut || null;
  }

  function echapper(s) {
    return String(s).replace(/[&<>"']/g, (c) => (
      { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
    ));
  }

  const STATUTS = {
    online: { label: 'En ligne', classe: 'badge-online', dot: 'dot-online', point: 'bg-online' },
    busy: { label: 'En consultation', classe: 'badge-busy', dot: 'dot-busy', point: 'bg-busy' },
    offline: { label: 'Hors ligne', classe: 'badge-offline', dot: 'dot-offline', point: 'bg-offline' },
  };

  const icone = (nom, classes) =>
    `<span class="material-symbols-outlined ${classes || ''}" aria-hidden="true">${nom}</span>`;

  function etoiles(n, taille) {
    const t = taille || 'text-[15px]';
    let out = '';
    for (let i = 1; i <= 5; i++) {
      const pleine = i <= Math.round(n);
      out += `<span class="material-symbols-outlined ${t} ${pleine ? 'icon-fill text-gold' : 'text-line'}" aria-hidden="true">star</span>`;
    }
    return `<span class="inline-flex items-center gap-px" role="img" aria-label="${note(n)} sur 5">${out}</span>`;
  }

  /** Logotype « unevoyante.fr » : Nunito 800, drapeau tricolore sur le « t ». */
  function logo(classes, href, sigle) {
    const complet = 'unevoyan<span class="uv-logo-t">t<i class="uv-flag"></i></span>e.fr';
    // Sigle « UV » : sous 640 px dans l'en-tête, il laisse la place aux commandes
    // (le logotype complet ne tient pas à côté d'elles sur un téléphone).
    const contenu = sigle
      ? `<span aria-hidden="true" class="uv-sigle sm:hidden">U<span class="uv-logo-v">V<i class="uv-flag"></i></span></span>
         <span aria-hidden="true" class="hidden sm:inline">${complet}</span>`
      : `<span aria-hidden="true">${complet}</span>`;
    return `<a href="${href || 'index.html'}" class="uv-logo ${classes || ''}" aria-label="unevoyante.fr — accueil">
      ${contenu}
    </a>`;
  }

  /** Avatar rond : la photo du praticien si elle existe. L'initiale reste
      dessous : visible pendant le chargement et si l'image échoue. */
  function monogramme(v, taille, avecStatut) {
    const t = taille || 'h-14 w-14 text-h-md';
    const st = avecStatut === false ? '' :
      `<span class="monogram-status ${STATUTS[v.statut].point}"></span>`;
    const photo = v.photo
      ? `<img src="${v.photo}" alt="" width="288" height="288" loading="lazy" decoding="async" class="monogram-photo" onerror="this.remove()">`
      : '';
    return `<span class="monogram ${t}" aria-hidden="true">${v.prenom[0]}${photo}${st}</span>`;
  }

  /* ==========================================================================
     3. NOTIFICATIONS (toasts)
     ========================================================================== */
  function toast(message, options) {
    const o = options || {};
    let zone = el('#uv-toasts');
    if (!zone) {
      zone = document.createElement('div');
      zone.id = 'uv-toasts';
      zone.className = 'fixed bottom-4 left-1/2 z-[90] flex w-[min(92vw,420px)] -translate-x-1/2 flex-col gap-2 sm:bottom-6';
      zone.setAttribute('role', 'status');
      zone.setAttribute('aria-live', 'polite');
      document.body.appendChild(zone);
    }
    const t = document.createElement('div');
    const ton = o.ton === 'or'
      ? 'bg-gold-cta text-navy'
      : o.ton === 'alerte' ? 'bg-white text-navy border border-gold' : 'bg-navy text-white';
    t.className = `pointer-events-auto flex animate-pop-in items-center gap-3 rounded-full ${ton} px-5 py-3 text-label-md shadow-lift`;
    t.innerHTML = `${icone(o.icone || 'check_circle', 'text-[18px] shrink-0')}<span class="flex-1">${echapper(message)}</span>`;
    if (o.action && o.href) {
      t.innerHTML += `<a href="${o.href}" class="shrink-0 rounded-full bg-white/15 px-3 py-1 text-label-sm underline-offset-2 hover:underline">${echapper(o.action)}</a>`;
    }
    zone.appendChild(t);
    setTimeout(() => {
      t.style.transition = 'opacity .3s, transform .3s';
      t.style.opacity = '0';
      t.style.transform = 'translateY(8px)';
      setTimeout(() => t.remove(), 300);
    }, o.duree || 3600);
  }

  /* ==========================================================================
     3 bis. THÈME CLAIR / NUIT
     Le mode clair est le défaut : la nuit est un choix, jamais une surprise.
     Le choix est gardé dans sa propre clé (et non dans l'état général) pour
     que le court script placé en <head> puisse l'appliquer avant le premier
     rendu, sans lire ni analyser tout l'état.
     ========================================================================== */
  const CLE_THEME = 'unevoyante.theme';
  const RACINE = document.documentElement;
  const CHROME_THEME = { clair: '#0F1F4B', nuit: '#0E1733' };

  function themeCourant() {
    try {
      return localStorage.getItem(CLE_THEME) === 'nuit' ? 'nuit' : 'clair';
    } catch (e) {
      return RACINE.classList.contains('dark') ? 'nuit' : 'clair';
    }
  }

  /** Met le bouton au diapason : l'icône annonce la destination, pas l'état. */
  function majBoutonTheme(b) {
    const nuit = themeCourant() === 'nuit';
    const libelle = nuit ? 'Passer en mode jour' : 'Passer en mode nuit';
    b.innerHTML = icone(nuit ? 'light_mode' : 'dark_mode', 'text-[22px]');
    b.setAttribute('aria-label', libelle);
    b.setAttribute('title', libelle);
  }

  function appliquerTheme(t) {
    RACINE.classList.toggle('dark', t === 'nuit');
    const meta = el('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', CHROME_THEME[t]);
    els('[data-uv-theme]').forEach(majBoutonTheme);
    document.dispatchEvent(new CustomEvent('uv:theme', { detail: t }));
  }

  function basculerTheme() {
    const t = themeCourant() === 'nuit' ? 'clair' : 'nuit';
    try { localStorage.setItem(CLE_THEME, t); } catch (e) { /* navigation privée */ }

    const appliquer = () => appliquerTheme(t);
    const douceur = !matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (douceur && document.startViewTransition) {
      RACINE.classList.add('uv-theme-anim');
      const vt = document.startViewTransition(appliquer);
      vt.finished.finally(() => RACINE.classList.remove('uv-theme-anim'));
    } else {
      appliquer();
    }
  }

  /** Le bouton unique, identique sur mobile et sur desktop. */
  function boutonTheme(sombre) {
    return `<button type="button" data-uv-theme
            class="grid h-10 w-10 shrink-0 place-items-center rounded-full transition-colors
                   ${sombre ? 'hover:bg-white/10' : 'hover:bg-ice'}"
            aria-label="Passer en mode nuit" title="Passer en mode nuit"></button>`;
  }

  /* ==========================================================================
     4. EN-TÊTE PARTAGÉ
     ========================================================================== */
  // inactif : lien affiché mais non cliquable, dans le menu comme dans le pied de page
  // (page conservée, à réactiver plus tard en retirant le drapeau)
  const NAV = [
    { href: 'voyants.html', label: 'Voyants' },
    { href: 'tarifs.html', label: 'Tarifs' },
    { href: 'faq.html', label: 'FAQ' },
  ];
  const PAGES_INACTIVES = new Set(NAV.filter((n) => n.inactif).map((n) => n.href));
  // Liens précis désactivés (URL complète, paramètres compris) sur des pages restées actives
  const LIENS_INACTIFS = new Set([]);
  const lienInactif = (href) => PAGES_INACTIVES.has(href.split(/[?#]/)[0]) || LIENS_INACTIFS.has(href.split('#')[0]);

  function pageCourante() {
    const f = location.pathname.split('/').pop();
    return !f || f === '' ? 'index.html' : f;
  }

  function estActif(href) {
    const p = pageCourante();
    if (href === p) return true;
    if (href === 'voyants.html' && p === 'voyant.html') return true;
    if (href === 'tarifs.html' && p === 'credits.html') return true;
    return false;
  }

  class UvHeader extends HTMLElement {
    connectedCallback() {
      const sombre = this.hasAttribute('sombre');
      const fond = sombre
        ? 'bg-navy text-white border-navy-600'
        : 'bg-white/95 text-navy border-line';
      const lien = sombre
        ? 'text-white/80 hover:text-gold'
        : 'text-navy/75 hover:text-royal';
      const lienActif = sombre ? 'text-gold' : 'text-royal';

      this.innerHTML = `
<header class="fixed inset-x-0 top-0 z-50 border-b ${fond} backdrop-blur-xl pt-safe" data-uv-header>
  <div class="shell flex h-16 items-center justify-between gap-2 min-[360px]:gap-3 sm:gap-4 lg:h-18">

    ${logo('text-[20px] sm:text-[22px] lg:text-[24px]', null, true)}

    <nav class="hidden items-center gap-5 lg:flex xl:gap-7" aria-label="Navigation principale">
      ${NAV.map((n) => n.inactif ? `
        <span class="cursor-not-allowed select-none whitespace-nowrap text-label-md font-bold ${sombre ? 'text-white/35' : 'text-navy/35'}"
              aria-disabled="true" title="Bientôt disponible">${n.label}</span>` : `
        <a href="${n.href}"
           class="whitespace-nowrap text-label-md font-bold transition-colors ${estActif(n.href) ? lienActif : lien}"
           ${estActif(n.href) ? 'aria-current="page"' : ''}>${n.label}</a>`).join('')}
    </nav>

    <div class="flex items-center gap-1 min-[360px]:gap-2 sm:gap-3">
      ${boutonTheme(sombre)}

      <!-- Solde + recharge : ouvre la modale « Liste des forfaits » (modales.js),
           sinon mène à la page Crédits. Sur mobile, l'icône et le chiffre seuls. -->
      <a href="credits.html" data-uv-forfaits aria-haspopup="dialog"
         class="inline-flex h-9 shrink-0 items-center gap-1 whitespace-nowrap rounded-full border pl-2 pr-2.5 text-label-sm font-bold transition-colors sm:gap-1.5 sm:px-3
                ${sombre ? 'border-white/15 bg-white/10 text-white hover:bg-white/20' : 'border-line bg-ice text-navy hover:bg-tint'}"
         title="Recharger mes crédits">
        ${icone('monetization_on', 'text-[18px] text-gold')}
        <span class="sr-only">Recharger mes crédits, solde actuel :</span>
        <span><span data-uv-credits>${etat.credits}</span><span class="max-sm:sr-only">&nbsp;crédit<span data-uv-credits-s>${etat.credits > 1 ? 's' : ''}</span></span></span>
      </a>

      <div data-uv-auth class="flex items-center gap-2 sm:gap-3"></div>

      <button type="button" data-uv-burger
              class="grid h-10 w-10 place-items-center rounded-full transition-colors lg:hidden
                     ${sombre ? 'hover:bg-white/10' : 'hover:bg-ice'}"
              aria-label="Ouvrir le menu" aria-expanded="false" aria-controls="uv-drawer">
        ${icone('menu', 'text-[24px]')}
      </button>
    </div>
  </div>
</header>

<!-- Tiroir mobile : se referme au clic extérieur, à Échap et à la navigation -->
<div id="uv-drawer" class="fixed inset-0 z-[60] hidden lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
  <div class="absolute inset-0 bg-navy/40 backdrop-blur-sm" data-uv-drawer-close></div>
  <nav class="absolute inset-y-0 right-0 flex w-[min(86vw,340px)] animate-slide-left flex-col gap-1 overflow-y-auto bg-white p-5 shadow-lift pt-safe">
    <div class="mb-2 flex items-center justify-between">
      ${logo('text-[20px]')}
      <button type="button" data-uv-drawer-close class="grid h-10 w-10 place-items-center rounded-full hover:bg-ice" aria-label="Fermer le menu">
        ${icone('close', 'text-[22px]')}
      </button>
    </div>
    ${NAV.map((n) => n.inactif ? `
      <span class="flex cursor-not-allowed select-none items-center justify-between rounded-md px-3 py-3 text-label-lg text-navy/35" aria-disabled="true">
        ${n.label} <span class="text-label-sm text-muted">Bientôt</span>
      </span>` : `
      <a href="${n.href}" class="flex items-center justify-between rounded-md px-3 py-3 text-label-lg ${estActif(n.href) ? 'bg-tint text-royal' : 'text-navy hover:bg-ice'}">
        ${n.label} ${icone('chevron_right', 'text-[20px] text-muted')}
      </a>`).join('')}
    <hr class="rule my-3">
    <a href="tchat.html" class="flex items-center gap-3 rounded-md px-3 py-3 text-label-lg text-navy hover:bg-ice">${icone('forum', 'text-[20px] text-royal')} Mes tchats</a>
    <a href="credits.html" class="flex items-center gap-3 rounded-md px-3 py-3 text-label-lg text-navy hover:bg-ice">${icone('monetization_on', 'text-[20px] text-gold')} Mes crédits</a>
    <a href="compte.html" class="flex items-center gap-3 rounded-md px-3 py-3 text-label-lg text-navy hover:bg-ice">${icone('person', 'text-[20px] text-royal')} Mon compte</a>
    <hr class="rule my-3">
    <a href="modales.html" class="flex items-center gap-3 rounded-md px-3 py-3 text-label-lg ${estActif('modales.html') ? 'bg-tint text-royal' : 'text-navy hover:bg-ice'}">${icone('web_asset', 'text-[20px] text-royal')} Modales</a>
    <div class="flex flex-col gap-2 pt-4" data-uv-auth-drawer></div>
  </nav>
</div>

<div class="h-16 lg:h-18" aria-hidden="true"></div>`;

      this.brancher();
    }

    brancher() {
      const drawer = el('#uv-drawer');
      const burger = el('[data-uv-burger]', this);

      const theme = el('[data-uv-theme]', this);
      majBoutonTheme(theme);
      theme.addEventListener('click', basculerTheme);

      // Liste des forfaits : ouverte en modale quand modales.js est chargé ;
      // sinon, et pour un clic « nouvel onglet », le lien mène à la page Crédits.
      el('[data-uv-forfaits]', this).addEventListener('click', (e) => {
        const forfaits = global.UV && global.UV.modales && global.UV.modales.forfaits;
        if (!forfaits || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        forfaits.ouvrir();
      });

      const ouvrir = () => {
        drawer.classList.remove('hidden');
        burger.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
        const premier = drawer.querySelector('a, button');
        if (premier) premier.focus();
      };
      const fermer = () => {
        drawer.classList.add('hidden');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      };

      burger.addEventListener('click', ouvrir);
      els('[data-uv-drawer-close]', drawer).forEach((b) => b.addEventListener('click', fermer));
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !drawer.classList.contains('hidden')) fermer();
      });

      majAuth();
      document.addEventListener('uv:etat', majAuth);
    }
  }

  function majAuth() {
    const sombre = !!el('uv-header[sombre]');
    els('[data-uv-auth]').forEach((zone) => {
      if (Store.connecte) {
        const c = Store.compte;
        zone.innerHTML = `
<div class="relative" data-uv-menu>
  <button type="button" class="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 transition-colors ${sombre ? 'hover:bg-white/10' : 'hover:bg-ice'}"
          aria-haspopup="true" aria-expanded="false">
    <span class="grid h-9 w-9 place-items-center rounded-full bg-royal font-display text-label-lg text-white">${echapper(c.prenom[0].toUpperCase())}</span>
    <span class="hidden text-label-md sm:inline">${echapper(c.prenom)}</span>
    ${icone('expand_more', 'text-[18px] hidden sm:inline')}
  </button>
  <div class="absolute right-0 top-full mt-2 hidden w-60 overflow-hidden rounded-lg border border-line bg-white p-1.5 text-navy shadow-lift" data-uv-menu-panel>
    <a href="compte.html" class="flex items-center gap-3 rounded px-3 py-2.5 text-label-md hover:bg-ice">${icone('person', 'text-[20px] text-royal')} Mon compte</a>
    <a href="tchat.html" class="flex items-center gap-3 rounded px-3 py-2.5 text-label-md hover:bg-ice">${icone('forum', 'text-[20px] text-royal')} Mes tchats</a>
    <a href="credits.html" class="flex items-center gap-3 rounded px-3 py-2.5 text-label-md hover:bg-ice">${icone('monetization_on', 'text-[20px] text-gold')} Mes crédits</a>
    <a href="compte.html#favoris" class="flex items-center gap-3 rounded px-3 py-2.5 text-label-md hover:bg-ice">${icone('favorite', 'text-[20px] text-royal')} Mes favoris</a>
    <hr class="rule my-1.5">
    <button type="button" data-uv-logout class="flex w-full items-center gap-3 rounded px-3 py-2.5 text-left text-label-md text-muted hover:bg-ice">${icone('logout', 'text-[20px]')} Se déconnecter</button>
  </div>
</div>`;
      } else {
        zone.innerHTML = `
<a href="connexion.html?next=${encodeURIComponent(pageCourante() + location.search)}"
   class="hidden whitespace-nowrap px-2 py-2 text-label-md font-bold transition-colors md:inline-flex ${sombre ? 'text-white/80 hover:text-gold' : 'text-navy/75 hover:text-royal'}">Se connecter</a>
<a href="inscription.html?next=${encodeURIComponent(pageCourante() + location.search)}"
   class="btn-gold btn-sm max-[359px]:px-3 sm:min-h-[42px]">S'inscrire<span class="hidden xl:inline"> · 3 crédits offerts</span></a>`;
      }
    });

    els('[data-uv-auth-drawer]').forEach((zone) => {
      zone.innerHTML = Store.connecte
        ? `<a href="compte.html" class="btn-ghost w-full">Mon compte</a>
           <button type="button" data-uv-logout class="btn-quiet w-full">Se déconnecter</button>`
        : `<a href="inscription.html" class="btn-gold w-full">S'inscrire · 3 crédits offerts</a>
           <a href="connexion.html" class="btn-ghost w-full">Se connecter</a>`;
    });

    // Menu déroulant du compte
    els('[data-uv-menu]').forEach((m) => {
      const b = el('button', m);
      const p = el('[data-uv-menu-panel]', m);
      b.addEventListener('click', (e) => {
        e.stopPropagation();
        const ouvert = !p.classList.contains('hidden');
        p.classList.toggle('hidden', ouvert);
        b.setAttribute('aria-expanded', String(!ouvert));
      });
      document.addEventListener('click', () => {
        p.classList.add('hidden'); b.setAttribute('aria-expanded', 'false');
      });
    });

    els('[data-uv-logout]').forEach((b) => b.addEventListener('click', () => {
      Store.deconnexion();
      toast('Vous êtes déconnecté. Le site reste entièrement accessible.', { icone: 'waving_hand' });
    }));

    majCredits();
  }

  function majCredits() {
    const n = etat.credits;
    els('[data-uv-credits]').forEach((e) => { e.textContent = n; });
    els('[data-uv-credits-s]').forEach((e) => { e.textContent = n > 1 ? 's' : ''; });
  }
  document.addEventListener('uv:etat', majCredits);

  /* ==========================================================================
     5. PIED DE PAGE PARTAGÉ
     ========================================================================== */
  const COLONNES = [
    {
      titre: 'Voyance',
      liens: [
        ['Voyance par tchat', 'voyants.html'],
        ['Tarot de Marseille', 'voyants.html?specialite=tarot'],
        ['Astrologie amoureuse', 'voyants.html?specialite=astrologie'],
        ['Médiums purs', 'voyants.html?specialite=voyance-pure'],
        ['Numérologie', 'voyants.html?specialite=numerologie'],
      ],
    },
    {
      titre: 'Informations',
      liens: [
        ['Comment ça marche', 'comment-ca-marche.html'],
        ['Tarifs & packs', 'tarifs.html'],
        ['Journal ésotérique', 'info.html?sujet=journal'],
        ['Devenir praticien partenaire', 'info.html?sujet=partenaire'],
        ['Nous contacter', 'contact.html'],
      ],
    },
    {
      titre: 'Légal',
      liens: [
        ['Mentions légales', 'info.html?sujet=mentions-legales'],
        ['Conditions générales (CGV)', 'info.html?sujet=cgv'],
        ['Politique de confidentialité', 'info.html?sujet=confidentialite'],
        ['Charte déontologique', 'info.html?sujet=charte'],
        ['Gestion des cookies', 'info.html?sujet=cookies'],
      ],
    },
  ];

  class UvFooter extends HTMLElement {
    connectedCallback() {
      this.innerHTML = `
<footer class="mt-auto bg-navy text-white">
  <div class="shell py-14 lg:py-16">
    <div class="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
      <div>
        <p class="mb-3">${logo('text-[22px]')}</p>
        <p class="mb-6 max-w-xs text-body-sm leading-relaxed text-white/70">
          Sanctuaire confidentiel de voyance et de guidance par tchat, 7j/7 et 24h/24.
          Écoute bienveillante, éthique et clarté immédiate.
        </p>
        <ul class="flex flex-col gap-2 text-body-sm text-white/80">
          <li class="flex items-center gap-2">${icone('support_agent', 'text-[16px] text-gold')}<span class="font-semibold text-white">Service client 7j/7 · 24h/24</span></li>
          <li class="flex items-center gap-2">${icone('call', 'text-[16px] text-gold')}<a href="tel:+33900000000" class="hover:text-gold">09 00 00 00 00</a></li>
          <li class="flex items-center gap-2">${icone('mail', 'text-[16px] text-gold')}<a href="contact.html" class="hover:text-gold">contact@unevoyante.fr</a></li>
        </ul>
      </div>
      ${COLONNES.map((c) => `
      <div>
        <h4 class="mb-4 font-sans text-label-lg font-bold text-white">${c.titre}</h4>
        <ul class="space-y-2.5 text-body-sm text-white/70">
          ${c.liens.map((l) => lienInactif(l[1])
            ? `<li><span class="cursor-not-allowed select-none text-white/35" aria-disabled="true" title="Bientôt disponible">${l[0]}</span></li>`
            : `<li><a href="${l[1]}" class="transition-colors hover:text-gold">${l[0]}</a></li>`).join('')}
        </ul>
      </div>`).join('')}
    </div>

    <div class="mt-12 flex flex-col gap-5 border-t border-white/10 pt-8 text-body-sm text-white/70 lg:flex-row lg:items-center lg:justify-between">
      <div class="flex flex-wrap items-center gap-x-5 gap-y-2">
        <p>© 2026 unevoyante.fr — Tous droits réservés. Éthique et sérénité garanties.</p>
        <a href="modales.html" class="flex items-center gap-1.5 transition-colors hover:text-gold">${icone('web_asset', 'text-[16px]')} Modales</a>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <span class="flex items-center gap-1.5 font-semibold text-white">${icone('verified', 'text-[18px] text-online')} Paiement 100 % sécurisé</span>
        <span class="flex flex-wrap items-center gap-2 text-label-sm">
          ${['VISA', 'Mastercard', 'Apple Pay', 'PayPal'].map((m) => `<span class="rounded bg-white/10 px-2 py-1">${m}</span>`).join('')}
          <span class="flex items-center gap-1 rounded bg-white/10 px-2 py-1">${icone('lock', 'text-[12px]')} SSL 256-bit</span>
        </span>
      </div>
    </div>

    <p class="mt-6 text-body-sm text-white/55">
      Service de divertissement et de guidance réservé aux personnes majeures. Nos praticiens ne délivrent
      aucun diagnostic ni traitement : une consultation de voyance ne remplace jamais un avis médical,
      psychologique, juridique ou financier.
    </p>
  </div>
</footer>`;
    }
  }

  /* ==========================================================================
     6. BARRE D'ONGLETS MOBILE
     ========================================================================== */
  const ONGLETS = [
    ['index.html', 'home', 'Accueil'],
    ['tchat.html', 'forum', 'Mes tchats'],
    ['credits.html', 'monetization_on', 'Crédits'],
    ['compte.html', 'person', 'Compte'],
  ];

  class UvTabbar extends HTMLElement {
    connectedCallback() {
      const p = pageCourante();
      const nonLus = Object.values(etat.conversations).reduce((s, c) => s + (c.nonLus || 0), 0);
      this.innerHTML = `
<!-- L'espace réservé inclut l'encoche du bas (iPhone), sinon le contenu passe dessous. -->
<div class="h-[var(--tabbar-total)] lg:hidden" aria-hidden="true" data-uv-tabbar-espace></div>
<nav class="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 pb-safe backdrop-blur-xl shadow-bar lg:hidden"
     aria-label="Navigation rapide" data-uv-tabbar>
  <ul class="mx-auto flex max-w-md items-stretch justify-around px-2">
    ${ONGLETS.map(([href, ic, label]) => {
      const actif = href === p || (href === 'index.html' && p === 'voyants.html');
      const badge = href === 'tchat.html' && nonLus
        ? `<span class="absolute right-2 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-gold px-1 text-[10px] font-bold text-navy">${nonLus}</span>` : '';
      return `<li class="flex-1">
        <a href="${href}" class="relative flex h-[var(--tabbar-h)] flex-col items-center justify-center gap-0.5 transition-colors ${actif ? 'text-royal' : 'text-muted hover:text-navy'}"
           ${actif ? 'aria-current="page"' : ''}>
          ${badge}
          <span class="material-symbols-outlined text-[22px] ${actif ? 'icon-fill' : ''}" aria-hidden="true">${ic}</span>
          <span class="text-label-sm ${actif ? 'font-semibold' : ''}">${label}</span>
        </a></li>`;
    }).join('')}
  </ul>
</nav>`;
    }
  }

  /* ==========================================================================
     7. FABRIQUES DE COMPOSANTS
     ========================================================================== */

  /** Carte praticien — utilisée sur l'accueil, le catalogue et les favoris. */
  function carteVoyant(v, options) {
    const o = options || {};
    const st = STATUTS[v.statut];
    const dispo = v.statut !== 'offline';
    const badge = v.top
      ? `<span class="badge-top">${icone('star', 'icon-fill text-[14px] text-gold')} TOP VOYANTE</span>`
      : `<span class="${st.classe}"><span class="${st.dot}"></span> ${st.label}</span>`;

    const cta = dispo
      ? `<a href="tchat.html?voyant=${v.id}" class="btn-gold w-full">Commencer la discussion</a>`
      : `<button type="button" class="btn-ghost w-full" data-uv-notifier="${v.id}">Me prévenir quand disponible</button>`;

    return `
<article class="card-pad card-hover flex min-w-0 flex-col" data-voyant="${v.id}"
         data-statut="${v.statut}" data-note="${v.note}" data-avis="${v.avis}" data-credits="${v.credits}"
         data-specialites="${v.specialites.join(' ')}" data-nom="${v.prenom.toLowerCase()} ${v.titre.toLowerCase()}">
  <div class="mb-4 flex items-start justify-between gap-3">
    <a href="voyant.html?id=${v.id}" class="shrink-0" aria-label="Voir la fiche de ${v.prenom}">
      ${monogramme(v, 'h-16 w-16 text-h-md')}
    </a>
    ${badge}
  </div>

  <h3 class="text-h-md"><a href="voyant.html?id=${v.id}" class="hover:text-royal">${v.prenom}</a></h3>
  <p class="mb-3 text-body-sm text-muted">${v.titre}</p>

  <div class="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3">
    <a href="voyant.html?id=${v.id}#avis" class="flex items-center gap-1 hover:underline">
      ${icone('star', 'icon-fill text-[16px] text-gold')}
      <span class="text-label-md">${note(v.note)}</span>
      <span class="text-body-sm text-muted">(${nombre(v.avis)})</span>
    </a>
    <span class="inline-flex items-center gap-1 rounded-full bg-ice px-2.5 py-1 text-label-sm">
      ${icone('monetization_on', 'text-[16px] text-gold')} ${v.credits} crédit${v.credits > 1 ? 's' : ''} / msg
    </span>
  </div>

  ${v.promo ? `<p class="mb-3"><span class="badge-promo">${icone('stars', 'text-[14px]')} ${v.promo}</span></p>` : ''}

  <p class="mb-4 line-clamp-2 text-body-sm leading-relaxed text-muted">${v.resume}</p>

  <div class="mb-5 flex flex-wrap gap-2">
    ${v.tags.slice(0, 2).map((t) => `<span class="tag">${t}</span>`).join('')}
  </div>

  <div class="mt-auto flex flex-col gap-2">
    ${cta}
    ${o.sansFiche ? '' : `<a href="voyant.html?id=${v.id}" class="btn-link justify-center">Voir la fiche ${icone('arrow_forward', 'text-[16px]')}</a>`}
  </div>
</article>`;
  }

  /** Ligne compacte — barre latérale du tchat, favoris. */
  function ligneVoyant(v, actif) {
    const conv = etat.conversations[v.id];
    const dernier = conv && conv.messages.length ? conv.messages[conv.messages.length - 1] : null;
    const apercu = dernier ? dernier.texte : v.accroche;
    return `
<a href="tchat.html?voyant=${v.id}"
   class="flex items-center gap-3 rounded-md border-l-[3px] px-3 py-3 transition-colors ${
     actif ? 'border-royal bg-tint' : 'border-transparent hover:bg-ice'}">
  ${monogramme(v, 'h-11 w-11 text-label-lg')}
  <span class="min-w-0 flex-1">
    <span class="flex items-baseline justify-between gap-2">
      <span class="truncate font-display text-label-lg font-extrabold text-navy">${v.prenom}</span>
      <span class="shrink-0 text-body-sm text-muted">${dernier ? heure(dernier.t) : ''}</span>
    </span>
    <span class="mt-0.5 flex items-center gap-2">
      <span class="truncate text-body-sm text-muted">${echapper(apercu)}</span>
      ${conv && conv.nonLus ? `<span class="grid h-5 min-w-5 shrink-0 place-items-center rounded-full bg-royal px-1 text-[11px] font-bold text-white">${conv.nonLus}</span>` : ''}
    </span>
  </span>
</a>`;
  }

  /** Pièce d'or frappée du bonus d'un pack (« +67 % offerts ») — modale des
      forfaits, pages Crédits et Tarifs. Décorative : fournir à côté le texte
      équivalent pour les lecteurs d'écran. `eclat` : reflet périodique, réservé
      au pack mis en avant. */
  function piece(bonus, eclat) {
    return `<span class="forfait-piece${bonus >= 100 ? ' forfait-piece-long' : ''}${eclat ? ' forfait-piece-eclat' : ''}" aria-hidden="true">
      <span class="forfait-piece-valeur"><span class="forfait-piece-signe">+</span>${bonus}<span class="forfait-piece-pourcent">%</span></span>
      <span class="forfait-piece-mention">offerts</span>
    </span>`;
  }

  /** Accordéon accessible. */
  // name commun : ouvrir une question referme les autres du même groupe (accordéon exclusif natif)
  let nbAccordeons = 0;
  function accordeon(items, options) {
    const o = options || {};
    const groupe = `accordeon-${++nbAccordeons}`;
    return items.map((it, i) => `
<details class="accordeon group card overflow-hidden" name="${groupe}" ${i === 0 && o.premierOuvert !== false ? 'open' : ''}>
  <summary class="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-label-lg text-navy marker:hidden hover:bg-ice/60 group-open:bg-navy group-open:text-white dark:group-open:bg-royal">
    <span class="font-display text-h-sm font-semibold">${it.q}</span>
    <span class="material-symbols-outlined shrink-0 text-[22px] text-royal transition-transform group-open:rotate-180 group-open:text-white" aria-hidden="true">expand_more</span>
  </summary>
  <div class="border-t border-line px-5 pb-5 pt-4 text-body-md leading-relaxed text-muted">${it.r}</div>
</details>`).join('');
  }

  /** Fil d'Ariane. */
  function filAriane(items) {
    return `
<nav aria-label="Fil d'Ariane" class="border-b border-line bg-ice">
  <ol class="shell flex items-center gap-2 overflow-x-auto py-3 text-body-sm text-muted no-scrollbar">
    ${items.map((it, i) => {
      const dernier = i === items.length - 1;
      return `<li class="flex shrink-0 items-center gap-2">
        ${i === 0 ? icone('home', 'text-[16px]') : ''}
        ${dernier
          ? `<span class="font-medium text-navy" aria-current="page">${it[0]}</span>`
          : `<a href="${it[1]}" class="hover:text-royal hover:underline">${it[0]}</a>
             ${icone('chevron_right', 'text-[16px] text-line')}`}
      </li>`;
    }).join('')}
  </ol>
</nav>`;
  }

  /* ==========================================================================
     8. BANDEAU COOKIES — informatif, refermable, jamais bloquant
     ========================================================================== */
  function bandeauCookies() {
    if (etat.cookies) return;
    const d = document.createElement('div');
    d.className = 'fixed inset-x-0 bottom-0 z-[70] p-3 sm:p-4';
    d.innerHTML = `
<div class="shell card flex flex-col gap-3 p-4 shadow-lift sm:flex-row sm:items-center sm:gap-5 sm:p-5">
  <p class="flex-1 text-body-sm leading-relaxed text-muted">
    Nous utilisons uniquement des cookies nécessaires au fonctionnement du site. Les mesures d'audience
    sont facultatives et désactivées par défaut. <a href="info.html?sujet=cookies" class="font-medium text-royal underline underline-offset-2">En savoir plus</a>.
  </p>
  <div class="flex shrink-0 flex-wrap gap-2">
    <button type="button" class="btn-ghost btn-sm" data-c="essentiels">Essentiels uniquement</button>
    <button type="button" class="btn-navy btn-sm" data-c="tous">Tout accepter</button>
  </div>
</div>`;
    document.body.appendChild(d);
    liensInactifs(d);
    els('button[data-c]', d).forEach((b) => b.addEventListener('click', () => {
      Store.set({ cookies: b.dataset.c });
      d.remove();
      toast('Préférence enregistrée. Modifiable à tout moment depuis la page Cookies.', { icone: 'cookie' });
    }));
  }

  /* ==========================================================================
     9. CONFORT DE NAVIGATION
     ========================================================================== */

  /** Hauteur réellement visible, clavier compris (iOS).
   *
   *  Sur iOS, l'ouverture du clavier ne redimensionne pas la page : Safari
   *  rétrécit le « visual viewport » et fait glisser le document derrière,
   *  sans rien dire au CSS. 100vh (viewport large) et 100dvh (mis à jour avec
   *  retard) décrivent alors tous deux une zone plus grande que l'écran utile,
   *  et les blocs calés dessus — la vue tchat, sa zone de saisie — se
   *  retrouvent hors champ. On mesure donc la zone visible et on la publie :
   *    --uv-vh      hauteur visible
   *    --uv-vv-top  décalage imposé par iOS (pour recoller l'en-tête)
   *    --uv-kb      hauteur du clavier
   *  plus la classe `uv-clavier` sur <html> tant qu'il est ouvert.
   */
  function viewportReel() {
    const vv = global.visualViewport;
    let clavierOuvert = false;
    let enAttente = false;

    const mesurer = () => {
      enAttente = false;
      const hauteur = vv ? vv.height : global.innerHeight;
      // `offsetTop` est une position (de combien iOS a fait glisser la zone
      // visible), pas une taille : il n'entre pas dans la hauteur du clavier.
      const decalage = vv ? vv.offsetTop : 0;
      const clavier = Math.max(0, global.innerHeight - hauteur);

      RACINE.style.setProperty('--uv-vh', Math.round(hauteur) + 'px');
      RACINE.style.setProperty('--uv-vv-top', Math.round(decalage) + 'px');
      RACINE.style.setProperty('--uv-kb', Math.round(clavier) + 'px');

      // Seuil large : une barre d'outils qui se replie n'est pas un clavier.
      const ouvert = clavier > 120;
      if (ouvert === clavierOuvert) return;
      clavierOuvert = ouvert;
      RACINE.classList.toggle('uv-clavier', ouvert);

      // La vue application tient dans l'écran : le défilement de page qu'iOS
      // a déclenché pour révéler le champ n'a plus lieu d'être.
      if (el('.app-view') && global.innerWidth < 1024) {
        setTimeout(() => {
          global.scrollTo(0, 0);
          const fil = el('#fil');
          if (fil && ouvert) fil.scrollTop = fil.scrollHeight;
        }, 60);
      }
      document.dispatchEvent(new CustomEvent('uv:clavier', { detail: ouvert }));
    };

    const planifier = () => {
      if (enAttente) return;
      enAttente = true;
      requestAnimationFrame(mesurer);
    };

    mesurer();
    if (vv) {
      vv.addEventListener('resize', planifier);
      vv.addEventListener('scroll', planifier);
    }
    addEventListener('resize', planifier);
    addEventListener('orientationchange', () => setTimeout(mesurer, 250));
  }

  /** Préchargement au survol : les pages internes s'ouvrent instantanément. */
  function prechargement() {
    const vus = new Set();
    const precharger = (href) => {
      if (!href || vus.has(href)) return;
      if (!/^[\w./?=&-]+\.html/.test(href)) return;
      vus.add(href);
      const l = document.createElement('link');
      l.rel = 'prefetch';
      l.href = href;
      document.head.appendChild(l);
    };
    document.addEventListener('mouseover', (e) => {
      const a = e.target.closest('a[href]');
      if (a && a.origin === location.origin) precharger(a.getAttribute('href'));
    }, { passive: true });
    document.addEventListener('touchstart', (e) => {
      const a = e.target.closest('a[href]');
      if (a && a.origin === location.origin) precharger(a.getAttribute('href'));
    }, { passive: true });
  }

  /** Boutons « Me prévenir » : retour immédiat, aucune impasse. */
  function notifications() {
    document.addEventListener('click', (e) => {
      const b = e.target.closest('[data-uv-notifier]');
      if (!b) return;
      const v = D.byId(b.dataset.uvNotifier);
      b.disabled = true;
      b.innerHTML = `${icone('notifications_active', 'text-[18px]')} Vous serez prévenu`;
      toast(`Alerte activée : vous serez prévenu dès que ${v ? v.prenom : 'ce praticien'} sera en ligne.`, { icone: 'notifications_active' });
    });
  }

  /** Révélation progressive au défilement (respecte prefers-reduced-motion). */
  function apparition() {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const cibles = els('[data-reveal]');
    if (!cibles.length || !('IntersectionObserver' in window)) return;
    cibles.forEach((c) => c.classList.add('reveal-wait'));
    const montrer = (c) => {
      if (!c.classList.contains('reveal-wait')) return;
      c.classList.remove('reveal-wait');
      c.classList.add('animate-fade-up');
    };
    const io = new IntersectionObserver((entrees) => {
      entrees.forEach((en) => {
        if (!en.isIntersecting) return;
        montrer(en.target);
        io.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -40px 0px', threshold: 0.05 });
    cibles.forEach((c) => io.observe(c));
    // Filet de sécurité : rien ne reste invisible (impression, observateur muet…)
    setTimeout(() => cibles.forEach(montrer), 1200);
  }

  /** Bouton « retour en haut » sur les pages longues. */
  function retourHaut() {
    if (document.body.scrollHeight < 2200) return;
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'fixed bottom-[calc(var(--tabbar-total)+var(--uv-bar,0px)+16px)] right-4 z-40 grid h-11 w-11 translate-y-3 place-items-center rounded-full border border-line bg-white text-royal opacity-0 shadow-lift transition-all hover:bg-ice lg:bottom-6';
    b.setAttribute('aria-label', 'Revenir en haut de la page');
    b.innerHTML = icone('arrow_upward', 'text-[22px]');
    b.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));
    document.body.appendChild(b);
    addEventListener('scroll', () => {
      const visible = scrollY > 700;
      b.style.opacity = visible ? '1' : '0';
      b.style.transform = visible ? 'none' : 'translateY(12px)';
      b.style.pointerEvents = visible ? 'auto' : 'none';
    }, { passive: true });
  }

  /** Neutralise, dans le contenu des pages, les liens désactivés (PAGES_INACTIVES, LIENS_INACTIFS). */
  function liensInactifs(racine) {
    els('a[href]', racine).forEach((a) => {
      if (!lienInactif(a.getAttribute('href'))) return;
      a.removeAttribute('href');
      a.setAttribute('aria-disabled', 'true');
      a.title = 'Bientôt disponible';
      a.className = a.className.split(/\s+/).filter((c) => !c.includes('hover:')).join(' ');
      a.classList.add('cursor-not-allowed', 'select-none', 'opacity-40');
    });
  }

  /* ==========================================================================
     10. AMORÇAGE
     ========================================================================== */
  customElements.define('uv-header', UvHeader);
  customElements.define('uv-footer', UvFooter);
  customElements.define('uv-tabbar', UvTabbar);

  function demarrer() {
    appliquerTheme(themeCourant());
    viewportReel();
    prechargement();
    notifications();
    apparition();
    retourHaut();
    liensInactifs();
    setTimeout(bandeauCookies, 1200);

    // Ancres internes : défilement doux même depuis une autre page
    if (location.hash) {
      const cible = document.getElementById(location.hash.slice(1));
      if (cible) setTimeout(() => cible.scrollIntoView({ block: 'start' }), 120);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', demarrer);
  } else {
    demarrer();
  }

  /* --- API publique -------------------------------------------------------- */
  global.UV = {
    Store, fidelite, toast, el, els, icone, etoiles, monogramme, euro, nombre, note, heure,
    param, echapper, STATUTS, carteVoyant, ligneVoyant, accordeon, filAriane,
    majCredits, pageCourante, logo, piece,
    theme: { courant: themeCourant, basculer: basculerTheme, appliquer: appliquerTheme },
  };
})(window);
