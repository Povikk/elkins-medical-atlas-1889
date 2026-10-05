// Blunt trauma narrative, no diagnosis or treatment automatically performed.
flows.hoof={title:'Coup de sabot',urgency:'serious',steps:[
 {title:'État du patient',do:['Éloigner le patient de l’animal sans s’exposer.','Vérifier réactions, respiration et saignement important avant les questions.'],say:['« Vous m’entendez ? Ne vous relevez pas tout de suite. »'],choices:flows.gunshot.steps[0].choices.map(c=>({label:c.label,set:{...c.set}}))},
 {title:'Priorités vitales',dynamicConscious:true},
 {title:'Zones frappées',do:['Repérer chaque zone touchée ; ne pas limiter l’examen à la marque du sabot.'],say:['« Où le sabot vous a-t-il atteint ? Y a-t-il une autre zone douloureuse ? »'],choices:[...['Bras gauche','Bras droit','Main gauche','Main droite','Jambe gauche','Jambe droite','Pied gauche','Pied droit'].map((label,i)=>({label,set:{hoofArea:['arm','arm','hand','hand','leg','leg','foot','foot'][i],hoofSide:i%2?'right':'left'}})),...[['head','Tête / visage / cou'],['chest','Thorax / côtes'],['abdomen','Abdomen'],['back','Dos'],['unknown','Impossible à déterminer']].map(([value,label])=>({label,set:{hoofArea:value,hoofSide:null}}))]},
 {title:'Signes constatés',do:['Observer souffle, réactions et aspect local sans forcer les mouvements.'],say:['« Qu’est-ce qui a changé depuis le coup ? »'],choices:[{label:'Douleur locale / bleu, sans autre signe décrit',set:{hoofSigns:'bruise'}},{label:'Plaie visible',set:{hoofSigns:'wound'}},{label:'Déformation ou fonction diminuée',set:{hoofSigns:'function'}},{label:'Souffle difficile, malaise, confusion ou douleur qui augmente',set:{hoofSigns:'danger'}},{label:'Non évalué / impossible à déterminer',set:{hoofSigns:'unknown'}}]},
 {title:'Prise en charge selon les signes',dynamicHoof:true,do:[],say:['« Je vais adapter les soins à ce que nous avons constaté. »']},
 {title:'Soulagement facultatif',do:['Réévaluer douleur, réactions et souffle avant tout produit.','Privilégier calme, soutien et soin local ; aucun opiacé automatique.'],say:['« Décrivez-moi la douleur, si vous pouvez répondre. »'],med:[['Laudanum','Teinture d’opium liquide','Voie orale seulement si le patient peut répondre et avaler','Soulagement facultatif après évaluation'],['Morphine','Sel de morphine en solution injectable','Voie hypodermique historique, sous responsabilité du médecin','Douleur importante si état compatible']]},
 {title:'Réévaluation et consignes',do:['Reprendre réactions, souffle, douleur et chaque zone atteinte.','La petite taille d’un bleu ne suffit pas à écarter une lésion interne.','Si l’état reste incertain ou inquiétant, poursuivre la surveillance et organiser un avis ; pas de départ automatique.'],say:['« Nous revérifions votre état avant de décider de la suite. »','« Prévenez-moi si la douleur augmente, si vous vous sentez faible ou si votre souffle change. »']}
]};
zoneKeys.push('hoofArea');
function hoofCareStep(step){
 if(!step.dynamicHoof)return step;
 const sensitive=['head','chest','abdomen','back'].some(zone=>zoneHas('hoofArea',zone));
 const danger=answers.hoofSigns==='danger'||careProductBlocked();
 const simpleBruise=answers.hoofSigns==='bruise'&&!sensitive&&!danger&&!zoneHas('hoofArea','unknown');
 let say=step.say,med=[],material=[];
 let actions=sensitive?['Tête, thorax, abdomen ou dos : surveiller réactions, souffle et douleur ; demander un avis adapté même si les marques sont discrètes.','Ne pas forcer les mouvements ni entreprendre une chirurgie sur la seule localisation.']:['Protéger et soutenir les zones douloureuses sans tester de force leur mobilité.'];
 if(danger)actions=['Suspendre les gestes non prioritaires ; réévaluer conscience, souffle et saignement.','Organiser du renfort et une prise en charge adaptée ; ne pas attendre le récit complet du patient.'];
 else if(answers.hoofSigns==='wound')actions.push('Nettoyer une plaie accessible si adapté, puis la protéger ; plaie profonde ou souillée : avis, sans fermeture automatique.');
 else if(answers.hoofSigns==='function')actions.push('Soutenir le membre, contrôler sensibilité et circulation décrites ; orienter pour suspicion de fracture ou atteinte profonde.');
 else if(simpleBruise){
  actions.push('Contusion simple : laisser le membre au repos, proposer un linge frais et un baume à l’arnica facultatif sur peau intacte uniquement.','Ne pas déposer de baume dans une coupure ; arrêter si la peau réagit.');
  med=[['Préparation à l’arnica','Baume / pommade semi-solide','Application locale sur peau intacte uniquement','Soin local facultatif d’un bleu ; ne remplace pas la réévaluation']];
  material=['Linge frais','Baume à l’arnica, si utilisé'];
  say=['« Je vais poser un linge frais sur le bleu. Gardez ce membre au repos. »','« Si nous utilisons le baume, je l’appliquerai seulement là où la peau est intacte. Dites-moi si cela vous irrite. »'];
 }
 else if(answers.hoofSigns==='unknown')actions.push('Compléter les observations ; inconnu ne signifie pas blessure légère.');
 actions.push('Examiner chaque zone séparément ; un choix ne décrit pas automatiquement toutes les blessures.');
 if(danger)say=['« Nous nous occupons d’abord de votre état. Ne vous relevez pas ; je fais venir de l’aide. »'];
 else if(answers.hoofSigns==='wound'){material=['Compresses','Pansement'];say=['« Je vais nettoyer et protéger cette plaie. Pas de baume à l’intérieur. »'];}
 else if(answers.hoofSigns==='function'){material=['Attelle ou écharpe','Tissu rembourré'];say=['« Je vais soutenir ce membre sans le forcer. Nous devons examiner cette difficulté à le bouger. »'];}
 else if(sensitive)say=['« Même si la marque est petite, nous devons surveiller ce coup. Prévenez-moi si votre souffle ou votre douleur change. »'];
 return {...step,do:actions,say,med,care:{material}};
}
sceneEndings.hoof=['Reprendre les zones frappées et les signes réellement constatés, sans conclure à une simple contusion par défaut.','« Nous gardons les zones frappées sous observation ; prévenez-moi de tout changement. »','Repos et protection selon les soins effectués ; contrôle convenu, surveillance prolongée si état incertain.','Malaise, confusion, souffle difficile, douleur croissante, ventre tendu ou perte de fonction.'];
careMemoRows.hoof=['Zones frappées · réactions · souffle · douleur','Évaluer chaque zone ; protéger / soutenir ; orienter si inquiétant','Soin local adapté ; soulagement facultatif après évaluation','Tête / thorax / abdomen : lésion possible malgré peu de marques'];
caseEmoji.hoof='1f40e';
