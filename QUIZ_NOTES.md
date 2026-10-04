# Quiz médical

Refonte éditoriale du 4 octobre 2026.

215 questions : 82 produits, 32 techniques, 21 matériel, 40 observations et 40 situations.
Les 544 anciennes questions automatiques ont été remplacées. Tous les sujets du catalogue
sont couverts. Le nombre a été réduit pour éliminer les combinaisons ambiguës et redondantes.

Chaque ligne contient sept champs séparés par `|` : référence, question, bonne réponse,
trois mauvaises réponses, explication. Les distracteurs sont propres à chaque question.
Ils ne sont pas empruntés au catalogue. Les réponses sont mélangées à l’affichage.

Fichiers : `dist/quiz-curated.js`, `dist/quiz-products-extra.js`, `dist/quiz-techniques.js`,
`dist/quiz-equipment.js`, `dist/quiz-situations.js`. Anecdotes : `dist/quiz-notes.js`.
L’ancien générateur et le remplacement automatique de vocabulaire ont été retirés.

## Rédaction

- Une décision ou connaissance précise et un contexte suffisant.
- Une seule réponse juste, avec trois choix distincts examinés ensemble.
- Pas d’identification à l’odeur seule ni de faux synonymes de préparations.
- Pas de joueur, RP, scène, guillemets autour des noms ou rappel systématique de 1889.
- Pas de dose, recette, méthode opératoire réelle ou réveil chronométré.
- Ne pas transformer une conjecture ou un soin prévu en résultat certain.
- Les actes dangereux anciens restent documentaires, distincts des soins actuels.

Les connaissances reposent sur le catalogue existant. Contrôle complémentaire de la gentiane :
[Kew, racine de gentiane](https://mpns.science.kew.org/mpns-portal/drugDetail?drugName=Gentian+root&filter=latinKewPrefName%3A%22Gentiana+lutea+L.%22&fuzzy=true&nameType=all&query=Lulea)
et [EMA, Gentianae radix](https://www.ema.europa.eu/en/medicines/herbal/gentianae-radix).
Les sources des anecdotes historiques restent affichées avec leur texte.

## Fonctionnement

10 questions : 4 produits, 2 techniques, 2 situations, 1 matériel et 1 observation.
Pas deux fois le même sujet par série, même entre techniques et matériel apparentés.
Les questions de la série précédente sont évitées. Réponse verrouillée, correction immédiate,
score sur 10 et révision finale. Aucun résultat enregistré : session en mémoire seulement.

## Vérification

`node tests/quiz.cjs` : banque, couverture du catalogue, vocabulaire, gentiane, écharpe,
rendu et correction des 215 questions, anecdotes, 100 tirages, score, navigation,
rechargement, thèmes et formats PC/mobile. Les tests structurels ne constituent pas
une preuve automatique d’exactitude médicale. Ce quiz est un entraînement historique,
pas une formation aux soins réels.
