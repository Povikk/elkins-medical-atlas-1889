# Attaque d’animal

Parcours autonome dans `dist/animal.js`, chargé après les modules de soin et de récapitulatif. Il utilise le moteur de navigation existant, y compris la capture des étapes pour le condensé. Aucun enregistrement d’intervention.

## Repères de conception

- Troisième carte de la grille des interventions, avec une patte Twemoji locale.
- Douze étapes courtes : état, sang, priorités, animal, blessures, zone, aspect / fonction, circonstances, soin local, douleur, protection, contrôle.
- Morsure, griffure, association et blessures multiples ; côtés gauche / droit du bras, de la main, de la jambe et du pied.
- Une seule zone principale est sélectionnée. Les autres blessures doivent aussi être inspectées, mais aucune localisation secondaire n’est inventée.
- Les réponses incertaines restent incertaines. Une réévaluation explicite des signes vitaux prévaut sur les observations initiales.
- Pas de suture automatique, de diagnostic de rage, d’extraction ou de chirurgie automatique.
- Plaie profonde, écrasement, fonction altérée ou localisation sensible : protection et évaluation / renfort, pas simple sortie après le pansement.
- Laudanum et morphine restent des possibilités historiques facultatives du lexique existant, pas des administrations enregistrées. Aucun opiacé proposé par ce parcours si l’état ou le saignement restent inquiétants / non évalués. Aucun produit oral si le patient ne peut pas répondre et avaler.
- Les serpents ont une branche spécifique : protection simple, calme, surveillance et transport / évaluation urgente. Ni suture ni antalgique automatique, ni promesse de guérison.
- Leurs observations distinguent marques locales, douleur / gonflement progressifs, dégradation des réactions / du souffle et évolution inconnue. Des signes qui se dégradent mettent la priorité en critique, sans diagnostiquer automatiquement une envenimation.

## Espèces de Red Dead Redemption 2

Vingt-deux choix, dont les options « Autre animal » et « Animal non identifié ». Les espèces / familles sont : grizzly (ours brun), ours noir, puma / cougar, panthère (dont Floride), loup gris, loup des bois, alligator, crotale, mocassin d’eau, serpent cuivré, fer-de-lance, serpent non identifié, sanglier, bison, cerf mâle, wapiti, élan, mouflon, rat musqué et petits mammifères (blaireau, raton laveur, castor).

Les prédateurs fréquents sont distingués des charges ou morsures défensives rapportées. L’ours noir est conservé pour les blessures décrites en scène, avec la réserve qu’il fuit généralement dans le jeu. Les variantes légendaires utilisent la même famille clinique : aucune blessure supplémentaire n’est inventée. L’option « Autre animal » couvre les espèces atypiques et les variantes du serveur.

Le choix d’un animal ne remplit pas automatiquement la blessure, sa profondeur ou son nombre. Il adapte les questions et les repères : plusieurs plaies pour les loups, chute et griffures pour les grands félins / ours, souillures et immersion pour l’alligator, heurt / bois / piétinement pour les grands herbivores, venin possible pour les serpents.

Les choix de blessure proposés aux serpents excluent les griffures et les cornes. Ceux des grands herbivores distinguent un heurt sans plaie d’une plaie par bois / corne. Aucun nettoyage de plaie ou risque de rage n’est ajouté au résumé d’un choc sans plaie ; aucun risque de rage lié au reptile n’est ajouté au résumé de l’alligator ou du serpent.

Sources de jeu : [grizzly et distinction avec l’ours noir](https://reddead.fandom.com/wiki/Grizzly_%28RDR_2%29), [puma / cougar](https://reddead.fandom.com/wiki/Cougar_%28RDR_2%29), [alligator](https://reddead.fandom.com/wiki/Alligator), [serpents et variantes](https://reddead.fandom.com/wiki/Snake_%28RDR_2%29), [compendium](https://www.powerpyx.com/red-dead-redemption-2-full-compendium/). Les réactions défensives plus rares sont corroborées par des [observations de joueurs](https://gtaforums.com/topic/917548-what-animals-attack-or-hunt-the-player/), moins fiables qu’une description officielle : elles ne sont pas présentées comme des attaques systématiques.

## Sources et limites

- [Institut Pasteur : première vaccination contre la rage en 1885](https://www.pasteur.fr/fr/en-ce-moment/nos-actualites/actualites/lhistoire-de-la-premiere-vaccination-contre-la-rage-en-1885).
- [Institut Pasteur : création et ouverture en 1888](https://www.pasteur.fr/fr/nous-connaitre/du-vaccin-contre-la-rage-la-creation-de-linstitut).
- [CDC, histoire de la vaccination antitétanique](https://www.cdc.gov/pinkbook/hcp/table-of-contents/chapter-21-tetanus.html) : pas de vaccin antitétanique de routine en 1889.
- [NICE : évaluation des morsures](https://www.nice.org.uk/guidance/ng184/chapter/Recommendations) et [limites des observations de surface](https://www.nice.org.uk/guidance/NG184/chapter/rationale-and-impact) utilisés pour éviter les raccourcis dangereux. Les antibiotiques et protocoles modernes ne sont pas transposés en 1889.
- [Histoire de la sérothérapie antivenimeuse](https://pmc.ncbi.nlm.nih.gov/articles/PMC4898362/) : présentation en 1894, donc aucun antivenin courant ajouté au cabinet de 1889.
- [CDC : morsures de serpent](https://www.cdc.gov/niosh/outdoor-workers/about/venomous-snakes.html) consulté pour exclure incision, aspiration, cautérisation et garrot. Ces garde-fous ne sont pas un protocole de secours proposé par l’Atlas.
- [CDC : rage chez les mammifères](https://www.cdc.gov/rabies/hcp/clinical-overview/) utilisé pour ne pas appliquer la branche rage aux reptiles.

Le traitement antirabique historique est une possibilité spécialisée dépendant du lieu et des moyens. Aucun flacon supposé disponible au cabinet. Les produits antiseptiques historiques peuvent être toxiques : aucun dosage, mélange ou protocole réel n’est ajouté. L’Atlas reste un support de fiction, pas un guide de secours.

## Vérification

`tests/animal.cjs` vérifie les deux vues, chaque choix, les branches superficielles / profondes / écrasement / incertaines / multiples, les garde-fous antalgiques, les dernières observations, les retours en arrière, les deux lignes finales et les largeurs 2560, 1920, 390 et 320 px dans les deux thèmes.

`tests/animal-species.cjs` parcourt les 22 choix dans les deux vues, soit 44 parcours complets. Il vérifie les restrictions de choix, la distinction serpent / reptile / charge, les résumés et l’invalidation des anciennes réponses lors d’un changement d’animal.

Le contrôle global a aussi identifié un débordement des choix en taille de texte très grande sur desktop. Les cellules utilisent désormais leur largeur naturelle pour ce réglage, sans réduire la taille de lecture.
