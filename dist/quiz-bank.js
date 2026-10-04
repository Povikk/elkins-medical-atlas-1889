// Questions documentaires issues des fiches de l'Atlas, pas un examen médical.
// Ajouter une situation : [question, bonne réponse, trois distracteurs, explication].
const quizSituations = [
 ['Un inconscient est découvert au bord du chemin. La cause est inconnue. Que regarder en premier ?', 'Respiration et saignement majeur', ['Son métier et son adresse','Le médicament à prescrire','La couleur de ses vêtements'], 'Le parcours cause inconnue commence par les signes prioritaires. L’histoire vient ensuite.'],
 ['Le patient inconscient ne peut pas raconter sa chute. Comment continuer le jeu ?', 'Observer et choisir les informations encore inconnues', ['Inventer ses réponses','Exiger son récit avant de poursuivre','Choisir conscient pour débloquer le parcours'], 'Le médecin peut avancer avec des observations et des choix « impossible à déterminer ».'],
 ['Une personne ne peut pas avaler. Quel repère appliquer au laudanum ?', 'Ne pas proposer la voie orale dans cet état', ['Le faire boire malgré tout','Le présenter comme un pansement','Le confondre avec une attelle'], 'La fiche réserve la voie orale à un patient conscient capable d’avaler.'],
 ['Après un opiacé, la respiration devient difficile. Quelle réaction RP est cohérente ?', 'Réévaluer et chercher du renfort', ['Rassurer en disant que tout est normal','Annoncer une guérison','Ignorer le changement pour finir le dialogue'], 'La dépression respiratoire figure parmi les dangers des opiacés. Un effet inquiétant ne se banalise pas.'],
 ['Une contusion est visible, mais la peau est intacte. Quel produit local correspond à ce repère de l’Atlas ?', 'Arnica', ['Laudanum en pansement','Morphine en friction','Scie chirurgicale'], 'L’arnica est présentée pour un usage externe sur peau intacte, pas dans une plaie.'],
 ['Une plaie est ouverte. Quelle limite retenir pour l’arnica ?', 'Ne pas l’appliquer dans la plaie', ['C’est un fil de suture','Elle remplace l’examen','Elle ferme toute plaie'], 'La fiche distingue le soin d’une contusion et celui d’une plaie ouverte.'],
 ['Le joueur dit que la balle est ressortie. Que retenir ?', 'Noter le fait sans annoncer que la blessure est bénigne', ['Toute surveillance devient inutile','Une extraction reste forcément nécessaire','Il n’y a pas de plaie de sortie possible'], 'Projectile sorti ne signifie pas absence de lésion, de saignement ou de complication.'],
 ['Une balle serait profondément logée et inaccessible. Que suggère l’Atlas ?', 'Un parcours spécialisé, sans extraction aveugle', ['Fouiller sans visibilité','Garantir un retrait immédiat','Déclarer la plaie guérie'], 'Le projectile profond relève d’une scène lourde. L’extraction ne devient pas automatique.'],
 ['La plaie au couteau paraît sale et irrégulière. Quelle décision ne faut-il pas automatiser ?', 'La fermeture par suture', ['La description de la zone','La recherche d’informations visibles','La prise en compte du saignement'], 'Le parcours distingue une plaie propre et nette d’une plaie sale ou trop profonde.'],
 ['Une petite éraflure ne nécessite pas de points. Comment jouer le soin ?', 'Nettoyage, protection et surveillance selon le parcours', ['Chirurgie lourde obligatoire','Anesthésie générale systématique','Trépanation'], 'L’Atlas garde les soins légers courts et proportionnés.'],
 ['Avant une suture simple retenue dans la scène, quel repère vient en amont ?', 'Nettoyage et contrôle du saignement', ['Déclarer immédiatement la cicatrisation','Inventer un nombre de points','Passer directement aux adieux'], 'La suture est conditionnelle. Le nettoyage et le saignement ne sont pas omis.'],
 ['Le parcours envisage une suture. Le nombre de points n’a pas été joué. Que noter ?', 'Nombre de points à préciser', ['Un nombre au hasard','Une suture forcément réalisée','Une cicatrisation parfaite'], 'Une suggestion du parcours n’est pas un acte confirmé. Le joueur précise ce qui a réellement été joué.'],
 ['Après une chute de cheval, le bras bouge mais fait mal. Que faut-il éviter ?', 'Conclure automatiquement à une fracture', ['Décrire la douleur','Préciser le côté','Demander comment le mouvement se passe'], 'Le parcours gère les cas intermédiaires : mouvement douloureux ne signifie pas diagnostic certain.'],
 ['Un membre est déformé. Quelle attitude convient au repère d’immobilisation ?', 'Soutenir sans remise en place forcée', ['Forcer le mouvement pour tester','Garantir que ce n’est pas une fracture','Faire marcher le patient pour prouver la guérison'], 'L’attelle limite les mouvements. Elle ne confirme pas le diagnostic et ne guérit pas le membre.'],
 ['Le bras gauche est blessé. Quelle observation rend le suivi plus clair ?', 'Zone et côté explicitement notés', ['Choisir le côté opposé','Écrire seulement malade','Omettre le membre'], 'Les choix latéralisés aident à conserver une scène cohérente et un rappel lisible.'],
 ['Après un choc à la tête, le patient répond mal. Quelle conclusion est prudente ?', 'Confusion à observer, sans cause certaine', ['Il simule forcément','Il est forcément ivre','Il est automatiquement rétabli'], 'Confusion est une observation, pas un diagnostic imposé au joueur.'],
 ['Après une blessure thoracique, une respiration difficile est signalée. Quelle priorité narrative ?', 'La respiration, avant les détails non urgents', ['Finir d’abord les papiers','Choisir un baume parfumé','Discuter uniquement de l’adresse du patient'], 'L’essoufflement attire l’attention sur la respiration, notamment après une blessure du thorax.'],
 ['Le joueur décrit pâleur et faiblesse. Comment formuler le constat ?', 'Signes observés à réévaluer', ['Preuve certaine d’une anémie','Preuve certaine d’une intoxication','Aucun signe à retenir'], 'Une pâleur peut orienter la scène, mais ne prouve pas à elle seule une cause.'],
 ['Un pansement vient d’être posé. Quelle phrase de suivi est cohérente ?', 'Prévenez-moi si la douleur ou le saignement change.', ['Vous ne pouvez plus saigner.','Toute infection est impossible.','Vous êtes définitivement guéri.'], 'Un pansement protège. Il ne garantit ni arrêt du saignement ni absence d’infection.'],
 ['Après une anesthésie historique, comment gérer le réveil ?', 'Attendre le réveil joué et maintenir la surveillance', ['Garantir exactement deux minutes','Déclarer le réveil sans réponse du joueur','Partir dès que l’opération est terminée'], 'Le réveil n’a pas de délai garanti. Respiration, conscience et saignement restent à observer.'],
 ['Une anesthésie générale est jouée. Quel rôle donner à un assistant ?', 'Surveillance de l’état du patient', ['Décider seul du passé du patient','Garantir la réussite','Écrire des doses improvisées'], 'L’Atlas propose préparation et surveillance, sans dosage ni méthode anesthésique réelle.'],
 ['Une légère éraflure est présentée. Quel recours est disproportionné ?', 'Une anesthésie générale systématique', ['Un soin léger adapté','Une observation de la plaie','Une consigne de surveillance'], 'Les anesthésiques historiques sont dangereux et ne sont pas un soin banal de toute douleur.'],
 ['Une sensation désagréable survient après un produit. Que dire ?', 'Décrire sans promettre que tout effet est normal', ['Tous les effets sont bons signes','Il faut forcément augmenter le produit','La douleur prouve la guérison'], 'Les notes sensorielles servent au RP. Elles n’autorisent pas à banaliser un effet inquiétant.'],
 ['L’odeur d’un pansement à l’iodoforme est forte. Que peut-on conclure ?', 'L’odeur du produit ne juge pas l’état de la plaie', ['Elle prouve une infection','Elle prouve l’absence d’infection','Elle prouve que la plaie est fermée'], 'La fiche de l’iodoforme précise cette limite et rappelle sa toxicité historique.'],
 ['Un patient a de la fièvre. Quelle limite retenir pour la quinine ?', 'Elle ne traite pas toutes les fièvres', ['Elle guérit toute infection','Elle remplace toute observation','Elle immobilise une fracture'], 'La quinine appartient à la pharmacopée historique, sans devenir un remède universel.'],
 ['Le collodion est évoqué. Quelle affirmation serait fausse ?', 'Il remplace le nettoyage et la suture de toute plaie', ['Il forme un film protecteur','Il est inflammable','Il peut donner une sensation de tiraillement'], 'La fiche décrit le film, l’odeur de solvant et les limites du collodion.'],
 ['Une friction camphrée est envisagée. Quel repère correspond à la fiche ?', 'Usage externe sur peau intacte', ['Application dans toute plaie profonde','Boisson pour un inconscient','Fil pour ligature'], 'Le liniment camphré est décrit en friction externe ; le camphre est toxique à l’ingestion.'],
 ['La glycérine est proposée comme ingrédient local. Que ne faut-il pas lui attribuer ?', 'Un pouvoir antiseptique universel', ['Une texture visqueuse','Un rôle d’humectant','Une présence dans certaines préparations'], 'La fiche la présente comme humectant et excipient, pas désinfectant universel.'],
 ['Une préparation de fer est évoquée devant une pâleur. Quelle limite est importante ?', 'La pâleur seule ne prouve pas une anémie', ['Le fer stoppe tout saignement aigu','Le fer remplace un bandage','La pâleur permet un diagnostic certain'], 'Le lexique distingue le contexte de certaines anémies et l’hémorragie aiguë.'],
 ['Un produit du lexique porte « Historique dangereux ». Que signifie cette présence ?', 'Une référence documentaire, pas une proposition systématique de soin', ['Un choix recommandé pour tous','Une garantie de sécurité','Un produit moderne sans risque'], 'Le catalogue contient aussi des pratiques abandonnées, signalées comme dangereuses.'],
 ['La disponibilité d’un produit de 1889 est incertaine dans votre ville RP. Que faire ?', 'Tenir compte de la pharmacie et du contexte de la scène', ['Supposer que tout est toujours disponible','Inventer une livraison instantanée obligatoire','Remplacer les observations par le catalogue'], 'La disponibilité varie selon le pays, le médecin et la pharmacie.'],
 ['Une sensation ou une odeur est inconnue pour un produit. Comment rester crédible ?', 'Ne pas inventer un effet garanti', ['Promettre une chaleur pour chaque produit','Promettre des picotements pour chaque produit','Dire que toute odeur est identique'], 'La note sensorielle n’est utilisée que si la fiche en propose une, sans certitude sur le vécu du patient.'],
 ['Le patient est inconscient. À qui adresser les explications utiles ?', 'À l’assistant ou aux proches présents', ['Exiger une réponse verbale du patient','Inventer son consentement verbal','Ignorer les personnes présentes'], 'Les formulations s’adaptent à la conscience. On ne prête pas une réponse à un personnage inconscient.'],
 ['Le patient est confus. Quel style de phrase aide la scène ?', 'Courte, simple et centrée sur une observation', ['Un long exposé de pharmacologie','Plusieurs questions simultanées obligatoires','Une conclusion sans l’écouter'], 'Les phrases RP sont prévues pour rester naturelles, courtes et adaptées au vocal.'],
 ['Un résultat n’a pas été confirmé par le joueur. Comment le décrire ?', 'Comme une observation ou une possibilité, pas une certitude', ['Imposer la guérison','Imposer une complication','Affirmer un résultat pour terminer vite'], 'L’Atlas soutient la scène : il ne décide pas de l’état du personnage à la place du joueur.'],
 ['Un saignement majeur continue pendant un geste secondaire. Quelle logique suivre ?', 'Suspendre le geste non prioritaire et réévaluer', ['Terminer toutes les étapes sans regarder','Changer seulement la formulation','Déclarer que la progression stabilise le patient'], 'Le passage à l’étape suivante ne signifie pas une stabilisation. Les signes inquiétants gardent la priorité.'],
 ['Une extraction de corps étranger est évoquée. Quelle limite retenir ?', 'Seulement un objet accessible dans la scène, sans recherche aveugle', ['Tous les objets doivent être retirés immédiatement','Il faut sonder toute plaie en profondeur','L’absence de visibilité ne compte pas'], 'La technique d’extraction garde une limite d’accessibilité et ne donne aucune procédure réelle.'],
 ['Une écharpe de soutien est posée. Que décrit-elle ?', 'Un soutien du bras, pas la guérison d’une fracture', ['Une anesthésie','Une preuve que l’os est réparé','Un produit antiseptique'], 'Le soutien sert au confort narratif et au maintien, sans résultat médical garanti.'],
 ['Une trame possible est suggérée pendant un soin. Quelle place laisser au joueur ?', 'La possibilité de rebondir ou de refuser', ['Lui imposer un passé','Inventer sa maladie secrète','Exiger la prochaine scène'], 'Une accroche ouvre une possibilité de jeu sans décider de l’histoire du patient.'],
 ['Après le soin, quelle consigne est la plus utile au jeu ?', 'Surveiller l’évolution et revenir si l’état change', ['Promettre zéro complication','Garantir une guérison immédiate','Interdire toute nouvelle observation'], 'Le suivi reste une ouverture de scène et un repère de surveillance, pas une garantie.'],
 ['Au cabinet, un patient tousse depuis plusieurs jours. Quelle première question est utile ?', 'Depuis quand toussez-vous, et respirez-vous difficilement ?', ['Quelle dose voulez-vous sans examen ?','Vous avez forcément une maladie précise, n’est-ce pas ?','Souhaitez-vous une attelle pour cette toux ?'], 'La durée et la gêne respiratoire précisent le contexte. Une toux seule ne permet pas d’identifier un germe.'],
 ['Un patient tousse et demande un adoucissant pour la gorge. Quel produit du lexique a cet usage historique ?', 'Préparation de réglisse', ['Scie chirurgicale','Attelle','Huile pour brûlures'], 'La réglisse figure dans des préparations de toux et de gorge. Elle ne traite pas une détresse respiratoire.'],
 ['Le pharmacien propose des sels odorants pour une toux. Quelle confusion vérifies-tu ?', 'Sels odorants et chlorure d’ammonium ne sont pas le même produit', ['Tous les sels ont le même usage','Une odeur suffit à identifier le flacon','Un expectorant répare une côte'], 'Le chlorure d’ammonium est décrit comme expectorant historique, distinct des sels odorants et de l’ammoniaque.'],
 ['Un patient demande de la morphine à boire comme du laudanum. Que précises-tu dans cette scène ?', 'La morphine de l’Atlas est une solution injectable, le laudanum une préparation orale', ['Les deux sont des bandes de tissu','La morphine est un baume cutané','Le laudanum est une attelle'], 'Le lexique distingue les formes et les voies. Les deux opiacés ont des risques, notamment respiratoires.'],
 ['Tu prépares un soin avec un liquide volatil et une lampe à flamme. Quel point d’installation vérifies-tu ?', 'Ne pas rapprocher la flamme du produit volatil', ['Éclairer le flacon directement avec la flamme','Identifier le contenu par son odeur seulement','Considérer tout solvant comme de l’eau'], 'La lampe de cabinet doit éclairer l’examen sans rapprocher une flamme des produits volatils.'],
 ['Un flacon n’a plus d’étiquette. Comment le pharmacien peut-il participer à la scène ?', 'Aider à identifier la préparation avant toute utilisation', ['Deviner à l’odeur et l’administrer','Le renommer morphine par défaut','Affirmer que tout liquide est antiseptique'], 'Le flacon étiqueté sert à identifier le contenu. La seule odeur ne suffit pas.'],
 ['Tu arrives sur le terrain sans le matériel prévu. Que fais-tu pour garder une scène cohérente ?', 'Nommer le matériel disponible et demander du renfort pour le reste', ['Faire apparaître tous les instruments sans explication','Annoncer que le manque de matériel guérit le patient','Choisir une chirurgie au hasard'], 'Le sac de terrain contient ce qui a été réellement prévu. Le manque de matériel peut créer une demande d’aide.'],
 ['Un blessé doit être transporté et plusieurs personnes sont présentes. Quel usage du brancard joues-tu ?', 'Répartir les rôles et annoncer le transport', ['Faire marcher le blessé par défaut','Annoncer que le transport résout la blessure','Utiliser le brancard comme médicament'], 'Le brancard est manipulé à plusieurs. Le déplacement ne décide pas de l’évolution médicale.'],
 ['Tu ouvres une boîte d’instruments. Quelle vérification reste nécessaire ?', 'Vérifier les pièces disponibles et leur préparation', ['Supposer que la boîte garantit la stérilité','Considérer tout objet comme propre','Choisir un outil sans le regarder'], 'La boîte est un rangement, pas une garantie de stérilité.'],
 ['Un assistant prépare une cuvette pour le soin. Quelle erreur évites-tu ?', 'Mélanger des produits au hasard', ['Installer le récipient près du linge','Préparer l’espace de travail','Distinguer les préparations disponibles'], 'Le bassin sert à préparer le travail. L’Atlas ne donne aucune recette de mélange.'],
 ['Après une bagarre, le patient a un bleu et une petite coupure. Comment distingues-tu les zones ?', 'Soin sur peau intacte pour le bleu, soin de plaie pour la coupure', ['Arnica dans toutes les plaies','Suture obligatoire sur tous les bleus','Même produit imposé partout'], 'La présence d’une coupure change le repère local : un produit pour peau intacte ne devient pas un soin de plaie ouverte.'],
 ['Une plaie propre doit être protégée après le soin. Que demandes-tu à ton assistant ?', 'Compresses et bandage', ['Trépan et scie chirurgicale','Huile de ricin et réglisse','Fer et quinquina'], 'Le pansement protège la plaie et le bandage la maintient, avec des consignes de surveillance.'],
 ['Un patient décrit une aigreur d’estomac sans autre précision. Avant de choisir un produit, que fais-tu ?', 'Faire préciser le contexte et les autres symptômes', ['Déclarer que toute douleur abdominale est banale','Donner un purgatif pour toute douleur','Conclure immédiatement à une plaie interne'], 'Le bicarbonate est un antiacide historique, mais ne justifie pas de banaliser une douleur abdominale ou thoracique.'],
 ['Un patient a une douleur abdominale inexpliquée et demande de l’huile de ricin. Que retiens-tu ?', 'Ce produit n’est pas proposé pour une douleur abdominale inexpliquée', ['Toute douleur exige un purgatif','Les graines brutes sont un équivalent à préparer','Le produit remplace l’examen'], 'La fiche distingue l’usage purgatif historique de cette situation et exclut les graines brutes, toxiques.'],
 ['Un joueur demande si les nouvelles préparations de 1889 sont déjà disponibles dans votre ville. Que lui réponds-tu ?', 'Cela dépend de l’approvisionnement et de la pharmacie joués', ['Tous les produits sont partout disponibles','Leur nouveauté garantit leur sécurité','Leur présence dans le lexique garantit le stock'], 'Le catalogue donne des repères d’époque, pas un inventaire garanti de chaque cabinet.'],
 ['Un patient frissonne et dit avoir de la fièvre. Quelle conclusion évites-tu ?', 'Attribuer une cause certaine à partir des frissons seuls', ['Demander depuis quand','Observer les autres signes','Écouter le contexte rapporté'], 'Les frissons ne donnent pas une cause unique à la fièvre.'],
 ['Après une chute, le joueur décrit des fourmillements dans la main droite. Quelle précision conserves-tu ?', 'Zone, côté et évolution de la sensation', ['Une guérison déjà acquise','Une incapacité imposée de tout le corps','Le côté gauche par défaut'], 'L’engourdissement est une sensation décrite par le joueur. Il faut demander la zone et les changements.'],
 ['Le patient se plaint de douleur, mais ne peut pas bien la décrire. Comment poses-tu ta question ?', 'Une question courte sur la zone et ce qui a changé', ['Un diagnostic imposé pour aller vite','Un long discours avant de l’écouter','Une promesse de disparition immédiate'], 'Les questions courtes gardent la scène lisible et laissent le joueur préciser ce qu’il ressent.'],
 ['Tu envisages une réduction parce qu’un membre paraît déformé. Quel doute gardes-tu ?', 'Une fracture reste possible : la réduction n’est pas automatique', ['Toute déformation est forcément une luxation','L’attelle prouve que l’os est intact','La douleur suffit à choisir une manœuvre'], 'La technique de réduction est spécialisée et n’est pas appliquée automatiquement à une déformation.'],
 ['Une douleur dentaire est la raison de la visite. Que ne décides-tu pas d’emblée ?', 'L’extraction de la dent', ['La zone douloureuse à faire préciser','Les symptômes rapportés à écouter','Le contexte à demander'], 'Le repère douleur dentaire commence par préciser la plainte, sans extraction automatique.']
];

