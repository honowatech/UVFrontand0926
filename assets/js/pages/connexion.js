/* connexion.html — script de la page (chargé après data.js, app.js et modales.js). */
(function () {
  'use strict';
  const { el, els, Store, toast } = UV;

  const suite = UV.param('next') || 'compte.html';
  el('#lien-inscription').href = `inscription.html?next=${encodeURIComponent(suite)}`;

  el('#voir').addEventListener('click', function () {
    const c = el('#motdepasse');
    const cache = c.type === 'password';
    c.type = cache ? 'text' : 'password';
    this.querySelector('span').textContent = cache ? 'visibility_off' : 'visibility';
    this.setAttribute('aria-label', cache ? 'Masquer le mot de passe' : 'Afficher le mot de passe');
  });

  el('#oubli').addEventListener('click', () => {
    toast('Un lien de réinitialisation vient d’être envoyé (démonstration).', { icone: 'mail' });
  });

  el('#formulaire').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = el('#email').value.trim();
    const mdp = el('#motdepasse').value;
    const erreur = el('#erreur');

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      erreur.textContent = 'Cette adresse e-mail semble incomplète.';
      erreur.classList.remove('hidden');
      el('#email').focus();
      return;
    }
    if (!mdp) {
      erreur.textContent = 'Saisissez votre mot de passe.';
      erreur.classList.remove('hidden');
      el('#motdepasse').focus();
      return;
    }

    erreur.classList.add('hidden');
    const prenom = email.split('@')[0].replace(/[^a-zà-ÿ]/gi, '') || 'Membre';
    Store.connexion({ prenom: prenom[0].toUpperCase() + prenom.slice(1), email });
    toast('Connexion réussie.', { icone: 'check_circle' });
    setTimeout(() => { location.href = suite; }, 600);
  });

  els('[data-sso]').forEach((b) => b.addEventListener('click', () => {
    Store.connexion({ prenom: 'Sophie', email: `sophie@${b.dataset.sso.toLowerCase()}.com` });
    toast(`Connecté via ${b.dataset.sso}.`, { icone: 'check_circle' });
    setTimeout(() => { location.href = suite; }, 600);
  }));
})();
