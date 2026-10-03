# Elkins & Elkins Medical Atlas

Application statique et autonome pour des scènes RP médicales en 1889.

Ouvrir `index.html` pour accéder directement à la version actuelle. La version monolithique fournie est conservée dans `index.legacy.html` uniquement comme référence.

## Structure

- `dist/index.html` contient la structure de l'interface.
- `dist/styles.css` contient le thème et les règles responsive.
- `dist/data.js` contient le Lexique, les parcours et le matériel.
- `dist/app.js` contient la navigation et le rendu interactif.
- `dist/care.js` contient les consultations, métadonnées de matériel, réévaluation et aides de soin.
- `dist/hooks.js` contient les 60 accroches, leurs filtres et la suggestion facultative pendant les soins.
- `dist/rp-ui.js` contient les formulations, le contexte temporaire et la taille du texte.
- `dist/scene.js` contient les références rapides, incidents et conclusions.
- `dist/atlas-labels.js` contient les 45 zones nommées des trois planches.
- `dist/pharmacy.js` et `dist/lexicon-extra.js` complètent les références historiques.

Pour modifier un parcours original, commencer par son entrée dans `dist/data.js`, puis vérifier les métadonnées correspondantes de `dist/care.js`. Les six consultations sont définies dans `careConsultations`.
Pour ajouter une accroche, ajouter une ligne à une catégorie de `hookGroups` dans `dist/hooks.js` : titre, identifiants de parcours séparés par une virgule, moment, phrase du médecin, relance et scène possible. Ne pas imposer de passé, de réaction ou de nouvelle maladie au joueur. La relance est repliée ; la suggestion pendant le soin est facultative.
L'application ne possède ni backend, ni base de données, ni sauvegarde automatique.

Seuls le thème et la taille de texte peuvent être mémorisés localement. Les choix du parcours, observations, contexte et formulations sont temporaires. Le mode en scène reste supprimé.

## Vérification

Servir `dist` sur `http://127.0.0.1:4173/`, puis exécuter les fichiers `tests/*.cjs` avec Node et Playwright disponibles. `tests/care-stories.cjs` couvre les 17 interventions, les 60 accroches et leurs filtres, la réévaluation, les gardes de produit, les recherches et l’affichage de 320 à 2560 pixels. Les sept autres tests couvrent les fonctions préexistantes, dont les six chirurgies et les 45 zones anatomiques.
