/**
 * unevoyante.fr — configuration Tailwind
 * Les tokens proviennent de DESIGN.md (« Clairvoyance Sérénité »).
 *
 * THÈME CLAIR / NUIT
 * Chaque couleur de la charte est branchée sur une variable CSS exprimée en
 * canaux RVB (« 15 31 75 »), définie dans src/input.css pour :root (clair) et
 * pour .dark (nuit). Conséquence : les utilitaires déjà écrits dans les pages
 * (text-navy, bg-ice, border-line, text-muted/80…) changent de sens sans
 * qu'aucune classe `dark:` soit nécessaire dans le HTML.
 *
 * Certaines couleurs jouent deux rôles : `navy` est l'encre du texte ET le fond
 * du chrome, `royal` est la couleur des liens ET le fond des bulles. Tailwind
 * permet de dissocier les deux — voir les sections `textColor` et
 * `backgroundColor` plus bas, qui ne sont donc pas redondantes avec `colors`.
 */
/** @type {import('tailwindcss').Config} */

/** Couleur branchée sur une variable CSS, opacité Tailwind préservée (text-navy/70). */
const v = (nom) => `rgb(var(--uv-${nom}) / <alpha-value>)`;

module.exports = {
  content: ['./*.html', './assets/js/**/*.js'],
  darkMode: 'class',
  theme: {
    extend: {
      /* ==================================================================
         COULEURS — rôle « encre, filets, icônes »
         Utilisées par text-*, border-*, ring-*, divide-*, stroke-*, fill-*…
         ================================================================== */
      colors: {
        /* Encre & marine ---------------------------------------------- */
        navy: {
          DEFAULT: v('ink'), // encre principale
          950: v('ink-950'),
          900: v('ink-900'),
          800: v('ink-800'),
          700: v('ink-700'),
          600: v('ink-600'),
        },
        /* Bleu interactif --------------------------------------------- */
        royal: {
          DEFAULT: v('royal'), // couleur des liens
          50: v('royal-50'),
          100: v('royal-100'),
          200: v('royal-200'),
          300: v('royal-300'),
          400: v('royal-400'),
          500: v('royal-500'),
          600: v('royal-600'),
          700: v('royal-700'),
          800: v('royal-800'),
          900: v('royal-900'),
        },
        /* Or champagne ------------------------------------------------- */
        gold: {
          DEFAULT: v('gold'),
          50: v('gold-50'),
          100: v('gold-100'),
          200: v('gold-200'),
          300: v('gold-300'),
          400: v('gold-400'),
          500: v('gold-500'),
          600: v('gold-600'),
          700: v('gold-700'),
          800: v('gold-800'),
        },
        /* Neutres ------------------------------------------------------ */
        muted: v('muted'),     // texte secondaire
        ice: v('soft'),        // surface douce
        tint: v('tint'),       // remplissage actif
        line: v('line'),       // filets & séparateurs
        /* Statuts ------------------------------------------------------ */
        online: v('online'),
        busy: v('busy'),
        offline: v('offline'),
      },

      /* ==================================================================
         COULEURS — rôle « fond »
         Là où le fond ne suit pas l'encre : le chrome s'assombrit quand
         l'encre s'éclaircit, les bulles et boutons restent colorés.
         `white` n'est volontairement PAS redéfini ici : bg-white/10 est du
         verre posé sur le chrome, pas une surface. Seul l'opaque bascule,
         via une règle dédiée dans input.css.
         ================================================================== */
      backgroundColor: {
        navy: {
          DEFAULT: v('chrome'),      // en-tête, pied de page, toasts
          950: v('chrome-950'),
          900: v('chrome-900'),
          800: v('chrome'),
          700: v('chrome-700'),      // survol du bouton marine
          600: v('chrome-600'),
        },
        royal: {
          DEFAULT: v('royal-bg'),    // bulle « moi », case cochée
          50: v('royal-bg-50'),      // survol du bouton fantôme
          700: v('royal-bg-700'),
        },
        gold: {
          DEFAULT: v('gold-bg'),
          50: v('gold-bg-50'),
          100: v('gold-bg-100'),
        },
      },

      /* Une seule famille, celle du logo : Nunito (sans à terminaisons
         arrondies). `display` = titres et logo (graisse 800), `sans` = texte. */
      fontFamily: {
        sans: ['Nunito', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        display: ['Nunito', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      fontSize: {
        'label-sm': ['11px', { lineHeight: '14px', letterSpacing: '0.04em', fontWeight: '600' }],
        'label-md': ['13px', { lineHeight: '18px', letterSpacing: '0.02em', fontWeight: '600' }],
        'label-lg': ['15px', { lineHeight: '20px', letterSpacing: '0.01em', fontWeight: '600' }],
        'body-sm': ['12px', { lineHeight: '18px', letterSpacing: '0.01em' }],
        'body-md': ['14px', { lineHeight: '22px' }],
        'body-lg': ['16px', { lineHeight: '26px', letterSpacing: '-0.01em' }],
        'h-sm': ['18px', { lineHeight: '24px', letterSpacing: '-0.005em' }],
        'h-md': ['22px', { lineHeight: '28px', letterSpacing: '-0.01em' }],
        'h-lg': ['32px', { lineHeight: '40px', letterSpacing: '-0.015em' }],
        'h-xl': ['40px', { lineHeight: '48px', letterSpacing: '-0.02em' }],
        'h-2xl': ['48px', { lineHeight: '54px', letterSpacing: '-0.025em' }],
        /* Déclinaisons mobiles (headline-lg-mobile / headline-xl-mobile) */
        'h-lg-m': ['26px', { lineHeight: '32px', letterSpacing: '-0.01em' }],
        'h-xl-m': ['30px', { lineHeight: '36px', letterSpacing: '-0.015em' }],
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        md: '0.75rem',
        lg: '1rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      /* Les ombres passent aussi par des variables : en nuit elles se
         creusent (noir plus dense) et gagnent un liseré de lumière haut. */
      boxShadow: {
        card: 'var(--uv-sh-card)',
        lift: 'var(--uv-sh-lift)',
        bar: 'var(--uv-sh-bar)',
        top: 'var(--uv-sh-top)',
        gold: 'var(--uv-sh-gold)',
        glow: 'var(--uv-sh-glow)',
        focus: 'var(--uv-sh-focus)',
      },
      backgroundImage: {
        'gold-cta': 'var(--uv-grad-gold-cta)',
        'gold-soft': 'var(--uv-grad-gold-soft)',
        'monogram': 'var(--uv-grad-monogram)',
        'night': 'var(--uv-grad-night)',
      },
      maxWidth: {
        shell: '1200px',
        prose: '68ch',
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'none' },
        },
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        'pop-in': {
          from: { opacity: '0', transform: 'translateY(6px) scale(.98)' },
          to: { opacity: '1', transform: 'none' },
        },
        'slide-left': {
          from: { opacity: '0', transform: 'translateX(24px)' },
          to: { opacity: '1', transform: 'none' },
        },
        blink: { '0%,80%,100%': { opacity: '.25' }, '40%': { opacity: '1' } },
        shimmer: { '100%': { transform: 'translateX(100%)' } },
      },
      animation: {
        'fade-up': 'fade-up .5s cubic-bezier(.22,.61,.36,1) both',
        'fade-in': 'fade-in .4s ease both',
        'pop-in': 'pop-in .32s cubic-bezier(.22,.61,.36,1) both',
        'slide-left': 'slide-left .35s cubic-bezier(.22,.61,.36,1) both',
      },
    },
  },
  plugins: [],
};
