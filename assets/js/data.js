/* =============================================================================
   unevoyante.fr — Jeu de données de démonstration
   Une seule source de vérité pour tout le site : catalogue, fiches, tchat,
   avis, packs de crédits et FAQ. Aucun appel réseau : la navigation reste
   entièrement fonctionnelle hors-ligne.
   ========================================================================== */
(function (global) {
  'use strict';

  /* --- Spécialités : sert aux filtres et aux liens de pied de page -------- */
  const SPECIALITES = [
    { id: 'amour', label: 'Amour', icon: 'favorite' },
    { id: 'tarot', label: 'Tarot', icon: 'style' },
    { id: 'pendule', label: 'Pendule', icon: 'radio_button_checked' },
    { id: 'runes', label: 'Runes', icon: 'grid_view' },
    { id: 'voyance-pure', label: 'Voyance pure', icon: 'visibility' },
    { id: 'astrologie', label: 'Astrologie', icon: 'nights_stay' },
    { id: 'numerologie', label: 'Numérologie', icon: 'pin' },
    { id: 'travail', label: 'Travail', icon: 'work' },
    { id: 'famille', label: 'Famille', icon: 'diversity_3' },
    { id: 'mediumnite', label: 'Médiumnité', icon: 'auto_awesome' },
  ];

  const AVIS_TYPE = [
    ['Marion', 5, '« Réponses très précises et pleines de douceur. Elle a vu juste sans que je ne dise un mot. Je recommande vivement. »'],
    ['Sophie', 5, '« Elle a parfaitement cerné ma situation sentimentale. Ses conseils m’ont aidée à patienter au bon moment. »'],
    ['Thomas', 5, '« Échange direct, sans détour mais très chaleureux. Les prédictions se sont vérifiées la semaine suivante ! »'],
    ['Camille', 5, '« Une lecture d’une grande finesse. A su apaiser mes angoisses avec beaucoup d’écoute et de bienveillance. »'],
    ['Inès', 4, '« Très bonne guidance, quelques réponses un peu générales au début puis c’est devenu bluffant de précision. »'],
    ['Lucas', 5, '« Je suis arrivé sceptique, je repars avec des dates concrètes et surtout beaucoup plus serein. »'],
    ['Nadia', 5, '« Enfin quelqu’un qui ne raconte pas ce qu’on veut entendre. Franchise et douceur, le duo parfait. »'],
    ['Élodie', 5, '« Réponse en deux minutes à 1h du matin. Cette disponibilité change absolument tout. »'],
    ['Karim', 4, '« Guidance professionnelle très pertinente sur ma reconversion. Merci pour la clarté. »'],
    ['Julie', 5, '« Trois messages ont suffi pour dénouer six mois de questionnements. »'],
  ];

  /* Horaires typiques réutilisés par plusieurs praticiens ------------------ */
  const H = {
    soir: ['14h – 22h', '14h – 22h', null, '17h – 2h', '17h – 2h', '10h – 18h', null],
    journee: ['9h – 18h', '9h – 18h', '9h – 18h', '9h – 18h', '9h – 17h', null, null],
    nuit: [null, '20h – 3h', '20h – 3h', '20h – 3h', '20h – 4h', '20h – 4h', '21h – 2h'],
    continu: ['8h – 23h', '8h – 23h', '8h – 23h', '8h – 23h', '8h – 23h', '10h – 20h', '10h – 20h'],
    weekend: [null, null, '18h – 23h', '18h – 23h', '14h – 00h', '10h – 00h', '10h – 22h'],
  };

  /* --- Catalogue : 24 praticiens ----------------------------------------- */
  const VOYANTS = [
    /* Les huit premiers profils reprennent les praticiens de monvoyantprive.com
       (prénom, photo, présentation, spécialités, expérience, consultations).
       `photoReelle` : false = photo d’illustration, mention affichée sur la fiche.
       Note, avis, statut, horaires et réponses restent des données de démonstration. */
    {
      id: 'claire', prenom: 'Claire', titre: 'Tarologue & Numérologue',
      photo: 'assets/img/voyants/claire.webp', photoReelle: false,
      statut: 'online', top: true, note: 4.9, avis: 104, consultations: 326, experience: 16,
      credits: 1, delai: '2 min', specialites: ['tarot', 'numerologie', 'amour', 'famille', 'travail'],
      tags: ['Tarot', 'Numérologie', 'Amour & relations', 'Famille'],
      accroche: 'Vous avez besoin de réponses, pas de suppositions.',
      resume: 'Tarot, intuition et ressentis pour éclairer votre avenir sentimental, familial ou professionnel.',
      horaires: H.soir,
      bio: [
        'Vous avez besoin de réponses, pas de suppositions.',
        'Depuis 16 ans, j’accompagne des personnes qui cherchent à comprendre leur avenir sentimental, familial ou professionnel. Mes consultations reposent sur le tarot, une forte intuition et de nombreux ressentis.',
        'La voyance est ma vie et je souhaite vous apporter toute mon expertise.',
      ],
      reponses: [
        'Je tire les cartes pour vous. Je vois une période de silence qui se termine bientôt, mais l’initiative ne doit pas venir de vous. Laissez passer deux semaines.',
        'L’Étoile sort en position de futur proche : ce que vous croyez perdu revient sous une autre forme. Ne forcez rien avant la fin du mois.',
        'Je ressens beaucoup de confusion de son côté, pas de désamour. Il a besoin de reprendre pied avant de revenir vers vous.',
        'Votre chemin de vie confirme les cartes : un contact avant la fin du mois. Restez disponible mais ne relancez pas.',
      ],
    },
    {
      id: 'karine', prenom: 'Karine', titre: 'Tarologue · Intuition & flashs',
      photo: 'assets/img/voyants/karine.webp', photoReelle: false,
      statut: 'online', top: true, note: 4.9, avis: 118, consultations: 345, experience: 21,
      credits: 1, delai: '2 min', specialites: ['tarot', 'amour', 'travail'],
      tags: ['Tarot', 'Amour & relations', 'Décisions de vie', 'Spiritualité'],
      accroche: 'Chaque consultation est une rencontre.',
      resume: 'Intuition, cartes et flashs depuis plus de 21 ans. Je prends le temps d’écouter avant de répondre.',
      horaires: H.soir,
      bio: [
        'Chaque consultation est une rencontre.',
        'Depuis plus de 21 ans, je laisse parler mon intuition, les cartes et les nombreux flashs qui viennent compléter mes analyses.',
        'Je prends le temps d’écouter avant de répondre, car chaque détail compte.',
      ],
      reponses: [
        'Les cartes répondent non pour ce mois-ci, oui pour le suivant. Un flash très net me le confirme.',
        'Trois cartes, trois signaux dans la même direction : la situation se débloque par une personne extérieure au couple.',
        'Je vais être franche : ce que vous espérez n’arrivera pas sous cette forme. En revanche, autre chose se prépare et vous ne le voyez pas encore.',
      ],
    },
    {
      id: 'marc', prenom: 'Marc', titre: 'Voyant · Tarot, flashs & intuition',
      photo: 'assets/img/voyants/marc.webp', photoReelle: false,
      statut: 'online', top: false, note: 4.9, avis: 231, consultations: 688, experience: 25,
      credits: 1, delai: '3 min', specialites: ['amour', 'famille', 'travail', 'astrologie'],
      tags: ['Amour & relations', 'Décisions de vie', 'Travail & carrière', 'Astrologie'],
      accroche: 'Je vous dirai toujours la vérité, même lorsqu’elle n’est pas celle que vous espériez entendre.',
      resume: '25 ans de tarot, de flashs et d’intuition, avec zéro compromis sur la vérité.',
      horaires: H.journee,
      bio: [
        'Avec moi, c’est 0 compromis : je vous dirai toujours la vérité, même lorsqu’elle n’est pas celle que vous espériez entendre.',
        'Fort de 25 années d’expérience, je travaille avec le tarot, les flashs et mon intuition. J’accorde une grande importance aux détails, car ce sont souvent eux qui changent totalement une situation.',
        'Essayez votre voyance gratuite avec moi, vous ne serez jamais déçu.',
      ],
      reponses: [
        'Je perçois un environnement professionnel qui change de direction sans vous consulter. Ne vous positionnez pas tout de suite, l’information manque encore.',
        'Un flash très net : une proposition arrive par une personne que vous avez déjà croisée. Elle ne viendra pas du canal que vous surveillez.',
        'Ce que vous préparez aboutit, mais plus tard que prévu. Le retard n’est pas un échec, il vous protège d’un mauvais associé.',
      ],
    },
    {
      id: 'aurelie', prenom: 'Aurelie', titre: 'Voyante · Astrologie & ressenti pur',
      photo: 'assets/img/voyants/aurelie.webp', photoReelle: true,
      statut: 'online', top: false, note: 4.9, avis: 112, consultations: 368, experience: 17,
      credits: 1, delai: '3 min', specialites: ['amour', 'astrologie', 'voyance-pure'],
      tags: ['Amour & relations', 'Astrologie', 'Ressenti pur'],
      accroche: 'Je crois profondément que rien n’arrive par hasard.',
      resume: 'Depuis 17 ans, j’accompagne les périodes de doute, de séparation et de grands changements.',
      horaires: H.weekend,
      bio: [
        'Je crois profondément que rien n’arrive par hasard.',
        'Depuis 17 ans, j’accompagne des personnes qui traversent des périodes de doute, de séparation ou de grands changements.',
      ],
      reponses: [
        'Rien n’arrive par hasard : cette séparation vous oblige à regarder ce que vous aviez mis de côté. Je ressens un vrai tournant d’ici la fin du mois.',
        'Votre thème montre une période de transition jusqu’à la prochaine pleine lune. Ne prenez pas de décision définitive avant.',
        'Je ressens de l’attachement de son côté, mais aussi beaucoup de retenue. Le lien n’est pas rompu, il se transforme.',
      ],
    },
    {
      id: 'julie', prenom: 'Julie', titre: 'Voyante · Spécialiste amour',
      photo: 'assets/img/voyants/julie.webp', photoReelle: false,
      statut: 'online', top: false, note: 4.9, avis: 96, consultations: 332, experience: 10,
      credits: 1, delai: '2 min', promo: 'Offre découverte', specialites: ['amour', 'numerologie', 'voyance-pure'],
      tags: ['Amour & relations', 'Numérologie', 'Ressenti pur'],
      accroche: 'Votre vie amoureuse n’aura aucun secret pour moi.',
      resume: 'Experte du domaine sentimental : ici, pas de bla-bla inutile.',
      horaires: H.soir,
      bio: [
        'Experte dans le domaine sentimental, votre vie amoureuse n’aura aucun secret pour moi. Ici, pas de bla-bla inutile.',
      ],
      reponses: [
        'Pas de détour : oui, il revient vers vous, mais pas avant six semaines. Notez la date, vous verrez.',
        'Votre chemin de vie et le sien sont compatibles, mais le timing ne l’est pas encore. Chacun a un travail personnel à finir.',
        'Réponse nette : non pour une reprise à l’identique. Oui pour un contact, sous une forme différente.',
      ],
    },
    {
      id: 'alex', prenom: 'Alex', titre: 'Voyant · Expert des relations amoureuses',
      photo: 'assets/img/voyants/alex.webp', photoReelle: true,
      statut: 'online', top: false, note: 4.9, avis: 18, consultations: 55, experience: 20,
      credits: 1, delai: '4 min', specialites: ['amour', 'voyance-pure', 'astrologie', 'famille', 'travail'],
      tags: ['Amour & relations', 'Décisions de vie', 'Astrologie', 'Ressenti pur'],
      accroche: 'Si je vois quelque chose, je vous le dirai. Si je ne le vois pas, je vous le dirai aussi.',
      resume: 'Expert des problématiques amoureuses depuis plus de 20 ans : avec moi, du vrai, du concret.',
      horaires: H.nuit,
      bio: [
        'Avec moi, ce sera du vrai, du concret. Je suis expert des problématiques amoureuses depuis plus de 20 ans.',
        'Si je vois quelque chose, je vous le dirai. Si je ne le vois pas, je vous le dirai aussi. C’est cette sincérité qui fait toute la différence.',
      ],
      reponses: [
        'Je vais être direct : je ne vois pas de retour à court terme. En revanche, une rencontre se prépare et elle va vous surprendre.',
        'Je ressens beaucoup de sincérité de son côté, mais une vraie peur de l’engagement. Laissez-lui de l’espace ce mois-ci.',
        'Là-dessus, je ne vois rien de net aujourd’hui, et je préfère vous le dire. Reposez-moi la question dans quelques jours.',
      ],
    },
    {
      id: 'marie', prenom: 'Marie', titre: 'Astrologue & Numérologue',
      photo: 'assets/img/voyants/marie.webp', photoReelle: false,
      statut: 'busy', top: true, note: 4.9, avis: 87, consultations: 299, experience: 22,
      credits: 2, delai: '5 min', specialites: ['amour', 'astrologie', 'numerologie'],
      tags: ['Amour & relations', 'Finances & abondance', 'Spiritualité', 'Astrologie'],
      accroche: 'Je préfère une vérité qui aide à avancer plutôt qu’un discours qui rassure quelques minutes.',
      resume: 'Tarot, ressentis et flashs depuis plus de 22 ans : avec moi, pas de place pour les illusions.',
      horaires: H.continu,
      bio: [
        'Avec moi, il n’y a pas de place pour les illusions. Je préfère une vérité qui aide à avancer plutôt qu’un discours qui rassure quelques minutes.',
        'Depuis plus de 22 ans, je travaille avec le tarot, mes ressentis et les flashs qui me viennent naturellement pendant la consultation.',
      ],
      reponses: [
        'Votre thème montre un transit de Jupiter sur la maison IV jusqu’en mars : c’est la fenêtre pour le projet familial que vous repoussez.',
        'Chemin de vie 7 : vous avancez par retraits successifs. Ce que vous vivez n’est pas un échec, c’est une phase d’intériorisation attendue.',
        'La période du 12 au 26 est nettement plus favorable pour une discussion difficile. Avant, Mercure travaille contre vous.',
      ],
    },
    {
      id: 'aymeric', prenom: 'Aymeric', titre: 'Voyant · Ressentis, cartes & astrologie',
      photo: 'assets/img/voyants/aymeric.webp', photoReelle: true,
      statut: 'busy', top: false, note: 4.8, avis: 47, consultations: 153, experience: 18,
      credits: 2, delai: '6 min', specialites: ['amour', 'famille', 'travail', 'astrologie'],
      tags: ['Amour & relations', 'Famille', 'Travail & carrière', 'Astrologie'],
      accroche: 'Avec moi, pas de faux-semblants ni de réponses toutes faites.',
      resume: 'Ressentis, cartes et images : une vision claire de votre situation, sans détour.',
      horaires: H.journee,
      bio: [
        'Je suis quelqu’un d’entier. Avec moi, pas de faux-semblants ni de réponses toutes faites.',
        'Depuis 18 ans, je me fie à mes ressentis, aux cartes et aux images qui apparaissent pendant nos échanges. J’aime aller droit au but et vous donner une vision claire de votre situation.',
      ],
      reponses: [
        'J’ai une image très nette : une porte qui se ferme et une autre qui s’ouvre juste à côté. Le changement professionnel est pour cet automne.',
        'Les cartes et mon ressenti vont dans le même sens : ce n’est pas le bon moment pour trancher. Attendez trois semaines.',
        'Je vais droit au but : cette personne tient à vous, mais elle ne quittera pas sa situation actuelle.',
      ],
    },
    {
      id: 'nadia', prenom: 'Nadia', titre: 'Tarologue · Guidance carrière',
      statut: 'online', top: false, note: 4.9, avis: 1580, consultations: 14200, experience: 11,
      credits: 2, delai: '3 min', specialites: ['tarot', 'travail', 'numerologie'],
      tags: ['Tarot', 'Carrière', 'Décision'],
      accroche: 'Décider, ce n’est pas deviner : c’est voir clair.',
      resume: 'Tarot appliqué aux décisions professionnelles : timing, associés, reconversion.',
      horaires: H.journee,
      bio: [
        'Ancienne consultante en ressources humaines, je me suis tournée vers le tarot il y a onze ans en gardant la même méthode : poser le problème avant de chercher la réponse.',
        'Je travaille sur les décisions professionnelles concrètes et je donne toujours au moins deux scénarios avec leurs conséquences.',
        'Mes lectures sont structurées et argumentées, tarif 2 crédits par message.',
      ],
      reponses: [
        'Deux scénarios : vous restez et vous négociez maintenant, ou vous partez en juin avec une meilleure position. Le tarot favorise nettement le second.',
        'Le Chariot en position centrale : vous avez déjà décidé, vous cherchez une permission. Vous ne l’aurez de personne.',
        'Attention à l’associé qui parle beaucoup et signe peu. La carte est sans ambiguïté sur ce point.',
      ],
    },
    {
      id: 'gabriel', prenom: 'Gabriel', titre: 'Médium spirite · Deuil & lignées',
      statut: 'offline', top: false, note: 4.9, avis: 720, consultations: 5400, experience: 18,
      credits: 3, delai: '10 min', specialites: ['mediumnite', 'famille'],
      tags: ['Médiumnité', 'Deuil', 'Lignées'],
      accroche: 'Accompagner le deuil demande du temps, pas des effets.',
      resume: 'Accompagnement du deuil et des mémoires familiales, avec un cadre déontologique strict.',
      horaires: H.weekend,
      bio: [
        'Je pratique la médiumnité spirite depuis dix-huit ans, dans un cadre déontologique strict : je n’accepte pas les consultations de deuil récent (moins de trois mois).',
        'Mon travail porte sur l’apaisement, jamais sur la promesse d’un contact. Ce qui vient, vient ; ce qui ne vient pas, je le dis.',
        'Je consulte sur rendez-vous, principalement le week-end. Activez la notification pour être prévenu de mon retour en ligne.',
      ],
      reponses: [
        'Il y a une présence apaisée, sans reproche. Le message est court : « ce n’était pas de ta faute ».',
        'Ce que vous portez vient de deux générations plus haut. Le nommer suffit souvent à alléger.',
        'Je ne force jamais un contact. Aujourd’hui rien ne vient, et c’est une réponse en soi. Reprenons dans quelques semaines.',
      ],
    },
    {
      id: 'yasmine', prenom: 'Yasmine', titre: 'Voyance pure · Amour & retour',
      statut: 'online', top: false, note: 4.7, avis: 540, consultations: 4800, experience: 6,
      credits: 1, delai: '2 min', specialites: ['voyance-pure', 'amour'],
      tags: ['Voyance pure', 'Amour', 'Retour affectif'],
      accroche: 'Vous n’avez pas besoin de tout me raconter.',
      resume: 'Connexion immédiate sur simple prénom. Réponses courtes, directes et datées.',
      horaires: H.continu,
      bio: [
        'Je travaille sur simple prénom, sans support. Mes messages sont courts parce que je transmets ce qui vient, sans le rallonger.',
        'Les questions de retour affectif représentent l’essentiel de ma pratique.',
        'Disponible presque en continu, avec un temps de réponse moyen de deux minutes.',
      ],
      reponses: [
        'Il pense à vous plus souvent qu’il ne le montre. Mais il ne fera pas le premier pas ce mois-ci.',
        'Je vois un message écrit qui arrive, pas un appel. Autour du 14.',
        'Ce n’est pas de l’indifférence, c’est de la peur. La nuance change tout pour la suite.',
      ],
    },
    {
      id: 'olivier', prenom: 'Olivier', titre: 'Tarot de Marseille · Guidance de vie',
      statut: 'online', top: false, note: 4.8, avis: 990, consultations: 9300, experience: 14,
      credits: 1, delai: '4 min', specialites: ['tarot', 'travail', 'famille'],
      tags: ['Tarot de Marseille', 'Guidance', 'Famille'],
      accroche: 'Le tarot ne prédit pas : il met en ordre.',
      resume: 'Lecture classique du Tarot de Marseille pour remettre de l’ordre dans les situations enchevêtrées.',
      horaires: H.continu,
      bio: [
        'Quatorze ans de Tarot de Marseille, dans la tradition la plus classique : pas d’ajout, pas d’oracle mélangé.',
        'Je suis particulièrement à l’aise avec les situations enchevêtrées, où plusieurs sujets se contaminent — travail, couple, argent, famille.',
        'Ma méthode : on isole, on hiérarchise, puis on tire.',
      ],
      reponses: [
        'Vous mélangez deux questions. Le tirage répond clairement à la première et reste muet sur la seconde : c’est un signal.',
        'La Maison Dieu en position de passé : la rupture a déjà eu lieu, vous en vivez seulement les conséquences.',
        'Le Monde en aboutissement : ce cycle se referme proprement. Ne le rouvrez pas par nostalgie.',
      ],
    },
    {
      id: 'lucie', prenom: 'Lucie', titre: 'Numérologue · Cycles & timing',
      statut: 'online', top: false, note: 4.8, avis: 460, consultations: 3600, experience: 8,
      credits: 2, delai: '5 min', specialites: ['numerologie', 'travail'],
      tags: ['Numérologie', 'Cycles', 'Timing'],
      accroche: 'Le bon choix au mauvais moment reste un mauvais choix.',
      resume: 'Calcul de vos cycles personnels pour choisir le bon moment plutôt que la bonne option.',
      horaires: H.journee,
      bio: [
        'La numérologie ne dit pas quoi faire, elle dit quand. C’est exactement ce qui manque à la plupart des décisions.',
        'Je calcule votre année, votre mois et votre jour personnels, puis je les croise avec votre chemin de vie.',
        'Prévoyez deux à trois messages pour une analyse complète.',
      ],
      reponses: [
        'Vous êtes en année personnelle 1 : c’est un démarrage. Tout ce que vous lancez maintenant a neuf ans devant lui.',
        'Mois personnel 4, c’est-à-dire consolidation. Mauvaise période pour signer, bonne pour préparer.',
        'Votre cycle change en octobre. Ce que vous forcez aujourd’hui deviendra fluide à ce moment-là.',
      ],
    },
    {
      id: 'raphael', prenom: 'Raphaël', titre: 'Clairvoyant · Questions fermées',
      statut: 'busy', top: false, note: 4.6, avis: 380, consultations: 3100, experience: 5,
      credits: 1, delai: '3 min', specialites: ['voyance-pure', 'pendule'],
      tags: ['Oui / Non', 'Pendule', 'Rapide'],
      accroche: 'Une question fermée, une réponse nette.',
      resume: 'Format court : vous posez une question fermée, je réponds oui, non ou pas encore.',
      horaires: H.soir,
      bio: [
        'Mon format est volontairement minimaliste : une question fermée, une réponse nette, une phrase d’explication.',
        'C’est le format le plus économique en crédits, et le plus frustrant pour ceux qui cherchent une longue lecture.',
        'Si votre question demande une analyse, orientez-vous plutôt vers un praticien en lecture longue.',
      ],
      reponses: [
        'Non. Pas dans les conditions actuelles — quelque chose doit changer d’abord.',
        'Oui, et plus vite que vous ne le pensez. Tenez-vous prêt.',
        'Pas encore. La réponse n’est pas fermée, elle est simplement en attente.',
      ],
    },
    {
      id: 'aurore', prenom: 'Aurore', titre: 'Astrologue karmique',
      statut: 'online', top: false, note: 4.9, avis: 1320, consultations: 11500, experience: 16,
      credits: 2, delai: '4 min', specialites: ['astrologie', 'amour', 'famille'],
      tags: ['Astrologie karmique', 'Nœuds lunaires', 'Amour'],
      accroche: 'Ce qui se répète cherche à être compris, pas subi.',
      resume: 'Astrologie karmique : nœuds lunaires, répétitions et schémas relationnels.',
      horaires: H.continu,
      bio: [
        'Je travaille sur les nœuds lunaires et les répétitions : les mêmes histoires, les mêmes profils, les mêmes ruptures.',
        'Seize ans de pratique m’ont convaincue que la plupart des blocages relationnels sont des schémas identifiables, donc modifiables.',
        'J’ai besoin de votre date, heure et lieu de naissance pour une lecture complète.',
      ],
      reponses: [
        'Nœud sud en Balance : vous répétez le sacrifice relationnel. Votre axe d’évolution demande exactement l’inverse.',
        'Le même profil revient parce que la leçon n’est pas terminée, pas parce que vous êtes maudite.',
        'Transit de Saturne sur votre Vénus : période exigeante mais structurante. Ce qui tient après cela tient vraiment.',
      ],
    },
    {
      id: 'malika', prenom: 'Malika', titre: 'Cartomancienne · Oracle Belline',
      statut: 'online', top: false, note: 4.7, avis: 620, consultations: 5200, experience: 9,
      credits: 1, delai: '3 min', specialites: ['tarot', 'amour', 'travail'],
      tags: ['Oracle Belline', 'Amour', 'Travail'],
      accroche: 'L’oracle raconte une histoire, encore faut-il l’écouter jusqu’au bout.',
      resume: 'Lecture narrative à l’Oracle Belline, riche en détails de contexte et de personnes.',
      horaires: H.soir,
      bio: [
        'L’Oracle Belline est un jeu narratif : il donne du contexte, des personnages, des lieux. C’est précieux quand la question porte sur un entourage.',
        'Je m’en sers pour les situations où plusieurs personnes interviennent : triangles amoureux, conflits d’équipe, familles recomposées.',
        'Mes lectures sont vivantes et détaillées.',
      ],
      reponses: [
        'Une tierce personne apparaît nettement dans le tirage. Pas forcément une rivale : quelqu’un qui influence sans être visible.',
        'La carte du voyage sort deux fois : un éloignement géographique joue dans cette histoire.',
        'L’oracle décrit une personne prudente, échaudée. Sa lenteur n’est pas du désintérêt.',
      ],
    },
    {
      id: 'julien', prenom: 'Julien', titre: 'Magnétiseur & Énergéticien',
      statut: 'offline', top: false, note: 4.8, avis: 340, consultations: 2700, experience: 7,
      credits: 2, delai: '8 min', specialites: ['mediumnite', 'famille'],
      tags: ['Énergies', 'Nettoyage', 'Protection'],
      accroche: 'On ne nettoie pas une pièce en fermant les yeux.',
      resume: 'Travail énergétique à distance : lourdeurs, fatigue inexpliquée, ambiance pesante.',
      horaires: H.weekend,
      bio: [
        'Magnétiseur, je travaille à distance sur les lourdeurs énergétiques : fatigue qui ne passe pas, sensation d’être bloqué, atmosphère pesante à la maison.',
        'Je ne remplace jamais un avis médical et je le rappelle systématiquement.',
        'Je consulte le week-end. Activez la notification pour connaître mes retours en ligne.',
      ],
      reponses: [
        'Il y a une accumulation, pas une attaque. La différence compte : cela se dissipe avec de l’hygiène énergétique simple.',
        'Je ressens un point de blocage au niveau du plexus. Cela accompagne souvent une décision retenue trop longtemps.',
        'Avant toute chose : faites vérifier cette fatigue par un médecin. Le travail énergétique vient en complément, jamais à la place.',
      ],
    },
    {
      id: 'clara', prenom: 'Clara', titre: 'Voyante · Grossesse & famille',
      statut: 'online', top: false, note: 4.9, avis: 870, consultations: 7900, experience: 10,
      credits: 1, delai: '3 min', specialites: ['famille', 'voyance-pure', 'pendule'],
      tags: ['Famille', 'Enfant', 'Foyer'],
      accroche: 'Les questions de famille méritent une grande délicatesse.',
      resume: 'Spécialiste des questions de foyer : enfants, projets de famille, tensions parentales.',
      horaires: H.continu,
      bio: [
        'Je me consacre aux questions de foyer : projets d’enfant, relations parents-adolescents, tensions dans la fratrie, séparations avec enfants.',
        'Ce sont des sujets où la délicatesse compte autant que la précision. Je prends le temps qu’il faut.',
        'Je rappelle toujours qu’aucune voyance ne remplace un suivi médical ou psychologique.',
      ],
      reponses: [
        'Je vois un apaisement dans le foyer après une mise au point difficile mais nécessaire. Elle est proche.',
        'L’adolescent dont vous parlez teste un cadre, il ne le rejette pas. La distinction est importante.',
        'Sur cette question, je préfère être prudente : la voyance ne se substitue pas à un avis médical.',
      ],
    },
    {
      id: 'theo', prenom: 'Théo', titre: 'Runologue · Décisions rapides',
      statut: 'online', top: false, note: 4.6, avis: 290, consultations: 2400, experience: 4,
      credits: 1, delai: '2 min', promo: 'Nouveau praticien', specialites: ['runes', 'travail'],
      tags: ['Runes', 'Décision', 'Rapide'],
      accroche: 'Trois runes, une direction.',
      resume: 'Tirage à trois runes pour trancher rapidement une hésitation.',
      horaires: H.soir,
      bio: [
        'Format simple et rapide : trois runes, passé / présent / direction. Je réponds en moins de deux minutes.',
        'Nouveau sur la plateforme après quatre ans de pratique en cabinet.',
        'Idéal pour les hésitations du quotidien plutôt que pour les grands bilans de vie.',
      ],
      reponses: [
        'Trois runes, une direction claire : allez-y, mais préparez une porte de sortie.',
        'Thurisaz au centre : il y a un conflit à traverser, pas à contourner.',
        'Le tirage est net sur le fait que l’attente vous coûte plus que l’action.',
      ],
    },
    {
      id: 'helene', prenom: 'Hélène', titre: 'Médium · Guidance douce',
      statut: 'busy', top: false, note: 4.9, avis: 1100, consultations: 9800, experience: 13,
      credits: 2, delai: '6 min', specialites: ['mediumnite', 'amour', 'famille'],
      tags: ['Médiumnité', 'Douceur', 'Écoute'],
      accroche: 'Il y a des vérités qui ne se disent pas n’importe comment.',
      resume: 'Guidance très douce, pensée pour les périodes de fragilité émotionnelle.',
      horaires: H.continu,
      bio: [
        'Ma pratique s’adresse d’abord aux personnes en période de fragilité : séparation récente, deuil, épuisement.',
        'Je dis les choses, mais je choisis le moment et les mots. La brutalité n’a jamais aidé personne à avancer.',
        'Consultations développées, 2 crédits par message.',
      ],
      reponses: [
        'Je vais vous répondre, mais d’abord : ce que vous traversez est lourd, et vous le gérez mieux que vous ne le croyez.',
        'Il y a une éclaircie, réelle, mais elle demande encore quelques semaines. Ne jugez pas votre situation depuis ce point bas.',
        'Ce que je perçois est apaisant, sans être ce que vous espérez exactement. Voulez-vous que je précise ?',
      ],
    },
    {
      id: 'samir', prenom: 'Samir', titre: 'Voyant · Argent & patrimoine',
      statut: 'online', top: false, note: 4.7, avis: 510, consultations: 4300, experience: 11,
      credits: 2, delai: '4 min', specialites: ['voyance-pure', 'travail', 'numerologie'],
      tags: ['Argent', 'Patrimoine', 'Décision'],
      accroche: 'Je n’annonce jamais de gain. J’éclaire des choix.',
      resume: 'Questions financières et patrimoniales, avec un cadre déontologique explicite.',
      horaires: H.journee,
      bio: [
        'Je traite les questions d’argent : vente immobilière, succession, litige, timing d’un investissement.',
        'Cadre clair et non négociable : je n’annonce jamais de gain au jeu et je ne donne aucun conseil financier réglementé.',
        'Ce que j’éclaire, ce sont les intentions des personnes autour de la transaction.',
      ],
      reponses: [
        'La vente se fait, mais pas au prix affiché. L’acheteur sérieux se présente après une première déception.',
        'Il y a une rétention d’information dans cette succession. Demandez les documents par écrit.',
        'Je ne me prononce jamais sur les jeux d’argent. En revanche, sur votre situation professionnelle, voici ce que je vois.',
      ],
    },
    {
      id: 'faustine', prenom: 'Faustine', titre: 'Tarologue de nuit',
      statut: 'online', top: false, note: 4.8, avis: 760, consultations: 6800, experience: 9,
      credits: 1, delai: '2 min', specialites: ['tarot', 'amour', 'voyance-pure'],
      tags: ['Tarot', 'Nuit', 'Amour'],
      accroche: 'Les questions qui empêchent de dormir méritent une réponse la nuit.',
      resume: 'Disponible de 20h à 4h : les questions qui empêchent de dormir trouvent une réponse la nuit.',
      horaires: H.nuit,
      bio: [
        'Je consulte exclusivement la nuit, de 20h à 4h. C’est le moment où les questions deviennent insistantes et où presque personne n’est disponible.',
        'Tarot classique, réponses rapides, ton posé.',
        'Beaucoup de mes consultants reviennent simplement pour ne pas rester seuls avec leur question à 2h du matin.',
      ],
      reponses: [
        'Vous ne dormez pas à cause de cette question, alors traitons-la maintenant. Voici ce que montrent les cartes.',
        'La nuit amplifie tout. Ce que je vois est nettement moins dramatique que ce que vous imaginez en ce moment.',
        'Le tirage est clair : rien ne se joue cette nuit. Dormez, la réponse arrive dans la semaine.',
      ],
    },
    {
      id: 'bastien', prenom: 'Bastien', titre: 'Médium · Animaux & intuition',
      statut: 'offline', top: false, note: 4.7, avis: 220, consultations: 1900, experience: 6,
      credits: 1, delai: '7 min', specialites: ['mediumnite', 'famille'],
      tags: ['Animaux', 'Intuition', 'Foyer'],
      accroche: 'Ils ne parlent pas, mais ils disent beaucoup.',
      resume: 'Communication animale et lecture de l’ambiance du foyer.',
      horaires: H.weekend,
      bio: [
        'Je pratique la communication animale : comportement inexpliqué, animal perdu, fin de vie.',
        'Je travaille aussi sur l’ambiance générale du foyer, que les animaux perçoivent souvent avant nous.',
        'Aucune de mes consultations ne remplace un avis vétérinaire.',
      ],
      reponses: [
        'Ce comportement est une réaction à un changement dans la maison, pas un problème de caractère.',
        'Je perçois une direction plutôt qu’un lieu précis : cherchez vers l’ouest, près d’un point d’eau.',
        'Avant tout : faites voir cet animal par un vétérinaire. Ensuite, je vous dirai ce que je ressens.',
      ],
    },
    {
      id: 'victoire', prenom: 'Victoire', titre: 'Voyante · Bilan complet',
      statut: 'online', top: false, note: 4.9, avis: 940, consultations: 8200, experience: 20,
      credits: 3, delai: '8 min', specialites: ['voyance-pure', 'tarot', 'astrologie', 'travail'],
      tags: ['Bilan', 'Année à venir', 'Complet'],
      accroche: 'Une seule consultation, mais complète.',
      resume: 'Bilan approfondi sur douze mois : amour, travail, famille, santé énergétique.',
      horaires: H.journee,
      bio: [
        'Vingt ans de pratique. Je propose un format unique : le bilan complet sur douze mois, tous domaines confondus.',
        'Un bilan demande trois à quatre messages de ma part, à 3 crédits chacun. C’est un investissement assumé, pas une consultation d’appoint.',
        'Je ne prends pas de questions ponctuelles : d’autres praticiens de la plateforme le font très bien et pour moins cher.',
      ],
      reponses: [
        'Commençons par le cadre : douze mois, quatre domaines. Je vais procéder dans l’ordre, dites-moi si vous voulez approfondir un point.',
        'Sur le plan professionnel, la première partie de l’année est en retrait, la seconde nettement plus mobile.',
        'Le domaine affectif est le plus chargé de votre thème cette année. Nous y reviendrons en détail.',
      ],
    },
  ];

  /* --- Packs de crédits ---------------------------------------------------
     Grille unique : modale « Liste des forfaits », pages Crédits et Tarifs.
     `bonus` : crédits en plus par rapport au tarif de base (≈ 2 € le crédit),
     en %. Le coût par message n'est jamais saisi : il se calcule (prix ÷ crédits). */
  const PACKS = [
    { id: 'essai', nom: 'Offre d’essai', credits: 2, prix: 4.99, badge: null, essai: true },
    { id: 'prevision', nom: 'Prévision', credits: 6, prix: 9.99, bonus: 20, badge: null },
    { id: 'evidence', nom: 'Évidence', credits: 15, prix: 19.99, bonus: 50, badge: null },
    { id: 'certitude', nom: 'Certitude', credits: 25, prix: 29.99, bonus: 67, badge: '★ Populaire', populaire: true },
    { id: 'resolution', nom: 'Résolution', credits: 55, prix: 49.99, bonus: 120, badge: null },
  ];

  /* --- Paliers de fidélité -------------------------------------------------
     Récompensent les crédits CONSOMMÉS, cumulés depuis toujours : le compteur
     n'est jamais remis à zéro et les crédits offerts sont versés au solde dès
     le palier franchi. Au-delà du dernier palier listé, la règle continue
     d'elle-même, sans fin : +10 crédits tous les 50 crédits consommés. */
  const PALIERS = [
    { seuil: 10, credits: 1 },
    { seuil: 30, credits: 3 },
    { seuil: 60, credits: 5 },
    { seuil: 100, credits: 7 },
    { seuil: 150, credits: 10 },
  ];
  const PALIER_RECURRENT = { pas: 50, credits: 10 };

  /* --- Offres ciblées ------------------------------------------------------
     Proposées dans une modale (assets/js/modales.js), jamais listées avec les
     packs publics. Le segment du client (VERT…) sera attribué par le
     back-office : la maquette présente l'offre à tous les visiteurs.
     `bonus` : crédits en plus, en % ; `duree` : validité en secondes. */
  const OFFRES = {
    vert: { id: 'vert', nom: 'Offre spéciale', credits: 15, prix: 17.99, bonus: 50, duree: 15 },
    // Offre du jour : crédits offerts contre la vérification d'un numéro de mobile.
    mobile: { id: 'mobile', nom: 'Offre du jour', credits: 3, valeur: 7.5 },
  };

  /* --- Compléments (upsell) ------------------------------------------------
     Proposés au moment de valider une offre ou un pack depuis une modale, en
     plus de l'achat en cours : compatibles avec tous les packs, retirables sur
     la page de paiement, achetables une fois (credits.html?complement=plus20). */
  const COMPLEMENTS = {
    plus20: { id: 'plus20', credits: 20, prix: 16.99 },
  };

  /* --- FAQ ---------------------------------------------------------------- */
  const FAQ = [
    {
      cat: 'Fonctionnement',
      q: 'Comment se déroule une consultation par tchat ?',
      r: 'Vous choisissez votre praticien, vous écrivez votre question et vous échangez en direct par message écrit. Vous conservez l’historique complet de la conversation pour relire vos prédictions quand vous le souhaitez, sans limite de durée.',
    },
    {
      cat: 'Crédits',
      q: 'Qu’est-ce qu’un crédit ?',
      r: 'Un crédit correspond à un message que vous envoyez. Vous ne payez pas au temps passé : posez votre question, refermez la conversation et revenez quand vous voulez. Les réponses du praticien ne sont jamais facturées.',
    },
    {
      cat: 'Crédits',
      q: 'Combien coûte un message ?',
      r: 'La majorité des praticiens facturent 1 crédit par message. Les lectures longues (bilan complet, astrologie karmique, numérologie détaillée) peuvent coûter 2 ou 3 crédits : le tarif est toujours affiché sur la fiche du praticien et rappelé dans la zone de saisie avant l’envoi.',
    },
    {
      cat: 'Crédits',
      q: 'Mes crédits expirent-ils ?',
      r: 'Non. Vos crédits n’ont aucune date d’expiration et il n’existe aucun abonnement ni prélèvement automatique sur unevoyante.fr. Vous rechargez uniquement quand vous en avez envie.',
    },
    {
      cat: 'Crédits',
      q: 'Comment acheter des crédits ?',
      r: 'Rendez-vous sur la page Crédits, choisissez votre pack, puis réglez par carte bancaire, Apple Pay ou PayPal. Les crédits sont disponibles immédiatement après le paiement, y compris au milieu d’une conversation en cours.',
    },
    {
      cat: 'Confidentialité',
      q: 'La consultation est-elle confidentielle ?',
      r: 'Totalement. Vos échanges sont chiffrés, jamais partagés et ne servent à aucune finalité commerciale. Vous consultez sous le prénom de votre choix et aucun praticien n’a accès à votre adresse e-mail ni à vos coordonnées de paiement.',
    },
    {
      cat: 'Praticiens',
      q: 'Que se passe-t-il si la voyante n’est plus connectée ?',
      r: 'Votre message reste dans la conversation et le praticien y répond dès son retour en ligne. Aucun crédit n’est perdu. Vous pouvez également activer une notification pour être prévenu de sa prochaine disponibilité.',
    },
    {
      cat: 'Praticiens',
      q: 'Comment les praticiens sont-ils sélectionnés ?',
      r: 'Chaque candidature passe par une consultation test anonyme, une vérification d’identité et la signature de notre charte déontologique. Moins de 5 % des candidats sont retenus, et un praticien dont la note moyenne descend durablement sous 4,5/5 est réévalué.',
    },
    {
      cat: 'Compte',
      q: 'Comment utiliser mes 3 crédits offerts ?',
      r: 'Ils sont crédités automatiquement à la création de votre compte et utilisables immédiatement, chez le praticien de votre choix. Aucune carte bancaire n’est demandée pour en profiter.',
    },
    {
      cat: 'Compte',
      q: 'Puis-je supprimer mon compte et mes données ?',
      r: 'Oui, à tout moment depuis votre espace membre, rubrique Confidentialité. La suppression est définitive et entraîne l’effacement de l’historique de vos conversations sous 30 jours.',
    },
  ];

  /* --- Étapes « Comment ça marche » --------------------------------------- */
  const ETAPES = [
    {
      n: 1, titre: 'Choisissez votre voyante', icon: 'person_search',
      texte: 'Parcourez les profils vérifiés, lisez les avis clients et découvrez leurs spécialités selon votre besoin.',
    },
    {
      n: 2, titre: 'Posez votre question par écrit', icon: 'edit_note',
      texte: 'Rédigez votre message à votre rythme. Aucun appel téléphonique, discrétion et anonymat 100 % garantis.',
    },
    {
      n: 3, titre: 'Recevez une réponse personnalisée', icon: 'mark_chat_read',
      texte: 'Votre voyante vous répond en direct sous quelques minutes avec une guidance précise et bienveillante.',
    },
  ];

  /* --- Arguments de confiance --------------------------------------------- */
  /* `ton` : variante de teinte de la carte (définie dans src/input.css). */
  const CONFIANCE = [
    {
      icon: 'verified_user', titre: 'Praticiens rigoureusement testés', ton: 'tint-sauge',
      texte: 'Moins de 5 % des candidats sont retenus après tests anonymes et validation déontologique.',
    },
    {
      icon: 'lock', titre: 'Confidentialité & anonymat total', ton: 'tint-amethyste',
      texte: 'Vos échanges sont strictement chiffrés et privés. Aucune donnée personnelle n’est partagée.',
    },
    {
      icon: 'credit_card', titre: 'Sans engagement ni abonnement', ton: 'tint-champagne',
      texte: 'Vous ne payez qu’à la question envoyée. Les crédits n’expirent jamais, sans frais cachés.',
    },
  ];

  const STATS = [
    { valeur: '50 000+', libelle: 'Consultations réalisées' },
    { valeur: '4,8 / 5', libelle: 'Note moyenne (Trustpilot)' },
    { valeur: '98 %', libelle: 'Clients satisfaits' },
    { valeur: '2 min', libelle: 'Délai moyen de réponse' },
  ];

  /* --- Conversation de démonstration avec Claire ---------------------------
     Cinq messages échangés (3 de Claire, 2 de l'utilisateur).
     `ilYA` = minutes avant l'ouverture de la page.
     Le solde final (3 crédits) correspond à l'état initial du magasin. ------ */
  const DEMO_TCHAT = [
    { de: 'eux', ilYA: 26, texte: 'Bonjour, je suis Claire. Je vous écoute : quelle est votre question ?' },
    { de: 'moi', ilYA: 24, texte: 'Bonjour Claire. Je ne sais pas si je dois reprendre contact avec mon ex, Julien. Qu’est-ce que vous voyez ?' },
    { de: 'eux', ilYA: 21, texte: 'Je tire les cartes pour vous. Je vois une période de silence qui se termine bientôt, mais l’initiative ne doit pas venir de vous. Laissez passer deux semaines.' },
    { de: 'moi', ilYA: 19, texte: 'Deux semaines… c’est long. Et s’il ne revient pas de lui-même ?' },
    { de: 'eux', ilYA: 16, texte: 'L’Étoile sort en position de futur proche : ce que vous croyez perdu revient sous une autre forme. Ne forcez rien avant la fin du mois.' },
  ];

  /* --- Génération déterministe des avis par praticien --------------------- */
  const JOURS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

  function avisDe(voyant) {
    const base = voyant.id.length + voyant.avis;
    const dates = ['8 septembre 2026', '5 septembre 2026', '2 septembre 2026', '29 août 2026', '24 août 2026', '19 août 2026'];
    // Chaque praticien démarre à un point différent de la liste : les auteurs
    // et les textes varient d'une fiche à l'autre.
    const debut = (base * 7) % AVIS_TYPE.length;
    return Array.from({ length: 6 }, (_, i) => {
      const a = AVIS_TYPE[(debut + i) % AVIS_TYPE.length];
      return { auteur: a[0], note: a[1], texte: a[2], date: dates[(base + i) % dates.length] };
    });
  }

  global.UV_DATA = {
    SPECIALITES, VOYANTS, PACKS, PALIERS, PALIER_RECURRENT, OFFRES, COMPLEMENTS,
    FAQ, ETAPES, CONFIANCE, STATS, JOURS, DEMO_TCHAT, avisDe,
    byId: (id) => VOYANTS.find((v) => v.id === id) || null,
  };
})(window);
