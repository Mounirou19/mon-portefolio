#!/usr/bin/env node
/*
 * Génère le blog à partir des fichiers Markdown de content/blog/.
 *
 *   node scripts/build-blog.mjs
 *
 * - content/blog/<slug>.md      -> blog/<slug>/index.html
 * - content/blog/legacy.json    -> articles écrits à la main (déjà dans blog/<slug>/), listés dans l'index
 * - blog/index.html             -> liste des articles (entre les marqueurs POSTS:START / POSTS:END)
 * - sitemap.xml                 -> entrées /blog/ régénérées, le reste est conservé
 *
 * Aucune dépendance : Node 18+ suffit.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://mouniroucisse.fr';
const SRC = path.join(ROOT, 'content', 'blog');
const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

const errors = [];
const warnings = [];

/* ---------- utilitaires ---------- */
const esc = s => String(s).replace(/&(?!#?\w+;)/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const attr = s => esc(s).replace(/"/g, '&quot;');
const slugify = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const dateFr = iso => { const [y, m, d] = iso.split('-').map(Number); return `${d === 1 ? '1er' : d} ${MOIS[m - 1]} ${y}`; };
const read = p => fs.readFileSync(p, 'utf8');

/* ---------- front matter ---------- */
function parse(file) {
  const raw = read(file).replace(/\r\n/g, '\n');
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) { errors.push(`${path.basename(file)} : front matter manquant`); return null; }
  const meta = {};
  for (const line of m[1].split('\n')) {
    const i = line.indexOf(':');
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^"(.*)"$/, '$1');
  }
  return { meta, body: m[2].trim(), file: path.basename(file) };
}

/* ---------- Markdown -> HTML (sous-ensemble volontairement réduit) ---------- */
function inline(text) {
  const codes = [];
  let t = text.replace(/`([^`]+)`/g, (_, c) => { codes.push(c); return `\u0000${codes.length - 1}\u0000`; });
  t = esc(t);
  t = t.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, label, url) => {
    const ext = /^https?:\/\//.test(url) && !url.startsWith(SITE);
    return `<a href="${attr(url)}"${ext ? ' rel="noopener"' : ''}>${label}</a>`;
  });
  t = t.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/(^|[\s(])\*([^*\s][^*]*)\*/g, '$1<em>$2</em>');
  return t.replace(/\u0000(\d+)\u0000/g, (_, i) => `<code>${esc(codes[i])}</code>`);
}

function render(md) {
  const lines = md.split('\n');
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }

    if (line.startsWith('<')) {                       // bloc HTML brut, jusqu'à la ligne vide
      const buf = [];
      while (i < lines.length && lines[i].trim()) buf.push(lines[i++]);
      out.push(buf.join('\n'));
      continue;
    }
    const h = line.match(/^(#{2,3}) (.+)$/);
    if (h) {
      const lvl = h[1].length;
      out.push(`<h${lvl} id="${slugify(h[2].replace(/[`*]/g, ''))}">${inline(h[2])}</h${lvl}>`);
      i++; continue;
    }
    if (/^\|/.test(line)) {                           // tableau
      const rows = [];
      while (i < lines.length && /^\|/.test(lines[i])) rows.push(lines[i++]);
      const cells = r => r.replace(/^\||\|$/g, '').split('|').map(c => c.trim());
      const head = cells(rows[0]);
      const body = rows.slice(2).map(cells);
      out.push('<table>\n<thead><tr>' + head.map(c => `<th>${inline(c)}</th>`).join('') + '</tr></thead>\n<tbody>\n' +
        body.map(r => '<tr>' + r.map(c => `<td>${inline(c)}</td>`).join('') + '</tr>').join('\n') + '\n</tbody>\n</table>');
      continue;
    }
    if (/^[-*] /.test(line) || /^\d+\. /.test(line)) { // listes
      const ordered = /^\d+\. /.test(line);
      const items = [];
      while (i < lines.length && (ordered ? /^\d+\. /.test(lines[i]) : /^[-*] /.test(lines[i]))) {
        items.push(lines[i++].replace(ordered ? /^\d+\. / : /^[-*] /, ''));
      }
      const tag = ordered ? 'ol' : 'ul';
      out.push(`<${tag}>\n` + items.map(x => `  <li>${inline(x)}</li>`).join('\n') + `\n</${tag}>`);
      continue;
    }
    if (line.startsWith('^ ')) {                      // note de bas de tableau / précision
      out.push(`<p class="note">${inline(line.slice(2))}</p>`);
      i++; continue;
    }
    const buf = [];                                   // paragraphe
    while (i < lines.length && lines[i].trim() && !/^(#{2,3} |\||[-*] |\d+\. |<|\^ )/.test(lines[i])) buf.push(lines[i++]);
    out.push(`<p>${inline(buf.join(' '))}</p>`);
  }
  return out.join('\n\n');
}

/* ---------- gabarits (repris de blog/prix-site-vitrine) ---------- */
const FONTS = 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,800&family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600&display=swap';

const head = ({ title, desc, url, type, ld }) => `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${attr(desc)}">
<link rel="canonical" href="${url}">
<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon-192.png" type="image/png" sizes="192x192">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<meta property="og:type" content="${type}">
<meta property="og:locale" content="fr_FR">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${attr(title)}">
<meta property="og:description" content="${attr(desc)}">
<meta property="og:image" content="${SITE}/img/og.jpg">
<meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">
${JSON.stringify(ld, null, 2).replace(/</g, '\\u003c')}
</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${FONTS}" rel="stylesheet">
<link rel="stylesheet" href="/style.css">
</head>
<body>

