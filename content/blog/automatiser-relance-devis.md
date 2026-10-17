---
title: Automatiser la relance de vos devis : mode d'emploi
slug: automatiser-relance-devis
description: Un devis sans réponse est une vente en suspens. Voici comment automatiser vos relances avec n8n, quelles étapes prévoir et ce qu'il faut garder à la main.
breadcrumb: Automatiser la relance de devis
date: 2026-10-18
lede: Beaucoup de devis ne sont pas refusés : ils sont oubliés, par vous comme par le client. Une relance bien placée en sauve une bonne part, à condition qu'elle parte sans que vous y pensiez.
related: facture-electronique-calendrier-pme
cta_title: Une relance qui part toute seule ?
cta_text: Je mets en place ce type d'automatisation sur vos outils (devis, e-mail, tableur, CRM). Décrivez ce que vous refaites à la main, je vous dis ce qui est automatisable.
cta_label: Parler de mon besoin
placeholder: "Ex. : j'envoie mes devis par e-mail et je ne relance jamais, comment faire partir une relance au bout de 5 jours ?"
---

## Pourquoi relancer

Un client qui ne répond pas à un devis n'a pas forcément dit non. Il a pu l'ouvrir, se dire « je regarde ça demain », puis l'oublier. Une relance courte et polie, quelques jours plus tard, remet le sujet en haut de sa liste.

Le problème est de le faire **systématiquement**. Quand on est occupé, la relance est la première tâche à sauter, et elle ne se fait jamais le jour où elle serait utile. C'est exactement le genre de tâche qu'on peut confier à un outil.

## Le principe d'une relance automatique

Le scénario est simple. Chaque devis envoyé crée une ligne dans un suivi (un tableur ou un outil de gestion). Un automate surveille ce suivi et agit selon l'état de la ligne :

1. **Un devis est envoyé** : une ligne est ajoutée avec le nom du client, son e-mail, le montant, la date d'envoi et le statut « envoyé ».
2. **Au bout de quelques jours sans réponse** : un premier e-mail de relance part automatiquement.
3. **Au bout d'une semaine de plus** : une seconde relance, plus courte, propose un échange téléphonique.
4. **Si le client répond ou signe** : vous passez le statut à « accepté » ou « refusé », et les relances s'arrêtent d'elles-mêmes.
5. **Si rien ne se passe** : l'automate vous prévient pour que vous décidiez de la suite, plutôt que d'insister à l'infini.

## Ce qu'il faut prévoir

Un scénario de ce type avec un outil comme [n8n](/automatisation-n8n/) tient en quelques étapes :

- **Un déclencheur** : une vérification quotidienne du suivi (chaque matin, par exemple).
- **Un filtre** : ne garder que les devis « envoyés » depuis plus de N jours et jamais relancés.
- **L'envoi de l'e-mail**, depuis votre propre adresse pour que le client réponde à vous.
- **La mise à jour du suivi** : noter la date de relance pour ne pas relancer deux fois.
- **Une alerte** pour vous si une étape échoue : un e-mail qui ne part pas ne doit pas passer inaperçu.

## Ce qu'on garde à la main

Tout n'a pas intérêt à être automatisé :

- **Le texte du premier devis** et le premier contact : c'est là que se joue la relation.
- **Les gros comptes** : un devis important mérite un appel, pas un e-mail automatique.
- **La décision finale** : l'outil signale, c'est vous qui tranchez.

Des relances automatiques mal réglées peuvent agacer : gardez un ton humain, un message court, et ne dépassez pas deux relances.

## Le texte d'une bonne relance

Une bonne relance est brève, personnelle et facile à répondre :

- elle **rappelle** le devis (numéro, objet, montant) ;
- elle pose **une seule question** : « Avez-vous eu le temps de le regarder ? » ;
- elle propose une **suite simple** : répondre à l'e-mail ou fixer un court appel.

## Ce que ça coûte

Pour une automatisation de ce type, mes tarifs se situent [entre 300 et 1 500 € selon la complexité](/automatisation-n8n/), prix fixé avant de commencer. Elle se rentabilise dès qu'elle fait aboutir un seul devis qui serait resté sans réponse.

## Pour commencer sans outil

Avant d'automatiser, vous pouvez déjà tester l'idée à la main : tenir un tableau de suivi avec la date d'envoi de chaque devis, et bloquer un créneau fixe chaque semaine pour relancer ceux qui n'ont pas répondu. Si cette habitude vous fait gagner des ventes, l'automatiser est l'étape suivante.
