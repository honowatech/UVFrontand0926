/* landing.html — script de la page d'atterrissage (chargé après data.js et app.js).
   Inscription en deux étapes (prénom, puis e-mail), praticiens en ligne,
   questions fréquentes et barre d'appel à l'action fixe sur mobile. */
(function () {
  'use strict';
  const D = UV_DATA, { el, els, Store, icone, monogramme, note, lienVoyant, accordeon, echapper } = UV;

  /* --- Questions fréquentes : source unique de l'accordéon et du balisage -- */
  const FAQ = [
    {
      q: 'La voyance gratuite par tchat est-elle vraiment gratuite ?',
      r: 'Oui. Vos 3 questions sont offertes dès l’inscription, sans carte bancaire et sans engagement. Vous ne payez que si vous choisissez ensuite de poursuivre avec des crédits.',
    },
    {
      q: 'Faut-il une carte bancaire pour commencer ?',
      r: 'Non. Un prénom et une adresse e-mail suffisent pour recevoir vos 3 questions offertes. Aucune empreinte bancaire n’est demandée à l’inscription.',
    },
    {
      q: 'Combien de questions sont offertes, et que se passe-t-il ensuite ?',
      r: 'Trois questions, soit 3 crédits, chez le voyant de votre choix (le tarif par message est affiché sur chaque profil). Ensuite, rien n’est prélevé automatiquement : si vous souhaitez approfondir, vous rechargez des crédits, sans abonnement, et ils n’expirent jamais.',
    },
    {
      q: 'Mes échanges sont-ils anonymes et confidentiels ?',
      r: 'Oui. Vous consultez sous le prénom de votre choix, vos échanges sont chiffrés et jamais partagés. Les voyants n’ont accès ni à votre adresse e-mail ni à vos coordonnées de paiement.',
    },
    {
      q: 'Comment se déroule une consultation par tchat ?',
      r: 'Vous choisissez un voyant en ligne, vous écrivez votre question et il vous répond en direct, par écrit. L’historique complet reste disponible dans votre espace : vous pouvez relire l’échange quand vous le souhaitez.',
    },
    {
      q: 'Comment poser une bonne question à un voyant ?',
      r: 'Préférez une question claire et ouverte à un simple oui/non : « Comment va évoluer ma relation dans les prochains mois ? » plutôt que « Va-t-il revenir ? ». Donnez le contexte utile (prénoms, période, enjeu) et une seule question par message.',
    },
    {
      q: 'Qui sont les voyants d’UneVoyante ?',
      r: 'Des tarologues, médiums, astrologues et numérologues sélectionnés après une consultation test anonyme, une vérification d’identité et la signature de notre charte déontologique. Moins de 5 % des candidats sont retenus.',
    },
    {
      q: 'Sur quels sujets puis-je consulter ?',
      r: 'Amour et relations, travail et carrière, famille, argent, décisions de vie ou questionnements personnels. Chaque profil indique les spécialités du voyant pour vous aider à choisir.',
    },
    {
      q: 'La voyance en ligne est-elle fiable ?',
      r: 'La voyance apporte un éclairage et une aide à la réflexion ; elle ne remplace ni un avis médical, ni juridique, ni financier. Nos voyants s’engagent à une écoute honnête, sans fausses promesses.',
    },
  ];

  el('#lp-faq').innerHTML = accordeon(FAQ, { premierOuvert: false });

  // Données structurées FAQPage ; déjà présentes dans la page pré-rendue : on les remplace.
  let ld = document.getElementById('ld-faq');
  if (!ld) {
    ld = document.createElement('script');
    ld.id = 'ld-faq';
    ld.type = 'application/ld+json';
    document.head.appendChild(ld);
  }
  ld.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.r } })),
  });

  /* --- Praticiens en ligne --------------------------------------------------- */
  const enLigne = D.VOYANTS.filter((v) => v.statut === 'online');
  const vitrine = enLigne.filter((v) => v.photo).slice(0, 4);
  els('[data-lp-en-ligne]').forEach((e) => { e.textContent = enLigne.length; });

  el('#lp-portraits').innerHTML = vitrine.map((v) => monogramme(v, 'h-10 w-10 text-label-lg', false)).join('');

  el('#lp-voyants').innerHTML = vitrine.map((v) => `
    <li class="lp-glace flex items-center gap-3 p-3.5 min-[360px]:gap-4 min-[360px]:p-4 sm:p-5" data-reveal>
      <a href="${lienVoyant(v.id)}" class="shrink-0" aria-label="Voir la fiche de ${v.prenom}">
        ${monogramme(v, 'h-14 w-14 text-h-md min-[360px]:h-16 min-[360px]:w-16 sm:h-[72px] sm:w-[72px]')}
      </a>
      <div class="min-w-0 flex-1">
        <h3 class="text-h-sm"><a href="${lienVoyant(v.id)}" class="hover:text-royal">${v.prenom}</a></h3>
        <p class="mt-0.5 truncate text-body-sm text-muted">${v.tags.slice(0, 2).join(' · ')}</p>
        <p class="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-body-sm">
          <span class="flex items-center gap-1">
            ${icone('star', 'icon-fill text-[16px] text-gold')}
            <span class="font-bold text-navy">${note(v.note)}</span>
            <span class="text-muted">(${v.avis})</span>
          </span>
          <span class="flex items-center gap-1.5 whitespace-nowrap font-bold text-[rgb(var(--uv-badge-online))]"><span class="dot-online"></span>En ligne</span>
        </p>
      </div>
      <a href="tchat.html?voyant=${v.id}" class="btn-gold shrink-0 px-4 min-[360px]:px-5" data-lp-consulter="${v.id}"
         aria-label="Consulter ${v.prenom}">Consulter</a>
    </li>`).join('');

  /* Tout ce qui suit dépend du visiteur ou de l'instant : rien n'est figé au
     pré-rendu, le navigateur le rejoue à l'ouverture. */
  if (window.UV_PRERENDU) return;

  /* --- Compteur du jour : croît au fil des heures, stable d'un rechargement à l'autre */
  const maintenant = new Date();
  const minutes = maintenant.getHours() * 60 + maintenant.getMinutes();
  el('[data-lp-compteur-n]').textContent = 14 + Math.floor(minutes / 24) + (maintenant.getDate() % 7);
  el('[data-lp-compteur]').classList.replace('hidden', 'flex');

  /* --- Thème (le bouton de l'en-tête réduit) ---------------------------------- */
  el('[data-uv-theme]').addEventListener('click', UV.theme.basculer);

  /* --- Inscription en deux étapes -------------------------------------------- */
  const carte = el('#inscription');
  const form = el('#lp-formulaire');
  const etapes = els('[data-lp-etape]');
  const bienvenue = el('[data-lp-bienvenue]');
  let prenom = '';
  let choisi = null; // praticien choisi avant l'inscription (bouton « Consulter »)

  const erreur = (n, msg, champ) => {
    const e = el(`#lp-erreur-${n}`);
    e.textContent = msg || '';
    e.classList.toggle('hidden', !msg);
    if (champ) {
      champ.setAttribute('aria-invalid', msg ? 'true' : 'false');
      if (msg) champ.focus();
    }
  };

  function progression(pourcent, libelle) {
    el('[data-lp-jauge]').style.width = pourcent + '%';
    el('[data-lp-etape-libelle]').textContent = libelle;
  }

  function allerA(n) {
    etapes.forEach((f) => { f.hidden = f.dataset.lpEtape !== String(n); });
    progression(n === 1 ? 50 : 90, `Étape ${n} sur 2`);
    if (n === 2) {
      el('[data-lp-salut]').textContent = `Merci ${prenom}, votre adresse e-mail`;
      el('#lp-email').focus();
    } else {
      el('#lp-prenom').focus();
    }
  }

  /** Destination après l'inscription : le praticien choisi, sinon la liste. */
  function majBienvenue(titre, texte) {
    const v = choisi && D.byId(choisi);
    const cta = el('[data-lp-bienvenue-cta]');
    el('[data-lp-bienvenue-titre]').textContent = titre;
    el('[data-lp-bienvenue-texte]').textContent = texte;
    if (v) {
      cta.href = `tchat.html?voyant=${v.id}`;
      cta.innerHTML = `Commencer avec ${echapper(v.prenom)} ${icone('arrow_forward', 'text-[20px]')}`;
    } else {
      cta.href = '#voyants';
      cta.innerHTML = `Choisir mon voyant ${icone('arrow_forward', 'text-[20px]')}`;
    }
  }

  function afficherBienvenue(titre, texte) {
    form.hidden = true;
    bienvenue.hidden = false;
    el('[data-lp-sous-titre]').textContent = 'Votre inscription est terminée';
    progression(100, 'Inscription terminée');
    el('[data-lp-compteur]').classList.replace('flex', 'hidden');
    majBienvenue(titre, texte);
    el('#lp-connexion').hidden = true;
    el('[data-lp-final-titre]').textContent = 'Vos questions vous attendent';
    els('[data-lp-cta]').forEach((a) => { a.textContent = 'Choisir mon voyant'; a.href = '#voyants'; });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const etape = etapes.find((f) => !f.hidden).dataset.lpEtape;

    if (etape === '1') {
      const champ = el('#lp-prenom');
      prenom = champ.value.trim().replace(/\s+/g, ' ');
      if (!prenom) return erreur(1, 'Indiquez votre prénom (ou un pseudonyme).', champ);
      erreur(1, '', champ);
      return allerA(2);
    }

    const champ = el('#lp-email');
    const email = champ.value.trim();
    if (!/^\S+@\S+\.\S+$/.test(email)) return erreur(2, 'Cette adresse e-mail semble incomplète.', champ);
    erreur(2, '', champ);
    if (!el('#lp-majeur').checked) return erreur(2, 'Merci de confirmer votre majorité et d’accepter les CGV.', el('#lp-majeur'));

    Store.connexion({ prenom, email });
    afficherBienvenue(`Bienvenue ${prenom}, vos 3 questions sont prêtes`,
      choisi ? 'Votre voyant vous attend : posez votre première question.' : 'Choisissez un voyant en ligne et posez votre première question.');
    bienvenue.focus();
  });

  el('[data-lp-retour]').addEventListener('click', () => allerA(1));

  // Visiteur déjà inscrit : pas de formulaire, directement vers les praticiens.
  if (Store.connecte) {
    const n = Store.credits;
    afficherBienvenue(`Bon retour ${Store.compte.prenom || ''}`.trim(),
      `Il vous reste ${n} crédit${n > 1 ? 's' : ''}. Choisissez un voyant en ligne pour reprendre.`);
  }

  /** Amène la carte d'inscription à l'écran et donne la main au bon champ. */
  function versInscription() {
    carte.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
    const champ = etapes.find((f) => !f.hidden).querySelector('input');
    setTimeout(() => champ.focus({ preventScroll: true }), 350);
  }

  // « Consulter » avant l'inscription : on retient le praticien, l'inscription d'abord.
  el('#lp-voyants').addEventListener('click', (e) => {
    const b = e.target.closest('[data-lp-consulter]');
    if (!b || Store.connecte) return;
    e.preventDefault();
    choisi = b.dataset.lpConsulter;
    const v = D.byId(choisi);
    el('[data-lp-sous-titre]').textContent = `puis consultez ${v.prenom}, en ligne maintenant`;
    versInscription();
  });

  els('[data-lp-cta]').forEach((a) => a.addEventListener('click', (e) => {
    if (Store.connecte) return; // lien #voyants : défilement natif
    e.preventDefault();
    versInscription();
  }));

  /* --- Barre fixe (mobile) : masquée tant que la carte ou le dernier appel est visible */
  const barre = el('[data-lp-barre]');
  if ('IntersectionObserver' in window) {
    const visibles = new Set();
    const io = new IntersectionObserver((entrees) => {
      entrees.forEach((en) => (en.isIntersecting ? visibles.add(en.target) : visibles.delete(en.target)));
      barre.classList.toggle('is-cachee', visibles.size > 0);
    }, { threshold: 0.15 });
    io.observe(carte);
    io.observe(el('#lp-final'));
  } else {
    barre.classList.remove('is-cachee');
  }
})();
