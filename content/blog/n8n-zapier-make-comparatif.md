---
title: n8n, Zapier ou Make : quel outil d'automatisation choisir ?
seotitle: n8n, Zapier ou Make : comparatif pour une PME
slug: n8n-zapier-make-comparatif
description: n8n, Zapier ou Make ? Comparatif des tarifs, de la facturation (tâches, crédits, exécutions) et de l'hébergement, pour choisir selon votre usage.
breadcrumb: n8n, Zapier ou Make
date: 2026-11-27
lede: Ces trois outils font le même métier : relier vos applications pour qu'elles travaillent sans vous. Ils diffèrent surtout par la façon de facturer, l'hébergement et le niveau de technicité demandé.
related: automatiser-taches-repetitives-pme, automatiser-relance-devis
cta_title: Un doute sur l'outil à choisir ?
cta_text: Je travaille sur n8n, et je peux aussi intervenir sur Zapier ou Make, ou vous aider à migrer. Décrivez ce que vous voulez automatiser, je vous dis quel outil est le plus adapté et à quel prix.
cta_label: Demander un conseil
placeholder: "Ex. : j'utilise Zapier pour 6 automatisations et la facture augmente, est-ce que je peux migrer ?"
---

## Ce que font ces trois outils

n8n, Zapier et Make sont des outils d'automatisation : un événement se produit dans une application (une demande arrive par formulaire, un devis est envoyé), et une suite d'actions se déclenche dans d'autres (ligne dans un tableur, e-mail, notification). La différence ne vient pas de ce qu'ils savent faire, mais de **ce que vous payez**, **où tournent vos données** et **qui peut les modifier ensuite**.

## La différence qui compte : ce qu'on vous facture

Les trois comptent l'usage différemment, et c'est là que les factures divergent.

- **Zapier** facture des **tâches**. Une tâche est comptée à chaque étape réussie d'un scénario ; les déclencheurs et ses outils intégrés (filtres, formatage, délais) ne comptent pas.
- **Make** facture des **crédits**. La plupart des actions en consomment un, y compris la lecture de données ou une transformation. Seuls le routeur et les gestionnaires d'erreur sont gratuits.
- **n8n** facture des **exécutions**. Une exécution est un passage complet du scénario, quel que soit le nombre d'étapes.

Prenons un scénario de quatre actions après son déclencheur, lancé 200 fois par mois. Selon ces règles, il consomme environ 800 tâches chez Zapier, environ 1 000 crédits chez Make (le déclencheur compte), et 200 exécutions chez n8n. Le calcul est un ordre de grandeur, qui change si des étapes échouent ou si l'outil facture certaines étapes plus d'une unité.

## Les tarifs affichés (relevés le 27 novembre 2026)

| Outil | Gratuit | Premier palier payant |
|---|---|---|
| Zapier | 100 tâches par mois, scénarios à deux étapes | Professional : 19,99 $/mois (facturation annuelle) ou 29,99 $/mois pour 750 tâches |
| Make | 1 000 crédits par mois, 2 scénarios actifs | Core : 12 $/mois pour 10 000 crédits (grille affichée, avec la mention d'une remise de 25 %) |
| n8n | Édition Community à héberger soi-même | Starter : 20 $/mois (facturation annuelle) pour 2 500 exécutions, hébergé par n8n |

^ Prix affichés en dollars sur les sites des éditeurs. Ils évoluent, et la devise et les taxes appliquées à la facturation peuvent différer : vérifiez sur la page tarifaire avant de décider.

Autres repères : le palier Pro de n8n passe à 50 $/mois pour 10 000 exécutions. Chez Zapier, le palier de 2 000 tâches est à 49 $/mois en facturation annuelle. L'offre gratuite de Zapier consulte vos applications toutes les 15 minutes, contre 2 minutes en Professional ; sur Make gratuit, l'intervalle minimum entre deux lancements est aussi de 15 minutes.

## L'hébergement et vos données

Si votre automatisation manipule des noms, des e-mails ou des devis de clients, la question de l'hébergement n'est pas un détail. Chez n8n, la version hébergée stocke les données en Allemagne (Francfort), et vous pouvez aussi installer n8n sur votre propre serveur. Make indique un hébergement chez AWS, en Europe ou en Amérique du Nord. Pour Zapier, la page tarifaire consultée ne précise pas la région : à vérifier avant tout traitement de données personnelles.

Dans tous les cas, l'outil agit comme sous-traitant : un contrat conforme à l'article 28 du RGPD doit encadrer le traitement, comme l'explique la CNIL.

## Le point sur n8n « gratuit »

L'édition Community de n8n est en accès libre sur GitHub, mais sous une licence « Sustainable Use » qui n'est pas une licence open source au sens strict. Elle autorise un usage pour vos propres besoins internes, et interdit par exemple de proposer n8n à vos clients pour qu'ils y construisent leurs propres automatisations. Construire des scénarios pour le compte d'une entreprise cliente est en revanche permis, selon la documentation de n8n.

Héberger soi-même signifie aussi s'occuper du serveur : mises à jour, sauvegardes, surveillance. L'absence d'abonnement ne veut donc pas dire absence de coût.

## Lequel choisir ?

- **Zapier** convient si vous voulez démarrer seul, très vite, avec peu d'automatisations à faible volume, et si vous acceptez que la facture suive le nombre d'étapes.
- **Make** convient si vous aimez construire visuellement des scénarios plus riches, avec un coût d'entrée bas.
- **n8n** convient si vos scénarios ont beaucoup d'étapes, si vous tenez à choisir l'hébergement, ou si vous voulez ajouter du code quand l'outil atteint ses limites. Il demande un peu plus de technicité.

Quel que soit l'outil, le plus important reste le scénario : automatisez d'abord une seule tâche qui vous coûte du temps, comme on l'a vu dans [7 tâches répétitives qu'une PME peut automatiser](/blog/automatiser-taches-repetitives-pme/). La relance des devis en est un bon exemple : [le détail est ici](/blog/automatiser-relance-devis/).

## Quand faire appel à un freelance

Si vous n'avez pas le temps de monter les scénarios ou de vous occuper de l'hébergement, je mets en place des automatisations sous n8n pour [300 à 1 500 € selon la complexité](/automatisation-n8n/), avec un prix fixé avant de commencer. Si vous êtes déjà sur Zapier ou Make, je peux aussi travailler dessus ou vous aider à migrer quand la facture devient lourde.

## Sources

- [Zapier : tarifs et fonctionnement des tâches](https://zapier.com/pricing.md) (consulté le 27 novembre 2026)
- [Make : tarifs et crédits](https://www.make.com/en/pricing) (consulté le 27 novembre 2026)
- [n8n : plans et tarifs](https://n8n.io/pricing) (consulté le 27 novembre 2026)
- [n8n Docs : licence Sustainable Use](https://docs.n8n.io/n8n-community-license) (consulté le 27 novembre 2026)
- [CNIL : Responsable de traitement et sous-traitant, 6 bonnes pratiques](https://cnil.fr/responsable-de-traitement-et-sous-traitant-6-bonnes-pratiques-pour-respecter-les-donnees) (consulté le 27 novembre 2026)
