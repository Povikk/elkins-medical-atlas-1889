// Animal injuries use the same transient route engine in both views.
// Historical scene reference only. No doses, automatic treatment or patient records.
const animalAnalgesics=[
 ['Laudanum','Teinture d’opium','Voie orale, seulement si le patient peut répondre et avaler','Possibilité historique pour douleur évaluée ; pas de cumul avec la morphine'],
 ['Morphine','Solution injectable','Voie hypodermique par le praticien, si retenue','Possibilité historique pour douleur forte ; surveillance de la conscience et du souffle']
];
const animalChoice=(label,set)=>({label,set});
const animalStep=(title,actions,say,choices,material=[])=>({title,do:actions,say,choices,care:{material,assistant:'Gardez les réactions et la respiration sous observation ; préparez seulement le matériel demandé.'}});
const animalSpecies=[
 ['grizzly','Grizzly / ours brun','mammal','Rechercher morsures, griffures, écrasement et lésions dues à une chute.'],
 ['black_bear','Ours noir américain','mammal','Vérifier les blessures rapportées. Dans le jeu, l’ours noir fuit généralement ; une rencontre seule ne prouve pas une attaque.'],
 ['cougar','Puma / cougar','mammal','Inspecter cou, épaules et autres zones atteintes ; rechercher morsures, griffures et chute.'],
 ['panther','Panthère / panthère de Floride','mammal','Rechercher plaies perforantes et griffures ; vérifier aussi les lésions de la chute.'],
 ['gray_wolf','Loup gris','mammal','Rechercher plusieurs morsures, notamment aux membres ; inspecter toutes les zones atteintes.'],
 ['timber_wolf','Loup des bois','mammal','Demander si plusieurs animaux étaient présents ; ne pas limiter l’examen à la première morsure.'],
 ['alligator','Alligator américain','reptile','Rechercher morsure profonde, écrasement et souillures. Si immersion, vérifier aussi la respiration.'],
 ['rattlesnake','Crotale / serpent à sonnette','venom','Morsure potentiellement venimeuse : surveillance et prise en charge urgente, pas un simple soin de plaie.'],
 ['cottonmouth','Mocassin d’eau / cottonmouth','venom','Ne pas confondre avec un serpent aquatique inoffensif ; venin possible, sans le déduire de l’aspect seul.'],
 ['copperhead','Serpent cuivré / copperhead','venom','Venin possible : préciser le moment de la morsure et l’évolution, sans attendre des signes graves.'],
 ['fer_de_lance','Fer-de-lance','venom','Espèce présente dans le jeu : morsure potentiellement venimeuse, sans remède universel.'],
 ['snake_unknown','Serpent non identifié','venom','Type inconnu : ne pas supposer la morsure inoffensive et ne pas tenter une capture.'],
 ['boar','Sanglier','mammal','Rechercher lésion par défense, heurt et chute ; une petite ouverture peut être profonde.'],
 ['bison','Bison américain','mammal','Après une charge, rechercher choc, piétinement, lésion par corne et chute, sans imposer une fracture.'],
 ['buck','Cerf de Virginie mâle','mammal','Après un coup de bois ou une charge, inspecter la zone touchée et les conséquences de la chute.'],
 ['elk','Wapiti','mammal','Rechercher contusion, plaie par bois et douleur après chute ; ne pas confondre heurt et morsure.'],
 ['moose','Élan / orignal','mammal','Rechercher choc, chute, piétinement ou plaie selon le récit ; aucune lésion n’est présumée.'],
 ['ram','Mouflon / bélier sauvage','mammal','Après un coup de tête, vérifier zone heurtée, équilibre et éventuelle chute.'],
 ['muskrat','Rat musqué','mammal','Même une petite morsure mérite inspection, nettoyage adapté et surveillance.'],
 ['small_mammal','Blaireau / raton laveur / castor','mammal','Rechercher la petite plaie et sa profondeur ; petite taille de l’animal ne veut pas dire absence de risque.'],
 ['other','Autre animal','unknown','Faire préciser l’animal si possible ; les soins restent guidés par les blessures et l’état observés.'],
 ['unknown','Animal non identifié','unknown','Garder le type d’animal incertain ; ne pas inventer l’espèce ni le mécanisme de l’attaque.']
].map(([id,name,family,focus])=>({id,name,family,focus}));
function animalProfile(){return animalSpecies.find(s=>s.id===answers.animalSpecies)||animalSpecies.find(s=>s.id==='unknown');}
function animalIsVenom(){return animalProfile().family==='venom';}
function animalHasWound(){return answers.animalInjury!=='blunt';}
function animalChoicesForStep(step){
 const choices=step.choices||[];
 if(step.dynamicAnimal==='injury'){
  if(animalIsVenom())return choices.filter(c=>['bite','unknown'].includes(c.set.animalInjury));
  if(['bison','buck','elk','moose','ram'].includes(answers.animalSpecies))return choices.filter(c=>['blunt','gore','unknown'].includes(c.set.animalInjury));
 }
 if(step.dynamicAnimal==='aspect'){
  if(animalIsVenom())return choices.filter(c=>Object.hasOwn(c.set,'animalVenomSigns'));
  return choices.filter(c=>Object.hasOwn(c.set,'animalDepth')&&(animalHasWound()||c.set.animalDepth!=='deep')).map(c=>!animalHasWound()&&c.set.animalDepth==='surface'?{...c,label:'Gêne locale, sans déformation ni gêne de mouvement décrites'}:c);
 }
 return choices;
}
flows.animal={title:'Attaque d’animal',urgency:'serious',steps:[
 animalStep('État du patient',['Mettre le patient à l’abri de l’animal ; ne pas organiser une capture.','Vérifier réactions, respiration et saignement avant le récit.'],['« Vous êtes à l’abri ici. Est-ce que vous m’entendez ? »','« Avez-vous du mal à respirer depuis l’attaque ? »'],flows.gunshot.steps[0].choices.map(c=>({...c,set:{...c.set}}))),
 animalStep('Saignement observé',['Rechercher la plaie qui saigne le plus, sans négliger les autres.','Choisir ce qui est observé maintenant, pas ce qui devrait suivre le soin.'],['« Je regarde d’abord ce saignement. Nous parlerons ensuite de l’animal. »'],[
  animalChoice('Saignement important / continu',{animalBleeding:'major'}),animalChoice('Saignement léger',{animalBleeding:'minor'}),animalChoice('Pas de saignement visible',{animalBleeding:'none'}),animalChoice('Impossible à évaluer',{animalBleeding:'unknown'})
 ],['Compresses','Linge propre']),
 {title:'Priorités et renfort',dynamicAnimal:'priority',care:{material:['Compresses','Linge propre','Couverture'],assistant:'Surveillez sa respiration et ses réactions ; demandez du renfort si son état est inquiétant.'}},
 {...animalStep('Quel animal ?',['Animal inconnu : choisir « Animal non identifié ».','L’espèce guide l’examen, pas le diagnostic.'],['« Quel animal vous a attaqué ? »','« Si vous ne l’avez pas bien vu, nous pouvons laisser ce point incertain. »'],animalSpecies.map(s=>animalChoice(s.name,{animalSpecies:s.id}))),animalSpeciesPicker:true},
 {title:'Nature des blessures',dynamicAnimal:'injury',choices:[
  animalChoice('Morsure isolée',{animalInjury:'bite',animalMultiplicity:'single'}),animalChoice('Griffure isolée',{animalInjury:'scratch',animalMultiplicity:'single'}),animalChoice('Morsures et griffures',{animalInjury:'mixed',animalMultiplicity:'multiple'}),animalChoice('Plusieurs morsures',{animalInjury:'bite',animalMultiplicity:'multiple'}),animalChoice('Plusieurs griffures',{animalInjury:'scratch',animalMultiplicity:'multiple'}),animalChoice('Heurt / charge, sans plaie ouverte observée',{animalInjury:'blunt',animalMultiplicity:'unknown'}),animalChoice('Plaie par corne, bois ou défense',{animalInjury:'gore',animalMultiplicity:'unknown'}),animalChoice('Nature / nombre non déterminés',{animalInjury:'unknown',animalMultiplicity:'unknown'})
 ],care:{material:[]}},
 animalStep('Zone principale',['Localiser la blessure principale et vérifier les autres zones atteintes.','Pour un membre, vérifier sensibilité, couleur et mouvement sans forcer.'],['« Où est la blessure qui vous gêne le plus ? »','« Sentez-vous encore normalement vos doigts ou vos orteils ? »'],[
  ...[['arm','Bras'],['hand','Main'],['leg','Jambe'],['foot','Pied']].flatMap(([area,label])=>[['left','gauche'],['right','droit'+(area==='hand'||area==='leg'?'e':'')]].map(([side,text])=>animalChoice(label+' '+text,{animalArea:area,animalSide:side}))),
  ...[['head','Tête / visage / cou'],['chest','Thorax'],['abdomen','Abdomen'],['back','Dos'],['unknown','Zone non déterminée']].map(([area,label])=>animalChoice(label,{animalArea:area,animalSide:'none'}))
 ]),
 {...animalStep('Aspect et fonction',['Observer profondeur apparente, souillures et bords de la plaie sans sonder à l’aveugle.','Rechercher perte de sensibilité, déformation ou mouvement impossible.','Ne pas conclure à une plaie bénigne sur la seule taille de l’ouverture.'],['« Ne forcez pas le mouvement. Je vérifie ce qui a pu être atteint. »','« Cette ouverture ne suffit pas à connaître la profondeur de la blessure. »'],[
  animalChoice('Atteinte superficielle, sans gêne de mouvement décrite',{animalDepth:'surface'}),animalChoice('Plaie profonde / perforante ou déchirure importante',{animalDepth:'deep'}),animalChoice('Écrasement, déformation ou fonction altérée',{animalDepth:'crush'}),animalChoice('Profondeur / fonction non évaluées',{animalDepth:'unknown'}),
  animalChoice('Marques locales, aucun autre signe rapporté',{animalVenomSigns:'local'}),animalChoice('Douleur / gonflement qui progressent',{animalVenomSigns:'progressing'}),animalChoice('Malaise, réactions ou respiration qui se dégradent',{animalVenomSigns:'danger'}),animalChoice('Évolution non déterminée',{animalVenomSigns:'unknown'})
 ]),dynamicAnimal:'aspect'},
 {title:'Circonstances de l’attaque',dynamicAnimal:'context',choices:[
  animalChoice('Rencontre en milieu sauvage, déroulement rapporté',{animalExposure:'wild'}),animalChoice('Attaque sans provocation ou comportement inhabituel rapportés',{animalExposure:'unusual'}),animalChoice('Réaction défensive après approche, surprise ou poursuite',{animalExposure:'known'}),animalChoice('Circonstances non déterminées',{animalExposure:'unknown'})
 ],care:{material:[]}},
 {title:'Soin local adapté',dynamicAnimal:'clean',care:{material:['Eau propre disponible','Compresses','Pansement propre'],assistant:'Préparez le linge et le pansement ; ne mélangez pas des antiseptiques et ne sondez pas la plaie.'}},
 {title:'Soulager la douleur',dynamicAnimal:'pain',care:{products:animalAnalgesics,material:[],assistant:'Surveillez conscience et respiration si un antalgique a réellement été administré.'}},
 {title:'Protéger et soutenir',dynamicAnimal:'protect',care:{material:['Compresses','Bandage'],assistant:'Vérifiez que le bandage ne gêne pas ; préparez le transport si une orientation est nécessaire.'}},
 {title:'Contrôle et consignes',dynamicAnimal:'finish',care:{material:[],assistant:'Reprenez les signes à surveiller et aidez à organiser le contrôle, sans annoncer de guérison.'}}
]};
interventionMaterials.animal=['Eau propre disponible','Compresses / linge propre','Pansement et bandages','Attelle ou écharpe si atteinte du membre','Brancard si transport nécessaire'];
careMemoRows.animal=['Conscience · souffle · sang · zones atteintes','Priorités ; examiner ; soin adapté ; protéger','Douleur évaluée ; aucun opiacé automatique','Plaie profonde · écrasement · rage à évaluer ; aucune suture automatique'];
sceneEndings.animal=['Reprendre les blessures observées et les soins réellement effectués, sans annoncer une fermeture ni une guérison automatique.','« Je veux revoir ces blessures. Prévenez-moi si la douleur, le saignement ou votre état changent. »','Garder le pansement propre, ménager la zone et organiser un contrôle rapproché. Poursuivre une évaluation spécialisée si exposition à la rage possible.','Saignement persistant, douleur croissante, rougeur qui s’étend, écoulement, fièvre, perte de sensibilité ou difficulté à bouger.'];
// Existing voluntary follow-up invitations remain available in their own category.
hooks.filter(h=>h.routes.includes('minor')||h.routes.includes('horse')).forEach(h=>h.routes.push('animal'));

