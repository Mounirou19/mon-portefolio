/* ==========================================================================
   Avis clients publiés — fichier unique à modifier, après validation manuelle.
   N'ajouter un avis que si l'auteur a donné son consentement écrit à la
   publication (case cochée dans le formulaire). Ne jamais y mettre son e-mail.
   Champs :
     nom         nom affiché (ex. "Sophie M.")
     entreprise  facultatif
     projet      type de projet (ex. "Site vitrine")
     note        entier de 1 à 5
     texte       avis, repris tel que reçu (modifié seulement avec l'accord de l'auteur)
     date        date de l'avis, "AAAA-MM-JJ"
     verifie     true si j'ai vérifié que l'auteur est client (devis/facture), sinon false
     reponse     facultatif : ma réponse publique
   Tous les avis sont publiés, y compris les négatifs (voir la règle sur la page).
   ========================================================================== */
window.AVIS = [];
