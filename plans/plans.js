/* ---- affichage des plans (page /plans/ uniquement) ---- */
(() => {
  const grid = document.getElementById('plans-grid');
  if (!grid || !Array.isArray(window.PLANS)) return;

  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };

  window.PLANS.forEach((p, i) => {
    const num = String(i + 1).padStart(2, '0');
    const dispo = p.statut === 'Disponible';
    const card = el('article', 'plan');

    const visual = el('div', 'plan-visual');
    visual.setAttribute('role', 'img');
    visual.setAttribute('aria-label', 'Visuel du plan ' + num + ' : ' + p.nom);
    visual.append(el('span', 'plan-num', num), el('span', 'plan-icon', '→'));

    const body = el('div', 'plan-body');
    const badge = el('span', 'plan-badge' + (dispo ? ' on' : ''), p.statut || 'En préparation');
    const h = el('h2', 'plan-name', p.nom);
    const src = el('p', 'plan-src', 'Inspiré de ');
    src.append(el('cite', null, p.livre), document.createTextNode(' (' + p.auteur + ')'));
    const promise = el('p', 'plan-promise', p.promesse);
    const ul = el('ul', 'plan-list');
    (p.contenu || []).forEach(t => ul.append(el('li', null, t)));

    const foot = el('div', 'plan-foot');
    foot.append(el('span', 'plan-price', p.prix ? p.prix : 'Prix à venir'));
    const btn = el('a', 'btn', dispo ? 'Commander' : 'Me prévenir à la sortie');
    const params = new URLSearchParams({ [dispo ? 'commande' : 'alerte']: p.nom });
    btn.href = '?' + params.toString() + '#contact';
    foot.append(btn);

    body.append(badge, h, src, promise, ul, foot);
    card.append(visual, body);
    grid.append(card);
  });
})();