function animalBleeding(){return answers.latestBleeding||answers.animalBleeding;}
function animalNeedsAssessment(){return animalIsVenom()||['deep','crush','unknown'].includes(answers.animalDepth)||['head','chest','abdomen','hand','foot','unknown'].some(area=>zoneHas('animalArea',area));}
function animalUnsafe(){return careProductBlocked()||animalBleeding()==='unknown'||!answers.conscious;}
function animalRiskNote(){
 if(animalIsVenom())return 'Venin possible : organiser une prise en charge urgente et une surveillance continue, même si les marques sont petites. Aucun sérum antivenimeux disponible dans ce parcours de 1889.';
 if(animalProfile().family==='reptile')return 'Alligator : pas de risque de rage transmis par ce reptile. Surveiller plutôt lésions profondes, souillures et conséquences d’une immersion éventuelle.';
 if(!animalHasWound())return 'Sans plaie ouverte ni exposition à la salive rapportées, ne pas inventer une morsure. Réévaluer les conséquences du choc et de la chute.';
 return answers.animalExposure==='known'?'Une réaction défensive n’exclut pas à elle seule un risque de rage. Faire évaluer l’exposition à la salive avec un praticien compétent.':'Faire évaluer rapidement une éventuelle exposition à la rage, même si la plaie paraît petite ; les circonstances ne suffisent pas à exclure ce risque.';
}
function animalMemoRow(row){
 if(answers.animalSpecies&&answers.animalSpecies!=='unknown')row[0]=animalProfile().name+' · souffle · sang · zones atteintes';
 if(animalIsVenom())return [row[0],'Calme ; protection simple ; surveillance et transport urgent','Aucun sérum antivenimeux en 1889 ; pas d’opiacé automatique','Venin possible ; pas de garrot, incision, aspiration ni cautérisation'];
 if(careProductBlocked())row[2]='État vital d’abord ; pas d’opiacé avant réévaluation';
 if(!animalHasWound()){row[1]='Examiner le choc et les autres lésions ; soutenir sans forcer';row[2]=careProductBlocked()?'État vital d’abord ; réévaluer avant un opiacé':'Soulagement selon l’état ; aucun antiseptique sans plaie';row[3]='Chute / piétinement ; perte de sensibilité ou fonction à réévaluer';}
 else if(!careProductBlocked())row[2]='Eau propre · phénol préparé si adapté · compresses / pansement ; douleur évaluée';
 else if(animalProfile().family==='reptile')row[3]='Plaie profonde / écrasement / souillures ; vérifier une immersion ; pas de rage liée au reptile';
 return row;
}
function animalEndingNotes(){
 if(animalIsVenom())return ['La prise en charge ne se termine pas avec le pansement : poursuivre la surveillance et organiser le transport.','« Restez au calme, nous poursuivons la prise en charge et la surveillance. »','Pas de départ ni de guérison déduits de la fin des étapes. Aucun antivenin courant dans ce parcours de 1889.','Respiration difficile, malaise, réactions qui changent, gonflement ou douleur qui progressent.'];
 const notes=[...sceneEndings.animal];
 if(animalProfile().family==='reptile')notes[2]='Garder la zone protégée, ménager le membre et organiser un contrôle / avis selon la profondeur. Vérifier le souffle si immersion ; pas de risque de rage transmis par l’alligator.';
 if(!animalHasWound()){notes[0]='Reprendre le heurt, la chute et la fonction observés, sans inventer une plaie ni des soins de plaie.';notes[2]='Ménager la zone ; organiser un contrôle ou un avis selon douleur, sensibilité et fonction.';}
 return notes;
}
function animalStepMarkup(step){
 const unsafe=animalUnsafe(),major=animalBleeding()==='major',multiple=answers.animalMultiplicity==='multiple';
 let actions=[],phrases=[],note='',products='';
 switch(step.dynamicAnimal){
  case 'injury':
   actions=[animalProfile().focus,'Choisir les lésions réellement observées ; l’espèce ne confirme ni leur profondeur ni leur gravité.'];
   phrases=animalIsVenom()?['« Quand le serpent vous a-t-il mordu ? »','« Depuis la morsure, la douleur ou le gonflement ont-ils changé ? »']:['« Montrez-moi tous les endroits où vous avez été touché. »','« Avez-vous été renversé ou piétiné pendant l’attaque ? »'];break;
  case 'context':
   actions=['Préciser le moment de l’attaque, le nombre d’animaux et une chute ou immersion éventuelle.',animalIsVenom()?'Venin possible : demander une prise en charge urgente sans attendre l’identification certaine du serpent. Ne pas retourner le capturer.':animalProfile().family==='reptile'?'Alligator : reprendre morsure, milieu souillé et immersion. Ce reptile ne transmet pas la rage.':'Préciser une exposition à la salive et un comportement inhabituel ; l’agressivité seule ne prouve pas la rage.'];
   phrases=['« Quand l’attaque a-t-elle eu lieu ? »','« Êtes-vous tombé ou passé sous l’eau ? »'];break;
  case 'aspect':
   actions=animalIsVenom()?['Observer l’évolution de la douleur, du gonflement, des réactions et de la respiration.','Choisir les signes rapportés ; petites marques ou absence de symptômes ne prouvent pas l’absence de venin.']:!animalHasWound()?['Examiner douleur, sensibilité et mouvement sans forcer.','Rechercher déformation, faiblesse ou gêne apparue après le choc ; ne pas supposer une fracture.']:step.do;
   phrases=animalIsVenom()?['« Depuis la morsure, qu’est-ce qui a changé ? »','« Dites-moi si vous avez un malaise ou si votre respiration devient difficile. »']:!animalHasWound()?['« Sans forcer, dites-moi ce qui vous gêne depuis le choc. »']:step.say;break;
  case 'priority':
   actions=[major?'Priorité au saignement important : compression adaptée avec du linge propre, surveillance et renfort ; ne pas retirer un objet fiché.':'Vérifier la respiration et les réactions ; contrôler un saignement léger si présent.','Si la respiration est absente ou difficile, organiser immédiatement une prise en charge prioritaire, avant les soins de plaie.','Réévaluer après les premiers gestes ; la fin de cette étape ne signifie pas une stabilisation.'];
   phrases=['« Je m’occupe d’abord de ce qui vous met en danger, puis je regarderai chaque blessure. »','« Restez auprès de lui ; prévenez-moi si sa respiration ou ses réactions changent. »'];break;
  case 'clean':
   if(animalIsVenom()){
    actions=['Morsure de serpent : protéger simplement la zone et organiser une prise en charge urgente.','Ne pas inciser, aspirer le venin, cautériser ou poser un garrot ; aucune suture proposée.','La taille des marques et le pansement ne permettent pas de conclure que le venin est absent.'];
    phrases=['« Je protège cette zone pendant que nous organisons la prise en charge. »'];
    break;
   }
   if(!animalHasWound()){
    actions=['Sans plaie ouverte observée : pas de nettoyage de plaie, de suture ni d’antiseptique systématique.','Examiner contusion, douleur et fonction ; protéger et soutenir la zone selon les signes.','Si déformation, perte de sensibilité ou douleur profonde : organiser une évaluation, sans annoncer une simple contusion.'];
    phrases=['« Je vérifie surtout les conséquences du choc, sans supposer qu’il s’agit d’une simple bosse. »'];break;
   }
   if(unsafe)actions=['Suspendre le nettoyage non prioritaire : réévaluer conscience, souffle et saignement.','Protéger provisoirement les plaies et organiser du renfort.'];
   else actions=[multiple?'Examiner et nettoyer chaque plaie accessible séparément ; ne pas s’arrêter à la plus visible.':'Nettoyer la plaie accessible avec de l’eau propre et du linge adapté, sans exploration profonde à l’aveugle.',animalNeedsAssessment()?'Plaie à faire examiner : protéger et organiser une évaluation des tissus profonds, des nerfs et des vaisseaux.':'Protéger l’atteinte superficielle après le soin local ; rester attentif aux signes nouveaux.',answers.animalInjury==='scratch'?'Une griffure n’exige pas automatiquement des points : évaluer profondeur, souillures et nécessité de fermeture.':'Morsure ou nature incertaine : aucune fermeture automatique. Faire décider la conduite selon profondeur, souillures et localisation.'];
   phrases=['« Je vais nettoyer ce qui est accessible, sans fouiller la blessure. »','« Je préfère vérifier cette plaie avant de décider s’il faut la refermer. »'];
   note='Repère 1889 : les antiseptiques du lexique sont des préparations historiques, parfois toxiques. Aucun mélange ni dosage ici ; pas de phénol pur, de cautérisation ou de baume dans une morsure profonde. Aucun produit local ne prévient à lui seul la rage.';break;
  case 'pain':
   if(animalIsVenom()){
    actions=['Garder le patient au calme, limiter ses efforts et organiser le transport.','Surveiller souffle, réactions, douleur et gonflement pendant l’attente ; aucun opiacé proposé par défaut dans cette branche.','Ne pas confondre produit de guérison du jeu et traitement médical de 1889.'];
    phrases=['« Restez au calme. Je vous garde sous surveillance pendant que l’on prépare le transport. »'];break;
   }
   actions=['Installer confortablement et ménager la zone ; évaluer la douleur avant un produit.',unsafe?'Conscience, souffle ou saignement incertains / inquiétants : réévaluation avant tout opiacé.':'Si un antalgique est retenu, surveiller les réactions et la respiration ; la douleur soulagée n’exclut pas une lésion profonde.'];
   phrases=['« Sans bouger la zone blessée, dites-moi si la douleur reste supportable. »','« Nous allons vous soulager sans négliger la surveillance de la blessure. »'];
   products=unsafe?'':meds(animalAnalgesics);break;
  case 'protect':
   if(animalIsVenom()){
    actions=['Protéger sans compression serrée ; éviter les mouvements inutiles.','Organiser le transport et surveiller tout changement de respiration, de réactions ou de gonflement.'];
    phrases=['« Ne forcez pas sur ce membre. Prévenez-moi de toute sensation nouvelle. »'];break;
   }
   actions=[!animalHasWound()?'Sans plaie ouverte, ménager la zone et soutenir le membre si nécessaire ; pas de pansement de plaie systématique.':unsafe?'Protéger provisoirement les plaies pendant la prise en charge prioritaire ; ne pas banaliser un départ.':'Poser une protection propre adaptée, sans bandage trop serré.',answers.animalDepth==='crush'?'Soutenir le membre atteint sans forcer ; prévoir une évaluation de fracture ou de lésion profonde, sans diagnostic automatique.':'Ménager la zone blessée ; vérifier sensibilité et gêne après le soin.',multiple?'Revérifier toutes les plaies et leurs pansements, pas seulement la zone principale.':'Rechercher un signe nouveau ou un saignement qui reprend, si une plaie est présente.'];
   phrases=!animalHasWound()?['« Ne forcez pas sur cette zone. Dites-moi si la douleur augmente ou si vous perdez de la sensibilité. »']:['« Dites-moi si le bandage serre, si vos doigts s’engourdissent ou si la douleur augmente. »'];break;
  case 'finish':
   actions=[unsafe?'État non rassurant ou incomplet : poursuivre la surveillance et organiser du renfort, pas une sortie automatique.':animalNeedsAssessment()?'Organiser l’évaluation de la blessure à risque avant de conclure ; un pansement ne suffit pas à écarter une lésion profonde.':'Prévoir un contrôle rapproché de la plaie et du pansement.','Expliquer : revenir si douleur croissante, rougeur qui s’étend, écoulement, fièvre, saignement ou perte de sensibilité.',animalRiskNote()];
   phrases=['« Je veux revoir la plaie pour vérifier son évolution, même si elle vous gêne moins. »','« Nous devons aussi examiner le risque lié à l’animal ; le pansement ne règle pas cette question. »'];
   note='<details class="animal-reference"><summary>Repère historique : rage et traitements</summary><p>La vaccination après exposition existe depuis 1885 ; l’Institut Pasteur ouvre en 1888. En 1889, il s’agit d’une prise en charge spécialisée à rechercher selon le lieu et les moyens, pas d’un flacon automatiquement disponible au cabinet. Ne pas attendre des symptômes pour demander cet avis. Ni antibiotiques modernes ni vaccination antitétanique de routine dans ce parcours.</p><small>Sources : <a href="https://www.pasteur.fr/fr/en-ce-moment/nos-actualites/actualites/lhistoire-de-la-premiere-vaccination-contre-la-rage-en-1885" target="_blank" rel="noopener">Institut Pasteur</a> ; <a href="https://www.cdc.gov/pinkbook/hcp/table-of-contents/chapter-21-tetanus.html" target="_blank" rel="noopener">Histoire de la vaccination antitétanique</a>. Repères historiques, pas des conseils médicaux actuels.</small></details>';break;
 }
 if(step.dynamicAnimal==='finish'&&['venom','reptile'].includes(animalProfile().family)){
  phrases=animalIsVenom()?['« La prise en charge continue ; le pansement ne permet pas de vous laisser repartir. »']:['« Je veux revoir la morsure et vérifier les conséquences du choc et de l’eau. »'];
  note=animalIsVenom()?'<details class="animal-reference"><summary>Repère 1889 : aucun antivenin courant</summary><p>La sérothérapie antivenimeuse est présentée en 1894, après l’époque de l’Atlas. Aucun sérum ni remède garanti ici.</p><small><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC4898362/" target="_blank" rel="noopener">Histoire de la sérothérapie</a> ; <a href="https://www.cdc.gov/niosh/outdoor-workers/about/venomous-snakes.html" target="_blank" rel="noopener">Garde-fous contre les gestes dangereux</a>. Support de fiction, pas un protocole de secours.</small></details>':'';
 }
 if(!animalHasWound()&&step.dynamicAnimal==='finish'){phrases=['« Je veux revoir cette zone douloureuse et vérifier que le mouvement et la sensibilité ne se dégradent pas. »'];note='';}
 let html=section('À faire',actions)+sayLines(phrases)+products;
 if(animalIsVenom()&&answers.animalVenomSigns==='danger')html+='<div class="route-note">Signes qui se dégradent : prise en charge prioritaire et renfort immédiat. Continuer la surveillance des réactions et de la respiration.</div>';
 if(note)html+=note.startsWith('<details')?note:`<details class="animal-reference"><summary>Repère de soin 1889</summary><p>${note}</p></details>`;
 if(['clean','protect','finish'].includes(step.dynamicAnimal)&&animalNeedsAssessment())html+='<div class="route-note">Plaie à risque : avis / renfort nécessaire. La fin des étapes ne confirme ni réparation ni sortie possible.</div>';
 return html;
}
