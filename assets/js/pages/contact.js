/* contact.html — script de la page (chargé après data.js, app.js et modales.js). */
(function () {
  'use strict';
  const { el, icone, filAriane, Store, toast } = UV;

  el('#ariane').innerHTML = filAriane([['Accueil', 'index.html'], ['Nous contacter']]);

  /* --- Pré-remplissage : pratique si l'on est connecté, jamais exigé --------- */
  const compte = Store.compte;
  if (compte) {
    el('#prenom').value = compte.prenom || '';
    el('#email').value = compte.email || '';
  }

  /* --- Motif porté par l'adresse (contact.html?motif=paiement) ---------------
     Un motif inconnu ne choisit rien : l'invite reste en place, et c'est à la
     personne de trancher. */
  const motif = UV.param('motif');
  const champMotif = el('#motif');
  if (motif) {
    // Comparaison sur les options existantes : jamais de sélecteur construit
    // à partir de l'adresse.
    const attendue = Array.from(champMotif.options).find((o) => o.value === motif);
    if (attendue) champMotif.value = attendue.value;
  }

  /* --- Erreurs : un seul encart, relié au champ fautif ------------------------ */
  const erreur = el('#erreur');
  let fautif = null;

  function oublier() {
    erreur.classList.add('hidden');
    if (!fautif) return;
    fautif.removeAttribute('aria-invalid');
    if (fautif.dataset.aide) fautif.setAttribute('aria-describedby', fautif.dataset.aide);
    else fautif.removeAttribute('aria-describedby');
    fautif = null;
  }

  function dire(message, champ) {
    erreur.textContent = message;
    erreur.classList.remove('hidden');
    champ.setAttribute('aria-invalid', 'true');
    champ.setAttribute('aria-describedby', champ.dataset.aide ? `erreur ${champ.dataset.aide}` : 'erreur');
    fautif = champ;
    champ.focus();
  }

  /* --- Envoi simulé : site statique, rien ne part nulle part ------------------ */
  el('#formulaire').addEventListener('submit', (e) => {
    e.preventDefault();
    oublier();

    const prenom = el('#prenom').value.trim();
    const email = el('#email').value.trim();
    const message = el('#message').value.trim();

    if (!prenom) return dire('Indiquez un prénom, pour savoir comment vous appeler.', el('#prenom'));
    if (!/^\S+@\S+\.\S+$/.test(email)) return dire('Cette adresse e-mail semble incomplète.', el('#email'));
    if (!champMotif.value) return dire('Choisissez le motif de votre demande.', champMotif);
    if (message.length < 10) return dire('Décrivez votre demande en quelques mots.', el('#message'));

    const bouton = el('#envoyer');
    bouton.disabled = true;
    bouton.innerHTML = `${icone('progress_activity', 'animate-spin text-[20px]')} Envoi en cours…`;

    setTimeout(() => {
      el('#formulaire').classList.add('hidden');
      el('#confirmation-email').textContent = email;
      el('#confirmation').classList.remove('hidden');
      el('#confirmation-titre').focus();
      toast('Message envoyé (démonstration).', { icone: 'mark_email_read' });
    }, 900);
  });
})();
