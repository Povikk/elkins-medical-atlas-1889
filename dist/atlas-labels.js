// Label rectangles in original 1158 x 1638 page coordinates.
// label, x, y, width, height, existing reference group, simple definition.
const atlasLabelRegions = {
  skeleton:[
    ["Crâne",718,263,57,31,0,"Ensemble des os de la tête qui entourent et protègent le cerveau."],
    ["Mandibule",716,345,91,31,0,"Os mobile de la mâchoire inférieure. Il porte les dents inférieures et participe à la mastication."],
    ["Clavicule",375,397,79,28,1,"Os qui relie le sternum à l'épaule et aide à maintenir le bras à distance du thorax."],
    ["Omoplate (scapula)",760,457,85,43,1,"Os plat situé à l'arrière de l'épaule, qui s'articule avec l'humérus et la clavicule."],
    ["Sternum",334,503,73,28,2,"Os plat au centre de la poitrine, auquel se rattachent les côtes par leurs cartilages."],
    ["Côtes",338,573,55,28,2,"Os courbes qui constituent la cage thoracique et protègent notamment le cœur et les poumons."],
    ["Colonne vertébrale",303,639,83,43,3,"Suite de vertèbres qui soutient le dos et forme un canal protecteur pour la moelle épinière."],
    ["Bassin",425,758,57,28,4,"Ensemble osseux à la base du tronc, reliant la colonne aux jambes et protégeant des organes pelviens."],
    ["Humérus",767,583,81,28,5,"Os du bras, situé entre l'épaule et le coude."],
    ["Radius",798,708,65,28,5,"L'un des deux os de l'avant-bras, du côté du pouce."],
    ["Ulna (cubitus)",805,757,77,44,5,"L'autre os de l'avant-bras, du côté du petit doigt. Il forme notamment la pointe du coude."],
    ["Carpe",805,835,59,28,5,"Groupe de petits os qui constitue le poignet."],
    ["Métacarpe",804,869,83,28,5,"Ensemble des os de la paume, entre le poignet et les doigts."],
    ["Phalanges de la main",805,918,82,28,5,"Petits os des doigts. Chaque doigt en possède trois, sauf le pouce qui en possède deux."],
    ["Fémur",727,977,60,29,6,"Os de la cuisse, reliant la hanche au genou. C'est le plus long os du corps."],
    ["Rotule (patella)",730,1065,83,46,6,"Petit os situé à l'avant du genou, dans le tendon du quadriceps."],
    ["Tibia",708,1176,52,29,6,"Os principal de la jambe pour l'appui, situé entre le genou et la cheville."],
    ["Péroné (fibula)",709,1231,72,44,6,"Os fin sur le côté externe de la jambe, qui participe à la stabilité de la cheville."],
    ["Tarse",711,1313,57,28,6,"Groupe d'os de l'arrière du pied, comprenant notamment les os de la cheville et du talon."],
    ["Métatarse",716,1341,83,28,6,"Ensemble des os du milieu et de l'avant du pied, entre le tarse et les orteils."],
    ["Phalanges du pied",719,1374,87,28,6,"Petits os des orteils. Le gros orteil en possède deux, les autres trois." ]
  ],
  muscles:[
    ["Sterno-cléido-mastoïdien",678,345,186,30,0,"Muscle de chaque côté du cou qui aide à tourner et incliner la tête."],
    ["Deltoïde",303,465,70,29,1,"Muscle qui recouvre l'épaule et participe notamment à l'élévation du bras."],
    ["Grand pectoral",278,542,114,29,2,"Grand muscle de la poitrine qui rapproche le bras du tronc et participe à sa rotation."],
    ["Biceps brachial",280,605,111,29,3,"Muscle à l'avant du bras qui fléchit le coude et aide à tourner la paume vers le haut."],
    ["Muscles de l'avant-bras",266,680,105,43,3,"Ensemble de muscles qui commande les mouvements du poignet et des doigts, ainsi que certaines rotations de l'avant-bras."],
    ["Grand droit de l'abdomen",782,651,100,45,4,"Muscle vertical à l'avant du ventre qui aide à fléchir le tronc et à soutenir la paroi abdominale."],
    ["Obliques de l'abdomen",785,746,99,45,4,"Muscles des côtés du ventre qui participent aux rotations du tronc et au maintien de la paroi abdominale."],
    ["Adducteurs",332,958,91,28,5,"Muscles de la face interne de la cuisse qui rapprochent la jambe de l'axe du corps."],
    ["Quadriceps fémoral",747,987,104,43,5,"Groupe de muscles à l'avant de la cuisse dont le rôle principal est de tendre le genou."],
    ["Tibial antérieur",679,1193,154,29,6,"Muscle à l'avant de la jambe qui relève le pied vers le tibia." ]
  ],
  organs:[
    ["Cerveau",732,269,72,29,0,"Organe principal du système nerveux, impliqué dans la pensée, les perceptions et la commande des mouvements."],
    ["Trachée",713,440,72,29,1,"Conduit respiratoire qui mène l'air du larynx vers les bronches des poumons."],
    ["Poumon droit",279,607,107,29,2,"Poumon situé à droite du patient, donc à gauche sur cette vue de face. Il participe aux échanges d'oxygène et de gaz carbonique."],
    ["Poumon gauche",761,598,122,29,2,"Poumon situé à gauche du patient, donc à droite sur cette vue de face. Il participe aux échanges respiratoires."],
    ["Coeur",777,680,50,28,3,"Organe musculaire qui propulse le sang dans les poumons et dans le reste du corps."],
    ["Diaphragme",286,757,98,29,2,"Principal muscle de la respiration. Il sépare la cavité thoracique de la cavité abdominale."],
    ["Foie",323,817,42,29,4,"Grand organe abdominal qui transforme des substances, stocke des réserves et produit la bile."],
    ["Estomac",777,811,70,29,5,"Poche digestive qui reçoit les aliments et commence à les transformer avant leur passage dans l'intestin."],
    ["Rate",780,865,43,29,5,"Organe qui participe aux défenses immunitaires et au renouvellement des cellules du sang."],
    ["Rein droit",280,896,84,29,6,"Organe situé à droite du patient qui filtre le sang et produit l'urine. Il se trouve en profondeur, vers le dos."],
    ["Rein gauche",782,911,100,29,6,"Organe situé à gauche du patient qui filtre le sang et produit l'urine. Il se trouve en profondeur, vers le dos."],
    ["Côlon",324,1003,56,28,7,"Partie du gros intestin qui récupère notamment de l'eau et participe à la formation des selles."],
    ["Intestin grêle",769,1004,103,29,7,"Long segment digestif où se déroule une grande partie de la digestion et de l'absorption des nutriments."],
    ["Vessie",708,1146,65,29,8,"Réservoir musculaire du bassin qui conserve l'urine avant son évacuation." ]
  ]
};