const quizObservationScenes={
 'Confusion':['Le patient répond de travers et paraît désorienté. Que vérifies-tu pour poursuivre la consultation ?','Faire simple et vérifier respiration et contexte : choc à la tête, fièvre ou produit pris.'],
 'Essoufflement':['Après un accident, le patient respire difficilement. Quelle priorité donnes-tu à la scène ?','Observer la respiration en priorité et rechercher le contexte thoracique ou une noyade.'],
 'Pâleur':['Le blessé devient pâle et faible. Quel élément cherches-tu à éclaircir ?','Rechercher les pertes de sang et réévaluer son état, sans conclure sur la pâleur seule.'],
 'Pouls faible':['Le pouls paraît très faible. Avec quelles observations complètes-tu ton examen ?','État général, pâleur et pertes de sang.'],
 'Pupilles serrées':['Les pupilles sont très petites, avec somnolence et respiration lente. Quelle piste de l’Atlas faut-il envisager ?','Une intoxication aux opiacés, à vérifier sans imposer le diagnostic.'],
 'Rougeur, chaleur, pus':['Une plaie présente rougeur, chaleur et pus. Quelle suite de scène envisages-tu ?','Une évaluation de la plaie infectée, avec nettoyage et éventuels gestes spécialisés selon le cas.'],
 'Sang craché':['Après une blessure au thorax, le patient crache du sang. Comment réagis-tu ?','Prendre le signe au sérieux et réévaluer la respiration et l’état général.'],
 'Somnolence inhabituelle':['Le patient peine soudain à rester éveillé. Dans quels contextes redoubles-tu de vigilance ?','Après un choc à la tête ou une possible intoxication.'],
 'Ventre dur':['Après une balle dans l’abdomen, le ventre paraît anormalement tendu. Que retiens-tu pour la suite ?','Un signe inquiétant à intégrer à l’évaluation de la blessure abdominale.'],
 'Vomissements':['Le patient vomit après un choc à la tête. Quelle attitude convient ?','Prendre le changement au sérieux et réévaluer, plutôt que banaliser le vomissement.'],
 'Frissons':['Le patient frissonne pendant la consultation. Que lui demandes-tu ?','Depuis quand, dans quel contexte et avec quels autres signes, sans attribuer une cause unique.'],
 'Sueurs inhabituelles':['Le patient transpire de façon inhabituelle. Que cherches-tu à savoir ?','Ce qu’il ressent et dans quel contexte les sueurs sont apparues.'],
 'Raideur':['Un mouvement paraît raide et douloureux. Comment poursuis-tu l’examen RP ?','Demander la zone et l’évolution sans forcer le mouvement.'],
 'Gonflement':['Une zone est gonflée après un incident. Quelles précisions demandes-tu ?','La zone, l’évolution du gonflement et les autres signes, sans diagnostic automatique.'],
 'Faiblesse':['Le patient se dit trop faible pour ses gestes habituels. Quelle question l’aide à préciser son état ?','Quels gestes arrivez-vous encore à faire, et lesquels sont devenus difficiles ?'],
 'Vision modifiée':['Le patient dit voir différemment depuis un choc. Comment vérifies-tu ce qu’il décrit ?','Lui demander ce qui a changé dans sa vision et à quel moment.'],
 'Toux':['Un patient vient te consulter pour une toux. Que lui demandes-tu d’abord ?','Depuis quand il tousse et si sa respiration est gênée.'],
 'Soif inhabituelle':['Le patient décrit une soif inhabituelle. Que vérifies-tu avant de lui proposer à boire ?','L’évolution, le contexte et sa capacité à avaler.'],
 'Douleur dentaire':['Le patient se plaint d’une dent. Comment commences-tu la consultation ?','Faire préciser la zone et les symptômes, sans décider d’emblée une extraction.'],
 'Engourdissement':['Le patient décrit des fourmillements. Que lui demandes-tu ?','La zone concernée et ce qui a changé, sans imposer le résultat d’un test.']
};
function quizScenePrompt(group,field,name,description){
 if(group==='Produits')return ({
  form:`Tu prépares « ${name} » pour un soin en 1889. Sous quelle forme se présente ce produit ?`,
  admin:`Tu dois utiliser « ${name} ». Quelle voie d’administration correspond à cette préparation ?`,
  use:`Tu disposes de « ${name} » dans ta pharmacie de 1889. À quel usage ce produit est-il destiné ?`,
  warning:`Tu envisages « ${name} » pendant un soin. Quelle précaution dois-tu garder en tête ?`,
  sensory:`Tu utilises « ${name} » et veux décrire ce que le patient pourrait percevoir. Quel détail convient, sans le garantir ?`,
  composition:`Le patient te demande ce que contient « ${name} ». Quelle explication lui donnes-tu ?`
 })[field];
 if(group==='Techniques')return ({
  form:`${quizTechniqueActions[name]} Quel matériel demandes-tu à ton assistant ?`,
  admin:`${quizTechniqueActions[name]} Quelle action correspond à ce soin ?`,
  use:`Tu envisages le soin suivant : « ${name} ». Dans quelle situation est-il indiqué dans la médecine de l’époque ?`,
  warning:`${quizTechniqueActions[name]} Quelle précaution dois-tu respecter ?`
 })[field];
 if(group==='Matériel')return field==='desc'?`Ton assistant cherche l’objet suivant : ${description} Quel matériel lui demandes-tu ?`:`Tu as « ${name} » dans ton sac de médecin. Dans quel moment du soin l’utiliserais-tu ?`;
 return field==='desc'?`Tu examines le patient : ${quizClinicalText(description)} Quel terme correspond à ce signe ?`:quizObservationScenes[name]?.[0]||`Le patient présente « ${name} ». Que vérifies-tu pour poursuivre le soin ?`;
}

