/* faq.html — script de la page (chargé après data.js, app.js et modales.js). */
(function () {
  'use strict';
  const D = UV_DATA, { el, els, accordeon, filAriane, echapper } = UV;

  el('#ariane').innerHTML = filAriane([['Accueil', 'index.html'], ['FAQ']]);

  const CATS = ['Toutes', ...Array.from(new Set(D.FAQ.map((f) => f.cat)))];
  let cat = 'Toutes';

  el('#categories').innerHTML = CATS.map((c) => `
    <button type="button" class="chip shrink-0 lg:w-full lg:justify-start" data-cat="${c}" aria-pressed="${c === cat}">${c}</button>`).join('');

  function rendre() {
    const liste = D.FAQ.filter((f) => cat === 'Toutes' || f.cat === cat);
    el('#liste').innerHTML = accordeon(liste, { premierOuvert: true });
  }

  els('[data-cat]').forEach((b) => b.addEventListener('click', () => {
    cat = b.dataset.cat;
    els('[data-cat]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    rendre();
  }));

  rendre();

  /* Données structurées FAQPage, tirées de la même source que la page : les
     questions balisées sont toujours celles que le visiteur lit. */
  // Déjà présent dans une page pré-générée : on le remplace, sans doublon.
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
    mainEntity: D.FAQ.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.r },
    })),
  });
})();
