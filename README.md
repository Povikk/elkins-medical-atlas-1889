# Elkins & Elkins Medical Atlas

Un aide-mémoire médical pour les scènes de jeu de rôle sur RedM, dans un univers western situé en 1889. L’application rassemble des parcours de soin et des références à consulter rapidement sur un second écran.

[Accéder à l’application](https://elkins-medical-atlas-1889.povik.chatgpt.site/) : l’accès est réservé aux utilisateurs autorisés.

Les contenus servent à la fiction et s’appuient sur des pratiques historiques. Ils ne constituent pas des conseils médicaux et ne doivent pas être utilisés pour des soins réels.

## Fonctionnalités

- Suivre des interventions adaptées aux réponses choisies : blessures par balle, attaques d’animaux, coups de sabot, chutes, brûlures et autres traumatismes.
- Accéder à des parcours de consultations simples, de suivi, de chirurgie lourde et d’obstétrique.
- Sélectionner plusieurs zones blessées, préciser un emplacement et indiquer le type et le nombre de projectiles par zone.
- Retrouver les actions, produits et matériels utiles, avec un pense-bête et une vue condensée du parcours.
- Consulter, modifier et copier le récapitulatif des constatations et des soins retenus.
- Gérer plusieurs patients pendant une session, les renommer et passer de l’un à l’autre.
- Rechercher des médicaments, techniques, matériels et symptômes dans le lexique, avec une vue des essentiels et des fiches au survol.
- Explorer trois planches anatomiques interactives et consulter des accroches pour prolonger une scène.
- S’entraîner avec des séries aléatoires de dix questions, leurs corrections et des anecdotes historiques.
- Compter les kits et seringues utilisés et calculer le montant à reverser au cabinet, avec des tarifs partagés modifiables par un administrateur.

L’interface propose un thème sombre ou clair, une taille de texte réglable et une présentation adaptée aux ordinateurs et aux mobiles.

## Fonctionnement et données

Les patients et les réponses aux parcours restent en mémoire pendant la session. Un rechargement de la page les efface : aucun dossier patient n’est enregistré automatiquement.

Les préférences d’affichage, les compteurs d’objets et le montant dû sont conservés localement dans le navigateur. Seuls les tarifs partagés sont stockés côté serveur ; les données des patients et les compteurs personnels ne sont pas envoyés au serveur.

## Technologies utilisées

- HTML, CSS et JavaScript natif, sans framework front-end.
- Node.js pour la construction, la prévisualisation locale et les tests.
- Cloudflare Workers pour servir l’application et gérer les tarifs, avec Cloudflare R2 pour leur stockage. La publication passe par Sites.
- Twemoji pour les illustrations des emojis.
- Tests avec les modules natifs de Node.js et Playwright pour les parcours dans le navigateur.

## Installation et utilisation en local

Depuis la racine du dépôt, avec Node.js 24, lancer les commandes suivantes. La construction et la prévisualisation ne nécessitent aucune installation de dépendances.

```sh
node scripts/build-worker.mjs
node scripts/preview-worker.mjs
```

Ouvrir ensuite [http://127.0.0.1:4173/](http://127.0.0.1:4173/). Garder le serveur lancé pendant l’utilisation.

La prévisualisation simule un accès administrateur. Ses tarifs restent en mémoire et ne modifient pas ceux du site en ligne. Après une modification des sources, relancer la construction puis redémarrer le serveur.

### Vérifications

Après la construction, ces tests peuvent être exécutés directement avec Node.js :

```sh
node tests/route-ledger.cjs
node tests/route-catalog.cjs
node tests/shared-rates.mjs
```

Les tests de navigation présents dans `tests/` nécessitent également Playwright et, pour ceux qui utilisent la prévisualisation, un serveur local actif.

## Organisation du dépôt

- `dist/` contient les sources de l’interface, les parcours, les références et les ressources visuelles. Malgré son nom, ce dossier contient des fichiers à modifier directement.
- `worker/` contient le serveur Cloudflare et la gestion des tarifs partagés.
- `scripts/` contient les outils de construction et de prévisualisation.
- `tests/` contient les vérifications de logique et de navigation.
- `sources/` et `docs/` regroupent le manuel fourni et les notes documentaires.

Le fichier `index.html` à la racine redirige vers l’interface. `index.legacy.html` conserve l’ancienne version monolithique comme référence.

## Auteur

**Jonathan Ragot**\
GitHub : [Povikk](https://github.com/Povikk)
