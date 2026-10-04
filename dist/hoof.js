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
 const danger=answers.hoofSigns==='danger'||answers.latestBreathing==='weak'||answers.latestBreathing==='no'||answers.latestState==='unresponsive';
 let actions=sensitive?['Tête, thorax, abdomen ou dos : surveiller réactions, souffle et douleur ; demander un avis adapté même si les marques sont discrètes.','Ne pas forcer les mouvements ni entreprendre une chirurgie sur la seule localisation.']:['Protéger et soutenir les zones douloureuses sans tester de force leur mobilité.'];
 if(danger)actions=['Suspendre les gestes non prioritaires ; réévaluer conscience, souffle et saignement.','Organiser du renfort et une prise en charge adaptée ; ne pas attendre le récit complet du patient.'];
 else if(answers.hoofSigns==='wound')actions.push('Nettoyer une plaie accessible si adapté, puis la protéger ; plaie profonde ou souillée : avis, sans fermeture automatique.');
 else if(answers.hoofSigns==='function')actions.push('Soutenir le membre, contrôler sensibilité et circulation décrites ; orienter pour suspicion de fracture ou atteinte profonde.');
 else if(answers.hoofSigns==='bruise'&&!sensitive)actions.push('Pour une contusion simple constatée : repos et linge frais ; arnica facultative seulement sur peau intacte.');
 else if(answers.hoofSigns==='unknown')actions.push('Compléter les observations ; inconnu ne signifie pas blessure légère.');
 actions.push('Examiner chaque zone séparément ; un choix ne décrit pas automatiquement toutes les blessures.');
 return {...step,do:actions,care:{material:answers.hoofSigns==='wound'?['Compresses','Pansement']:answers.hoofSigns==='function'?['Attelle ou écharpe','Tissu rembourré']:[]}};
}
sceneEndings.hoof=['Reprendre les zones frappées et les signes réellement constatés, sans conclure à une simple contusion par défaut.','« Nous gardons les zones frappées sous observation ; prévenez-moi de tout changement. »','Repos et protection selon les soins effectués ; contrôle convenu, surveillance prolongée si état incertain.','Malaise, confusion, souffle difficile, douleur croissante, ventre tendu ou perte de fonction.'];
careMemoRows.hoof=['Zones frappées · réactions · souffle · douleur','Évaluer chaque zone ; protéger / soutenir ; orienter si inquiétant','Soin local adapté ; soulagement facultatif après évaluation','Tête / thorax / abdomen : lésion possible malgré peu de marques'];
caseEmoji.hoof='1f40e';
