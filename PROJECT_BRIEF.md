# Elkins & Elkins Medical Atlas

## Objectif

Créer une petite webapp RP médicale en français pour RedM / western en 1889.

L'application sert d'aide-mémoire pendant des scènes RP. Elle doit être rapide, simple, lisible sur écran 2K et utilisable en quelques clics.

Le but n'est pas de faire un simulateur médical réaliste ou un cours complet. Les scènes doivent rester courtes, généralement quelques minutes, et ne pas durer 20 minutes sauf cas RP exceptionnel.

## Nom

Elkins & Elkins Medical Atlas

Sous-titre :
Practical Medicine, Surgery & Field Notes - 1889

Important :
Ne jamais utiliser de tirets longs.
Utiliser uniquement le tiret simple "-".

## Architecture principale

Page d'accueil avec 3 entrées :

1. Intervention
   - C'est la fonction principale.
   - Elle doit être au-dessus des autres.
   - Plus grande.
   - Fond légèrement différent.
   - C'est le coeur de l'application.

2. Lexique
   - Médicaments
   - Matériel
   - Symptômes

3. Chirurgie lourde
   - Cas rares et graves uniquement.
   - Les actes simples doivent rester dans Intervention.

## Intervention

L'utilisateur doit cliquer sur ce qu'il constate, pas devoir poser lui-même un diagnostic.

Exemples :
- patient conscient / confus / inconscient
- respire / respire mal / ne respire pas
- douleur légère / modérée / forte
- zone touchée
- saignement léger / important
- mouvement normal / douloureux / impossible
- plaie propre / sale / profonde
- projectile sorti / encore présent / impossible à savoir

Les réponses doivent modifier automatiquement la suite du parcours.

Toujours prévoir quand pertinent :
- "Impossible à savoir"
- "Impossible à déterminer"
- "Patient inconscient"
- "Je n'ai pas encore pu vérifier"

Le module doit fonctionner même quand le médecin arrive sur quelqu'un d'inconscient et ne sait pas ce qu'il s'est passé.

## Patient inconscient / cause inconnue

Prévoir un accès rapide.

Ordre logique :
1. respiration
2. gros saignement
3. stabilisation
4. reprise de conscience
5. seulement ensuite recherche de la cause

Le parcours ne doit pas demander des informations que le patient ne peut pas donner.

## Format d'une étape

Chaque étape doit rester courte.

Afficher en priorité :

### À faire
2 à 4 points maximum si possible.

Puis juste en dessous, directement :
→ « phrase RP possible »
→ « variante éventuelle »

Ne pas créer un gros bloc séparé "À dire".

Puis si nécessaire :
- Matériel
- Médicament / produit
- Attention

## Phrases RP

Chaque étape doit avoir au moins une phrase naturelle à dire.

En mode normal :
- 2 ou 3 variantes maximum.

En mode compact :
- 1 seule phrase.

Les phrases doivent être :
- naturelles
- courtes
- adaptées au vocal
- pas trop médicales
- pas répétitives

## Médicaments / produits

Toujours préciser :
- nom
- catégorie
- forme
- composition quand utile
- voie d'administration
- usage RP

Exemples attendus :

Laudanum
- liquide
- teinture d'opium
- voie orale
- en gouttes ou petite quantité diluée
- seulement si le patient est conscient et peut avaler

Morphine
- solution injectable
- voie hypodermique
- seringue

Chloroforme
- liquide volatil
- voie inhalée
- linge / compresse

Éther
- liquide volatil
- voie inhalée

Phénol / acide carbolique
- solution antiseptique liquide diluée
- application locale sur la plaie, les compresses ou le matériel

Arnica
- teinture alcoolique liquide ou pommade
- application locale sur peau intacte
- pas dans une plaie ouverte

## Couleurs du Lexique

Utiliser des fonds légers différents selon la catégorie :
- Antidouleur
- Anesthésique
- Antiseptique
- Soin local
- Stimulant
- Fièvre / maladie
- Technique
- Autre

Rester sobre et cohérent avec l'esthétique papier / carnet médical.

## Lexique

Prévoir 3 onglets robustes :

### Médicaments
- tri alphabétique
- barre de recherche

### Matériel
Exemples :
- seringue hypodermique
- aiguille et fil de suture
- forceps / pince
- scalpel / bistouri
- attelle
- compresses
- bandage
- scie chirurgicale
- trépan

