const lexique = [
  {
    name:"Iodoforme",
    category:"Antiseptique",
    tags:"iodoforme poudre jaune gaze pansement plaie chirurgie antiseptique",
    type:"Antiseptique historique pour pansements",
    form:"Poudre jaune ou gaze préparée à l'iodoforme",
    composition:"Iodoforme (triiodométhane), incorporé à une préparation de pansement.",
    admin:"Usage externe dans un pansement préparé, en contexte chirurgical RP",
    use:"Variante de pansement après nettoyage. Ne remplace ni le nettoyage ni la surveillance d'une infection ; produit historiquement toxique.",
    icon:""
  },
  {
    name:"Onguent à l'oxyde de zinc",
    category:"Soin local",
    tags:"zinc oxyde pommade onguent irritation frottement peau intacte protection",
    type:"Préparation protectrice cutanée",
    form:"Pommade blanche, épaisse",
    composition:"Oxyde de zinc dans une base grasse ; composition variable selon la pharmacie.",
    admin:"Application externe sur peau intacte ou superficiellement irritée",
    use:"Protection d'une zone irritée par les frottements. Ne traite pas une plaie profonde, une fracture ou une infection.",
    icon:""
  },
  {
    name:"Laudanum",
    category:"Antidouleur",
    tags:"douleur antidouleur opium liquide oral boire gouttes",
    type:"Antidouleur / sédatif",
    form:"Liquide opiacé, teinture d’opium dans l’alcool",
    composition:"Teinture d’opium dans de l’alcool, généralement aromatisée selon la préparation.",
    admin:"Voie orale, en gouttes ou petite quantité diluée",
    use:"Douleur, agitation selon la scène",
    icon:""
  },
  {
    name:"Morphine",
    category:"Antidouleur",
    tags:"douleur antidouleur injection seringue hypodermique",
    type:"Antidouleur puissant",
    form:"Solution liquide injectable à base de sel de morphine",
    composition:"Sel de morphine dissous dans une solution destinée à l’injection hypodermique.",
    admin:"Injection hypodermique à l’aide d’une seringue",
    use:"Douleur importante",
    icon:""
  },
  {
    name:"Chloroforme",
    category:"Anesthésique",
    tags:"endormir anesthésie anesthésique inhalation",
    type:"Anesthésique",
    form:"Liquide volatil",
    composition:"Chloroforme liquide pur ou préparation anesthésique à base de chloroforme.",
    admin:"Voie inhalée, versé sur un linge, une compresse ou un masque simple",
    use:"Intervention importante nécessitant une anesthésie",
    icon:""
  },
  {
    name:"Éther",
    category:"Anesthésique",
    tags:"endormir anesthésie anesthésique inhalation",
    type:"Anesthésique",
    form:"Liquide volatil",
    composition:"Éther éthylique volatil utilisé comme anesthésique inhalé.",
    admin:"Voie inhalée, sur linge, compresse ou dispositif d’anesthésie simple",
    use:"Alternative anesthésique",
    icon:""
  },
  {
    name:"Phénol / acide carbolique",
    category:"Antiseptique",
    tags:"antiseptique désinfecter nettoyer plaie",
    type:"Antiseptique local",
    form:"Solution liquide diluée",
    composition:"Acide carbolique dilué dans une solution adaptée à l’usage antiseptique.",
    admin:"Application locale sur la peau, la plaie, les compresses ou le matériel",
    use:"Nettoyage et antisepsie",
    icon:""
  },
  {
    name:"Alcool",
    category:"Antiseptique",
    tags:"antiseptique nettoyer désinfecter",
    type:"Antiseptique local",
    form:"Liquide",
    composition:"Éthanol ou alcool fort utilisé comme nettoyant / antiseptique de fortune.",
    admin:"Application locale",
    use:"Nettoyage simple du matériel ou d’une zone",
    icon:""
  },
  {
    name:"Préparation à l’arnica",
    category:"Soin local",
    tags:"arnica baume pommade teinture bobo bleu ecchymose contusion peau léger",
    type:"Soin local pour contusions",
    form:"Teinture alcoolique ou préparation grasse",
    composition:"Fleurs d’arnica macérées dans l’alcool ; pour une pommade RP, la préparation peut être incorporée à une base grasse/cireuse.",
    admin:"Application locale sur peau intacte, en friction légère",
    use:"Bleus, bosses, contusions et douleurs superficielles sans plaie ouverte",
    icon:""
  },
  {
    name:"Onguent protecteur",
    category:"Soin local",
    tags:"onguent pommade brûlure peau baume",
    type:"Soin local",
    form:"Pommade / onguent",
    composition:"Base grasse, cireuse ou huileuse ; la composition pouvait varier selon la pharmacie.",
    admin:"Application locale en fine couche",
    use:"Irritations, petites brûlures, protection cutanée",
    icon:""
  },
  {
    name:"Méthode de Silvester",
    category:"Technique",
    tags:"réanimation respiration artificielle inconscient ne respire pas silvester historique",
    type:"Respiration artificielle historique",
    form:"Manœuvre manuelle",
    admin:"Patient sur le dos : élévation des bras puis compression douce du thorax",
    use:"Asphyxie / absence apparente de respiration dans un contexte RP 1889",
    icon:""
  },
  {
    name:"Ammoniaque / sels odorants",
    category:"Stimulant",
    tags:"inconscient malaise réveiller stimulation sels odorants ammoniaque respiration",
    type:"Stimulant d’époque",
    form:"Vapeurs / sels odorants",
    composition:"Préparation libérant des vapeurs ammoniacales irritantes.",
    admin:"Présentés brièvement sous le nez, sans contact direct",
    use:"Tentative de stimulation d’un patient évanoui qui respire encore",
    icon:""
  },
  {
    name:"Carron oil / huile pour brûlures",
    category:"Soin local",
    tags:"brûlure huile carron oil linseed lime water onguent peau",
    type:"Soin historique des brûlures",
    form:"Mélange huileux / lotion",
    composition:"Mélange traditionnel à base d’huile de lin et d’eau de chaux.",
    admin:"Application locale sur la brûlure, puis pansement",
    use:"Soin RP historiquement plausible pour brûlures au XIXe siècle",
    icon:""
  },
  {
    name:"Suture",
    category:"Technique",
    tags:"suture points aiguille fil refermer plaie couture",
    type:"Technique de fermeture de plaie",
    form:"Aiguille courbe ou droite + fil de suture",
    composition:"Matériel : aiguille, fil, pince, ciseaux, compresses et antiseptique.",
    admin:"Rapprocher les bords de la plaie puis poser des points séparés.",
    use:"Plaie propre, suffisamment profonde pour nécessiter une fermeture, sans contre-indication évidente dans la scène.",
    icon:""
  },
  {
    name:"Quinine",
    category:"Fièvre / maladie",
    tags:"fièvre poudre boire oral",
    type:"Médicament contre certaines fièvres",
    form:"Poudre ou sels/cristaux de quinine selon la préparation",
    composition:"Alcaloïde extrait du quinquina, souvent préparé sous forme de sels ou de poudre.",
    admin:"Voie orale, poudre ou sels dissous / mélangés à une préparation",
    use:"Fièvres intermittentes liées au paludisme dans la pratique d'époque, pas toute fièvre.",
    icon:""
  }
];


