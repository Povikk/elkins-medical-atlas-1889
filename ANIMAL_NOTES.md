# Attaque d’animal

Parcours autonome dans `dist/animal.js`, chargé après les modules de soin et de récapitulatif. Il utilise le moteur de navigation existant, y compris la capture des étapes pour le condensé. Aucun enregistrement d’intervention.

## Repères de conception

- Troisième carte de la grille des interventions, avec une patte Twemoji locale.
- Onze étapes courtes : état, sang, priorités, blessures, zone, aspect / fonction, circonstances, soin de plaie, douleur, protection, contrôle.
- Morsure, griffure, association et blessures multiples ; côtés gauche / droit du bras, de la main, de la jambe et du pied.
- Une seule zone principale est sélectionnée. Les autres blessures doivent aussi être inspectées, mais aucune localisation secondaire n’est inventée.
- Les réponses incertaines restent incertaines. Une réévaluation explicite des signes vitaux prévaut sur les observations initiales.
- Pas de suture automatique, de diagnostic de rage, d’extraction ou de chirurgie automatique.
- Plaie profonde, écrasement, fonction altérée ou localisation sensible : protection et évaluation / renfort, pas simple sortie après le pansement.
- Laudanum et morphine restent des possibilités historiques facultatives du lexique existant, pas des administrations enregistrées. Aucun opiacé proposé par ce parcours si l’état ou le saignement restent inquiétants / non évalués. Aucun produit oral si le patient ne peut pas répondre et avaler.
- Les morsures de serpent / venin possible nécessitent une évaluation distincte : ce parcours de plaies ne prétend pas les traiter.

## Sources et limites

- [Institut Pasteur : première vaccination contre la rage en 1885](https://www.pasteur.fr/fr/en-ce-moment/nos-actualites/actualites/lhistoire-de-la-premiere-vaccination-contre-la-rage-en-1885).
- [Institut Pasteur : création et ouverture en 1888](https://www.pasteur.fr/fr/nous-connaitre/du-vaccin-contre-la-rage-la-creation-de-linstitut).
- [CDC, histoire de la vaccination antitétanique](https://www.cdc.gov/pinkbook/hcp/table-of-contents/chapter-21-tetanus.html) : pas de vaccin antitétanique de routine en 1889.
- [NICE : évaluation des morsures](https://www.nice.org.uk/guidance/ng184/chapter/Recommendations) et [limites des observations de surface](https://www.nice.org.uk/guidance/NG184/chapter/rationale-and-impact) utilisés pour éviter les raccourcis dangereux. Les antibiotiques et protocoles modernes ne sont pas transposés en 1889.

Le traitement antirabique historique est une possibilité spécialisée dépendant du lieu et des moyens. Aucun flacon supposé disponible au cabinet. Les produits antiseptiques historiques peuvent être toxiques : aucun dosage, mélange ou protocole réel n’est ajouté. L’Atlas reste un support de fiction, pas un guide de secours.

## Vérification

`tests/animal.cjs` vérifie les deux vues, chaque choix, les branches superficielles / profondes / écrasement / incertaines / multiples, les garde-fous antalgiques, les dernières observations, les retours en arrière, les deux lignes finales et les largeurs 2560, 1920, 390 et 320 px dans les deux thèmes.

Le contrôle global a aussi identifié un débordement des choix en taille de texte très grande sur desktop. Les cellules utilisent désormais leur largeur naturelle pour ce réglage, sans réduire la taille de lecture.