<header class="top">
  <div class="wrap">
    <a href="/" class="mark">Mounirou Cissé<span>.</span></a>
    <button class="burger" id="burger" aria-expanded="false" aria-controls="nav">Menu</button>
    <nav class="nav" id="nav" aria-label="Navigation principale">
      <a href="/#offres">Prestations</a>
      <a href="/#projets">Réalisations</a>
      <a href="/#methode">Méthode</a>
      <a href="/#apropos">À propos</a>
      <a href="/blog/">Conseils</a>
      <a href="/plans/">Plans</a>
      <a href="/#faq">FAQ</a>
      <a href="#contact">Contact</a>
    </nav>
  </div>
</header>

<main>
`;

const contact = ({ heading, subject, placeholder }) => `
  <!-- CONTACT -->
  <section class="sec contact" id="contact">
    <div class="wrap">
      <h2>${esc(heading)}</h2>
      <p style="margin-top:16px;max-width:52ch">Réponse sous 24 h en semaine. Décrivez votre besoin en quelques lignes, je vous dis ce qui est faisable, en combien de temps et pour quel prix.</p>
      <form class="cform" id="cform" action="https://api.web3forms.com/submit" method="POST">
        <input type="hidden" name="access_key" value="1e90bb98-832b-46aa-9f76-d436bba213b8">
        <input type="hidden" name="subject" value="${attr(subject)}">
        <input type="hidden" name="from_name" value="Portfolio mouniroucisse.fr">
        <input type="checkbox" name="botcheck" class="hp" tabindex="-1" autocomplete="off">
        <div class="row">
          <label>Nom<input type="text" name="name" required autocomplete="name"></label>
          <label>E-mail<input type="email" name="email" required autocomplete="email"></label>
        </div>
        <label>Votre projet en quelques mots<textarea name="message" required placeholder="${attr(placeholder)}"></textarea></label>
        <button class="btn" type="submit">Envoyer le message</button>
        <p class="legal">Vos informations servent uniquement à vous répondre et ne sont jamais transmises à des tiers. <a href="/mentions-legales.html">Données personnelles et mentions légales</a></p>
        <p class="fstatus" id="fstatus" role="status" aria-live="polite"></p>
      </form>
      <p style="margin:30px 0 8px">
        <a class="mail" id="mail" href="mailto:admin@mouniroucisse.fr">admin@mouniroucisse.fr</a>
        <span class="copied" id="copied">Copié</span>
      </p>
      <div class="cta-row">
        <button class="btn ghost" id="copy">Copier l'adresse</button>
        <a class="btn ghost" href="https://www.linkedin.com/in/mounirou-cisse-a86a4a1a1/" rel="noopener">LinkedIn</a>
        <a class="btn ghost" href="https://www.malt.fr/profile/mouniroucisse" rel="noopener">Malt</a>
      </div>
    </div>
  </section>
</main>

