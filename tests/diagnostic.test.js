/* Scénarios du moteur (cahier des charges, section 11). Lancer : node tests/diagnostic.test.js */
const assert = require('node:assert/strict');
const REGLES = require('../diagnostic-facture-electronique/regles.js');
const { diagnostiquer, questionsAPoser } = require('../diagnostic-facture-electronique/diagnostic.js');

const AUJOURDHUI = '2026-10-10';
const obligation = (r, id) => r.obligations.find(o => o.id === id);
const ids = liste => liste.map(x => x.id);

const scenario1 = {
  statut: 'oui', tva: 'franchise', taille: 'oui', clients: ['pros_fr'],
  plateforme: 'non', outil: 'bureautique'
};

const scenarios = [
  ['1 — franchise, pros, sans plateforme, bureautique', () => {
    const r = diagnostiquer(scenario1, REGLES, AUJOURDHUI);
    assert.equal(r.niveau, 'en_retard');
    assert.equal(obligation(r, 'reception').etat, 'en_retard');
    assert.equal(obligation(r, 'emission').etat, 'a_faire');
    assert.equal(obligation(r, 'emission').echeance, '2027-09-01');
    assert.equal(obligation(r, 'ereporting'), undefined);
    assert.equal(r.actions[0].id, 'plateforme');
    assert.ok(r.actions.length <= 3);
  }],

  ['2 — TVA collectée, pros + particuliers, tout en place', () => {
    const r = diagnostiquer({
      statut: 'oui', tva: 'collecte', taille: 'oui', clients: ['pros_fr', 'particuliers'],
      plateforme: 'oui', outil: 'logiciel', compatible: 'oui'
    }, REGLES, AUJOURDHUI);
    assert.equal(r.niveau, 'en_bonne_voie');
    assert.equal(obligation(r, 'reception').etat, 'fait');
    assert.equal(obligation(r, 'emission').etat, 'fait');
    assert.equal(obligation(r, 'ereporting').etat, 'fait');
    assert.equal(obligation(r, 'mentions').etat, 'a_verifier');
  }],

  ['3 — particuliers seuls, plateforme, papier', () => {
    const r = diagnostiquer({
      statut: 'oui', tva: 'collecte', taille: 'oui', clients: ['particuliers'],
      plateforme: 'oui', outil: 'papier'
    }, REGLES, AUJOURDHUI);
    assert.equal(r.niveau, 'a_preparer');
    assert.equal(obligation(r, 'reception').etat, 'fait');
    assert.equal(obligation(r, 'emission'), undefined);
    assert.equal(obligation(r, 'ereporting').etat, 'a_faire');
    assert.equal(obligation(r, 'ereporting').echeance, '2027-09-01');
  }],

  ['4 — 250 salariés ou plus, outil non compatible', () => {
    const r = diagnostiquer({
      statut: 'oui', tva: 'collecte', taille: 'non', clients: ['pros_fr'],
      plateforme: 'oui', outil: 'logiciel', compatible: 'non'
    }, REGLES, AUJOURDHUI);
    assert.equal(r.niveau, 'en_retard');
    assert.equal(obligation(r, 'emission').etat, 'en_retard');
    assert.equal(obligation(r, 'emission').echeance, '2026-09-01');
  }],

  ['5 — pas établi en France : non concerné', () => {
    const reponses = { statut: 'non' };
    const r = diagnostiquer(reponses, REGLES, AUJOURDHUI);
    assert.equal(r.niveau, 'non_concerne');
    assert.deepEqual(r.obligations, []);
    assert.deepEqual(ids(questionsAPoser(reponses, REGLES)), ['statut']);
  }],

  ['6 — activité exonérée, plateforme inconnue, aucune facture', () => {
    const reponses = {
      statut: 'oui', tva: 'exonere', taille: 'oui', clients: ['particuliers'],
      plateforme: 'inconnu', outil: 'aucune'
    };
    const r = diagnostiquer(reponses, REGLES, AUJOURDHUI);
    assert.equal(r.horsChamp, true);
    assert.equal(obligation(r, 'reception').etat, 'en_retard');
    assert.equal(obligation(r, 'emission'), undefined);
    assert.equal(obligation(r, 'ereporting'), undefined);
    assert.deepEqual(r.incertains, ['plateforme']);
    assert.ok(!ids(questionsAPoser(reponses, REGLES)).includes('compatible'));
  }],

  ['7 — scénario 1 au 2 septembre 2027', () => {
    const r = diagnostiquer(scenario1, REGLES, '2027-09-02');
    assert.equal(obligation(r, 'emission').etat, 'en_retard');
  }],

  ['8 — statut « je ne sais pas » : reste dans le champ, point signalé', () => {
    const r = diagnostiquer({ ...scenario1, statut: 'nsp' }, REGLES, AUJOURDHUI);
    assert.notEqual(r.niveau, 'non_concerne');
    assert.equal(obligation(r, 'reception').etat, 'en_retard');
    assert.ok(r.incertains.includes('statut'));
  }],

  ['9 — TVA « je ne sais pas » : reste dans le champ, point signalé', () => {
    const r = diagnostiquer({ ...scenario1, tva: 'nsp' }, REGLES, AUJOURDHUI);
    assert.equal(r.horsChamp, false);
    assert.equal(obligation(r, 'emission').etat, 'a_faire');
    assert.ok(r.incertains.includes('tva'));
  }],

  ['10 — tout est fait : l’action « expert-comptable » n’a pas de délai', () => {
    const r = diagnostiquer({
      statut: 'oui', tva: 'collecte', taille: 'oui', clients: ['particuliers'],
      plateforme: 'oui', outil: 'logiciel', compatible: 'oui'
    }, REGLES, AUJOURDHUI);
    assert.equal(r.niveau, 'en_bonne_voie');
    assert.ok(r.obligations.every(o => o.etat === 'fait'));
    assert.deepEqual(ids(r.actions), ['comptable']);
    assert.equal(r.actions[0].echeance, null);
    assert.equal(r.actions[0].joursRestants, null);
  }]
];

let echecs = 0;
for (const [nom, test] of scenarios) {
  try {
    test();
    console.log('ok    ' + nom);
  } catch (e) {
    echecs++;
    console.log('ÉCHEC ' + nom + '\n      ' + e.message.split('\n')[0]);
  }
}
console.log(`\n${scenarios.length - echecs}/${scenarios.length} scénarios passent`);
process.exitCode = echecs ? 1 : 0;
