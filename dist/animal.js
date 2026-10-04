// Animal injuries use the same transient route engine in both views.
// Historical scene reference only. No doses, automatic treatment or patient records.
const animalAnalgesics=[
 ['Laudanum','Teinture d’opium','Voie orale, seulement si le patient peut répondre et avaler','Possibilité historique pour douleur évaluée ; pas de cumul avec la morphine'],
 ['Morphine','Solution injectable','Voie hypodermique par le praticien, si retenue','Possibilité historique pour douleur forte ; surveillance de la conscience et du souffle']
];
const animalChoice=(label,set)=>({label,set});
const animalStep=(title,actions,say,choices,material=[])=>({title,do:actions,say,choices,care:{material,assistant:'Gardez les réactions et la respiration sous observation ; préparez seulement le matériel demandé.'}});
flows.animal={title:'Attaque d’animal',urgency:'serious',steps:[
 animalStep('État du patient',['Mettre le patient à l’abri de l’animal ; ne pas organiser une capture.','Vérifier réactions, respiration et saignement avant le récit.','Morsure de serpent / venin possible : demander une évaluation urgente distincte ; ce parcours de plaies ne suffit pas.'],['« Vous êtes à l’abri ici. Est-ce que vous m’entendez ? »','« Avez-vous du mal à respirer depuis l’attaque ? »'],flows.gunshot.steps[0].choices.map(c=>({...c,set:{...c.set}}))),
 animalStep('Saignement observé',['Rechercher la plaie qui saigne le plus, sans négliger les autres.','Choisir ce qui est observé maintenant, pas ce qui devrait suivre le soin.'],['« Je regarde d’abord ce saignement. Nous parlerons ensuite de l’animal. »'],[
  animalChoice('Saignement important / continu',{animalBleeding:'major'}),animalChoice('Saignement léger',{animalBleeding:'minor'}),animalChoice('Pas de saignement visible',{animalBleeding:'none'}),animalChoice('Impossible à évaluer',{animalBleeding:'unknown'})
 ],['Compresses','Linge propre']),
 {title:'Priorités et renfort',dynamicAnimal:'priority',care:{material:['Compresses','Linge propre','Couverture'],assistant:'Surveillez sa respiration et ses réactions ; demandez du renfort si son état est inquiétant.'}},
 animalStep('Nature des blessures',['Repérer morsures, griffures et traces d’écrasement.','Inspecter aussi les zones moins visibles ; une petite ouverture peut cacher une lésion profonde.'],['« L’animal vous a-t-il mordu, griffé, ou les deux ? »','« Montrez-moi aussi les autres endroits qui vous font mal. »'],[
  animalChoice('Morsure isolée',{animalInjury:'bite',animalMultiplicity:'single'}),animalChoice('Griffure isolée',{animalInjury:'scratch',animalMultiplicity:'single'}),animalChoice('Morsures et griffures',{animalInjury:'mixed',animalMultiplicity:'multiple'}),animalChoice('Plusieurs morsures',{animalInjury:'bite',animalMultiplicity:'multiple'}),animalChoice('Plusieurs griffures',{animalInjury:'scratch',animalMultiplicity:'multiple'}),animalChoice('Nature / nombre non déterminés',{animalInjury:'unknown',animalMultiplicity:'unknown'})
 ]),
 animalStep('Zone principale',['Localiser la blessure principale et vérifier les autres zones atteintes.','Pour un membre, vérifier sensibilité, couleur et mouvement sans forcer.'],['« Où est la blessure qui vous gêne le plus ? »','« Sentez-vous encore normalement vos doigts ou vos orteils ? »'],[
  ...[['arm','Bras'],['hand','Main'],['leg','Jambe'],['foot','Pied']].flatMap(([area,label])=>[['left','gauche'],['right','droit'+(area==='hand'||area==='leg'?'e':'')]].map(([side,text])=>animalChoice(label+' '+text,{animalArea:area,animalSide:side}))),
  ...[['head','Tête / visage / cou'],['chest','Thorax'],['abdomen','Abdomen'],['back','Dos'],['unknown','Zone non déterminée']].map(([area,label])=>animalChoice(label,{animalArea:area,animalSide:'none'}))
 ]),
 animalStep('Aspect et fonction',['Observer profondeur apparente, souillures et bords de la plaie sans sonder à l’aveugle.','Rechercher perte de sensibilité, déformation ou mouvement impossible.','Ne pas conclure à une plaie bénigne sur la seule taille de l’ouverture.'],['« Ne forcez pas le mouvement. Je vérifie ce qui a pu être atteint. »','« Cette ouverture ne suffit pas à connaître la profondeur de la blessure. »'],[
  animalChoice('Atteinte superficielle, sans gêne de mouvement décrite',{animalDepth:'surface'}),animalChoice('Plaie profonde / perforante ou déchirure importante',{animalDepth:'deep'}),animalChoice('Écrasement, déformation ou fonction altérée',{animalDepth:'crush'}),animalChoice('Profondeur / fonction non évaluées',{animalDepth:'unknown'})
 ]),
 animalStep('Animal et circonstances',['Demander quel animal, quand et dans quelles circonstances ; ne pas déduire la rage de son agressivité seule.','Un animal sauvage ou inconnu et une exposition à la salive justifient une évaluation spécifique.'],['« Quel animal était-ce, et quand l’attaque a-t-elle eu lieu ? »','« Avez-vous remarqué un comportement inhabituel, ou de la salive sur une plaie ? »'],[
  animalChoice('Animal sauvage / inconnu ou non retrouvé',{animalExposure:'wild'}),animalChoice('Animal identifié, comportement inhabituel',{animalExposure:'unusual'}),animalChoice('Animal domestique identifié, sans anomalie rapportée',{animalExposure:'known'}),animalChoice('Circonstances non déterminées',{animalExposure:'unknown'})
 ]),
 {title:'Nettoyage et fermeture',dynamicAnimal:'clean',care:{material:['Eau propre disponible','Compresses','Pansement propre'],assistant:'Préparez le linge et le pansement ; ne mélangez pas des antiseptiques et ne sondez pas la plaie.'}},
 {title:'Soulager la douleur',dynamicAnimal:'pain',care:{products:animalAnalgesics,material:[],assistant:'Surveillez conscience et respiration si un antalgique a réellement été administré.'}},
 {title:'Protéger et soutenir',dynamicAnimal:'protect',care:{material:['Compresses','Bandage'],assistant:'Vérifiez que le bandage ne gêne pas ; préparez le transport si une orientation est nécessaire.'}},
 {title:'Contrôle et consignes',dynamicAnimal:'finish',care:{material:[],assistant:'Reprenez les signes à surveiller et aidez à organiser le contrôle, sans annoncer de guérison.'}}
]};
interventionMaterials.animal=['Eau propre disponible','Compresses / linge propre','Pansement et bandages','Attelle ou écharpe si atteinte du membre','Brancard si transport nécessaire'];
careMemoRows.animal=['Conscience · souffle · sang · toutes les plaies','Priorités ; examiner ; nettoyer si adapté ; protéger','Soin local adapté ; douleur évaluée, pas d’opiacé automatique','Plaie profonde / écrasement ; pas de suture automatique ; risque de rage à évaluer'];
sceneEndings.animal=['Reprendre les blessures observées et les soins réellement effectués, sans annoncer une fermeture ni une guérison automatique.','« Je veux revoir ces blessures. Prévenez-moi si la douleur, le saignement ou votre état changent. »','Garder le pansement propre, ménager la zone et organiser un contrôle rapproché. Poursuivre une évaluation spécialisée si exposition à la rage possible.','Saignement persistant, douleur croissante, rougeur qui s’étend, écoulement, fièvre, perte de sensibilité ou difficulté à bouger.'];
// Existing voluntary follow-up invitations remain available in their own category.
hooks.filter(h=>h.routes.includes('minor')||h.routes.includes('horse')).forEach(h=>h.routes.push('animal'));

