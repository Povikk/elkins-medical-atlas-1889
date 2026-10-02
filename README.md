# Elkins & Elkins Medical Atlas

Application statique et autonome pour des scènes RP médicales en 1889.

Ouvrir `index.html` pour accéder directement à la version actuelle. La version monolithique fournie est conservée dans `index.legacy.html` uniquement comme référence.

## Structure

- `dist/index.html` contient la structure de l'interface.
- `dist/styles.css` contient le thème et les règles responsive.
- `dist/data.js` contient le Lexique, les parcours et le matériel.
- `dist/app.js` contient la navigation et le rendu interactif.

Pour modifier un parcours, éditer uniquement son entrée dans `dist/data.js`.
L'application ne possède ni backend, ni base de données, ni sauvegarde automatique.
