/* ---- Diagnostic facture électronique : interface ----
   Affiche une question par écran, garde les réponses dans sessionStorage et affiche le
   résultat calculé par DIAGNOSTIC (diagnostic.js) à partir de REGLES (regles.js).
   Tout est enfermé dans une fonction pour ne pas croiser les noms de /main.js. */
(function () {
  if (typeof REGLES === 'undefined' || typeof DIAGNOSTIC === 'undefined') return;
  var racine = document.getElementById('diag');
  if (!racine) return;

  var CLE = 'diagnostic-facture';
  var MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  var SOUS_TITRES = {
    en_retard: 'Au moins une obligation est déjà en vigueur et n’est pas encore en place chez vous.',
    a_preparer: 'Rien n’est en retard, mais des étapes sont à prévoir avant vos échéances.',
    en_bonne_voie: 'L’essentiel est en place. Il reste quelques points à vérifier.',
    non_concerne: 'La facture électronique vise les entreprises et les indépendants établis en France.'
  };
  var CONTACT = {
    neutre: 'Une question sur votre situation ? Parlons-en.',
    en_retard: 'Vous êtes en retard sur un point : voyons-le ensemble.',
    a_preparer: 'Vous avez encore du temps : préparons la suite ensemble.',
    en_bonne_voie: 'Vous êtes en bonne voie. Un doute sur un point précis ?',
    non_concerne: 'A priori pas concerné ? Un doute, écrivez-moi.'
  };
  var PROMESSE = 'Je vous réponds sous 24 h en semaine avec mon avis sur votre situation.';
  var reduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (id) { return document.getElementById(id); };
  var vues = { intro: $('diag-intro'), question: $('diag-question'), resultat: $('diag-result') };

  var etat = lire() || { reponses: {}, etape: null };   // etape : null (accueil), n° de question, ou 'resultat'
  var courante = null, coches = [];

  function lire() {
    try {
      var s = JSON.parse(sessionStorage.getItem(CLE));
      return s && s.reponses ? s : null;
    } catch (e) { return null; }
  }
  function sauver() {
    try { sessionStorage.setItem(CLE, JSON.stringify(etat)); } catch (e) {}
  }

  function el(tag, classe, texte) {
    var n = document.createElement(tag);
    if (classe) n.className = classe;
    if (texte) n.textContent = texte;
    return n;
  }
  function dateLongue(iso) {
    var p = iso.split('-'), j = +p[2];
    return (j === 1 ? '1er' : j) + ' ' + MOIS[+p[1] - 1] + ' ' + p[0];
  }
  function delai(jours) {
    if (jours > 1) return 'dans ' + jours + ' jours';
    if (jours === 1) return 'demain';
    if (jours === 0) return 'aujourd’hui';
    return 'dépassée depuis ' + (-jours) + (jours === -1 ? ' jour' : ' jours');
  }
  function libelleReponse(q, v) {
    var r = q.reponses.filter(function (x) { return x.valeur === v; })[0];
    return r ? r.libelle : '';
  }

  function afficher(nom) {
    for (var k in vues) vues[k].hidden = k !== nom;
  }
  function amener(cible) {
    cible.focus({ preventScroll: true });
    cible.scrollIntoView({ behavior: reduit ? 'auto' : 'smooth', block: 'start' });
  }
  function questions() { return DIAGNOSTIC.questionsAPoser(etat.reponses, REGLES); }

  /* Retire les réponses aux questions qui ne se posent plus (ex. « compatible » après « papier »). */
  function nettoyer() {
    var ids = questions().map(function (q) { return q.id; });
    for (var k in etat.reponses) if (ids.indexOf(k) === -1) delete etat.reponses[k];
  }

  /* ---- questionnaire ---- */
  function montrerQuestion(i, focus) {
    var liste = questions();
    var q = courante = liste[i];
    etat.etape = i; sauver();
    afficher('question');

    $('diag-bar').style.width = Math.round(i / liste.length * 100) + '%';
    $('diag-step').textContent = 'Question ' + (i + 1) + ' sur ' + liste.length;
    $('diag-q').textContent = q.texte;
    $('diag-help').hidden = !q.aide;
    $('diag-help').textContent = q.aide || '';

    var zone = $('diag-answers'), valeur = etat.reponses[q.id];
    zone.textContent = '';
    zone.className = 'diag-answers' + (q.multiple ? ' multi' : '');
    coches = q.multiple ? (valeur || []).slice() : [];
    q.reponses.forEach(function (r) {
      var b = el('button', 'diag-answer', r.libelle);
      b.type = 'button';
      b.setAttribute('aria-pressed', q.multiple ? coches.indexOf(r.valeur) !== -1 : valeur === r.valeur);
      b.addEventListener('click', function () {
        if (!q.multiple) return repondre(q, r.valeur);
        var k = coches.indexOf(r.valeur);
        if (k === -1) coches.push(r.valeur); else coches.splice(k, 1);
        b.setAttribute('aria-pressed', k === -1);
        $('diag-next').disabled = !coches.length;
      });
      zone.appendChild(b);
    });
    $('diag-next').hidden = !q.multiple;
    $('diag-next').disabled = !coches.length;
    if (focus) amener($('diag-q'));
  }

  function repondre(q, valeur) {
    etat.reponses[q.id] = valeur;
    nettoyer();
    var liste = questions();
    var i = liste.map(function (x) { return x.id; }).indexOf(q.id);
    if (i + 1 < liste.length) montrerQuestion(i + 1, true);
    else montrerResultat(true);
  }

  function demarrer() {
    mesurer('diagnostic-demarre');
    majContact(null);
    etat = { reponses: {}, etape: 0 };
    montrerQuestion(0, true);
  }

  /* ---- résultat ---- */
  function montrerResultat(nouveau) {
    var r = DIAGNOSTIC.diagnostiquer(etat.reponses, REGLES, new Date());
    etat.etape = 'resultat'; sauver();
    afficher('resultat');

    var niveau = $('diag-level');
    niveau.className = 'diag-level lvl-' + r.niveau;
    niveau.textContent = '';
    niveau.appendChild(el('strong', '', REGLES.niveaux[r.niveau]));
    niveau.appendChild(el('p', '', (r.niveau === 'non_concerne' ? REGLES.messages.nonConcerne + ' ' : '') + SOUS_TITRES[r.niveau]));

    var msgs = $('diag-messages');
    msgs.textContent = '';
    if (r.horsChamp) msgs.appendChild(el('p', 'diag-msg', REGLES.messages.horsChamp));
    r.incertains.forEach(function (id) {
      var q = REGLES.questions.filter(function (x) { return x.id === id; })[0];
      msgs.appendChild(el('p', 'diag-msg', '« ' + q.texte + ' » ' + REGLES.messages.incertain));
    });

    $('diag-details').hidden = !r.obligations.length;
    var obl = $('diag-obl');
    obl.textContent = '';
    r.obligations.forEach(function (o) {
      var def = REGLES.obligations[o.id], source = REGLES.sources[def.source];
      var li = el('li'), tete = el('div', 'head');
      tete.appendChild(el('span', 'name', def.libelle));
      tete.appendChild(el('span', 'etat etat-' + o.etat, REGLES.etats[o.etat]));
      li.appendChild(tete);
      li.appendChild(el('p', '', def.explication));
      var ech = el('p', '', 'Échéance : ' + dateLongue(o.echeance) + (o.etat === 'fait' ? '' : ' (' + delai(o.joursRestants) + ')') + '. ');
      var lien = el('a', '', 'Source');
      lien.href = source.url; lien.rel = 'noopener'; lien.title = source.libelle;
      ech.appendChild(lien);
      li.appendChild(ech);
      obl.appendChild(li);
    });

    var act = $('diag-actions');
    act.textContent = '';
    r.actions.forEach(function (a) {
      var li = el('li');
      li.appendChild(el('span', 'name', REGLES.actions[a.id]));
      if (a.echeance) {
        li.appendChild(el('p', '', a.joursRestants < 0
          ? 'Échéance du ' + dateLongue(a.echeance) + ' dépassée : à faire dès maintenant.'
          : 'Avant le ' + dateLongue(a.echeance) + ', ' + delai(a.joursRestants) + '.'));
      }
      act.appendChild(li);
    });

    var note = [];
    if (r.niveau !== 'non_concerne') {
      note.push(REGLES.messages.sanctions);
      if (REGLES.afficherMontantsSanctions) note = note.concat(REGLES.sanctions);
      note.push(REGLES.messages.tolerance);
    }
    note.push(REGLES.messages.avertissement);
    $('diag-warning').textContent = note.join(' ');

    majContact(r);
    if (nouveau) {
      mesurer('diagnostic-termine', { niveau: r.niveau });
      amener(niveau);
    }
    return r;
  }

  /* ---- formulaire de contact : titre adapté et champs cachés lus par /main.js ---- */
  function champ(nom) { var f = $('cform'); return f && f.elements[nom]; }

  function resumer(r) {
    var lignes = ['Réponses :'];
    questions().forEach(function (q) {
      var v = etat.reponses[q.id];
      if (v === undefined) return;
      var txt = q.multiple ? v.map(function (x) { return libelleReponse(q, x); }).join(', ') : libelleReponse(q, v);
      lignes.push('- ' + q.texte + ' ' + txt);
    });
    lignes.push('', 'Résultat : ' + REGLES.niveaux[r.niveau]);
    if (r.horsChamp) lignes.push('- ' + REGLES.messages.horsChamp);
    r.obligations.forEach(function (o) {
      lignes.push('- ' + REGLES.obligations[o.id].libelle + ' : ' + REGLES.etats[o.etat] + ' (échéance ' + dateLongue(o.echeance) + ')');
    });
    if (r.incertains.length) lignes.push('Points incertains : ' + r.incertains.join(', '));
    if (r.actions.length) lignes.push('Actions proposées : ' + r.actions.map(function (a) { return REGLES.actions[a.id]; }).join(' ; '));
    return lignes.join('\n');
  }

  function majContact(r) {
    $('contact-titre').textContent = r ? CONTACT[r.niveau] : CONTACT.neutre;
    $('contact-texte').textContent = PROMESSE + (r ? ' Vos réponses au questionnaire seront jointes à votre message.' : '');
    if (champ('niveau')) champ('niveau').value = r ? REGLES.niveaux[r.niveau] : '';
    if (champ('diagnostic')) champ('diagnostic').value = r ? resumer(r) : '';
  }

  /* track() est défini par /main.js (chargé avant) ; Umami peut manquer : jamais bloquant. */
  function mesurer(nom, donnees) {
    try { if (typeof track === 'function') track(nom, donnees); } catch (e) {}
  }

  /* ---- branchements ---- */
  document.querySelectorAll('[data-diag-start]').forEach(function (b) {
    b.addEventListener('click', function (e) {
      e.preventDefault();
      if (etat.etape === null || this.tagName === 'BUTTON') return demarrer();
      amener(etat.etape === 'resultat' ? $('diag-level') : $('diag-q'));
    });
  });
  $('diag-next').addEventListener('click', function () {
    if (courante && coches.length) repondre(courante, coches.slice());
  });
  $('diag-back').addEventListener('click', function () {
    if (etat.etape > 0) return montrerQuestion(etat.etape - 1, true);
    etat.etape = null; sauver();
    afficher('intro');
    amener(vues.intro.querySelector('h3'));
  });
  $('diag-restart').addEventListener('click', demarrer);

  document.querySelectorAll('[data-diag-verif]').forEach(function (n) {
    n.textContent = dateLongue(REGLES.dateVerification);
  });

  /* ---- reprise après rechargement ---- */
  racine.hidden = false;
  if (etat.etape === 'resultat') montrerResultat(false);
  else if (typeof etat.etape === 'number' && etat.etape < questions().length) montrerQuestion(etat.etape, false);
  else afficher('intro');
})();
