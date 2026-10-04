// Notes courtes : histoire sourcée ou détail pédagogique issu de l'Atlas.
// Ne pas présenter une astuce de jeu comme un événement historique.
const quizNoteSources={
 morphine:['Science History Institute','https://www.sciencehistory.org/stories/magazine/dreams-and-nightmares/'],
 laudanum:['Science Museum, coffre à médicaments français','https://collection.sciencemuseumgroup.org.uk/objects/co197541'],
 anesthesia:['Royal College of Anaesthetists','https://www.rcoa.ac.uk/about-us/heritage/history-anaesthesia'],
 lister:['Science Museum, Joseph Lister','https://collection.sciencemuseumgroup.org.uk/people/cp37522/joseph-lister'],
 spray:['Science Museum, pulvérisateur carbolique','https://collection.sciencemuseumgroup.org.uk/objects/co163555/carbolic-steam-spray-used-by-joseph-lister'],
 collodion:['Science Museum, photographie au collodion','https://collection.sciencemuseumgroup.org.uk/objects/co156229/wet-collodion-photograph-in-locket-ostensibly-mr-w-evans'],
 syringe:['Science Museum, seringue hypodermique','https://collection.sciencemuseumgroup.org.uk/objects/co142320/hypodermic-syringe-europe-1871-1900'],
 stethoscope:['Science Museum, stéthoscope de Laennec','https://collection.sciencemuseumgroup.org.uk/objects/co90986/laennecs-stethoscope'],
 epsom:['Royal Society, manuscrit de 1723','https://makingscience.royalsociety.org/items/clp_11i_53/paper-observations-and-experiments-on-the-sal-catharticum-amarum-commonly-calld-the-epsom-salt-by-john-brown-browne'],
 calomel:['Royal College of Physicians and Surgeons of Glasgow','https://heritage.rcpsg.ac.uk/items/show/800'],
 iodoform:['Article historique, documents des années 1880','https://pmc.ncbi.nlm.nih.gov/articles/PMC1871706/'],
 boric:['Publication médicale de 1880','https://pmc.ncbi.nlm.nih.gov/articles/PMC5893062/'],
 cannabis:['Science Museum, coffre à médicaments','https://collection.sciencemuseumgroup.org.uk/objects/co196990/medicine-chest'],
 thermometer:['Collection médicale de l’Université de Zurich','https://www.medizinsammlung.uzh.ch/de/objektgeschichten/OG13_thermometer.html']
};
// [texte, source facultative]. Sans source externe : détail de la sélection RP.
const quizItemNotes={
 'Iodoforme':['Au début des années 1880, l’iodoforme suscitait déjà des publications sur ses usages et ses intoxications. Un antiseptique « moderne » pour 1889 n’était donc pas forcément inoffensif.','iodoform'],
 "Onguent à l'oxyde de zinc":['Sa blancheur et son aspect épais offrent un détail facile à jouer. Dans l’Atlas, cette protection cutanée ne se confond pas avec le soin d’une plaie profonde.'],
 'Laudanum':['Le Science Museum conserve un flacon de laudanum provenant d’un coffre à médicaments français daté de 1751 à 1850 : ce produit était donc déjà ancien en 1889.','laudanum'],
 'Morphine':['Le nom morphine évoque Morphée, le dieu grec des rêves. Il a été donné à la substance isolée de l’opium par Sertürner au début du XIXe siècle.','morphine'],
 'Chloroforme':['James Young Simpson a introduit le chloroforme dans la pratique anesthésique en 1847. Pour un médecin de 1889, ce n’est plus une nouveauté de la veille.','anesthesia'],
 'Éther':['La démonstration publique d’anesthésie à l’éther de Boston, en 1846, a fait connaître la méthode bien au-delà des États-Unis. L’anesthésie ne naît donc pas avec le chloroforme.','anesthesia'],
 'Phénol / acide carbolique':['Le Science Museum conserve un pulvérisateur carbolique utilisé par Lister vers 1867. L’histoire de l’antisepsie comporte aussi des appareils aujourd’hui abandonnés, pas seulement des flacons.','spray'],
 'Alcool':['Une odeur familière ne fait pas d’un flacon un produit identifié. Dans une scène, lire l’étiquette est plus crédible que reconnaître chaque préparation au nez.'],
 'Préparation à l’arnica':['Le détail à mémoriser est la peau intacte : un bleu et une coupure voisins ne reçoivent pas automatiquement le même soin. Cela donne une raison simple de préciser la blessure.'],
 'Onguent protecteur':['« Onguent » décrit une forme de préparation, pas un ingrédient unique. Demander lequel est disponible au cabinet est donc une vraie question de scène.'],
 'Ammoniaque / sels odorants':['Les sels odorants et le chlorure d’ammonium ont des noms proches, mais pas le même rôle dans l’Atlas. Le nom d’un produit compte autant que son apparence.'],
 'Carron oil / huile pour brûlures':['Son nom peut faire croire à une huile unique. L’Atlas la présente comme une préparation huileuse historique pour brûlures, pas comme une huile alimentaire à improviser.'],
 'Quinine':['Quinine et quinquina ne sont pas deux orthographes du même produit : l’Atlas distingue la substance purifiée des préparations d’écorce. Voilà une bonne réplique à échanger avec le pharmacien.'],
 'Cocaïne médicinale':['La fiche situe l’anesthésie locale oculaire dès 1884. En 1889, cette référence peut nourrir une conversation sur les nouveautés, sans en faire un produit banal de terrain.'],
 'Antifébrine / acétanilide':['Antifébrine et acétanilide désignent ici la même entrée. Un nom nouveau ou commercial ne signifie pas que le produit est sans risque.'],
 'Phénacétine':['Introduite en 1887 selon le lexique, elle n’a que deux ans en 1889. Un cabinet peut en entendre parler sans en avoir déjà reçu.'],
 'Salicylate de sodium':['Le nom rappelle la famille salicylique, mais l’Atlas précise que ce n’est pas de l’aspirine. Ce rapprochement aide à retenir sans glisser vers une pharmacie moderne.'],
 'Quinquina':['Le produit est présenté sous forme d’écorce, d’extrait ou de teinture. Cela permet de jouer un échange sur la préparation disponible plutôt que de supposer un comprimé moderne.'],
 'Huile de ricin':['La préparation pharmaceutique n’est pas la graine brute. La distinction est assez importante pour figurer dans les précautions du lexique.'],
 'Séné':['Une plante peut arriver en infusion, sirop ou extrait. « C’est végétal » ne suffit donc ni à identifier la préparation ni à rassurer sur ses effets.'],
 'Rhubarbe médicinale':['Dans cette entrée, on parle de la racine médicinale, pas d’une recette de cuisine. Le nom familier peut justement être une source de confusion en scène.'],
 'Aloès médicinal':['L’aloès oral de cette pharmacopée n’est pas le gel cutané apaisant que le nom peut évoquer aujourd’hui. La forme du produit change le sens du soin.'],
 "Sels d'Epsom":['Un manuscrit de John Browne conservé par la Royal Society compare déjà des sels d’Epsom en 1723. En 1889, ils ont une longue histoire derrière eux.','epsom'],
 'Sels de Glauber':['Le lexique les associe au sulfate de sodium, tandis que les sels d’Epsom correspondent au sulfate de magnésium. Deux poudres salines ne sont pas interchangeables.'],
 'Bicarbonate de sodium':['L’Atlas l’associe à certaines aigreurs d’estomac, pas à toute douleur du ventre. Demander « aigreur ou douleur ? » rend la consultation plus précise.'],
 'Magnésie':['La fiche cite des formes différentes, oxyde ou carbonate. Le nom court ne dispense pas de préciser la préparation fournie par le pharmacien.'],
 'Sous-nitrate de bismuth':['Le mot bismuth ne suffit pas : le sous-nitrate historique de l’Atlas est distingué du subsalicylate moderne. Retenir le nom complet évite le raccourci.'],
 'Teinture de gentiane':['« Tonique » est un usage historique, pas une promesse de guérison. Une amertume marquée peut servir de détail de dialogue sans prouver un effet.'],
 'Préparation de gingembre':['Le même nom peut évoquer une épice et une préparation pharmaceutique. Dans l’Atlas, on précise la forme préparée plutôt que de donner une recette.'],
 'Essence de menthe poivrée':['Une sensation fraîche peut aider la description RP, mais ne dit pas à elle seule ce qui arrive au patient. Fraîcheur et efficacité sont deux choses distinctes.'],
 'Préparation de réglisse':['L’usage de gorge appartient aux préparations adoucissantes du lexique. Une toux avec respiration difficile change la priorité : ce n’est plus seulement une question de confort.'],
 'Ipécacuanha':['La fiche donne des usages historiques différents selon la préparation : expectorant ou vomitif. Ce double rôle est précisément une raison de ne pas choisir sur le nom seul.'],
 'Scille':['L’Atlas la décrit à la fois dans des préparations expectorantes et diurétiques. Une plante de la rubrique respiration n’est donc pas forcément un simple adoucissant.'],
 "Chlorure d'ammonium":['Le nom évoque l’ammoniaque, mais cette entrée décrit un expectorant oral historique. Le rapprochement des mots ne doit pas devenir une substitution de produits.'],
 'Hydrate de chloral':['Dans le vocabulaire de la fiche, « hypnotique » signifie un produit employé pour provoquer le sommeil. Ce n’est pas une technique d’hypnose jouée par le médecin.'],
 'Bromure de potassium':['Le lexique cite la sédation et certaines crises épileptiques comme usages historiques. Ces deux contextes ne permettent pas d’imposer une prise orale pendant une crise.'],
 'Valériane':['Son odeur terreuse offre une touche de pharmacie facile à décrire. Elle n’est cependant pas une preuve que l’agitation a été expliquée ou résolue.'],
 'Cannabis indica médicinal':['Un coffre conservé au Science Museum contient du Chlorodyne préparé entre 1856 et 1878, mêlant notamment opium, chloroforme et cannabis. Les spécialités anciennes pouvaient combiner plusieurs substances.','cannabis'],
 'Belladone':['La fiche mentionne plusieurs formes et voies selon la préparation. Il est donc plus crédible de demander « quelle préparation ? » que de jouer une belladone universelle.'],
 'Digitale':['Le mot ancien « hydropisie » apparaît dans cette fiche pour parler d’œdèmes. C’est un détail de vocabulaire d’époque, pas le nom d’une cause unique.'],
 'Préparation de fer':['Le lexique emploie « tonique martial » : ici, martial renvoie au fer. Ce vocabulaire peut colorer une discussion entre médecin et pharmacien sans compliquer l’échange avec le patient.'],
 'Huile de foie de morue':['Le goût et l’odeur de poisson donnent un détail concret à la scène. Le rôle historique de reconstituant ne devient pas une guérison annoncée d’une infection.'],
 'Acide borique':['Une publication médicale de février 1880 traite déjà de l’acide borique parmi les matériaux de l’antisepsie. Il appartient donc aux débats de soin de l’époque, pas à une découverte après 1889.','boric'],
 "Nitrate d'argent":['Le « crayon caustique » de la fiche n’est pas un crayon pour écrire. Il désigne une forme spécialisée du produit ; c’est un mot à expliquer au patient plutôt qu’à laisser mystérieux.'],
 'Pommade au soufre':['L’Atlas précise que l’odeur dépend de la préparation et n’est pas forcément celle d’un œuf pourri. Le cliché est moins utile que la description du produit disponible.'],
 'Collodion':['Le collodion servait aussi à la photographie. Le Science Museum conserve un portrait au collodion humide daté de 1851 à 1880 : un photographe peut donc connaître ce mot en 1889.','collodion'],
 'Glycérine':['La fiche la classe comme humectant et ingrédient de préparations. Tous les liquides du cabinet ne sont donc pas des antiseptiques : certains participent surtout à la texture d’un soin.'],
 "Huile d'amande douce":['« Douce » distingue le produit dans son nom. Le lexique insiste sur la différence avec l’amande amère et rappelle qu’une huile n’est pas automatiquement un désinfectant.'],
 'Liniment camphré':['Le liniment permet de parler d’une friction locale sur peau intacte. Son odeur reconnaissable peut enrichir le dialogue, mais ne remplace pas l’identification du flacon.'],
 'Calomel':['Le musée du Royal College de Glasgow conserve un flacon de calomel attribué à un chimiste du XIXe siècle. Le contenu est du chlorure mercureux : un nom ancien peut cacher un composé toxique.','calomel'],
 'Teinture de benjoin':['La fiche distingue la résine dans l’alcool des formes composées avec d’autres ingrédients. Une même famille de noms peut donc recouvrir des préparations différentes.'],
 'Méthode de Silvester':['Cette méthode appartient à la respiration artificielle historique de l’Atlas. Son intérêt est documentaire pour une scène d’époque, pas une méthode de secours moderne à reproduire.'],
 'Suture':['L’aiguille et le fil sont des objets faciles à nommer en scène ; le nombre de points, lui, ne doit pas sortir automatiquement du parcours. Il dépend de ce qui a été effectivement joué.'],
 'Compression d’un saignement':['Maintenir un geste peut être une action RP à part entière. Faire participer un assistant évite que le soin ne se réduise à une succession de phrases du médecin.'],
 'Nettoyage et antisepsie':['Lister publia ses travaux sur son système antiseptique en 1867. L’idée de prévenir l’infection par la propreté a une histoire distincte de celle de supprimer la douleur.','lister'],
 'Pansement et bandage':['Le pansement protège une zone ; le bandage peut le maintenir. Nommer ces deux rôles rend le geste plus clair qu’un simple « je soigne ».'],
 'Immobilisation par attelle':['Une attelle est un soutien, pas une preuve de fracture. Elle permet de jouer la prudence même quand le diagnostic de la scène reste incertain.'],
 'Écharpe de soutien':['Le tissu de soutien crée un geste simple à décrire et un objet visible pour le patient. Ce soutien n’annonce pas que le bras est déjà guéri.'],
 'Examen d’une plaie':['La réponse du joueur et l’observation du médecin n’ont pas le même rôle. Demander où il a mal laisse le ressenti au joueur ; décrire ce qui est visible garde l’examen concret.'],
 'Ligature d’un vaisseau':['Le fil de ligature et le fil de fermeture de la peau n’ont pas le même rôle. Cette différence explique pourquoi « quelques points » ne résume pas toute une chirurgie.'],
 'Drainage d’un abcès':['Dans l’Atlas, ce geste relève d’une scène spécialisée. Le nom peut être expliqué par son but narratif, évacuer les sécrétions, sans détailler une incision réelle.'],
 'Débridement d’une plaie':['Ce mot désigne ici un geste sur des tissus abîmés, pas seulement le retrait d’un bandage. Dire son objectif est plus clair pour le joueur que réciter le terme.'],
 'Extraction d’un corps étranger':['Retirer un objet n’est pas toujours le centre du soin : une balle supposée présente ne justifie pas une recherche aveugle. L’accessibilité est le détail qui change la scène.'],
 'Anesthésie générale historique':['L’éther et le chloroforme ont rendu possibles de nouvelles scènes opératoires au XIXe siècle. Cela n’a pas supprimé le besoin de surveillance ni les dangers de l’opération.','anesthesia'],
 'Surveillance après anesthésie':['Le réveil est aussi une phase de jeu : un assistant peut observer pendant que le médecin prépare la suite. Un compte à rebours ne remplace pas la réaction du patient.'],
 'Réduction d’une luxation':['« Réduction » signifie ici une remise en place spécialisée, pas diminuer la dose d’un produit. Le vocabulaire opératoire peut être traduit en une phrase simple pour le patient.'],
 'Cautérisation historique':['Le mot peut recouvrir un instrument ou une préparation caustique. Dans les deux cas, ce n’est pas un synonyme de nettoyage ordinaire de la peau.'],
 'Aiguille et fil de suture':['Ce petit matériel laisse une trace facile à retenir dans le récit : les points posés. Mais le fil préparé et les points réellement réalisés restent deux faits distincts.'],
 'Attelle':['Sa fonction est de limiter les mouvements, pas de faire disparaître immédiatement la douleur. C’est un objet de soutien, même quand la scène laisse le diagnostic ouvert.'],
 'Bandage':['Une bande de tissu peut maintenir une compresse ou soutenir un membre. Le même objet n’implique donc pas forcément la même blessure.'],
 'Compresses / linge propre':['Le linge peut servir à plusieurs moments du soin. En RP, demander du linge propre supplémentaire donne un rôle utile à un témoin sans inventer une complication.'],
 'Forceps / pince':['Une pince aide à saisir avec précision, mais ne rend pas un projectile profond soudain accessible. L’outil ne remplace pas les limites de ce qui est visible.'],
 'Scalpel / bistouri':['Ces deux noms désignent ici la petite lame chirurgicale. Changer de mot ne change pas le caractère spécialisé d’une incision.'],
 'Scie chirurgicale':['Dans l’Atlas, cet instrument appartient à l’amputation exceptionnelle. Le voir dans le catalogue ne signifie pas qu’il accompagne chaque fracture.'],
 'Seringue hypodermique':['Alexander Wood et Charles Pravaz développèrent des dispositifs hypodermiques autour de 1853. En 1889, la seringue a déjà plusieurs décennies d’histoire.','syringe'],
 'Trépan':['Il appartient à la chirurgie du crâne, pas à l’examen courant d’un choc à la tête. Distinguer l’objet de la simple observation évite de rendre toute consultation spectaculaire.'],
 'Thermomètre clinique':['Des thermomètres compacts du modèle d’Allbutt étaient déjà vendus en 1867. Le thermomètre de poche a donc sa place dans un cabinet de 1889.','thermometer'],
 'Stéthoscope':['En 1816, Laennec utilisa un tube de papier roulé pour écouter le cœur d’une patiente. Le stéthoscope n’a pas commencé sous la forme familière à deux écouteurs.','stethoscope'],
 'Ciseaux à pansement':['Leur rôle se décrit facilement : préparer ou retirer du tissu. Tous les instruments d’un médecin ne sont pas destinés à une opération sur le corps.'],
 'Bassin / cuvette':['L’objet banal du cabinet peut servir à installer la scène. Le poser près du linge fait comprendre la préparation sans faire réciter une liste de produits.'],
 'Brancard':['Le transport donne une action collective aux témoins. Faire annoncer les rôles permet une transition de scène sans décider que le blessé peut marcher.'],
 'Couverture':['La couverture permet de jouer l’attente et le confort tout en continuant à observer le patient. Elle n’est pas un signe que l’urgence est passée.'],
 'Flacon étiqueté':['Une étiquette peut être l’occasion de faire intervenir le pharmacien. Le détail utile est le nom et la préparation, pas une reconnaissance miraculeuse à l’odeur.'],
 'Sac de terrain':['Un sac crédible n’est pas un cabinet sans fond. Préciser le matériel emporté peut créer une demande de renfort simple et naturelle.'],
 'Linge de transport':['Protéger et séparer les objets propres fait partie de la préparation du soin. Ce petit geste donne de la cohérence sans allonger l’intervention.'],
 'Lampe de cabinet':['L’éclairage aide à examiner, mais une flamme n’est pas un accessoire neutre auprès d’un produit volatil. L’installation mérite parfois une phrase avant le geste.'],
 'Boîte à instruments':['Une boîte fermée montre un rangement, pas une stérilité garantie. L’ouvrir et vérifier son contenu peut être joué en quelques secondes.'],
 'Confusion':['Une mauvaise réponse n’a pas une cause unique. Une question courte donne au joueur un moyen de montrer sa désorientation sans que le médecin invente toute son histoire.'],
 'Essoufflement':['Le patient peut décrire une gêne que le médecin ne voit pas immédiatement. Demander ce qu’il ressent complète la description de la respiration.'],
 'Pâleur':['Le teint est un constat, pas une explication. Associer la pâleur au contexte évite de transformer la couleur du visage en diagnostic certain.'],
 'Pouls faible':['« Faible » est une observation à replacer avec le reste de l’état du patient. Elle devient plus utile quand la scène précise conscience, pâleur et pertes de sang.'],
 'Pupilles serrées':['Le lexique relie ce signe aux opiacés lorsqu’il accompagne somnolence et respiration lente. L’association de signes est plus informative qu’un détail isolé.'],
 'Rougeur, chaleur, pus':['Ces trois observations peuvent enrichir une description de plaie. Les nommer ne signifie pas que le médecin connaît déjà le germe responsable.'],
 'Sang craché':['Le geste visible de tousser et le sang observé sont deux informations différentes. Cette précision aide à décrire la scène sans fabriquer un diagnostic interne.'],
 'Somnolence inhabituelle':['« Inhabituelle » suppose un changement. Demander depuis quand le patient peine à rester éveillé donne un repère plus utile qu’un simple « il dort ».'],
 'Ventre dur':['Le mot décrit un aspect de l’examen, pas le résultat d’une exploration interne. Il peut rendre la scène inquiétante sans imposer une lésion précise.'],
 'Vomissements':['Le contexte compte : après un choc à la tête, ce signe ne se raconte pas comme un simple dégoût d’un médicament. La chronologie aide à garder la scène cohérente.'],
 'Frissons':['Un frisson est visible ou rapporté, mais sa cause ne l’est pas forcément. La question « depuis quand ? » transforme un détail d’ambiance en information utile.'],
 'Sueurs inhabituelles':['Le vêtement humide peut être visible, tandis que la sensation du patient doit lui être demandée. Cette distinction laisse chacun jouer son rôle.'],
 'Raideur':['Une limitation peut être décrite sans forcer un test. Le joueur peut préciser ce qu’il arrive à faire au lieu de recevoir une incapacité imposée.'],
 'Gonflement':['Dire « la cheville a gonflé depuis la chute » est plus concret que « augmentation de volume ». Le lieu et la chronologie donnent immédiatement une prise au jeu.'],
 'Faiblesse':['Demander un geste habituel devenu difficile est plus précis que demander seulement « vous êtes faible ? ». Cela aide le joueur à montrer son état.'],
 'Vision modifiée':['Un trouble visuel ne se lit pas simplement sur le visage. Le médecin doit laisser le joueur décrire ce qui lui paraît différent.'],
 'Toux':['Une toux peut être jouée en un son, mais la consultation gagne en intérêt quand on demande sa durée et la gêne respiratoire associée. Ce détail n’identifie pas un germe.'],
 'Soif inhabituelle':['La soif est un ressenti rapporté. Vérifier que le patient peut avaler reste distinct de lui demander depuis quand il a soif.'],
 'Douleur dentaire':['La douleur peut être décrite dans une dent ou dans la mâchoire. Faire préciser la zone ouvre l’examen sans décider immédiatement une extraction.'],
 'Engourdissement':['Fourmillements et toucher diminué sont des sensations que le joueur décrit. Une question sur le côté et l’évolution vaut mieux qu’un résultat de test imposé.']
};
function quizNoteFor(question){
 let key=question.reference;
 if(!quizItemNotes[key]){
  const text=question.prompt+' '+question.explanation;
  key=Object.keys(quizItemNotes).sort((a,b)=>b.length-a.length).find(name=>text.toLocaleLowerCase('fr').includes(name.toLocaleLowerCase('fr')));
 }
 const row=quizItemNotes[key];
 if(row)return {text:quizClinicalText(row[0]),source:row[1]?quizNoteSources[row[1]]:null,title:row[1]?'Petite histoire':'Petit détail à retenir'};
 return {title:'Détail à retenir',text:'Demander au patient ce qui a changé permet de compléter l’observation. Un soin réalisé ne suffit pas, à lui seul, à confirmer une amélioration.',source:null};
}
function quizNoteMarkup(question){
 const note=quizNoteFor(question);
 return `<aside class="quiz-anecdote"><b>${quizEscape(note.title)}</b><p>${quizEscape(note.text)}</p>${note.source?`<a href="${quizEscape(note.source[1])}" target="_blank" rel="noopener noreferrer">Source : ${quizEscape(note.source[0])}</a>`:'<small>Entraînement historique, pas une consigne de soin réel.</small>'}</aside>`;
}
function renderQuizAnecdotes(){
 if(!quizSession)return;
 if(quizSession.done){document.querySelectorAll('#quiz .quiz-review details').forEach((element,index)=>element.insertAdjacentHTML('beforeend',quizNoteMarkup(quizSession.questions[index])));return;}
 const feedback=document.querySelector('#quiz .quiz-feedback');
 if(feedback)feedback.insertAdjacentHTML('beforeend',quizNoteMarkup(quizSession.questions[quizSession.index]));
}
