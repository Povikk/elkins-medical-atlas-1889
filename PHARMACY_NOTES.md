# Extension du Lexique, octobre 2026

53 fiches dans l'onglet Médicaments : 51 produits ou préparations et les 2 techniques déjà présentes. 38 nouvelles entrées dans dist/pharmacy.js. Les interventions ne sont pas modifiées par cette extension.

## Sources

- British Pharmacopoeia, 1885, exemplaire UCL conservé par Wellcome : https://wellcomecollection.org/works/cukcj8d4
- T. Lauder Brunton, A Text-Book of Pharmacology, Therapeutics and Materia Medica, ouvrage d'époque avec références britanniques et américaines : https://www.chestofbooks.com/health/materia-medica-drugs/Pharmacology-Therapeutics-Drugs/index.html
- Cocaïne locale : JAMA, Hydrochloride of Cocaine, 1884 : https://jamanetwork.com/journals/jama/article-abstract/423461
- Antifébrine : Antifebrin, a New Antipyretic, 1886 : https://pmc.ncbi.nlm.nih.gov/articles/PMC9447502/
- Phénacétine : monographie IARC, introduction thérapeutique en 1887 et toxicité ultérieure : https://www.ncbi.nlm.nih.gov/books/NBK304337/

## Limites éditoriales

Les fiches résument des usages historiques, sans reprendre les recettes, les doses ou les indications dangereuses des ouvrages. La présence dans une pharmacopée n'établit ni une disponibilité dans tous les cabinets ni une efficacité. Le contexte « Pharmacopée XIXe » signifie appartenance à la pharmacie d'époque, pas fréquence d'utilisation. « Spécialisé » et « Historique dangereux » sont des repères éditoriaux pour le RP, pas des classifications officielles d'époque.

Sensations et odeurs restent variables selon la préparation et la personne. Les signes de toxicité ne sont pas des effets à rassurer. Aucun produit ajouté n'est proposé automatiquement dans une intervention. Pas de backend, de dosage, de recette ni d'enregistrement patient.

## Maintenance

Les données additionnelles sont séparées de la navigation. Les nouvelles catégories sont découvertes automatiquement. La recherche ignore les accents, les filtres se combinent, et les détails gardent les sources accessibles. Les tests tests/pharmacy-smoke.cjs couvrent tous les filtres, les détails, les onglets, les états vides et les deux thèmes en desktop et mobile.
