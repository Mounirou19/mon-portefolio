/* ---- menu mobile ---- */
const burger = document.getElementById('burger'), nav = document.getElementById('nav');
burger.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
  burger.textContent = open ? 'Fermer' : 'Menu';
});
nav.addEventListener('click', e => {
  if (e.target.tagName === 'A') { nav.classList.remove('open'); burger.textContent = 'Menu'; burger.setAttribute('aria-expanded','false'); }
});

/* ---- pipeline (accueil uniquement) ---- */
if (document.getElementById('panel')) {
const STAGES = [
  {
    title:"Formulaire",
    text:"Une page, un objectif, un formulaire court. Les champs sont validés côté navigateur avant l'envoi, et la source de la campagne est conservée avec le contact.",
    list:["Chargement sous la seconde sur mobile","Validation des champs en direct","Origine du trafic tracée jusqu'au lead"],
    cap:"Ce que le formulaire envoie",
    code:'POST /api/lead\n{\n  <span class="k">"nom"</span>: "Dupont",\n  <span class="k">"tel"</span>: "+33612345678",\n  <span class="k">"cp"</span>: "93120",\n  <span class="k">"campagne"</span>: "clim-ete-93",\n  <span class="k">"consentement"</span>: true\n}'
  },
  {
    title:"Validation",
    text:"Un lead invalide coûte plus cher qu'un lead perdu. Format du téléphone, existence du code postal, doublons sur les trente derniers jours : tout est contrôlé avant de partir.",
    list:["Téléphone et e-mail normalisés","Doublons écartés et journalisés","Consentement horodaté et conservé"],
    cap:"Résultat du contrôle",
    code:'{\n  <span class="k">"statut"</span>: "valide",\n  <span class="k">"tel_normalise"</span>: "0612345678",\n  <span class="k">"doublon"</span>: false,\n  <span class="k">"score"</span>: 92\n}'
  },
  {
    title:"Acheminement",
    text:"Chaque destinataire a ses exigences : appel API, dépôt de fichier sur un SFTP, webhook. Le lead est reformaté pour lui, et les échecs sont réessayés puis signalés.",
    list:["API REST, SFTP ou webhook au choix","Nouvelle tentative en cas d'échec","Alerte immédiate si le flux s'arrête"],
    cap:"Dépôt du fichier de leads",
    code:'sftp&gt; put leads_2026-09-07.csv /in/\n\n<span class="k">200</span> 1 lead accepté\n<span class="k">200</span> accusé de réception reçu\n<span class="k">ok</span>  flux clos'
  },
  {
    title:"Suivi",
    text:"Le lead arrive : la relance part, le tableau se met à jour. Vous voyez combien de contacts sont entrés, combien ont été livrés, et où ça coince — sans ouvrir un seul outil technique.",
    list:["Relance automatique par mail ou SMS","Tableau de bord des volumes livrés","Rejets visibles et corrigeables"],
    cap:"Scénario n8n déclenché",
    code:'Webhook → Filtrer statut\n  ├─ valide  → Mail de bienvenue\n  │           → Ligne ajoutée au suivi\n  └─ rejeté  → Alerte à l\'équipe'
  }
];
const tabs = [...document.querySelectorAll('.node')];
const el = { title:'d-title', text:'d-text', list:'d-list', cap:'d-cap', code:'d-code' };
for (const k in el) el[k] = document.getElementById(el[k]);

function show(i){
  const s = STAGES[i];
  tabs.forEach((t,j) => t.setAttribute('aria-selected', j === i));
  el.title.textContent = s.title;
  el.text.textContent = s.text;
  el.list.innerHTML = s.list.map(x => '<li>' + x + '</li>').join('');
  el.cap.textContent = s.cap;
  el.code.innerHTML = s.code;
  document.getElementById('panel').setAttribute('aria-labelledby','tab-' + i);
}
tabs.forEach((t,i) => {
  t.addEventListener('click', () => show(i));
  t.addEventListener('keydown', e => {
    const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const n = (i + d + tabs.length) % tabs.length;
    tabs[n].focus(); show(n);
  });
});
show(0);

/* animation des paquets : seulement quand le rail est visible */
const rail = document.getElementById('rail');
if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
  new IntersectionObserver(es => es.forEach(e => rail.classList.toggle('running', e.isIntersecting)))
    .observe(rail);
}
}

/* ---- copier l'adresse ---- */
document.getElementById('copy')?.addEventListener('click', async () => {
  const mail = document.getElementById('mail').textContent.trim();
  try { await navigator.clipboard.writeText(mail); } catch (e) {
    const t = document.createElement('textarea');
    t.value = mail; document.body.appendChild(t); t.select();
    document.execCommand('copy'); t.remove();
  }
  const tag = document.getElementById('copied');
  tag.classList.add('on');
  setTimeout(() => tag.classList.remove('on'), 1600);
});

/* ---- formulaire de contact ---- */
const form = document.getElementById('cform'), fstatus = document.getElementById('fstatus');
form?.addEventListener('submit', async e => {
  e.preventDefault();
  const btn = form.querySelector('button');
  btn.disabled = true; fstatus.className = 'fstatus'; fstatus.textContent = 'Envoi en cours…';
  const body = new FormData(form);
  body.append('page', location.pathname);
  try {
    const r = await fetch(form.action, {
      method:'POST', headers:{ Accept:'application/json' }, body
    });
    const data = await r.json();
    if (!r.ok || !data.success) throw new Error(data.message);
    form.reset();
    fstatus.className = 'fstatus ok';
    fstatus.textContent = 'Merci, votre message est bien parti. Je vous réponds sous 24 h en semaine.';
  } catch (err) {
    fstatus.className = 'fstatus err';
    fstatus.textContent = "L'envoi a échoué. Écrivez-moi directement à admin@mouniroucisse.fr.";
  }
  btn.disabled = false;
});
