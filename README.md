# Elkins & Elkins Medical Atlas

Application statique et autonome pour des scènes RP médicales en 1889.

Ouvrir `index.html` pour accéder directement à la version actuelle. La version monolithique fournie est conservée dans `index.legacy.html` uniquement comme référence.

## Structure

- `dist/index.html` contient la structure de l'interface.
- `dist/styles.css` contient le thème et les règles responsive.
- `dist/data.js` contient le Lexique, les parcours et le matériel.
- `dist/app.js` contient la navigation et le rendu interactif.
- `dist/care.js` contient les consultations, métadonnées de matériel, réévaluation et aides de soin.
- `dist/condensed.js` affiche le parcours complet sans dialogue RP, en réutilisant les actions et règles de branchement du rendu détaillé. Les observations ultérieures sont invalidées quand une réponse antérieure change ; les dernières observations vitales restent conservées.
- `dist/care-memo.js` fournit le pense-bête d’Effie, accessible depuis le condensé : quatre cellules Observer / Agir / Produits facultatifs / Danger, seules ou au-dessus des étapes. Les choix restent accessibles en vue seule. Présentation inspirée des pages 2 et 3 du PDF fourni ; les consultations et chirurgies sont adaptées aux parcours existants. Les autres chapitres du PDF ne deviennent pas de nouveaux diagnostics ou prescriptions. Aucun protocole ou dosage ajouté.
- `dist/report.js` prépare un résumé local en mots-clés à la fin du soin : motif et constatations médicales ; soins, traitements et prescriptions renseignés. Nombre de points et notes libres peuvent être indiqués. Le résultat est modifiable et copiable, sans prompt, appel distant ni stockage automatique. Aucun soin proposé dans le parcours n’est considéré comme effectué.

Le pense-bête est affiché par défaut dans les parcours détaillés et condensés. Les boutons de matériel en haut et de changement de chirurgie sont retirés ; le matériel indiqué dans les étapes reste disponible.
- `dist/hooks.js` contient les 60 accroches et leurs filtres, uniquement dans la catégorie Accroches. Aucune suggestion de perche dans les interventions.
- `dist/rp-ui.js` contient les formulations, le contexte temporaire et la taille du texte.
- `dist/scene.js` contient les références rapides, incidents et conclusions.
- `dist/atlas-labels.js` contient les 45 zones nommées des trois planches.
- `dist/pharmacy.js` et `dist/lexicon-extra.js` complètent les références historiques.

Pour modifier un parcours original, commencer par son entrée dans `dist/data.js`, puis vérifier les métadonnées correspondantes de `dist/care.js`. Les six consultations sont définies dans `careConsultations`.
Pour ajouter une accroche, ajouter une ligne à une catégorie de `hookGroups` dans `dist/hooks.js` : titre, identifiants de parcours séparés par une virgule, moment, phrase du médecin, relance et scène possible. Ne pas imposer de passé, de réaction ou de nouvelle maladie au joueur. La relance est repliée ; la suggestion pendant le soin est facultative.
L'application ne possède ni backend, ni base de données, ni sauvegarde automatique.

Seuls le thème et la taille de texte peuvent être mémorisés localement. Les choix du parcours, observations, contexte et formulations sont temporaires. Le mode en scène reste supprimé.

Le bouton « Condensé » remplace « Compact ». Sur PC, le parcours est présenté en colonnes ; sur mobile ou avec un texte fortement agrandi, la lisibilité prime et le défilement reste possible. `tests/condensed.cjs` vérifie les 17 parcours et six chirurgies, les branches, le retour au détail et les deux thèmes.

## Vérification

Servir `dist` sur `http://127.0.0.1:4173/`, puis exécuter les fichiers `tests/*.cjs` avec Node et Playwright disponibles. `tests/care-stories.cjs` couvre les 17 interventions, les 60 accroches et leurs filtres, la réévaluation, les gardes de produit, les recherches et l’affichage de 320 à 2560 pixels. Les sept autres tests couvrent les fonctions préexistantes, dont les six chirurgies et les 45 zones anatomiques.