const equipmentLexicon = [
  {name:"Aiguille et fil de suture", tags:"suture couture fermeture plaie", desc:"Matériel servant à rapprocher et maintenir les bords d'une plaie propre.", use:"Suture simple après nettoyage et contrôle du saignement."},
  {name:"Attelle", tags:"fracture immobiliser membre bois", desc:"Support rigide placé le long d'un membre pour limiter les mouvements.", use:"Fracture ou traumatisme nécessitant une immobilisation."},
  {name:"Bandage", tags:"pansement maintenir compression", desc:"Bande de tissu servant à maintenir une compresse, soutenir un membre ou exercer une pression.", use:"Plaies, contusions, soutien et immobilisation légère."},
  {name:"Compresses / linge propre", tags:"sang plaie compression nettoyer", desc:"Carrés ou morceaux de tissu propres utilisés contre une plaie.", use:"Compression, nettoyage, protection et pansement."},
  {name:"Forceps / pince", tags:"pince balle projectile corps étranger", desc:"Instrument permettant de saisir un objet ou un tissu avec davantage de précision.", use:"Projectile accessible, corps étranger ou manipulation pendant une petite chirurgie RP."},
  {name:"Scalpel / bistouri", tags:"lame incision chirurgie ouvrir", desc:"Petite lame chirurgicale destinée aux incisions précises.", use:"Intervention chirurgicale, drainage ou ouverture contrôlée."},
  {name:"Scie chirurgicale", tags:"amputation os chirurgie lourde", desc:"Instrument de chirurgie lourde destiné à la section de l'os.", use:"Amputation uniquement dans une scène exceptionnelle."},
  {name:"Seringue hypodermique", tags:"injection morphine aiguille", desc:"Seringue équipée d'une aiguille permettant d'injecter un produit sous la peau.", use:"Notamment pour la morphine en solution injectable."},
  {name:"Trépan", tags:"crane trépanation chirurgie", desc:"Instrument destiné à pratiquer une ouverture limitée dans l'os du crâne.", use:"Trépanation exceptionnelle dans la section Chirurgie lourde."}
];

const symptomLexicon = [
  {name:"Confusion", tags:"tête commotion intoxication conscience", desc:"Le patient répond mal, se trompe ou paraît désorienté.", rp:"Faire simple : vérifier respiration, traumatisme crânien, fièvre ou toxique selon le contexte."},
  {name:"Essoufflement", tags:"respiration thorax poumon", desc:"Respiration difficile, rapide ou courte.", rp:"Priorité à la respiration, surtout après blessure thoracique ou noyade."},
  {name:"Pâleur", tags:"hémorragie choc sang faiblesse", desc:"Teint anormalement pâle, souvent accompagné de faiblesse ou de froid.", rp:"Peut renforcer la suspicion d'une perte de sang ou d'un collapsus dans la scène."},
  {name:"Pouls faible", tags:"hémorragie collapsus choc", desc:"Pouls difficile à sentir ou paraissant très faible.", rp:"Signe inquiétant à associer à l'état général, à la pâleur et aux pertes de sang."},
  {name:"Pupilles serrées", tags:"opium morphine intoxication overdose", desc:"Pupilles très petites.", rp:"Dans le manuel, associé à la surdose d'opium ou de morphine avec somnolence et respiration lente."},
  {name:"Rougeur, chaleur, pus", tags:"infection plaie fièvre", desc:"Aspect local pouvant accompagner une plaie infectée.", rp:"Le manuel associe ces signes au drainage, nettoyage et débridement."},
  {name:"Sang craché", tags:"thorax poumon balle respiration", desc:"Présence de sang lorsque le patient tousse ou crache.", rp:"Signe sérieux dans une blessure thoracique."},
  {name:"Somnolence inhabituelle", tags:"tête commotion opium conscience", desc:"Difficulté inhabituelle à rester éveillé.", rp:"À surveiller après traumatisme crânien ou lors d'une intoxication."},
  {name:"Ventre dur", tags:"abdomen balle douleur interne", desc:"Abdomen paraissant anormalement tendu ou rigide.", rp:"Le manuel le cite parmi les signes à rechercher après une balle dans l'abdomen."},
  {name:"Vomissements", tags:"tête abdomen intoxication", desc:"Rejets digestifs après un traumatisme ou une maladie.", rp:"À prendre particulièrement au sérieux après un choc à la tête ou une blessure abdominale."}
];


let lexTab = "meds";
let materialPanelOpen = false;

const interventionMaterials = {
  unknown:["Compresses / linge propre","Bandages","Couverture","Sels odorants si le patient respire"],
  gunshot:["Compresses / linge propre","Bandages","Phénol / acide carbolique dilué","Forceps si projectile accessible","Aiguille et fil de suture si fermeture","Seringue si morphine"],
  knife:["Compresses / linge propre","Bandages","Phénol / acide carbolique dilué","Aiguille et fil de suture si nécessaire","Seringue si morphine"],
  fight:["Compresses","Bandage léger","Préparation à l'arnica sur peau intacte","Antiseptique si coupure"],
  horse:["Compresses","Bandages","Attelle si suspicion de fracture","Arnica si contusion sur peau intacte","Seringue si morphine"],
  fracture:["Attelle","Bandages","Tissu rembourré","Seringue si morphine"],
  minor:["Compresses","Petit bandage","Arnica ou onguent sur peau intacte","Antiseptique si petite plaie"],
  drowning:["Couverture / linge sec","Espace dégagé pour respiration artificielle"],
  head:["Compresses","Bandage","Antiseptique si plaie","Couverture"],
  burn:["Compresses / linge propre","Pansement protecteur","Eau fraîche si disponible","Antalgique selon douleur"],
  poison:["Couverture","Sels odorants si indiqué","Matériel de surveillance et respiration artificielle"]
};

