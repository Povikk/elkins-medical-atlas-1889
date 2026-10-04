# Sélections multiples et quiz

Les six sélecteurs d’emplacement existants permettent plusieurs zones : balle, couteau, chute de cheval, fracture / luxation, soin léger et attaque d’animal. Une zone se coche ou se décoche, puis la sélection est validée explicitement. Aucune limite artificielle de nombre de zones.

Les tableaux `*AreaSelections` conservent les libellés et les côtés de chaque observation. Ils sont remplacés, jamais modifiés en place, pour préserver les instantanés de navigation. Les anciens champs de branche restent disponibles et utilisent une priorité conservatrice. Le rappel et le récapitulatif final lisent toutes les zones, pas seulement le champ ancien.

L’incertitude, l’absence de douleur et les douleurs générales sont exclusives des emplacements précis. Modifier une sélection antérieure invalide les observations suivantes, mais ne supprime pas la dernière réévaluation vitale. Revenir en arrière conserve la sélection validée ; démarrer un autre cas remet les réponses à zéro. Rien n’est enregistré.

Les alertes de tête / abdomen et l’évaluation des zones sensibles lisent toutes les zones. La branche balle rappelle aussi les précautions pour chaque type de zone retenu. Les observations suivantes ne sont pas inventées séparément pour chaque plaie : une mention demande de les réévaluer individuellement.

Le condensé utilise des cases à cocher dans un volet léger. La zone en cours est ouverte ; les autres sélections restent repliables pour préserver la lisibilité. Les nouvelles cellules utilisent une largeur naturelle sur desktop, sans diminuer le réglage de texte.

`quiz-practice-extra.js` apporte 100 questions rédigées individuellement, réparties à parts égales entre produits, techniques, matériel, observations et situations. La banque complète compte 315 questions. Chaque question possède quatre propositions distinctes et une correction. Les anecdotes existantes restent associées aux références connues.

Vérifications : `multi-zones.cjs`, `quiz.cjs`, `care-stories.cjs`, `condensed.cjs` et `animal-species.cjs`. Sélection de cinq zones, retour, exclusivité des réponses incertaines, réinitialisation, préservation des signes vitaux, desktop / mobile et les deux thèmes.
