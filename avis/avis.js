/* ---- affichage des avis (page /avis/ uniquement) ---- */
(() => {
  const list = document.getElementById('avis-list');
  if (!list || !Array.isArray(window.AVIS)) return;

  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };
  const dateFr = d => new Date(d + 'T12:00:00').toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });

  if (!window.AVIS.length) {
    list.append(el('p', 'avis-empty', "Aucun avis publié pour l'instant. Les premiers apparaîtront ici dès qu'un client aura donné son accord pour les publier."));
    return;
  }

  window.AVIS.forEach(a => {
    const note = Math.max(1, Math.min(5, Math.round(a.note)));
    const card = el('article', 'avis');
    const stars = el('p', 'avis-note', '★'.repeat(note) + '☆'.repeat(5 - note));
    stars.setAttribute('aria-label', 'Note : ' + note + ' sur 5');
    const quote = el('blockquote', 'avis-text', a.texte);
    const who = el('p', 'avis-who');
    who.append(el('strong', null, a.nom));
    if (a.entreprise) who.append(document.createTextNode(', ' + a.entreprise));
    const meta = el('p', 'avis-meta', [a.projet, a.date ? dateFr(a.date) : ''].filter(Boolean).join(' · '));
    const badge = el('span', 'plan-badge' + (a.verifie ? ' on' : ''), a.verifie ? 'Client vérifié (devis ou facture)' : 'Avis non vérifié');
    card.append(stars, quote, who, meta, badge);
    if (a.reponse) {
      const rep = el('p', 'avis-rep');
      rep.append(el('strong', null, 'Ma réponse : '), document.createTextNode(a.reponse));
      card.append(rep);
    }
    list.append(card);
  });
})();
