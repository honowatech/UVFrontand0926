/* inscription.html — script de la page (chargé après data.js, app.js et modales.js). */
(function () {
  'use strict';
  const { el, els, Store, toast } = UV;

  const suite = UV.param('next') || 'compte.html';
  el('#lien-connexion').href = `connexion.html?next=${encodeURIComponent(suite)}`;

  /* --- Affichage du mot de passe -------------------------------------------- */
  el('#voir').addEventListener('click', function () {
    const c = el('#motdepasse');
    const cache = c.type === 'password';
    c.type = cache ? 'text' : 'password';
    this.querySelector('span').textContent = cache ? 'visibility_off' : 'visibility';
    this.setAttribute('aria-label', cache ? 'Masquer le mot de passe' : 'Afficher le mot de passe');
  });

  /* --- Indicateur de robustesse ---------------------------------------------- */
  el('#motdepasse').addEventListener('input', (e) => {
    const v = e.target.value;
    let n = 0;
    if (v.length >= 8) n++;
    if (/[A-Z]/.test(v) && /[a-z]/.test(v)) n++;
    if (/\d/.test(v) || /[^\w]/.test(v)) n++;
    const couleurs = ['bg-red-400', 'bg-busy', 'bg-online'];
    els('[data-force]').forEach((b, i) => {
      b.className = `h-1 flex-1 rounded-full ${i < n ? couleurs[n - 1] : 'bg-line'}`;
    });
  });

  /* --- Soumission ------------------------------------------------------------- */
  el('#formulaire').addEventListener('submit', (e) => {
    e.preventDefault();
    const prenom = el('#prenom').value.trim();
    const email = el('#email').value.trim();
    const mdp = el('#motdepasse').value;
    const erreur = el('#erreur');

    const dire = (msg, champ) => {
      erreur.textContent = msg;
      erreur.classList.remove('hidden');
      if (champ) champ.focus();
    };

    if (!prenom) return dire('Indiquez un prénom ou un pseudonyme.', el('#prenom'));
    if (!/^\S+@\S+\.\S+$/.test(email)) return dire('Cette adresse e-mail semble incomplète.', el('#email'));
    if (mdp.length < 8) return dire('Le mot de passe doit contenir au moins 8 caractères.', el('#motdepasse'));
    if (!el('#majeur').checked) return dire('Merci de confirmer votre majorité et d’accepter les CGV.', el('#majeur'));

    erreur.classList.add('hidden');
    Store.connexion({ prenom, email });
    toast(`Bienvenue ${prenom} — vos 3 crédits sont disponibles.`, { ton: 'or', icone: 'auto_awesome' });
    setTimeout(() => { location.href = suite; }, 700);
  });

  /* --- Connexion tierce simulée ------------------------------------------------ */
  els('[data-sso]').forEach((b) => b.addEventListener('click', () => {
    const fournisseur = b.dataset.sso;
    Store.connexion({ prenom: 'Sophie', email: `sophie@${fournisseur.toLowerCase()}.com` });
    toast(`Compte créé via ${fournisseur}. 3 crédits offerts ajoutés.`, { ton: 'or', icone: 'auto_awesome' });
    setTimeout(() => { location.href = suite; }, 700);
  }));
})();