function animalBleeding(){return answers.latestBleeding||answers.animalBleeding;}
function animalNeedsAssessment(){return ['deep','crush','unknown'].includes(answers.animalDepth)||['head','chest','abdomen','hand','foot'].includes(answers.animalArea)||answers.animalArea==='unknown';}
function animalUnsafe(){return careProductBlocked()||animalBleeding()==='unknown'||!answers.conscious;}
function animalRiskNote(){
 return answers.animalExposure==='known'?'Animal identifié : cela n’exclut pas à lui seul un risque de rage. Reprendre les circonstances et l’exposition à la salive avec un praticien compétent.':'Animal sauvage, inconnu, comportement inhabituel ou circonstances incertaines : faire évaluer rapidement une éventuelle exposition à la rage, même si la plaie paraît petite.';
}
function animalStepMarkup(step){
 const unsafe=animalUnsafe(),major=animalBleeding()==='major',multiple=answers.animalMultiplicity==='multiple';
 let actions=[],phrases=[],note='',products='';
 switch(step.dynamicAnimal){
  case 'priority':
   actions=[major?'Priorité au saignement important : compression adaptée avec du linge propre, surveillance et renfort ; ne pas retirer un objet fiché.':'Vérifier la respiration et les réactions ; contrôler un saignement léger si présent.','Si la respiration est absente ou difficile, organiser immédiatement une prise en charge prioritaire, avant les soins de plaie.','Réévaluer après les premiers gestes ; la fin de cette étape ne signifie pas une stabilisation.'];
   phrases=['« Je m’occupe d’abord de ce qui vous met en danger, puis je regarderai chaque blessure. »','« Restez auprès de lui ; prévenez-moi si sa respiration ou ses réactions changent. »'];break;
  case 'clean':
   if(unsafe)actions=['Suspendre le nettoyage non prioritaire : réévaluer conscience, souffle et saignement.','Protéger provisoirement les plaies et organiser du renfort.'];
   else actions=[multiple?'Examiner et nettoyer chaque plaie accessible séparément ; ne pas s’arrêter à la plus visible.':'Nettoyer la plaie accessible avec de l’eau propre et du linge adapté, sans exploration profonde à l’aveugle.',animalNeedsAssessment()?'Plaie à faire examiner : protéger et organiser une évaluation des tissus profonds, des nerfs et des vaisseaux.':'Protéger l’atteinte superficielle après le soin local ; rester attentif aux signes nouveaux.',answers.animalInjury==='scratch'?'Une griffure n’exige pas automatiquement des points : évaluer profondeur, souillures et nécessité de fermeture.':'Morsure ou nature incertaine : aucune fermeture automatique. Faire décider la conduite selon profondeur, souillures et localisation.'];
   phrases=['« Je vais nettoyer ce qui est accessible, sans fouiller la blessure. »','« Je préfère vérifier cette plaie avant de décider s’il faut la refermer. »'];
   note='Repère 1889 : les antiseptiques du lexique sont des préparations historiques, parfois toxiques. Aucun mélange ni dosage ici ; pas de phénol pur, de cautérisation ou de baume dans une morsure profonde. Aucun produit local ne prévient à lui seul la rage.';break;
  case 'pain':
   actions=['Installer confortablement et ménager la zone ; évaluer la douleur avant un produit.',unsafe?'Conscience, souffle ou saignement incertains / inquiétants : réévaluation avant tout opiacé.':'Si un antalgique est retenu, surveiller les réactions et la respiration ; la douleur soulagée n’exclut pas une lésion profonde.'];
   phrases=['« Sans bouger la zone blessée, dites-moi si la douleur reste supportable. »','« Nous allons vous soulager sans négliger la surveillance de la blessure. »'];
   products=unsafe?'':meds(animalAnalgesics);break;
  case 'protect':
   actions=[unsafe?'Protéger provisoirement les plaies pendant la prise en charge prioritaire ; ne pas banaliser un départ.':'Poser une protection propre adaptée, sans bandage trop serré.',answers.animalDepth==='crush'?'Soutenir le membre atteint sans forcer ; prévoir une évaluation de fracture ou de lésion profonde, sans diagnostic automatique.':'Ménager la zone blessée ; vérifier sensibilité et gêne après le pansement.',multiple?'Revérifier toutes les plaies et leurs pansements, pas seulement la zone principale.':'Rechercher un saignement qui reprend ou un signe nouveau.'];
   phrases=['« Dites-moi si le bandage serre, si vos doigts s’engourdissent ou si la douleur augmente. »'];break;
  case 'finish':
   actions=[unsafe?'État non rassurant ou incomplet : poursuivre la surveillance et organiser du renfort, pas une sortie automatique.':animalNeedsAssessment()?'Organiser l’évaluation de la blessure à risque avant de conclure ; un pansement ne suffit pas à écarter une lésion profonde.':'Prévoir un contrôle rapproché de la plaie et du pansement.','Expliquer : revenir si douleur croissante, rougeur qui s’étend, écoulement, fièvre, saignement ou perte de sensibilité.',animalRiskNote()];
   phrases=['« Je veux revoir la plaie pour vérifier son évolution, même si elle vous gêne moins. »','« Nous devons aussi examiner le risque lié à l’animal ; le pansement ne règle pas cette question. »'];
   note='<details class="animal-reference"><summary>Repère historique : rage et traitements</summary><p>La vaccination après exposition existe depuis 1885 ; l’Institut Pasteur ouvre en 1888. En 1889, il s’agit d’une prise en charge spécialisée à rechercher selon le lieu et les moyens, pas d’un flacon automatiquement disponible au cabinet. Ne pas attendre des symptômes pour demander cet avis. Ni antibiotiques modernes ni vaccination antitétanique de routine dans ce parcours.</p><small>Sources : <a href="https://www.pasteur.fr/fr/en-ce-moment/nos-actualites/actualites/lhistoire-de-la-premiere-vaccination-contre-la-rage-en-1885" target="_blank" rel="noopener">Institut Pasteur</a> ; <a href="https://www.cdc.gov/pinkbook/hcp/table-of-contents/chapter-21-tetanus.html" target="_blank" rel="noopener">Histoire de la vaccination antitétanique</a>. Repères historiques, pas des conseils médicaux actuels.</small></details>';break;
 }
 let html=section('À faire',actions)+sayLines(phrases)+products;
 if(note)html+=note.startsWith('<details')?note:`<details class="animal-reference"><summary>Repère de soin 1889</summary><p>${note}</p></details>`;
 if(['clean','protect','finish'].includes(step.dynamicAnimal)&&animalNeedsAssessment())html+='<div class="route-note">Plaie à risque : avis / renfort nécessaire. La fin des étapes ne confirme ni réparation ni sortie possible.</div>';
 return html;
}