const surgeryMaterials = {
  amputation:["Chloroforme ou éther","Scalpel / bistouri","Scie chirurgicale","Forceps","Fils de ligature","Aiguille et fil de suture","Nombreuses compresses et bandages"],
  major_bleeding:["Nombreuses compresses","Forceps","Fils de ligature","Aiguille et fil de suture","Bandage épais"],
  deep_bullet:["Chloroforme ou éther","Scalpel / bistouri","Forceps","Compresses","Antiseptique","Aiguille et fil de suture"],
  abdominal:["Chloroforme ou éther","Scalpel / bistouri","Forceps","Compresses","Fils de ligature","Aiguille et fil de suture","Pansement large"],
  trepanation:["Chloroforme ou éther","Trépan","Scalpel / bistouri","Forceps","Compresses","Aiguille et fil de suture"],
  infected_wound:["Scalpel / bistouri","Forceps","Compresses","Phénol / acide carbolique dilué","Bandages"]
};

const flows = {
  unknown: {
    title:"Patient inconscient / cause inconnue",
    urgency:"critical",
    steps:[
      {
        title:"Respire-t-il ?",
        do:["Appeler le patient et vérifier s'il réagit.","Observer la poitrine et écouter la respiration.","Regarder immédiatement s'il y a un saignement massif."],
        choices:[
          {label:"Oui, il respire", set:{unknownBreathing:"yes"}},
          {label:"Respiration faible / irrégulière", set:{unknownBreathing:"weak"}},
          {label:"Il ne semble pas respirer", set:{unknownBreathing:"no"}},
          {label:"Impossible à savoir immédiatement", set:{unknownBreathing:"unknown"}}
        ]
      },
      {
        title:"Stabiliser",
        dynamicUnknownBreathing:true
      },
      {
        title:"Y a-t-il un gros saignement ?",
        choices:[
          {label:"Oui, saignement important", set:{unknownBleeding:"major"}},
          {label:"Petit saignement seulement", set:{unknownBleeding:"minor"}},
          {label:"Pas de saignement visible", set:{unknownBleeding:"none"}},
          {label:"Impossible à déterminer", set:{unknownBleeding:"unknown"}}
        ]
      },
      {
        title:"Contrôler ce qui est visible",
        dynamicUnknownBleeding:true
      },
      {
        title:"Le patient revient-il à lui ?",
        choices:[
          {label:"Oui, il se réveille", set:{unknownWake:"awake"}},
          {label:"Il reste confus", set:{unknownWake:"confused"}},
          {label:"Il reste inconscient", set:{unknownWake:"unconscious"}},
          {label:"Impossible à évaluer", set:{unknownWake:"unknown"}}
        ]
      },
      {
        title:"Chercher la cause",
        dynamicUnknownCause:true
      }
    ]
  },

  gunshot: {
    title:"Blessure par balle",
    urgency:"serious",
    steps:[
      {
        title:"État du patient",
        do:["Vérifier s’il répond.","Observer la respiration.","Repérer un saignement majeur avant toute discussion."],
        say:["« Vous m’entendez ? »","« Ouvrez les yeux si vous m’entendez. »"],
        choices:[
          {label:"Conscient", set:{conscious:"awake"}},
          {label:"Confus / répond mal", set:{conscious:"confused"}},
          {label:"Inconscient mais respire", set:{conscious:"unconscious_breathing"}},
          {label:"Inconscient et ne semble pas respirer", set:{conscious:"not_breathing"}},
          {label:"Impossible à déterminer pour l’instant", set:{conscious:"unknown"}}
        ]
      },
      {
        title:"Stabiliser / réanimer si besoin",
        dynamicConscious:true
      },
      {
        title:"Où est la blessure ?",
        choices:[
          {label:"Bras / épaule", set:{gunArea:"arm"}},
          {label:"Jambe", set:{gunArea:"leg"}},
          {label:"Thorax / poitrine", set:{gunArea:"chest"}},
          {label:"Abdomen", set:{gunArea:"abdomen"}},
          {label:"Tête / cou", set:{gunArea:"head"}},
          {label:"Impossible à déterminer", set:{gunArea:"unknown"}}
        ]
      },
      {
        title:"Priorité selon la zone",
        dynamicGunArea:true
      },
      {
        title:"Contrôler le saignement",
        do:["Dégager les vêtements autour de la blessure.","Comprimer avec un linge ou une compresse propre.","Maintenir la pression et surveiller la pâleur."],
        say:["« Ne bougez pas, je vais comprimer la plaie. »","« Continuez de me parler si vous pouvez. »","« Dites-moi si vous vous sentez faible ou étourdi. »"],
        material:["Compresses","Linge propre","Bandage"]
      },
      {
        title:"Examiner la plaie",
        do:["Observer les zones atteintes : simple éraflure ou plaie pénétrante ?","Si la plaie est pénétrante, rechercher une entrée et une sortie sans sonder.","Ne pas conclure à une atteinte superficielle sur la seule taille de la plaie."],
        say:["« Je vérifie si le projectile a seulement effleuré la peau ou pénétré. »","« Dites-moi où vous avez mal. »","« Ne bougez pas pendant que j’examine la plaie. »"],
        choices:[
          {label:"Éraflure par balle, atteinte superficielle constatée", set:{bullet:"graze",needsSuture:false}},
          {label:"La balle est ressortie", set:{bullet:"out"}},
          {label:"La balle semble encore présente", set:{bullet:"in"}},
          {label:"Impossible à déterminer", set:{bullet:"unknown"}},
          {label:"Je n’ai pas encore pu vérifier", set:{bullet:"unchecked"}}
        ]
      },
      {
        title:"Soulager la douleur",
        do:["Choisir un antalgique seulement si la scène le justifie (laudanum, liquide oral en gouttes ; ou morphine, solution injectable hypodermique, selon l’intensité).","Surveiller le patient après administration."],
        say:["« Je vais vous donner quelque chose pour calmer la douleur. »","« Dites-moi si ça devient plus supportable. »","« Restez tranquille le temps que ça agisse. »"],
        med:[
          ["Morphine","Sel de morphine dissous en solution injectable","Injection hypodermique avec seringue","Douleur importante"],
          ["Laudanum","Liquide opiacé (teinture d’opium)","Voie orale, en gouttes ou petite quantité diluée","Douleur modérée à forte"]
        ]
      },
      {
        title:"Traiter la blessure",
        dynamic:true
      },
      {
        title:"La plaie peut-elle être suturée ?",
        choices:[
          {label:"Oui, plaie propre et nette", set:{needsSuture:true}},
          {label:"Non, petite plaie / fermeture inutile", set:{needsSuture:false}},
          {label:"Plaie sale, irrégulière ou trop profonde", set:{needsSuture:"avoid"}}
        ]
      },
      {
        title:"Suture / fermeture",
        dynamicSuture:true
      },
      {
        title:"Pansement",
        do:["Nettoyer autour de la zone.","Poser une compresse propre.","Maintenir avec un bandage sans trop serrer."],
        say:["« Je vais protéger la plaie maintenant. »"],
        material:["Compresses","Bandage"]
      },
      {
        title:"Consignes de fin",
        do:["Mettre le membre au repos si nécessaire.","Conseiller de garder le pansement propre.","Prévoir une surveillance de la fièvre et de la douleur."],
        say:["« Gardez cette zone au repos. »","« Si la fièvre monte ou si la douleur augmente, revenez me voir. »","« Ne retirez pas le pansement inutilement. »"]
      }
    ]
  },

  knife: {
    title:"Blessure au couteau",
    urgency:"serious",
    steps:[
      {
        title:"État du patient",
        do:["Vérifier s’il répond.","Observer respiration et saignement.","Ne pas attendre d’avoir toutes les informations si le patient est inconscient."],
        choices:[
          {label:"Conscient", set:{conscious:"awake"}},
          {label:"Confus / répond mal", set:{conscious:"confused"}},
          {label:"Inconscient mais respire", set:{conscious:"unconscious_breathing"}},
          {label:"Inconscient et ne semble pas respirer", set:{conscious:"not_breathing"}},
          {label:"Impossible à déterminer pour l’instant", set:{conscious:"unknown"}}
        ]
      },
      {
        title:"Stabiliser / réanimer si besoin",
        dynamicConscious:true
      },
      {
        title:"Où est la plaie ?",
        choices:[
          {label:"Bras / jambe", set:{knifeArea:"limb"}},
          {label:"Thorax / poitrine", set:{knifeArea:"chest"}},
          {label:"Abdomen", set:{knifeArea:"abdomen"}},
          {label:"Dos", set:{knifeArea:"back"}},
          {label:"Impossible à déterminer", set:{knifeArea:"unknown"}}
        ]
      },
      {
        title:"Évaluer la plaie",
        do:["Observer la profondeur et le saignement.","Vérifier si la respiration ou les mouvements aggravent fortement la douleur."],
        say:["« Où avez-vous le plus mal ? »","« Je vais regarder la blessure. »"],
        choices:[
          {label:"Plaie superficielle / membre", set:{knifeSeverity:"simple"}},
          {label:"Plaie profonde / thorax / abdomen", set:{knifeSeverity:"deep"}},
          {label:"Impossible à évaluer", set:{knifeSeverity:"unknown"}}
        ]
      },
      {
        title:"Contrôler le saignement",
        do:["Comprimer avec un linge propre.","Maintenir une pression constante.","Éviter de manipuler inutilement une plaie profonde."],
        say:["« Je vais comprimer, ça risque d’être douloureux. »"],
        material:["Compresses","Bandage","Linge propre"]
      },
      {
        title:"Nettoyer",
        do:["Nettoyer autour de la plaie.","Retirer uniquement les saletés facilement accessibles.","Préparer la zone pour la fermeture si nécessaire."],
        say:["« Je nettoie avant de refermer. »"]
      },
      {
        title:"Soulager",
        med:[
          ["Laudanum","Liquide opiacé","À boire / gouttes par voie orale","Douleur"],
          ["Morphine","Sel de morphine dissous en solution injectable","Injection hypodermique avec seringue","Douleur importante"]
        ],
        say:["« Je vais calmer la douleur avant de continuer. »"]
      },
      {
        title:"La plaie peut-elle être suturée ?",
        choices:[
          {label:"Oui, plaie propre et nette", set:{needsSuture:true}},
          {label:"Non, petite plaie / fermeture inutile", set:{needsSuture:false}},
          {label:"Plaie profonde, sale ou irrégulière", set:{needsSuture:"avoid"}}
        ]
      },
      {
        title:"Suture / fermeture",
        dynamicSuture:true
      },
      {
        title:"Pansement et repos",
        do:["Poser une compresse propre.","Maintenir avec un bandage.","Prévoir du repos et une surveillance."],
        say:["« Gardez ce pansement propre et sec. »"]
      }
    ]
  },

  fight: {
    title:"Bagarre / coups",
    urgency:"light",
    steps:[
      {
        title:"État du patient",
        do:["Vérifier s’il répond.","Regarder la respiration et les saignements visibles."],
        choices:[
          {label:"Conscient", set:{conscious:"awake"}},
          {label:"Confus / répond mal", set:{conscious:"confused"}},
          {label:"Inconscient mais respire", set:{conscious:"unconscious_breathing"}},
          {label:"Inconscient et ne semble pas respirer", set:{conscious:"not_breathing"}},
          {label:"Impossible à déterminer pour l’instant", set:{conscious:"unknown"}}
        ]
      },
      {
        title:"Stabiliser si nécessaire",
        dynamicConscious:true
      },
      {
        title:"Qu'est-ce qui gêne le plus ?",
        choices:[
          {label:"Bleu / bosse / douleur légère", set:{fightIssue:"bruise"}},
          {label:"Petite coupure / éraflure", set:{fightIssue:"cut"}},
          {label:"Articulation déformée / luxation possible", set:{fightIssue:"dislocation"}},
          {label:"Douleur aux côtes", set:{fightIssue:"ribs"}},
          {label:"Mal à la tête / étourdissement", set:{fightIssue:"head"}},
          {label:"Douleur diffuse sans blessure visible", set:{fightIssue:"general"}},
          {label:"Impossible à savoir", set:{fightIssue:"unknown"}}
        ]
      },
      {
        title:"Soins adaptés",
        dynamicFightCare:true
      },
      {
        title:"Vérification finale",
        do:["Vérifier que le patient est bien conscient.","Demander si la douleur augmente ou diminue.","Conseiller repos et retour si de nouveaux symptômes apparaissent."],
        say:["« Reposez-vous pendant que nous faisons le point sur votre état. »","« Si la douleur augmente ou si vous vous sentez étourdi, prévenez-moi. »"]
      }
    ]
  },

  horse: {
    title:"Chute de cheval",
    urgency:"light",
    steps:[
      {
        title:"État du patient",
        do:["Vérifier s’il répond.","Observer sa respiration.","Regarder rapidement s’il y a un saignement important."],
        choices:[
          {label:"Conscient", set:{conscious:"awake"}},
          {label:"Confus / répond mal", set:{conscious:"confused"}},
          {label:"Inconscient mais respire", set:{conscious:"unconscious_breathing"}},
          {label:"Inconscient et ne semble pas respirer", set:{conscious:"not_breathing"}},
          {label:"Impossible à déterminer pour l’instant", set:{conscious:"unknown"}}
        ]
      },
      {
        title:"Stabiliser si nécessaire",
        dynamicConscious:true
      },
      {
        title:"Où a-t-il mal ?",
        say:["« Dites-moi où vous avez le plus mal. »"],
        choices:[
          {label:"Bras / épaule", set:{horseArea:"arm"}},
          {label:"Jambe / cheville", set:{horseArea:"leg"}},
          {label:"Dos / nuque", set:{horseArea:"back"}},
          {label:"Côtes / poitrine", set:{horseArea:"ribs"}},
          {label:"Tête", set:{horseArea:"head"}},
          {label:"Douleurs un peu partout", set:{horseArea:"general"}},
          {label:"Presque aucune douleur", set:{horseArea:"none"}}
        ]
      },
      {
        title:"Quelle intensité ?",
        choices:[
          {label:"Légère - gênante mais supportable", set:{horsePain:"mild"}},
          {label:"Modérée - mouvements douloureux", set:{horsePain:"moderate"}},
          {label:"Forte - difficile de bouger", set:{horsePain:"severe"}}
        ]
      },
      {
        title:"Que vois-tu ?",
        choices:[
          {label:"Rien de particulier / simple douleur", set:{horseVisible:"none"}},
          {label:"Bleu / bosse / contusion", set:{horseVisible:"bruise"}},
          {label:"Petite éraflure / coupure", set:{horseVisible:"wound"}},
          {label:"Gonflement important", set:{horseVisible:"swelling"}},
          {label:"Membre déformé / position anormale", set:{horseVisible:"deformity"}},
          {label:"Articulation déformée / luxation possible", set:{horseVisible:"dislocation"}}
        ]
      },
      {
        title:"Peut-il bouger ?",
        dynamicMovementQuestion:true
      },
      {
        title:"Soins adaptés",
        dynamicHorseCare:true
      },
      {
        title:"Antidouleur si nécessaire",
        dynamicHorsePain:true
      },
      {
        title:"Contrôle avant de le laisser repartir",
        dynamicHorseFinish:true
      }
    ]
  },

  fracture: {
    title:"Fracture / luxation",
    urgency:"serious",
    steps:[
      {
        title:"État du patient",
        do:["Vérifier conscience et respiration.","Si le patient ne répond pas, commencer par le stabiliser."],
        choices:[
          {label:"Conscient", set:{conscious:"awake"}},
          {label:"Confus / répond mal", set:{conscious:"confused"}},
          {label:"Inconscient mais respire", set:{conscious:"unconscious_breathing"}},
          {label:"Inconscient et ne semble pas respirer", set:{conscious:"not_breathing"}},
          {label:"Impossible à déterminer pour l’instant", set:{conscious:"unknown"}}
        ]
      },
      {
        title:"Stabiliser / réanimer si besoin",
        dynamicConscious:true
      },
      {
        title:"Niveau de douleur",
        choices:[
          {label:"Légère", set:{fracturePain:"mild"}},
          {label:"Modérée", set:{fracturePain:"moderate"}},
          {label:"Forte", set:{fracturePain:"severe"}},
          {label:"Impossible à évaluer", set:{fracturePain:"unknown"}}
        ]
      },
      {
        title:"Examiner le membre",
        do:["Observer déformation, gonflement et douleur.","Vérifier sensation et mouvement des doigts ou orteils."],
        say:["« Essayez de bouger doucement vos doigts. »","« Vous sentez ma main ici ? »"]
      },
      {
        title:"Immobiliser",
        do:["Maintenir le membre dans une position stable.","Poser une attelle rembourrée.","Bandage sans serrer excessivement."],
        say:["« Je vais immobiliser le membre. »"],
        material:["Attelle","Bandages","Tissu rembourré"]
      },
      {
        title:"Soulager la douleur",
        med:[
          ["Morphine","Sel de morphine dissous en solution injectable","Injection hypodermique avec seringue","Douleur importante"],
          ["Laudanum","Liquide opiacé, teinture d’opium","Voie orale, en gouttes, seulement si le patient est conscient et peut avaler","Douleur modérée"]
        ]
      },
      {
        title:"Consignes",
        do:["Éviter l’appui sur le membre.","Surveiller couleur, chaleur et sensibilité des extrémités.","Prévoir du repos."],
        say:["« Ne prenez pas appui dessus. »","« Si vos doigts deviennent froids ou insensibles, prévenez-moi. »"]
      }
    ]
  },

  minor: {
    title:"Petit bobo / soin léger",
    urgency:"light",
    steps:[
      {
        title:"Regarder la zone",
        do:["Vérifier qu’il ne s’agit pas d’une plaie profonde.","Nettoyer doucement si la peau est éraflée."],
        say:["« Rien de très grave, je vais nettoyer ça. »"]
      },
      {
        title:"Appliquer un soin",
        do:["Sur peau intacte ou peu irritée, appliquer une petite quantité de baume ou d’onguent.","Éviter les produits gras directement dans une plaie ouverte."],
        med:[
          ["Préparation à l’arnica","Teinture alcoolique ou pommade","Application locale sur peau intacte","Bosse, bleu, contusion légère"],
          ["Onguent protecteur","Pommade","Application locale","Petite irritation ou peau échauffée"]
          ,["Onguent à l'oxyde de zinc","Pommade blanche dans une base grasse","Application externe sur peau intacte irritée","Alternative protectrice pour les frottements ; pas pour une plaie profonde"]
        ],
        say:["« Je vais mettre un peu de préparation à l’arnica, ça devrait vous soulager. »"]
      },
      {
        title:"Faut-il refermer ?",
        choices:[
          {label:"Non, éraflure ou petite coupure", set:{needsSuture:false}},
          {label:"Oui, petite plaie nette mais ouverte", set:{needsSuture:true}}
        ]
      },
      {
        title:"Suture / fermeture",
        dynamicSuture:true
      },
      {
        title:"Fin",
        do:["Laisser la zone propre.","Mettre un petit bandage si nécessaire.","Revenir si la douleur ou le gonflement augmente."],
        say:["« Gardez ça propre et évitez de trop y toucher. »"]
      }
    ]
  },

  drowning: {
    title:"Noyade / asphyxie",
    urgency:"critical",
    steps:[
      {
        title:"Sortir du danger",
        do:["Mettre le patient hors de l’eau, de la fumée ou de la source d’asphyxie.","L’allonger et dégager le cou et la poitrine.","Vérifier immédiatement s’il respire."],
        choices:[
          {label:"Il respire", set:{breathing:"yes"}},
          {label:"Respiration faible / irrégulière", set:{breathing:"weak"}},
          {label:"Il ne semble pas respirer", set:{breathing:"no"}}
        ]
      },
      {
        title:"Faire reprendre la respiration",
        dynamicBreathing:true
      },
      {
        title:"Réchauffer et surveiller",
        do:["Retirer les vêtements trempés si possible.","Sécher et couvrir le patient.","Le garder allongé et au chaud.","Surveiller respiration et état de conscience."],
        say:["« Restez allongé. On va vous réchauffer. »","« Respirez doucement et ne cherchez pas à vous relever. »"]
      },
      {
        title:"Après le réveil",
        do:["Faire parler le patient seulement lorsqu’il est assez conscient.","Vérifier douleur thoracique, toux, confusion et faiblesse.","Le laisser récupérer avant tout déplacement."],
        say:["« Vous m’entendez bien ? Dites-moi votre nom. »","« Est-ce que votre poitrine vous fait mal quand vous respirez ? »"]
      }
    ]
  },

  head: {
    title:"Traumatisme crânien",
    urgency:"serious",
    steps:[
      {
        title:"État de conscience",
        do:["Ne pas relever le patient immédiatement.","Vérifier respiration et saignement visible.","Observer s’il répond normalement."],
        choices:[
          {label:"Conscient et cohérent", set:{headState:"awake"}},
          {label:"Confus / étourdi", set:{headState:"confused"}},
          {label:"Inconscient mais respire", set:{headState:"unconscious"}},
          {label:"Ne semble pas respirer", set:{headState:"not_breathing"}}
        ]
      },
      {
        title:"Stabiliser",
        dynamicHead:true
      },
      {
        title:"Examiner la tête",
        do:["Chercher bosse, coupure ou saignement.","Demander où se situe la douleur si le patient peut répondre.","Éviter de manipuler inutilement le cou après une grosse chute."],
        say:["« Ne tournez pas la tête pour le moment. »","« Vous voyez trouble ? Vous avez envie de vomir ? »"]
      },
      {
        title:"Surveiller la commotion",
        do:["Surveiller confusion, vomissements, somnolence inhabituelle et aggravation de la douleur.","Garder le patient au repos.","Reposer régulièrement des questions simples."],
        say:["« Comment vous appelez-vous ? »","« Vous vous souvenez de ce qui s’est passé ? »"]
      },
      {
        title:"Petit soin local",
        do:["Nettoyer une coupure superficielle.","Poser un pansement si nécessaire.","Pour une bosse sans plaie ouverte, utiliser un soin local léger si souhaité en RP."],
        med:[
          ["Baume apaisant","Baume / pommade","Application locale sur peau intacte","Bosse ou contusion légère"]
        ]
      }
    ]
  },

  burn: {
    title:"Brûlure",
    urgency:"serious",
    steps:[
      {
        title:"Éloigner la source",
        do:["Éloigner le patient du feu, de la vapeur ou de la source chaude.","Retirer délicatement ce qui n’est pas collé à la peau.","Observer l’étendue de la brûlure."],
        choices:[
          {label:"Petite brûlure localisée", set:{burnSeverity:"minor"}},
          {label:"Brûlure étendue / cloques importantes", set:{burnSeverity:"major"}},
          {label:"Visage / fumée inhalée", set:{burnSeverity:"airway"}},
          {label:"Impossible à évaluer", set:{burnSeverity:"unknown"}}
        ]
      },
      {
        title:"Premiers soins",
        dynamicBurn:true
      },
      {
        title:"Protéger la zone",
        do:["Couvrir avec un linge ou pansement propre.","Éviter de percer volontairement les cloques.","Garder le patient au repos."],
        say:["« Je vais couvrir la brûlure pour la protéger. »"]
      },
      {
        title:"Soulager",
        med:[
          ["Laudanum","Liquide opiacé","À boire / gouttes par voie orale","Douleur"],
          ["Morphine","Solution injectable","Injection hypodermique","Douleur très importante"],
          ["Carron oil / huile pour brûlures","Mélange huileux historique","Application locale puis pansement","Option de soin historique XIXe siècle"]
        ],
        say:["« Je vais vous donner quelque chose contre la douleur. »"]
      },
      {
        title:"Surveillance",
        do:["Surveiller fièvre, faiblesse, aggravation de la douleur et aspect de la peau.","Pour une brûlure importante, prévoir repos et surveillance prolongée."],
        say:["« Si la douleur augmente ou si vous vous sentez fiévreux, revenez immédiatement. »"]
      }
    ]
  },

  poison: {
    title:"Intoxication / opiacés",
    urgency:"critical",
    steps:[
      {
        title:"État du patient",
        do:["Chercher ce qui a été pris si quelqu’un le sait.","Vérifier respiration et état de conscience.","Ne pas attendre une réponse du patient s’il est trop somnolent."],
        choices:[
          {label:"Conscient mais très somnolent", set:{poisonState:"sleepy"}},
          {label:"Inconscient mais respire", set:{poisonState:"unconscious"}},
          {label:"Respiration très faible / absente", set:{poisonState:"not_breathing"}}
        ]
      },
      {
        title:"Maintenir éveillé / respirer",
        dynamicPoison:true
      },
      {
        title:"Identifier le produit",
        do:["Chercher une fiole, ordonnance ou témoignage.","Demander laudanum, opium, morphine ou autre produit si le patient peut répondre.","Estimer grossièrement quand le produit a été pris."],
        say:["« Qu’avez-vous pris ? »","« Combien ? Et depuis combien de temps ? »"]
      },
      {
        title:"Soutenir la respiration",
        do:["Continuer à surveiller constamment la respiration.","Stimuler le patient seulement s'il respire encore.","Le manuel de 1889 ne donne pas d'antidote spécifique : la priorité reste le soutien respiratoire."],
        med:[
          ["Sels odorants / ammoniaque","Vapeurs / sels","Présentés brièvement sous le nez","Stimulation si le patient respire encore"]
        ],
        say:["« Restez éveillé. Continuez de me regarder. »","« Je vais soutenir votre respiration et vous garder sous surveillance. »"]
      },
      {
        title:"Surveillance prolongée",
        do:["Ne pas laisser le patient seul.","Surveiller continuellement respiration et niveau de conscience.","Garder le patient au chaud et au repos."],
        say:["« Vous restez ici sous surveillance. Ne vous rendormez pas pour le moment. »"]
      }
    ]
  }
};

