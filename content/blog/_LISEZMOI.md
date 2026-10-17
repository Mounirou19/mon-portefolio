# Écrire et publier un article

Les articles sont des fichiers Markdown dans `content/blog/`. Le script `scripts/build-blog.mjs` produit les pages HTML, la liste de `/blog/` et le sitemap. Le site est déployé par GitHub Pages depuis la branche `main` : pousser sur `main` publie.

## Ajouter un article

1. Choisir la première ligne `todo` de `plan-editorial.md` (ou un sujet plus pertinent, à justifier dans le commit).
2. Créer `content/blog/<slug>.md` (le nom du fichier = le slug).
3. `node scripts/build-blog.mjs` : doit afficher 0 erreur et 0 avertissement.
4. Passer la ligne du plan en `publié AAAA-MM-JJ`.
5. Committer les sources ET les pages générées (`blog/`, `sitemap.xml`, `content/`), puis pousser sur `main`.
6. Vérifier que la page est en ligne (https://mouniroucisse.fr/blog/<slug>/).

## En-tête (front matter)

```
---
title: Titre de l'article (65 caractères maximum)
slug: identique-au-nom-du-fichier
description: Résumé pour Google, 70 à 160 caractères
breadcrumb: Libellé court pour le fil d'Ariane
date: AAAA-MM-JJ
modified: AAAA-MM-JJ        (facultatif, à renseigner si on met l'article à jour)
lede: Phrase d'accroche sous le titre (1 à 2 phrases)
related: slug-1, slug-2     (articles existants à proposer en fin d'article)
cta_title: Titre du bloc d'appel à l'action
cta_text: Une phrase qui relie l'article à l'offre
cta_label: Texte du bouton
placeholder: "Exemple de message dans le formulaire"
---
```

## Syntaxe Markdown acceptée

`## Titre`, `### Sous-titre`, paragraphes, listes `-` et `1.`, tableaux `| a | b |`, `**gras**`, `*italique*`, `[lien](url)`, `` `code` ``, et `^ Note en petits caractères` (sous un tableau, par exemple). Pas de titre `#` : le titre vient de l'en-tête.

## Règles de rédaction

- Français, vouvoiement, ton direct et concret, sans jargon inutile. Pas de formules creuses ni de remplissage.
- 700 à 1 100 mots. Une idée par section, des listes ou un tableau quand le lecteur compare ou parcourt.
- **Tout chiffre, date, règle légale ou prix doit venir d'une source consultée le jour même** (recherche web), citée en fin d'article dans une section `## Sources`. En cas de désaccord entre sources, le dire. Pas de statistique de mémoire.
- Ne rien inventer sur Mounirou : n'utiliser que ses offres et tarifs publiés sur le site (site vitrine 800 à 2 500 €, automatisation 300 à 1 500 €, maintenance dès 50 €/mois, application sur devis).
- Liens internes utiles : au moins un lien vers la page de service concernée (`/creation-site-vitrine/`, `/application-web-sur-mesure/`, `/automatisation-n8n/`, `/maintenance-site-web/`, `/diagnostic-facture-electronique/`) et un article lié via `related`.
- Ne pas répéter un sujet déjà traité : lire la liste des articles avant d'écrire.
- Pas de promesse de résultat (« première place en une semaine »), pas d'avis ni de témoignage inventés.
