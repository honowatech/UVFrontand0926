/* voyants.html — script de la page (chargé après data.js, app.js et modales.js). */
(function () {
  'use strict';
  const D = UV_DATA, { el, els, carteVoyant, filAriane, toast, echapper } = UV;

  el('#ariane').innerHTML = filAriane([['Accueil', 'index.html'], ['Voyants']]);

  /* --- État de la vue, synchronisé avec l'URL ----------------------------- */
  let filtre = UV.param('specialite') || 'tous';
  let recherche = UV.param('q') || '';
  el('#recherche').value = recherche;

  const FILTRES = [{ id: 'tous', label: 'Tous' }, { id: 'en-ligne', label: 'En ligne', dot: true }]
    .concat(D.SPECIALITES.map((s) => ({ id: s.id, label: s.label })))
    .concat([{ id: '1-credit', label: '1 crédit / message' }, { id: 'top', label: 'Top voyantes' }]);

  el('#filtres').innerHTML = FILTRES.map((f) => `
    <button type="button" class="chip" data-f="${f.id}" aria-pressed="${f.id === filtre}">
      ${f.dot ? '<span class="dot-online"></span>' : ''}${f.label}
    </button>`).join('');

  function filtrer() {
    const q = recherche.trim().toLowerCase();
    const dispoOnly = el('#dispo-only').checked;

    let liste = D.VOYANTS.filter((v) => {
      if (dispoOnly && v.statut === 'offline') return false;
      if (filtre === 'en-ligne' && v.statut !== 'online') return false;
      if (filtre === '1-credit' && v.credits !== 1) return false;
      if (filtre === 'top' && !v.top) return false;
      if (!['tous', 'en-ligne', '1-credit', 'top'].includes(filtre) && !v.specialites.includes(filtre)) return false;
      if (q) {
        const foin = [v.prenom, v.titre, v.resume, v.accroche, v.tags.join(' '), v.specialites.join(' ')]
          .join(' ').toLowerCase();
        if (!foin.includes(q)) return false;
      }
      return true;
    });

    const ordre = { online: 0, busy: 1, offline: 2 };
    const tri = el('#tri').value;
    liste.sort((a, b) => {
      if (tri === 'note') return b.note - a.note || b.avis - a.avis;
      if (tri === 'avis') return b.avis - a.avis;
      if (tri === 'prix') return a.credits - b.credits || b.note - a.note;
      if (tri === 'experience') return b.experience - a.experience;
      return ordre[a.statut] - ordre[b.statut] || (b.top - a.top) || b.note - a.note;
    });
    return liste;
  }

  function rendre() {
    const liste = filtrer();
    el('#grille').innerHTML = liste.map((v) => carteVoyant(v)).join('');
    el('#compte-resultats').textContent = liste.length;
    el('#compte-ligne').textContent = liste.filter((v) => v.statut === 'online').length;
    el('#vide').classList.toggle('hidden', liste.length > 0);

    // L'URL reflète la vue : le lien reste partageable et le retour arrière fonctionne
    const u = new URL(location.href);
    filtre === 'tous' ? u.searchParams.delete('specialite') : u.searchParams.set('specialite', filtre);
    recherche ? u.searchParams.set('q', recherche) : u.searchParams.delete('q');
    history.replaceState(null, '', u);
  }

  els('#filtres .chip').forEach((b) => b.addEventListener('click', () => {
    filtre = b.dataset.f;
    els('#filtres .chip').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    rendre();
  }));

  let minuteur;
  el('#recherche').addEventListener('input', (e) => {
    clearTimeout(minuteur);
    recherche = e.target.value;
    minuteur = setTimeout(rendre, 180);
  });
  el('#tri').addEventListener('change', rendre);
  el('#dispo-only').addEventListener('change', rendre);
  el('#reset').addEventListener('click', () => {
    filtre = 'tous'; recherche = '';
    el('#recherche').value = '';
    el('#dispo-only').checked = false;
    el('#tri').value = 'dispo';
    els('#filtres .chip').forEach((x) => x.setAttribute('aria-pressed', String(x.dataset.f === 'tous')));
    rendre();
  });

  rendre();

  /* --- Orientation par mots-clés ------------------------------------------ */
  const MOTS = {
    amour: ['amour', 'ex', 'couple', 'rupture', 'reviendra', 'sentiment', 'relation', 'flamme', 'mariage', 'divorce'],
    travail: ['travail', 'boulot', 'carrière', 'emploi', 'job', 'reconversion', 'patron', 'entretien', 'démission'],
    famille: ['famille', 'enfant', 'parent', 'mère', 'père', 'fils', 'fille', 'grossesse', 'frère', 'sœur'],
    astrologie: ['astro', 'thème', 'signe', 'lune', 'planète', 'karmique', 'natal'],
    numerologie: ['numéro', 'chiffre', 'cycle', 'année personnelle', 'date'],
    mediumnite: ['défunt', 'deuil', 'disparu', 'esprit', 'énergie', 'protection', 'lourdeur'],
    tarot: ['tarot', 'carte', 'tirage', 'oracle'],
  };

  el('#orienter').addEventListener('click', orienter);
  el('#orientation').addEventListener('keydown', (e) => { if (e.key === 'Enter') orienter(); });

  function orienter() {
    const q = el('#orientation').value.trim().toLowerCase();
    const zone = el('#orientation-resultat');

    if (!q) {
      zone.classList.remove('hidden');
      zone.innerHTML = 'Écrivez quelques mots sur votre situation, ou <a href="#" class="font-semibold text-royal underline underline-offset-2" data-tout>parcourez simplement les 24 profils</a>.';
      zone.querySelector('[data-tout]').addEventListener('click', (e) => {
        e.preventDefault(); el('#reset').click(); scrollTo({ top: 300, behavior: 'smooth' });
      });
      return;
    }

    let meilleur = null, score = 0;
    Object.entries(MOTS).forEach(([spec, mots]) => {
      const s = mots.filter((m) => q.includes(m)).length;
      if (s > score) { score = s; meilleur = spec; }
    });

    if (!meilleur) {
      // Aucun mot reconnu : on propose quand même, jamais d'écran mort
      filtre = 'en-ligne';
      els('#filtres .chip').forEach((x) => x.setAttribute('aria-pressed', String(x.dataset.f === 'en-ligne')));
      rendre();
      zone.classList.remove('hidden');
      zone.textContent = 'Votre question est singulière : voici tous les praticiens disponibles à cet instant, la plupart traitent tous les sujets.';
      toast('Filtre appliqué : praticiens en ligne', { icone: 'filter_alt' });
    } else {
      filtre = meilleur;
      els('#filtres .chip').forEach((x) => x.setAttribute('aria-pressed', String(x.dataset.f === meilleur)));
      rendre();
      const label = (D.SPECIALITES.find((s) => s.id === meilleur) || {}).label || meilleur;
      const n = filtrer().length;
      zone.classList.remove('hidden');
      zone.innerHTML = `Nous avons retenu la spécialité <strong class="font-semibold">${echapper(label)}</strong> : ${n} praticien${n > 1 ? 's correspondent' : ' correspond'} à votre question.`;
      toast(`Filtre appliqué : ${label}`, { icone: 'filter_alt' });
    }
    document.querySelector('#grille').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
})();
