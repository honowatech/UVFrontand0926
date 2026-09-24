/* 404.html — script de la page (chargé après data.js, app.js et modales.js). */
// Avec <base href="/">, « #contenu » viserait l'accueil : le lien
// d'évitement doit rester sur l'adresse courante.
document.querySelector('.skip-link').href = location.pathname + location.search + '#contenu';
