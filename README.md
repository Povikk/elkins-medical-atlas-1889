# Elkins & Elkins Medical Atlas

Application statique et autonome pour des scènes RP médicales en 1889.

Ouvrir `index.html` pour accéder directement à la version actuelle. La version monolithique fournie est conservée dans `index.legacy.html` uniquement comme référence.

## Structure

- `dist/index.html` contient la structure de l'interface.
- `dist/styles.css` contient le thème et les règles responsive.
- `dist/data.js` contient le Lexique, les parcours et le matériel.
- `dist/app.js` contient la navigation et le rendu interactif.
- `dist/care.js` contient les consultations, métadonnées de matériel, réévaluation et aides de soin.
- `dist/stories.js` contient les 32 trames, leur recherche et leurs fiches de préparation.
- `dist/rp-ui.js` contient les formulations, le contexte temporaire et la taille du texte.
- `dist/scene.js` contient les références rapides, incidents et conclusions.
- `dist/atlas-labels.js` contient les 45 zones nommées des trois planches.
- `dist/pharmacy.js` et `dist/lexicon-extra.js` complètent les références historiques.

Pour modifier un parcours original, commencer par son entrée dans `dist/data.js`, puis vérifier les métadonnées correspondantes de `dist/care.js`. Les six consultations sont définies dans `careConsultations`.
Pour ajouter une trame, ajouter une ligne à `storyRows` dans `dist/stories.js`. Chaque fiche possède une accroche, des rôles, trois temps, un geste et une phrase par temps, des issues ouvertes, des limites historiques et une source éventuelle. La catégorie `Repères futurs` reste explicitement hors jeu en 1889.
L'application ne possède ni backend, ni base de données, ni sauvegarde automatique.

Seuls le thème et la taille de texte peuvent être mémorisés localement. Les choix du parcours, observations, contexte et formulations sont temporaires. Le mode en scène reste supprimé.

## Vérification

Servir `dist` sur `http://127.0.0.1:4173/`, puis exécuter les fichiers `tests/*.cjs` avec Node et Playwright disponibles. `tests/care-stories.cjs` couvre les 17 interventions, les 32 trames, la réévaluation, les gardes de produit, les recherches et l’affichage de 320 à 2560 pixels. Les sept autres tests couvrent les fonctions préexistantes, dont les six chirurgies et les 45 zones anatomiques.
