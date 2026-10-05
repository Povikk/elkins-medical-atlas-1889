# Relecture des parcours et des zones

Version locale, non publiée.

## Changements

- Repères courts de produits et matériel sur les étapes des 19 interventions / consultations et 12 chirurgies. Même source pour le détaillé et le condensé.
- Nettoyage de plaie explicité : eau propre, antiseptique historique préparé si retenu, compresses et pansement. Pas de mélange ni de recette ; pas d'application profonde ou de phénol pur.
- Coup de sabot : distinction contusion, plaie, déformation, zone sensible et état inquiétant.
- Petit soin : choix distinct de l'aspect de la peau. Arnica pour bleu sur peau intacte, protection pour irritation, nettoyage / protection pour plaie. Pas de proposition de points pour une peau intacte ou un aspect incertain.
- Les huiles historiques de brûlure restent documentaires au lexique, pas un soin universel. Pas de sels odorants présentés comme un traitement d'intoxication.
- Examen / surveillance sans médicament pertinent explicitement signalés. Les produits ne sont jamais automatiquement administrés.
- Bras et épaule, jambe et cheville, tête / visage / cou, thorax et côtes séparés dans les sélections concernées. Les familles de branches existantes sont conservées pour éviter de traiter un nouvel endroit comme une blessure sans risque.
- Précision facultative par zone, conservée temporairement par patient et reprise dans le récapitulatif. Texte échappé à l'affichage. Aucun enregistrement des patients.

## Vérifications

`tests/route-audit.cjs` : 31 parcours, 193 étapes, 341 variantes de choix avec rendu des étapes suivantes, détaillé et condensé. Contrôles ciblés : plaie de sabot, baume absent d'une petite plaie, épaule / bras distincts, précision libre / récapitulatif / échappement, absence de débordement à 1920, 1366, 390 et 320 px.

`tests/multi-zones.cjs`, `tests/patients.cjs`, `tests/cabinet.cjs` : sélection multiple et retour, zones sensibles, thèmes / mobile, isolation des patients, absence de persistance patient, compteurs et resets indépendants.

Ce sont des vérifications de contenu et de fonctionnement d'un outil de fiction, pas une validation médicale de protocoles réels. Les branches ne constituent pas un diagnostic.

## Références des limites historiques

- [Science Museum : Joseph Lister et l'acide carbolique](https://collection.sciencemuseumgroup.org.uk/people/cp37522/joseph-lister).
- [NIH : arnica, peau lésée et réactions cutanées](https://www.ncbi.nlm.nih.gov/sites/books/NBK501828/).

Les produits historiques potentiellement toxiques sont des repères de narration, pas des préparations à reproduire.