<footer class="wrap">
  <span>© 2026 Mounirou Cissé — Développeur web freelance, Île-de-France</span>
  <span><a href="/creation-site-vitrine/">Site vitrine</a> · <a href="/application-web-sur-mesure/">Application web</a> · <a href="/automatisation-n8n/">Automatisation n8n</a> · <a href="/maintenance-site-web/">Maintenance</a> · <a href="/diagnostic-facture-electronique/">Diagnostic facture électronique</a> · <a href="/blog/">Conseils</a> · <a href="/mentions-legales.html">Mentions légales</a></span>
</footer>

<script src="/main.js" defer></script>
</body>
</html>
`;

const PERSON = { '@type': 'Person', name: 'Mounirou Cissé', url: `${SITE}/`, image: `${SITE}/img/photo.jpg` };

/* ---------- lecture des sources ---------- */
const legacy = fs.existsSync(path.join(SRC, 'legacy.json')) ? JSON.parse(read(path.join(SRC, 'legacy.json'))) : [];
const posts = fs.readdirSync(SRC).filter(f => f.endsWith('.md') && !f.startsWith('_') && f !== 'plan-editorial.md')
  .map(f => parse(path.join(SRC, f))).filter(Boolean);

const seen = new Set(legacy.map(l => l.slug));
for (const p of posts) {
  const { meta, file } = p;
  for (const k of ['title', 'description', 'date', 'slug', 'breadcrumb']) if (!meta[k]) errors.push(`${file} : champ « ${k} » manquant`);
  if (!meta.slug) continue;
  if (meta.slug !== file.replace(/\.md$/, '')) errors.push(`${file} : le slug « ${meta.slug} » doit être identique au nom du fichier`);
  if (seen.has(meta.slug)) errors.push(`${file} : slug en double`);
  seen.add(meta.slug);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(meta.date || '')) errors.push(`${file} : date invalide (AAAA-MM-JJ attendu)`);
  if ((meta.title || '').length > 65) warnings.push(`${file} : titre long (${meta.title.length} car., 65 max conseillé)`);
  const dl = (meta.description || '').length;
  if (dl < 70 || dl > 160) warnings.push(`${file} : description de ${dl} caractères (70 à 160 conseillé)`);
}

/* liens internes : chaque lien relatif doit pointer vers une page qui existe */
const exists = href => {
  const p = href.split('#')[0].split('?')[0];
  if (!p || p === '/') return true;
  const f = path.join(ROOT, p);
  return fs.existsSync(f) && (fs.statSync(f).isFile() || fs.existsSync(path.join(f, 'index.html'))) || seen.has(p.replace(/^\/blog\/|\/$/g, ''));
};

/* ---------- articles ---------- */
const all = [...legacy.map(l => ({ ...l, legacy: true })), ...posts.filter(p => p.meta.slug).map(p => ({ ...p.meta, post: p }))]
  .sort((a, b) => b.date.localeCompare(a.date));
const bySlug = Object.fromEntries(all.map(a => [a.slug, a]));

for (const a of all.filter(x => x.post)) {
  const { meta, body, file } = a.post;
  const url = `${SITE}/blog/${meta.slug}/`;
  const html = render(body);
  for (const m of html.matchAll(/href="(\/[^"]*)"/g)) if (!exists(m[1])) errors.push(`${file} : lien interne cassé ${m[1]}`);

  const words = body.split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 200));
  const related = (meta.related || '').split(',').map(s => s.trim()).filter(Boolean);
  for (const r of related) if (!bySlug[r]) errors.push(`${file} : article lié introuvable « ${r} »`);

  const ld = [
    {
      '@context': 'https://schema.org', '@type': 'Article', headline: meta.title, description: meta.description, url,
      datePublished: meta.date, dateModified: meta.modified || meta.date, inLanguage: 'fr-FR',
      mainEntityOfPage: url, author: PERSON, publisher: PERSON, image: `${SITE}/img/og.jpg`
    },
    {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Accueil', item: `${SITE}/` },
        { '@type': 'ListItem', position: 2, name: 'Conseils', item: `${SITE}/blog/` },
        { '@type': 'ListItem', position: 3, name: meta.breadcrumb || meta.title, item: url }
      ]
    }
  ];

  const relatedHtml = related.length
    ? `\n        <h2>À lire aussi</h2>\n        <ul>\n${related.map(r => `          <li><a href="/blog/${r}/">${esc(bySlug[r].title)}</a></li>`).join('\n')}\n        </ul>\n`
    : '';

  const modified = meta.modified && meta.modified !== meta.date ? ` · mis à jour le <time datetime="${meta.modified}">${dateFr(meta.modified)}</time>` : '';
  const page = head({ title: `${meta.title} | Mounirou Cissé`, desc: meta.description, url, type: 'article', ld }) + `  <article class="sec article">
    <div class="wrap">
      <nav class="crumbs" aria-label="Fil d'Ariane"><a href="/">Accueil</a> › <a href="/blog/">Conseils</a> › ${esc(meta.breadcrumb)}</nav>
      <header class="art-head">
        <h1>${esc(meta.title)}</h1>
        ${meta.lede ? `<p class="lede">${inline(meta.lede)}</p>` : ''}
        <div class="byline">
          <img src="/img/photo.jpg" alt="" width="40" height="40">
          <span>Par <strong>Mounirou Cissé</strong>, développeur web freelance · <time datetime="${meta.date}">${dateFr(meta.date)}</time>${modified} · ${minutes} min de lecture</span>
        </div>
      </header>

      <div class="art-body">