const surgeries = {
  amputation:{
    title:"Amputation",
    duration:"4 à 7 min RP",
    intro:"Dernier recours lorsque le membre est considéré comme irrécupérable dans la scène.",
    steps:[
      {
        title:"Confirmer la décision",
        do:["Vérifier qu'une solution plus simple n'est plus crédible.","Préparer assistants, pansements et matériel.","Informer le patient s'il est conscient."],
        say:["« Je n'ai plus de moyen raisonnable de sauver ce membre. »","« Je vais devoir l'enlever pour vous donner une chance. »"]
      },
      {
        title:"Préparer et anesthésier",
        do:["Installer le patient.","Préparer le matériel et de nombreux linges propres.","Mettre en place une anesthésie adaptée à la scène."],
        say:["« Je vais vous endormir avant de commencer. »","« Respirez calmement, je vous surveille. »"],
        meds:[
          ["Chloroforme","Liquide volatil","Voie inhalée, sur linge ou compresse","Anesthésie générale historique"],
          ["Éther","Liquide volatil","Voie inhalée","Alternative anesthésique"]
        ]
      },
      {
        title:"Opérer",
        do:["Jouer l'acte de manière descriptive et brève.","Faire comprendre que le chirurgien travaille vite.","Prévoir un assistant chargé du contrôle du saignement."],
        say:["« Tenez-le bien. Je commence. »","« Gardez la pression ici pendant que je travaille. »"]
      },
      {
        title:"Contrôler le saignement",
        do:["Décrire la ligature ou le contrôle des vaisseaux importants.","Vérifier que le saignement ralentit nettement.","Maintenir le patient au chaud."],
        say:["« Continuez à maintenir ici. Je vérifie si le saignement ralentit. »","« Encore un instant, je termine les gestes prévus. »"]
      },
      {
        title:"Fermer et panser",
        do:["Refermer de façon plausible en RP.","Poser un pansement épais.","Prévoir surveillance prolongée."],
        say:["« C'est terminé. Je vais maintenant fermer et protéger la plaie. »","« Gardez-le au chaud et surveillez sa respiration. »"]
      }
    ]
  },

  major_bleeding:{
    title:"Hémorragie majeure",
    duration:"4 à 7 min RP",
    intro:"Quand une compression simple ne suffit pas et qu'un vaisseau important semble atteint.",
    steps:[
      {
        title:"Stabiliser",
        do:["Allonger le patient.","Comprimer fortement la zone.","Préparer plusieurs compresses et assistants si disponibles."],
        say:["« Ne relâchez pas la pression. »","« Restez avec moi, regardez-moi. »"]
      },
      {
        title:"Soulager si possible",
        do:["Évaluer l'état de conscience avant tout produit oral.","Préparer un antalgique si la scène le permet."],
        say:["« Je vais essayer de calmer la douleur pendant que je travaille. »"],
        meds:[
          ["Morphine","Solution injectable","Injection hypodermique","Douleur forte"],
          ["Laudanum","Liquide opiacé","Voie orale en gouttes, uniquement si le patient peut avaler","Douleur modérée"]
        ]
      },
      {
        title:"Identifier le point de saignement",
        do:["Écarter suffisamment les tissus dans la scène pour repérer l'origine.","Éviter de fouiller inutilement.","Préparer une ligature si un vaisseau est clairement identifié."],
        say:["« Je cherche d'où vient exactement le saignement. »","« Tenez cette compresse ici, sans bouger. »"]
      },
      {
        title:"Ligaturer",
        do:["Décrire la pose d'une ligature autour du vaisseau atteint.","Vérifier que le saignement diminue.","Nettoyer ensuite la zone."],
        say:["« Si le vaisseau est repéré, je prépare la ligature. »","« Je vérifie si le saignement diminue après ce geste. »"]
      },
      {
        title:"Fermer et surveiller",
        do:["Refermer si la plaie s'y prête.","Poser un pansement épais.","Surveiller pâleur, respiration et reprise de conscience."],
        say:["« Je revérifie le saignement avant de décider de la fermeture. »","« Vous allez rester au repos sous surveillance. »"]
      }
    ]
  },

  deep_bullet:{
    title:"Projectile profondément logé",
    duration:"4 à 7 min RP",
    intro:"Quand la balle n'est pas accessible par une extraction simple mais que la scène justifie une exploration.",
    steps:[
      {
        title:"Évaluer le risque",
        do:["Repérer la zone touchée.","Vérifier respiration, circulation et état de conscience.","Décider si l'exploration est crédible ou trop dangereuse."],
        say:["« La balle est trop profonde pour être retirée simplement. »","« Je vais devoir explorer un peu plus la plaie. »"]
      },
      {
        title:"Anesthésier",
        do:["Préparer le patient et le matériel.","Choisir une anesthésie adaptée à la scène."],
        say:["« Je vais vous endormir avant d'aller plus loin. »","« Respirez doucement. »"],
        meds:[
          ["Chloroforme","Liquide volatil","Voie inhalée","Anesthésie générale historique"],
          ["Éther","Liquide volatil","Voie inhalée","Alternative anesthésique"]
        ]
      },
      {
        title:"Explorer",
        do:["Décrire une ouverture limitée et prudente.","Rechercher le projectile sans transformer la scène en cours de chirurgie détaillé.","Arrêter si la trajectoire paraît trop dangereuse."],
        say:["« Je cherche le projectile. »","« Encore un instant, je travaille doucement. »"]
      },
      {
        title:"Extraire si accessible",
        do:["Saisir le projectile avec une pince si la scène le permet.","Retirer doucement.","Vérifier le saignement après extraction."],
        say:["« Si elle est accessible, je prépare son retrait. »","« Je vérifie ce qui a pu être retiré avant de poursuivre. »"]
      },
      {
        title:"Nettoyer, suturer, panser",
        do:["Nettoyer la zone.","Suturer si la plaie est adaptée.","Poser un pansement propre."],
        say:["« Je vais nettoyer puis refermer. »","« Encore quelques points et ce sera terminé. »"]
      }
    ]
  },

  abdominal:{
    title:"Plaie abdominale grave",
    duration:"4 à 7 min RP",
    intro:"Scène exceptionnelle pour une blessure profonde de l'abdomen avec suspicion d'atteinte interne.",
    steps:[
      {
        title:"Stabiliser",
        do:["Allonger le patient.","Contrôler les saignements externes.","Éviter de faire boire si une opération est probable."],
        say:["« Ne bougez plus. La blessure est sérieuse. »","« Je vais devoir vous opérer. »"]
      },
      {
        title:"Anesthésier",
        do:["Préparer le patient et le matériel.","Mettre en place une anesthésie générale RP."],
        say:["« Je vais vous endormir avant de commencer. »","« Respirez lentement. »"],
        meds:[
          ["Chloroforme","Liquide volatil","Voie inhalée","Anesthésie générale historique"],
          ["Éther","Liquide volatil","Voie inhalée","Alternative anesthésique"]
        ]
      },
      {
        title:"Explorer",
        do:["Jouer une ouverture abdominale brève et descriptive.","Chercher la source du saignement ou une lésion évidente.","Éviter les détails anatomiques trop techniques."],
        say:["« J'ouvre maintenant. Gardez les compresses prêtes. »","« Je cherche la source du saignement. »"]
      },
      {
        title:"Traiter la lésion",
        do:["Décrire la réparation ou la ligature de la zone atteinte.","Contrôler le saignement.","Nettoyer avant fermeture."],
        say:["« Je recherche la lésion qui peut être traitée dans cette scène. »","« Je vérifie si le saignement diminue après le geste. »"]
      },
      {
        title:"Fermer",
        do:["Refermer l'abdomen en plusieurs temps de manière RP simplifiée.","Poser un pansement large.","Prévoir surveillance stricte."],
        say:["« Je vais refermer maintenant. »","« L'opération est terminée, il va falloir le surveiller de près. »"]
      }
    ]
  },

  trepanation:{
    title:"Trépanation",
    duration:"4 à 7 min RP",
    intro:"Très rare. À réserver à un traumatisme crânien grave dans une scène exceptionnelle.",
    steps:[
      {
        title:"Confirmer la gravité",
        do:["Vérifier perte de connaissance, confusion persistante ou aggravation.","S'assurer que la scène justifie un geste aussi lourd.","Préparer assistants et matériel."],
        say:["« Son état se dégrade. Je vais devoir intervenir sur le crâne. »","« Préparez le matériel et gardez-le immobile. »"]
      },
      {
        title:"Anesthésier",
        do:["Installer le patient.","Mettre en place une anesthésie générale RP."],
        say:["« Je vais l'endormir avant de commencer. »","« Surveillez sa respiration. »"],
        meds:[
          ["Chloroforme","Liquide volatil","Voie inhalée","Anesthésie générale historique"],
          ["Éther","Liquide volatil","Voie inhalée","Alternative anesthésique"]
        ]
      },
      {
        title:"Accéder à la zone",
        do:["Décrire la préparation du cuir chevelu.","Ouvrir la zone de manière brève et RP.","Repérer la partie du crâne concernée."],
        say:["« J'accède à la zone maintenant. »","« Gardez les compresses prêtes. »"]
      },
      {
        title:"Décomprimer",
        do:["Décrire l'utilisation d'un trépan sans détailler une technique réelle.","Faire comprendre qu'une petite ouverture osseuse est réalisée.","Surveiller le saignement et l'état du patient."],
        say:["« Je commence la décompression. »","« Encore un instant, la pression devrait diminuer. »"]
      },
      {
        title:"Refermer et surveiller",
        do:["Refermer le cuir chevelu.","Poser un pansement.","Prévoir une surveillance neurologique prolongée."],
        say:["« Je vais refermer maintenant. »","« Il faudra le surveiller toute la nuit. »"]
      }
    ]
  },

  infected_wound:{
    title:"Plaie gravement infectée",
    duration:"4 à 7 min RP",
    intro:"Pour une plaie profonde très infectée avec tissus abîmés, pus ou mauvaise odeur.",
    steps:[
      {
        title:"Examiner",
        do:["Observer rougeur, gonflement, écoulement et tissus abîmés.","Vérifier fièvre et état général.","Décider si un nettoyage chirurgical est nécessaire."],
        say:["« La plaie est sérieusement infectée. »","« Je vais devoir nettoyer bien plus profondément. »"]
      },
      {
        title:"Soulager",
        do:["Préparer le patient.","Choisir un antalgique selon la scène."],
        say:["« Je vais calmer la douleur avant de commencer. »"],
        meds:[
          ["Morphine","Sel de morphine en solution injectable","Injection hypodermique avec seringue","Douleur importante"],
          ["Laudanum","Liquide opiacé","Voie orale en gouttes si le patient peut avaler","Douleur modérée"]
        ]
      },
      {
        title:"Nettoyer chirurgicalement",
        do:["Décrire le retrait des tissus manifestement morts ou souillés.","Laisser s'écouler les sécrétions.","Nettoyer abondamment avec du phénol / acide carbolique dilué (solution antiseptique liquide, application locale)."],
        say:["« Je retire ce qui est trop abîmé pour cicatriser. »","« Je vais nettoyer toute l'infection visible. »"],
        meds:[
          ["Phénol / acide carbolique","Solution antiseptique liquide diluée","Application locale","Antisepsie"]
        ]
      },
      {
        title:"Laisser drainer",
        do:["Éviter de fermer hermétiquement une plaie encore infectée.","Poser des compresses propres.","Prévoir changement régulier du pansement."],
        meds:[["Iodoforme","Gaze préparée à l'iodoforme","Pansement externe dans la scène chirurgicale","Variante historique après nettoyage ; ne remplace pas la surveillance"]],
        say:["« Je ne vais pas refermer complètement. Il faut que la plaie puisse se drainer. »","« On changera le pansement régulièrement. »"]
      },
      {
        title:"Surveiller",
        do:["Surveiller fièvre, douleur, odeur et extension de la rougeur.","Garder le patient au repos.","Prévoir une nouvelle inspection."],
        say:["« Je veux revoir cette plaie rapidement. »","« Si la fièvre monte, vous revenez immédiatement. »"]
      }
    ]
  }
};