Pour chaque entrée :
- ce que c'est
- à quoi ça sert en RP

### Symptômes
Exemples :
- confusion
- essoufflement
- pâleur
- pouls faible
- pupilles serrées
- rougeur / chaleur / pus
- sang craché
- somnolence
- ventre dur
- vomissements

Pour chaque entrée :
- ce que c'est
- ce que ça peut suggérer en RP
- rester prudent, ne pas présenter ça comme un diagnostic automatique

## Matériel nécessaire

Dans Intervention et Chirurgie lourde, ajouter un bouton :
"Matériel nécessaire"

Il affiche rapidement le matériel probable pour la scène en cours.

Il ne doit pas bloquer la navigation.

## Mode compact

Présent dans Intervention et Chirurgie lourde.

Mode normal :
- détails complets
- jusqu'à 2 ou 3 phrases RP

Mode compact :
- 2 ou 3 actions max
- matériel condensé
- 1 phrase RP
- médicaments affichés avec au minimum :
  - nom
  - forme
  - administration

## Urgence visuelle

Afficher un indicateur léger :
- Léger
- Sérieux
- Critique

Ne pas faire trop jeu vidéo.

## Intervention courantes à garder / compléter

- Patient inconscient / cause inconnue
- Blessure par balle
- Blessure au couteau
- Bagarre / coups
- Chute de cheval
- Fracture / luxation
- Petit bobo / soin léger
- Noyade / asphyxie
- Traumatisme crânien
- Brûlure
- Intoxication / opiacés

## Chute de cheval

Le parcours doit gérer les cas intermédiaires.

Exemple :
- conscient
- douleur au bras
- douleur modérée
- bleu
- peut bouger mais ça fait mal

Résultat logique :
- repos
- linge frais
- arnica si peau intacte
- bandage de soutien éventuel
- laudanum si douleur modérée
- morphine seulement si douleur forte

Ne pas limiter le choix à "fracture / pas fracture".

## Suture

La suture doit être une vraie étape conditionnelle.

Choix possibles :
- plaie propre et nette
- petite plaie, pas besoin de points
- plaie sale / irrégulière / trop profonde

Si suture :
- nettoyer
- rapprocher les bords
- aiguille + fil
- quelques points
- nettoyer autour
- pansement

Avec phrases RP et médicaments si nécessaire.

## Chirurgie lourde

Cette section ne doit pas contenir les petits gestes qui existent déjà dans Intervention.

Cas lourds :
- Amputation
- Hémorragie majeure
- Projectile profondément logé
- Plaie abdominale grave
- Trépanation
- Plaie gravement infectée

Les scènes doivent rester courtes :
environ 4 à 8 minutes RP.

Chaque étape doit avoir une phrase à dire.

## Design

Ambiance :
- ouvrage médical ancien
- papier / beige
- sobre
- lisible
- pas kitsch
- pas trop chargé

Sur l'accueil :
- grand titre possible
- bouton Intervention très visible

Une fois dans une intervention :
- réduire fortement l'en-tête
- conserver un maximum d'espace vertical pour le contenu

Sur écran 2K :
- largeur confortable
- texte lisible
- pas une petite colonne de 900 px perdue au milieu de l'écran

Sur mobile :
- gros boutons
- mise en page en colonne
- pas de scroll horizontal

## Contraintes techniques

Le site doit rester simple.

Pour l'instant :
- HTML / CSS / JavaScript classique
- pas besoin de backend
- pas de base de données
- aucune sauvegarde patient
- aucune connexion à un dossier médical

Le module est 100 % informatif.

Priorité absolue :
tous les boutons et onglets doivent fonctionner.

Ne pas ajouter d'images anatomiques pour l'instant.
Elles ont provoqué des problèmes dans les versions précédentes.

## Source historique principale

Utiliser le PDF fourni dans le dossier sources :
Manuel_medecine_RP_1889_Effie_Elkins.pdf

Le PDF contient notamment :
- urgences et traumatologie
- maladies / infections / intoxications
- obstétrique
- maladies de l'esprit
- pharmacopée
- vocabulaire

Quand le PDF donne une information précise, la privilégier pour le contenu RP.

Ne pas inventer des dosages médicaux réels.