${html.split('\n').map(l => l && '        ' + l).join('\n')}
${relatedHtml}
        <aside class="art-cta">
          <h2>${esc(meta.cta_title || 'Un projet web en tête ?')}</h2>
          <p>${esc(meta.cta_text || 'Décrivez votre activité en quelques lignes : je vous réponds sous 24 h avec une estimation, gratuitement et sans engagement.')}</p>
          <a class="btn" href="#contact">${esc(meta.cta_label || 'Demander une estimation')}</a>
        </aside>
      </div>
    </div>
  </article>
` + contact({
    heading: meta.cta_title || 'Un projet web en tête ?',
    subject: `Nouveau message depuis mouniroucisse.fr (Article ${meta.slug})`,
    placeholder: meta.placeholder || "Ex. : j'ai lu votre article, j'aimerais savoir comment vous pouvez m'aider sur mon projet."
  });

  const dir = path.join(ROOT, 'blog', meta.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), page);
}

/* ---------- index du blog ---------- */
const listHtml = '<ul class="posts">\n' + all.map(a => `        <li>
          <a href="/blog/${a.slug}/">
            <time datetime="${a.date}">${dateFr(a.date)}</time>
            <h2>${esc(a.title)}</h2>
            <p>${esc(a.excerpt || a.description)}</p>
            <span class="proj-more">Lire l'article →</span>
          </a>
        </li>`).join('\n') + '\n      </ul>';

const indexFile = path.join(ROOT, 'blog', 'index.html');
let index = read(indexFile);
if (!index.includes('<!-- POSTS:START -->')) {
  index = index.replace(/<ul class="posts">[\s\S]*?<\/ul>/, '<!-- POSTS:START -->\n      <!-- POSTS:END -->');
}
index = index.replace(/<!-- POSTS:START -->[\s\S]*?<!-- POSTS:END -->/, `<!-- POSTS:START -->\n      ${listHtml}\n      <!-- POSTS:END -->`);
fs.writeFileSync(indexFile, index);

/* ---------- sitemap ---------- */
const smFile = path.join(ROOT, 'sitemap.xml');
let sm = read(smFile).replace(/\s*<url><loc>https:\/\/mouniroucisse\.fr\/blog\/[^<]*<\/loc>[^\n]*<\/url>/g, '');
const lastBlog = all.reduce((m, a) => ((a.modified || a.date) > m ? (a.modified || a.date) : m), '0000-00-00');
const entries = [`  <url><loc>${SITE}/blog/</loc><lastmod>${lastBlog}</lastmod></url>`,
  ...all.map(a => `  <url><loc>${SITE}/blog/${a.slug}/</loc><lastmod>${a.modified || a.date}</lastmod></url>`)];
sm = sm.replace('</urlset>', entries.join('\n') + '\n</urlset>');
fs.writeFileSync(smFile, sm);

/* ---------- bilan ---------- */
for (const w of warnings) console.warn('⚠ ' + w);
for (const e of errors) console.error('✗ ' + e);
console.log(`${posts.length} article(s) Markdown + ${legacy.length} manuel(s) → ${all.length} dans l'index.`);
if (errors.length) process.exit(1);
