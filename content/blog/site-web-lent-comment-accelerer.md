---
title: Site lent : les causes fréquentes et comment l'accélérer
slug: site-web-lent-comment-accelerer
description: Site web lent ? Les trois indicateurs de Google à mesurer, les causes les plus fréquentes (images, scripts, serveur) et les corrections qui comptent vraiment.
breadcrumb: Site lent : causes et solutions
date: 2026-11-06
lede: Un site lent ne se règle pas avec un « plugin magique ». Il faut mesurer, trouver ce qui ralentit réellement vos pages, puis corriger dans le bon ordre. Voici la méthode.
related: wordpress-ou-site-sur-mesure, bandeau-cookies-site-vitrine
cta_title: Votre site est lent et vous ne savez pas pourquoi ?
cta_text: La maintenance et la performance d'un site commencent par un état des lieux clair (vitesse, affichage mobile) avec les priorités à traiter.
cta_label: Demander un devis gratuit
placeholder: "Ex. : mon site met plusieurs secondes à s'afficher sur mobile. Pouvez-vous regarder d'où vient le problème ?"
---

## Commencez par mesurer, pas par deviner

Google a défini trois indicateurs, les « Core Web Vitals », qui décrivent l'expérience réelle d'un visiteur. Selon la documentation de Google (web.dev), les seuils à viser sont :

| Indicateur | Ce qu'il mesure | Seuil « bon » | Seuil « mauvais » |
|---|---|---|---|
| LCP (Largest Contentful Paint) | Le temps d'affichage du contenu principal | 2,5 s ou moins | plus de 4 s |
| INP (Interaction to Next Paint) | La réactivité aux clics et aux touches | 200 ms ou moins | plus de 500 ms |
| CLS (Cumulative Layout Shift) | La stabilité de la mise en page | 0,1 ou moins | plus de 0,25 |

^ Entre les deux seuils, Google parle de « à améliorer ». L'objectif est atteint quand ces valeurs sont respectées pour au moins 75 % des visites.

Pour mesurer, utilisez [PageSpeed Insights](https://pagespeed.web.dev/) (gratuit). Google recommande de regarder d'abord le bloc « données réelles des utilisateurs » quand il existe, puis le diagnostic de laboratoire. Si les deux se contredisent, les données réelles sont plus fiables. Un petit site peu visité n'aura parfois pas assez de données réelles : le diagnostic de laboratoire sert alors de repère, avec ses limites.

## Cause n°1 : l'image principale chargée trop tard ou trop lourde

Pour la plupart des sites vitrines, l'élément le plus grand de la page d'accueil est une image. La documentation de Google détaille ce qui retarde son affichage :

- **Elle est découverte tard** : image ajoutée par JavaScript, ou chargée par une bibliothèque de chargement différé qui masque son adresse. Mieux vaut qu'elle figure directement dans le code HTML de la page.
- **Elle est en chargement différé** (`loading="lazy"`) alors qu'elle est visible dès l'arrivée : le navigateur attend alors d'avoir calculé la mise en page avant de la charger. Réservez ce réglage aux images placées plus bas.
- **Elle n'est pas prioritaire** : Google conseille l'attribut `fetchpriority="high"` sur l'image qui sera probablement la plus grande, en se limitant à une ou deux images, sinon l'effet disparaît.
- **Elle est trop lourde** : formats modernes (WebP, AVIF), bonnes dimensions, compression.

Google insiste sur un point : réduire le poids d'une image ne suffit pas toujours, car le temps gagné peut simplement se déplacer ailleurs dans le chargement, par exemple vers un affichage retardé par du JavaScript. Il faut corriger la chaîne complète.

## Cause n°2 : des fichiers qui bloquent l'affichage

Une feuille de style volumineuse, ou un script placé dans l'en-tête de page sans attribut `async` ou `defer`, empêche le navigateur d'afficher quoi que ce soit tant qu'il n'est pas chargé. Selon Google, il est « presque jamais nécessaire » d'ajouter des scripts synchrones dans l'en-tête. Les remèdes : supprimer les règles CSS inutilisées, différer ce qui n'est pas critique, compresser et réduire les fichiers.

## Cause n°3 : un serveur ou un hébergement lent

Tout part du premier octet reçu. Google rappelle qu'un temps de réponse du serveur élevé rend un LCP sous 2,5 secondes difficile, voire impossible. Il cite parmi les causes fréquentes les redirections en cascade (par exemple depuis une publicité ou un lien raccourci), l'éloignement du serveur, et l'impossibilité d'utiliser le cache à cause de paramètres uniques dans les adresses. Deux leviers : un réseau de diffusion (CDN) et, quand c'est possible, des pages générées à l'avance plutôt qu'à chaque visite. Un site statique ou prégénéré est en général plus simple à rendre rapide qu'un site dynamique chargé de modules.

## Cause n°4 : trop de scripts, qui rendent le site « mou »

Un site peut s'afficher vite et pourtant répondre mal : un menu qui tarde à s'ouvrir, un bouton qui semble ne pas réagir. C'est le terrain de l'INP. D'après Google, les causes typiques sont des scripts lourds à charger et à exécuter, des tâches longues qui occupent le navigateur, une page au code HTML très volumineux, ou un contenu fabriqué entièrement par JavaScript. Chaque module ajouté (chat, carrousel, widget d'avis, outil de suivi) a un coût : faites l'inventaire de ce qui est réellement utile et retirez le reste.

## Cause n°5 : une page qui bouge pendant le chargement

Un titre qui descend d'un coup parce qu'une image arrive, un bandeau qui apparaît en haut et décale tout : c'est du CLS. Google liste les causes courantes : images sans dimensions, publicités, vidéos ou cartes intégrées sans espace réservé, polices web qui remplacent une police provisoire. Les corrections sont simples : indiquer `width` et `height` sur chaque image, réserver l'espace des éléments chargés tard (`min-height` ou `aspect-ratio`), et soigner le chargement des polices. Les bandeaux qui s'insèrent dans le flux de la page déplacent le contenu ; Google conseille de les superposer ou de leur réserver la place. Si vous en avez un, [le bandeau cookies](/blog/bandeau-cookies-site-vitrine/) est justement concerné.

## Dans quel ordre agir

1. Mesurez avec PageSpeed Insights, page d'accueil et une page de service, sur mobile.
2. Identifiez l'élément principal (image ou texte) et vérifiez qu'il est chargé tôt, au bon poids.
3. Retirez ou différez les scripts et feuilles de style qui bloquent l'affichage.
4. Réservez l'espace des images et des éléments tardifs.
5. Examinez l'hébergement et le cache si le premier octet reste lent.
6. Remesurez, et recommencez après chaque modification de contenu importante.

Les plateformes à modules empilés cumulent facilement ces causes, comme le détaille notre comparaison [WordPress ou site sur mesure](/blog/wordpress-ou-site-sur-mesure/). Les performances ne sont pas un réglage ponctuel : elles se dégradent à mesure que le site évolue, d'où l'intérêt d'un suivi régulier, que couvre la [maintenance de site web](/maintenance-site-web/).

## Sources

- [web.dev, Web Vitals (dernière mise à jour 31 octobre 2024)](https://web.dev/articles/vitals)
- [web.dev, Optimize Largest Contentful Paint (mise à jour 31 mars 2025)](https://web.dev/articles/optimize-lcp)
- [web.dev, Optimize Interaction to Next Paint](https://web.dev/articles/optimize-inp)
- [web.dev, Optimize Cumulative Layout Shift (mise à jour 7 février 2025)](https://web.dev/articles/optimize-cls)
- [PageSpeed Insights](https://pagespeed.web.dev/)