let quizBankCache = null;
function buildQuizBank(){
 if(quizBankCache)return quizBankCache;
 const bank=[];
 const clean=value=>String(value||'').replace(/[\u2013\u2014]/g,'-').trim();
 function addFields(items,group,fields){
  fields.forEach(([field,label])=>{
   const pool=[...new Set(items.map(item=>clean(item[field])).filter(Boolean))];
   if(pool.length<4)return;
   items.forEach((item,index)=>{
    const correct=clean(item[field]);if(!correct)return;
    if(field==='composition'&&correct===clean(item.form))return;
    let answersPool=pool.filter(value=>value!==correct);
    // Several oral/external descriptions can all be true: quiz the route family instead.
    let answer=correct;
    if(field==='desc'&&(group==='Matériel'||group==='Observations')){
     answer=clean(item.name);answersPool=items.filter(other=>other.name!==item.name&&clean(other.desc)!==correct).map(other=>clean(other.name));
    }
    if(group==='Observations'&&field==='rp'){
     answer=quizObservationScenes[item.name]?.[1]||correct;
     answersPool=['Conclure immédiatement à une maladie certaine avec ce seul signe.','Ignorer ce signe et terminer le soin sans réévaluer.','Choisir un médicament avant de demander le contexte.'];
    }
    if(group==='Produits'&&field==='admin'){
     const route=/variable/i.test(correct)?'Variable selon la préparation':/hypoderm|inject/i.test(correct)?'Injection hypodermique':/inhal/i.test(correct)?'Voie inhalée':/orale/i.test(correct)?'Voie orale':'Application locale ou externe';
     answer=route;answersPool=['Variable selon la préparation','Injection hypodermique','Voie inhalée','Voie orale','Application locale ou externe'].filter(value=>value!==route);
    }
    const complement=field==='warning'?item.use:field==='use'?item.warning:null;
    bank.push({id:group+':'+index+':'+field,topic:group+':'+index,group,
     prompt:quizScenePrompt(group,field,clean(item.name),correct),
     correct:answer,pool:answersPool,
     explanation:group==='Observations'&&field==='rp'?`${answer} ${clean(item.desc)} Ce signe oriente la scène, sans décider seul du diagnostic.`:`${clean(item.name)} : ${correct}${/[.!?]$/.test(correct)?'':'.'}${complement?' '+clean(complement):''}`,
     reference:clean(item.name)});
   });
  });
 }
 addFields(lexique.filter(item=>item.category!=='Technique'),'Produits',[
  ['form','quelle forme est décrite ?'],['admin','quelle voie ou application est indiquée ?'],
  ['use','quel usage historique RP est décrit ?'],['warning','quelle précaution est indiquée ?'],
  ['sensory','quel repère sensoriel est décrit ?'],['composition','quelle composition est indiquée ?']
 ]);
 addFields(lexique.filter(item=>item.category==='Technique'),'Techniques',[
  ['form','quel matériel accompagne ce geste RP ?'],['admin','comment évoquer ce geste en scène ?'],
  ['use','dans quel contexte ce geste intervient-il ?'],['warning','quelle limite doit-on respecter ?']
 ]);
 addFields(equipmentLexicon,'Matériel',[
  ['desc','quelle description correspond à cet objet ?'],['use','quel usage RP est indiqué ?']
 ]);
 addFields(symptomLexicon,'Observations',[
  ['desc','quelle observation est décrite ?'],['rp','quel repère de scène est proposé ?']
 ]);
 quizSituations.forEach(([prompt,correct,wrong,explanation],index)=>bank.push({id:'Situation:'+index,topic:'Situation:'+index,group:'Situations',prompt,correct,pool:wrong,explanation,reference:'Parcours et repères RP de l’Atlas'}));
 // Reverse recognition: identify the preparation from a scene rather than its name.
 const products=lexique.filter(item=>item.category!=='Technique');
 ['form','use','sensory'].forEach(field=>{
  products.forEach((item,index)=>{
   const clue=clean(item[field]);if(!clue)return;
   // Broad/shared clues and descriptions naming the answer do not make good riddles.
   if(products.filter(other=>clean(other[field])===clue).length!==1)return;
   const words=clean(item.name).toLocaleLowerCase('fr').split(/[\s/]+/).filter(word=>word.length>4);
   if(words.some(word=>clue.toLocaleLowerCase('fr').includes(word)))return;
   if(clue.length<30)return;
   const scene=field==='form'?`Ton assistant te décrit cette préparation : « ${clue} ». Quel produit cherche-t-il ?`:field==='use'?`Dans ta pharmacie de 1889, tu cherches le produit dont l’usage est décrit ainsi : « ${clue} ». Lequel correspond à cette description ?`:`Pendant la préparation d’un soin, tu reconnais ce détail : « ${clue} ». À quel produit de l’Atlas correspond ce repère ?`;
   const others=products.filter(other=>other.name!==item.name&&clean(other[field])!==clue);
   bank.push({id:'Produits:'+index+':recognize-'+field,topic:'Produits:'+index,group:'Produits',prompt:scene,correct:clean(item.name),pool:others.map(other=>clean(other.name)),explanation:`Il s’agit de ${clean(item.name)}. ${clean(item.use)} ${clean(item.warning)}`,reference:clean(item.name)});
  });
 });
 quizBankCache=bank.map(normalizeQuizQuestion);return quizBankCache;
}
