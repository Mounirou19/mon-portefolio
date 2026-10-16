/* ==========================================================================
   Données des plans d'action — fichier unique à modifier.
   Champs :
     id         identifiant court (sans espace ni accent)
     nom        nom du plan
     livre      livre d'inspiration (cité comme source d'inspiration seulement)
     auteur     auteur du livre
     promesse   promesse en une phrase
     contenu    3 à 5 puces : étapes, durée, format
     prix       texte libre, ex. "29 €". Vide = « Prix à venir »
     statut     "En préparation" ou "Disponible"
   ========================================================================== */
window.PLANS = [
  {
    id: 'plan-01',
    nom: 'Plan Mindset Argent',
    livre: 'Réfléchissez et devenez riche',
    auteur: 'Napoleon Hill',
    promesse: 'Un plan en 30 jours pour définir un objectif financier précis et agir dessus chaque jour.',
    contenu: [
      'Durée : 30 jours, environ 15 minutes par jour',
      'Format : PDF avec carnet de suivi à imprimer',
      'Ce que tu obtiens : un objectif financier chiffré et un tableau de suivi quotidien',
      'Pour qui : ceux qui veulent passer de l\'envie à l\'action sur leur situation financière',
      'Ce n\'est pas un résumé du livre : c\'est un plan d\'action original'
    ],
    prix: '12 €',
    statut: 'En préparation'
  },
  {
    id: 'plan-02',
    nom: 'Plan MBA Autodidacte',
    livre: 'Le Personal MBA',
    auteur: 'Josh Kaufman',
    promesse: 'Un programme de 12 semaines pour maîtriser les bases du business sans passer par une école.',
    contenu: [
      'Durée : 12 semaines, un thème par semaine',
      'Format : PDF avec exercices et fiches de révision',
      'Ce que tu obtiens : un parcours structuré et un mini-projet business appliqué',
      'Pour qui : entrepreneurs, freelances et salariés qui veulent monter en compétences',
      'Ce n\'est pas un résumé du livre : c\'est un plan d\'action original'
    ],
    prix: '19 €',
    statut: 'En préparation'
  },
  {
    id: 'plan-03',
    nom: 'Plan Clarté & Intentions',
    livre: 'La Loi de l\'Attraction',
    auteur: 'Esther et Jerry Hicks',
    promesse: 'Un carnet de 21 jours pour clarifier ce que tu veux et le transformer en actions concrètes.',
    contenu: [
      'Durée : 21 jours, environ 10 minutes par jour',
      'Format : carnet PDF à imprimer ou à remplir à l\'écran',
      'Ce que tu obtiens : une liste d\'intentions claires et un plan d\'actions associées',
      'Pour qui : ceux qui veulent mettre de l\'ordre dans leurs objectifs personnels',
      'Ce n\'est pas un résumé du livre : c\'est un plan d\'action original'
    ],
    prix: '9 €',
    statut: 'En préparation'
  },
  {
    id: 'plan-04',
    nom: 'Plan Briser les Blocages',
    livre: 'Plus malin que le Diable',
    auteur: 'Napoleon Hill',
    promesse: 'Un plan pour repérer ce qui te freine et mettre en place des habitudes qui tiennent.',
    contenu: [
      'Durée : 4 semaines, quelques minutes par jour',
      'Format : PDF avec exercices d\'auto-observation et suivi d\'habitudes',
      'Ce que tu obtiens : une liste de tes freins identifiés et 3 habitudes à installer',
      'Pour qui : ceux qui commencent beaucoup de choses sans les terminer',
      'Ce n\'est pas un résumé du livre : c\'est un plan d\'action original'
    ],
    prix: '12 €',
    statut: 'En préparation'
  },
  {
    id: 'plan-05',
    nom: 'Plan Travailler Moins, Mieux',
    livre: 'La semaine de 4 heures',
    auteur: 'Timothy Ferriss',
    promesse: 'Un plan pour automatiser, déléguer et libérer du temps sur ton activité.',
    contenu: [
      'Durée : 4 semaines',
      'Format : PDF avec checklists et tableau d\'audit du temps',
      'Ce que tu obtiens : un audit de ton emploi du temps et une liste de tâches à automatiser ou déléguer',
      'Pour qui : freelances et indépendants débordés par leurs tâches',
      'Ce n\'est pas un résumé du livre : c\'est un plan d\'action original'
    ],
    prix: '15 €',
    statut: 'En préparation'
  },
  {
    id: 'plan-06',
    nom: 'Plan Tester son Idée',
    livre: 'Lean Startup',
    auteur: 'Eric Ries',
    promesse: 'Un plan en 4 semaines pour valider une idée de projet avant d\'y investir du temps et de l\'argent.',
    contenu: [
      'Durée : 4 semaines, une étape par semaine',
      'Format : PDF avec modèles à remplir (hypothèses, tests, bilan)',
      'Ce que tu obtiens : une idée testée auprès de vrais prospects et une décision claire (continuer, ajuster ou arrêter)',
      'Pour qui : porteurs de projet, freelances, créateurs d\'application ou de site',
      'Ce n\'est pas un résumé du livre : c\'est un plan d\'action original'
    ],
    prix: '19 €',
    statut: 'En préparation'
  }
];