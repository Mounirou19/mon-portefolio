/* ---- Diagnostic facture électronique : moteur ----
   Chargement : script classique, sans module ni build. Dans le navigateur, il expose une
   seule variable globale, DIAGNOSTIC ; sous Node, le même objet sort par module.exports
   (le test « typeof module » en bas du fichier). Les règles (REGLES, dans regles.js) sont
   passées en paramètre : le moteur ne lit ni le DOM, ni l'horloge, ni aucune date en dur.

   diagnostiquer(reponses, regles, dateDuJour) → résultat
     reponses   : { statut, tva, taille, clients: [..], plateforme, outil, compatible }
     dateDuJour : Date ou chaîne 'AAAA-MM-JJ'
   questionsAPoser(reponses, regles) → liste des questions à afficher, dans l'ordre.

   Choix de lecture du cahier des charges :
   - Une réponse « nsp » ou « inconnu » compte comme « non » pour le calcul, et la question
     est signalée dans resultat.incertains. Exceptions : pour statut et tva, « nsp » garde
     le visiteur dans le champ (seul un « non » ou « exonere » explicite l'en fait sortir).
   - Une obligation non remplie est « en_retard » si son échéance est atteinte à la date du
     jour, « a_faire » sinon (réception comprise).
   - L'action « outil » n'est proposée que si l'émission ou le e-reporting s'applique. */
var DIAGNOSTIC = (function () {
  var JOUR = 86400000;

  function versJour(d) {
    if (typeof d === 'string') {
      var p = d.split('-');
      return Date.UTC(+p[0], +p[1] - 1, +p[2]);
    }
    return Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
  }

  function joursEntre(de, a) {
    return Math.round((versJour(a) - versJour(de)) / JOUR);
  }

  function questionsAPoser(reponses, regles) {
    reponses = reponses || {};
    if (reponses.statut === 'non') return regles.questions.slice(0, 1);
    return regles.questions.filter(function (q) {
      if (!q.sauterSi) return true;
      return !Object.keys(q.sauterSi).some(function (id) {
        return q.sauterSi[id].indexOf(reponses[id]) !== -1;
      });
    });
  }

  function diagnostiquer(reponses, regles, dateDuJour) {
    reponses = reponses || {};
    var incertaines = regles.reponsesIncertaines;
    var resultat = {
      niveau: null,
      horsChamp: false,
      obligations: [],
      actions: [],
      incertains: []
    };

    var aPoser = questionsAPoser(reponses, regles);
    aPoser.forEach(function (q) {
      if (incertaines.indexOf(reponses[q.id]) !== -1) resultat.incertains.push(q.id);
    });

    if (reponses.statut === 'non') {
      resultat.niveau = 'non_concerne';
      return resultat;
    }

    var clients = reponses.clients || [];
    var exonere = reponses.tva === 'exonere';
    var plateformeOk = reponses.plateforme === 'oui';
    var compatibleOk = reponses.compatible === 'oui' && aPoser.some(function (q) { return q.id === 'compatible'; });
    var outilOk = (reponses.outil === 'logiciel' || reponses.outil === 'comptable') && compatibleOk;
    var ech = regles.echeances;
    var echEmission = reponses.taille === 'non' ? ech.emissionGrandes : ech.emissionPme;
    resultat.horsChamp = exonere;

    function etat(fait, echeance) {
      if (fait) return 'fait';
      return joursEntre(dateDuJour, echeance) <= 0 ? 'en_retard' : 'a_faire';
    }
    function ajouter(id, echeance, e) {
      resultat.obligations.push({
        id: id, echeance: echeance, etat: e,
        joursRestants: joursEntre(dateDuJour, echeance)
      });
    }

    ajouter('reception', ech.reception, etat(plateformeOk, ech.reception));

    var emission = !exonere && clients.indexOf('pros_fr') !== -1;
    if (emission) ajouter('emission', echEmission, etat(outilOk && plateformeOk, echEmission));

    var ereporting = !exonere && (clients.indexOf('particuliers') !== -1 || clients.indexOf('etranger') !== -1);
    if (ereporting) ajouter('ereporting', echEmission, etat(compatibleOk && plateformeOk, echEmission));

    if (emission) ajouter('mentions', echEmission, 'a_verifier');

    var etats = resultat.obligations.map(function (o) { return o.etat; });
    resultat.niveau = etats.indexOf('en_retard') !== -1 ? 'en_retard'
      : etats.indexOf('a_faire') !== -1 ? 'a_preparer'
      : 'en_bonne_voie';

    /* Actions, par ordre de priorité, trois au maximum. */
    function action(id, echeance) {
      resultat.actions.push({
        id: id, echeance: echeance,
        joursRestants: echeance ? joursEntre(dateDuJour, echeance) : null
      });
    }
    var outilAChanger = reponses.outil === 'papier' || reponses.outil === 'bureautique' || !compatibleOk;
    var ereportingAFaire = ereporting && etats[resultat.obligations.map(function (o) { return o.id; }).indexOf('ereporting')] !== 'fait';
    var prochaine = resultat.obligations
      .filter(function (o) { return o.etat !== 'fait'; })
      .map(function (o) { return o.echeance; })
      .sort()[0] || null;

    if (!plateformeOk) action('plateforme', ech.reception);
    if (outilAChanger && (emission || ereporting)) action('outil', echEmission);
    if (emission) action('mentions', echEmission);
    if (ereportingAFaire) action('ereporting', echEmission);
    action('comptable', prochaine);
    resultat.actions = resultat.actions.slice(0, 3);

    return resultat;
  }

  return { diagnostiquer: diagnostiquer, questionsAPoser: questionsAPoser, joursEntre: joursEntre };
})();

if (typeof module !== 'undefined' && module.exports) module.exports = DIAGNOSTIC;
