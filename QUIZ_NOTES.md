# Quiz RP

Ajout du 4 octobre 2026. Onglet Quiz dans la navigation principale.

- 433 questions : 249 produits, 62 techniques, 42 matériel, 40 observations et 40 situations.
- 10 questions par série : 4 produits, 2 techniques, 2 situations, 1 matériel et 1 observation.
- Questions et réponses mélangées. Pas de même sujet deux fois dans une série ; les questions de la série précédente sont évitées.
- Correction après chaque réponse, puis score sur 10 et réponses repliables à revoir.
- Série conservée uniquement en mémoire tant que la page est ouverte. Aucun stockage, appel réseau, chronomètre ou dossier patient.

La banque se construit depuis les fiches existantes de l’Atlas. Chaque couple fiche / champ est une question distincte ; les compositions identiques à la forme sont exclues. Les voies d’application sont regroupées pour ne pas proposer plusieurs réponses orales toutes valables. Le contenu historique décrit la référence RP, sans dosage, recette ni procédure réelle. Les situations sont rédigées séparément dans `dist/quiz-bank.js`.

Pour enrichir : ajouter des lignes à `quizSituations` ou modifier les fiches du catalogue. Conserver une seule réponse correcte et trois distracteurs distincts. La correction ne doit imposer ni diagnostic, ni guérison, ni réveil chronométré au joueur.

Vérification : `node tests/quiz.cjs` avec Playwright installé. Teste la banque, 100 tirages, les scores, le verrouillage d’une réponse, la reprise après navigation, la remise à zéro au rechargement, les thèmes et les tailles desktop/mobile. Régression : `node tests/site-smoke.cjs`.
