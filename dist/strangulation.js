// Fictional 1889 scene, not a modern emergency-care protocol.
// Risk boundaries: https://www.gloshospitals.nhs.uk/your-visit/patient-information-leaflets/injury-to-the-throat/
flows.strangulation={title:'Strangulation',urgency:'serious',steps:[
 {title:'État du patient',do:['Mettre fin à la compression et observer réactions et souffle ; ne pas attendre un récit complet.'],say:['« Vous m’entendez ? Je vérifie votre respiration. »'],choices:flows.gunshot.steps[0].choices.map(c=>({label:c.label,set:{...c.set}}))},
 {title:'Priorités après la compression',dynamicConscious:true,dynamicStrangPriority:true},
 {title:'Aspect du cou',do:['Observer le cou sans le comprimer, le masser ni forcer ses mouvements.'],say:['« Montrez-moi ce qui vous fait mal, sans tourner la tête de force. »'],choices:[
  {label:'Pas de marque visible au cou',set:{strangNeck:'none'}},
  {label:'Marques / bleu / douleur locale, peau intacte',set:{strangNeck:'bruise'}},
  {label:'Petite écorchure superficielle constatée',set:{strangNeck:'abrasion'}},
  {label:'Gonflement ou douleur importante du cou',set:{strangNeck:'swelling'}},
  {label:'Aspect non encore évalué',set:{strangNeck:'unknown'}}
 ]},
 {title:'Voix, déglutition et souffle',do:['Écouter la voix et demander la gêne pour avaler ; ne pas faire boire pour tester.'],say:['« Votre voix a-t-elle changé ? Avez-vous du mal à avaler ou à respirer ? »'],choices:[
  {label:'Voix habituelle, avale et respire sans gêne rapportée',set:{strangThroat:'normal'}},
  {label:'Voix rauque / changée',set:{strangThroat:'voice'}},
  {label:'Douleur / difficulté pour avaler',set:{strangThroat:'swallow'}},
  {label:'Voix changée et gêne pour avaler',set:{strangThroat:'both'}},
  {label:'Respiration difficile / bruyante',set:{strangThroat:'breathing'}},
  {label:'Impossible à évaluer',set:{strangThroat:'unknown'}}
 ]},
 {title:'Soins et surveillance',dynamicStrangCare:true,do:[],say:[]}
]};
caseEmoji.strangulation='26a0';
function strangulationDanger(){
 return careProductBlocked()||['unconscious_breathing','not_breathing','confused','unknown'].includes(answers.conscious)||['swelling','unknown'].includes(answers.strangNeck)||['voice','swallow','both','breathing','unknown'].includes(answers.strangThroat);
}
function strangulationCareStep(step){
 if(step.dynamicStrangPriority){
  const absent=answers.latestBreathing==='no'||!answers.latestState&&answers.conscious==='not_breathing';
  return {...step,dynamicConscious:false,do:[absent?'Absence de respiration constatée : prise en charge respiratoire prioritaire et renfort immédiat.':'Surveiller sans interruption les réactions et le souffle ; demander une prise en charge urgente.','Aucun produit oral, opiacé ou anesthésique pendant cette phase ; ne pas forcer le cou.','Recontrôler les réactions après les premiers gestes ; un réveil ne suffit pas à écarter une lésion.'],say:['« Restez auprès de lui et annoncez-moi tout changement de son souffle. »'],care:{material:['Couverture','Espace dégagé']}};
 }
 if(!step.dynamicStrangCare)return step;
 const danger=strangulationDanger();
 const actions=[danger?'Organiser un examen urgent et maintenir la surveillance des réactions, de la voix et du souffle.':'Reprendre l’examen du cou, de la voix et du souffle ; expliquer que l’absence de marques n’exclut pas une lésion.'];
 let material=['Couverture'];
 if(answers.strangNeck==='abrasion'&&!danger){actions.push('Nettoyer la petite écorchure accessible et la protéger avec une compresse ; antisepsie externe adaptée, sans bandage serré autour du cou.');material.push('Eau propre','Compresses','Préparation antiseptique externe adaptée');}
 else actions.push('Repos et protection de la zone ; aucun massage, maintien serré ou médicament systématique.');
 actions.push('Expliquer de revenir immédiatement pour voix changée, gêne pour avaler ou respirer, gonflement, malaise ou confusion ; ces signes peuvent apparaître plus tard.');
 return {...step,do:actions,say:[danger?'« Votre gêne demande un examen urgent. Je continue à surveiller votre souffle. »':'« Je ne vois pas de signe inquiétant décrit pour le moment, mais surveillez votre voix et votre souffle. »'],care:{material}};
}
function strangulationRoutineActs(step){
 if(step.dynamicStrangPriority){
  const absent=answers.latestBreathing==='no'||!answers.latestState&&answers.conscious==='not_breathing';
  return ['watch','Prise en charge urgente organisée',...(absent?['respiration']:[])];
 }
 const acts=['Examen du cou, de la voix et de la respiration','watch','Repos conseillé','Consignes sur les signes retardés expliquées'];
 if(strangulationDanger())acts.push('Prise en charge urgente organisée');
 else if(answers.strangNeck==='abrasion')acts.push('clean','antisepsis','dressing');
 return acts;
}
sceneEndings.strangulation=['Reprendre les réactions, l’aspect du cou, la voix et le souffle constatés.','« Revenez immédiatement si votre voix, votre respiration ou votre état changent. »','Repos et contrôle convenu après examen ; surveillance des signes retardés.','Voix changée, gêne pour avaler / respirer, gonflement, malaise ou confusion.'];
careMemoRows.strangulation=['Réactions · cou · voix · déglutition · souffle','Examiner et surveiller ; réveil ≠ absence de lésion','Compresses pour une petite plaie ; aucun opiacé automatique','Pas de marque visible ≠ absence de danger ; signes parfois retardés'];
interventionMaterials.strangulation=['Couverture','Linge propre','Compresses'];
