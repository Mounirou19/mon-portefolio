/* ---- Diagnostic facture électronique : données ----
   Questions, échéances, libellés et sources. Tout ce qui dépend de la loi vit ici :
   pour mettre la page à jour, on modifie ce fichier et la date de vérification.
   Chargé tel quel par le navigateur (variable globale REGLES) et par Node (module.exports). */
var REGLES = {
  dateVerification: '2026-10-10',

  /* Les montants ne sont pas encore recoupés avec une source officielle :
     tant que ce drapeau vaut false, la page n'affiche aucun chiffre. */
  afficherMontantsSanctions: false,

  echeances: {
    reception: '2026-09-01',
    emissionGrandes: '2026-09-01',   // grandes entreprises et ETI (250 salariés ou plus)
    emissionPme: '2027-09-01'        // PME, TPE et micro-entreprises
  },

  /* Réponses « je ne sais pas » : traitées comme « non » pour le calcul, et signalées. */
  reponsesIncertaines: ['nsp', 'inconnu'],

  questions: [
    {
      id: 'statut',
      texte: 'Votre activité est-elle une entreprise ou une activité indépendante établie en France ?',
      reponses: [
        { valeur: 'oui', libelle: 'Oui' },
        { valeur: 'non', libelle: 'Non' },
        { valeur: 'nsp', libelle: 'Je ne sais pas' }
      ]
    },
    {
      id: 'tva',
      texte: 'Quelle est votre situation vis-à-vis de la TVA ?',
      reponses: [
        { valeur: 'collecte', libelle: 'Je facture la TVA' },
        { valeur: 'franchise', libelle: 'Micro-entreprise ou franchise en base (pas de TVA sur mes factures)' },
        { valeur: 'exonere', libelle: 'Activité exonérée (santé, enseignement…)' },
        { valeur: 'nsp', libelle: 'Je ne sais pas' }
      ]
    },
    {
      id: 'taille',
      texte: 'Votre entreprise compte-t-elle moins de 250 salariés ?',
      reponses: [
        { valeur: 'oui', libelle: 'Oui, moins de 250' },
        { valeur: 'non', libelle: 'Non, 250 ou plus' }
      ]
    },
    {
      id: 'clients',
      texte: 'À qui vendez-vous ?',
      aide: 'Plusieurs choix possibles.',
      multiple: true,
      reponses: [
        { valeur: 'pros_fr', libelle: 'À des professionnels en France' },
        { valeur: 'particuliers', libelle: 'À des particuliers' },
        { valeur: 'etranger', libelle: 'À des clients à l’étranger' }
      ]
    },
    {
      id: 'plateforme',
      texte: 'Avez-vous choisi une plateforme agréée pour recevoir vos factures ?',
      aide: 'Une plateforme agréée est un service validé par l’État qui envoie et reçoit les factures électroniques à votre place.',
      reponses: [
        { valeur: 'oui', libelle: 'Oui' },
        { valeur: 'non', libelle: 'Non' },
        { valeur: 'inconnu', libelle: 'Je ne sais pas ce que c’est' }
      ]
    },
    {
      id: 'outil',
      texte: 'Comment faites-vous vos factures aujourd’hui ?',
      reponses: [
        { valeur: 'papier', libelle: 'Sur papier' },
        { valeur: 'bureautique', libelle: 'Avec Word, Excel ou un PDF' },
        { valeur: 'logiciel', libelle: 'Avec un logiciel de facturation ou de caisse' },
        { valeur: 'comptable', libelle: 'Mon comptable s’en charge' },
        { valeur: 'aucune', libelle: 'Je n’émets pas de facture' }
      ]
    },
    {
      id: 'compatible',
      texte: 'Votre outil est-il annoncé compatible avec la facture électronique ?',
      sauterSi: { outil: ['papier', 'bureautique', 'aucune'] },
      reponses: [
        { valeur: 'oui', libelle: 'Oui' },
        { valeur: 'non', libelle: 'Non' },
        { valeur: 'nsp', libelle: 'Je ne sais pas' }
      ]
    }
  ],

  niveaux: {
    en_retard: 'En retard',
    a_preparer: 'À préparer',
    en_bonne_voie: 'En bonne voie',
    non_concerne: 'Non concerné'
  },

  etats: {
    fait: 'Fait',
    a_faire: 'À faire',
    a_verifier: 'À vérifier',
    en_retard: 'En retard'
  },

  obligations: {
    reception: {
      libelle: 'Recevoir des factures électroniques',
      explication: 'Toutes les entreprises doivent pouvoir recevoir des factures électroniques, quelle que soit leur taille.',
      source: 'economie'
    },
    emission: {
      libelle: 'Émettre des factures électroniques',
      explication: 'Vos factures à des professionnels en France doivent partir en format électronique par une plateforme agréée. Un PDF envoyé par e-mail ne suffira plus à partir de cette échéance.',
      source: 'economie'
    },
    ereporting: {
      libelle: 'Transmettre vos données de ventes (e-reporting)',
      explication: 'Le e-reporting consiste à transmettre à l’administration, via votre plateforme, les montants de vos ventes aux particuliers et à l’étranger.',
      source: 'economie'
    },
    mentions: {
      libelle: 'Ajouter les nouvelles mentions sur vos factures',
      explication: 'Numéro SIREN du client, catégorie de l’opération (vente, prestation ou les deux), option de TVA sur les débits le cas échéant, adresse de livraison si elle diffère.',
      source: 'economie'
    }
  },

  actions: {
    plateforme: 'Choisir une plateforme agréée',
    outil: 'Remplacer ou faire évoluer votre outil de facturation',
    mentions: 'Ajouter les nouvelles mentions sur vos factures',
    ereporting: 'Préparer le e-reporting',
    comptable: 'En parler à votre expert-comptable'
  },

  messages: {
    nonConcerne: 'Vous n’êtes a priori pas concerné.',
    horsChamp: 'Probablement hors champ pour vos ventes exonérées, à confirmer. La réception de factures électroniques peut rester concernée.',
    incertain: 'Vous n’êtes pas sûr de ce point : c’est la première chose à vérifier.',
    avertissement: 'Ce diagnostic donne une information générale, pas un conseil fiscal ou juridique. Confirmez votre situation auprès de votre expert-comptable ou de votre service des impôts.',
    sanctions: 'Des amendes sont prévues en cas de manquement.',
    tolerance: 'L’administration annonce une approche de tolérance pour les entreprises en difficulté au démarrage. Aucun report n’est annoncé.'
  },

  /* Montants relevés dans une source secondaire, non recoupés. Affichés seulement si
     afficherMontantsSanctions vaut true. */
  sanctions: [
    'Facture non électronique : 50 € par facture, dans la limite de 15 000 € par an.',
    'Absence de plateforme agréée pour la réception : mise en demeure, puis 500 €, puis 1 000 € tous les trois mois.',
    'E-reporting manquant : 500 € par transmission, dans la limite de 15 000 € par an.'
  ],

  sources: {
    economie: {
      libelle: 'Tout savoir sur la facturation électronique (economie.gouv.fr)',
      url: 'https://www.economie.gouv.fr/tout-savoir-sur-la-facturation-electronique-pour-les-entreprises'
    },
    impots: {
      libelle: 'Je découvre la facturation électronique (impots.gouv.fr)',
      url: 'https://www.impots.gouv.fr/professionnel/je-decouvre-la-facturation-electronique'
    }
  }
};

if (typeof module !== 'undefined' && module.exports) module.exports = REGLES;
