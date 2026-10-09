// Short fictional 1889 route. No doses, infusions or automatic diagnoses.
// Historical iron preparations: https://collection.sciencemuseumgroup.org.uk/objects/co196763/tabloid-medicine-chest-used-by-teddy-roosevelt-in-1909
// Safety boundary for oral fluids: https://www.nhs.uk/conditions/dehydration/
const lossProfiles=[
 {id:'digestive',branch:'liquids',label:'Diarrhée / vomissements ; conscient et peut garder une boisson'},
 {id:'heat',branch:'liquids',label:'Chaleur / sueurs / manque de boisson ; conscient et peut boire'},
 {id:'intolerance',branch:'liquids',label:'Vomissements persistants ; ne garde pas les boissons'},
 {id:'dehydrationDanger',branch:'liquids',label:'Malaise marqué, confusion ou faiblesse qui s’aggrave'},
 {id:'iron',branch:'anemia',label:'Anémie évaluée, carence en fer retenue ; état stable'},
 {id:'bloodloss',branch:'anemia',label:'Perte de sang récente rapportée ; aucun saignement externe visible'},
 {id:'activeBleeding',branch:'anemia',label:'Saignement externe encore visible'},
 {id:'anemiaDanger',branch:'anemia',label:'Essoufflement au repos, malaise marqué ou faiblesse aggravée'},
 {id:'unconfirmed',branch:'anemia',label:'Pâleur / faiblesse ; cause de l’anémie non établie'}
];
flows.fluidLoss={title:'Déperdition de liquides / Anémie profonde',urgency:'serious',steps:[
 {title:'Motif de la prise en charge',do:['Distinguer perte de liquides et problème lié au sang ; ne pas les traiter comme une même affection.'],say:['« Qu’est-ce qui vous amène : pertes de liquides ou faiblesse liée au sang ? »'],choices:[{label:'Déperdition de liquides',set:{lossBranch:'liquids'}},{label:'Anémie profonde / suspicion d’anémie',set:{lossBranch:'anemia'}}]},
 {title:'État du patient',do:['Observer les réactions et le souffle avant tout produit ou boisson.'],say:['« Vous m’entendez ? Restez au repos pendant l’examen. »'],choices:flows.gunshot.steps[0].choices.map(c=>({label:c.label,set:{...c.set}}))},
 {title:'Priorités vitales',dynamicConscious:true},
 {title:'Signes et circonstances',dynamicLossAssessment:true,do:[],choices:lossProfiles.map(p=>({label:p.label,set:{lossProfile:p.id}}))},
 {title:'Soins et consignes',dynamicLossCare:true,do:[],say:[]}
]};
caseEmoji.fluidLoss='1f4a7';
function lossCareStep(step){
 if(step.dynamicLossAssessment){
  if(!answers.lossBranch)return {...step,do:['Choisir d’abord le motif : déperdition de liquides ou anémie.'],choices:undefined};
  return {...step,do:answers.lossBranch==='liquids'?['Demander les pertes digestives, les sueurs, la soif et la possibilité de garder une boisson.','Observer bouche sèche, faiblesse et quantité d’urines rapportée.']:['Reprendre la fatigue, la pâleur, le souffle et toute perte de sang rapportée.','La pâleur seule ne confirme ni une anémie ni une carence en fer.'],choices:step.choices.filter(c=>lossProfiles.find(p=>p.id===c.set.lossProfile)?.branch===answers.lossBranch)};
 }
 if(!step.dynamicLossCare)return step;
 const p=lossProfiles.find(p=>p.id===answers.lossProfile),danger=careProductBlocked()||['dehydrationDanger','anemiaDanger','bloodloss','activeBleeding','intolerance'].includes(p?.id);
 let actions=['Mettre au repos et réévaluer réactions, souffle et faiblesse.'],material=['Couverture'],med=[],confirmActs=[];
 if(!p||p.branch!==answers.lossBranch)actions.push('Compléter les observations avant de choisir un traitement.');
 else if(danger){
  actions.push('Organiser une prise en charge urgente et maintenir la surveillance ; ne pas conclure à un simple manque de boisson ou de fer.');
  if(p.id==='activeBleeding'){actions.push('Contrôler le saignement externe visible avec un linge propre ; surveiller sa persistance.');material.push('Compresses / linge propre');}
  if(p.id==='bloodloss')actions.push('Reprendre la perte de sang rapportée et rechercher sa source ; ne pas supposer qu’elle est compensée par une boisson ou du fer.');
  actions.push('Ne pas forcer une boisson ni donner de produit oral à un patient confus, inconscient ou incapable de garder les liquides.');
 }else if(['digestive','heat'].includes(p.id)){
  actions.push('Proposer de l’eau potable, par petites prises, au patient conscient capable d’avaler ; vérifier qu’il la garde.','Éviter chaleur et effort ; comparer soif, réactions et faiblesse avant la fin.');material.push('Eau potable','Gobelet propre');
 }else if(p.id==='iron'){
  actions.push('Présenter une préparation de fer pour la carence retenue après examen ; ce traitement ne corrige pas immédiatement une anémie profonde.','Expliquer le repos, l’alimentation et le contrôle de la fatigue et du souffle.');
  med=[['Préparation de fer','Pilules ou préparation pharmaceutique de sel de fer','Voie orale, après examen et seulement si le patient peut avaler','Carence en fer retenue ; pas de traitement d’une hémorragie aiguë']];
  confirmActs=['Préparation de fer prescrite'];
 }else actions.push('Rechercher la cause avant toute préparation de fer ; aucune prescription martiale automatique sur la seule pâleur.');
 actions.push('Expliquer les signes de retour urgent : malaise, confusion, souffle difficile, saignement ou impossibilité de boire.');
 return {...step,do:actions,say:[answers.lossBranch==='liquids'?'« Nous allons surveiller ce que vous parvenez à boire et l’évolution de votre faiblesse. »':'« Nous devons comprendre cette faiblesse ; le fer ne remplace pas le sang perdu. »'],med,confirmActs,care:{material}};
}
function lossRoutineActs(){
 const p=lossProfiles.find(p=>p.id===answers.lossProfile);
 const acts=['exam','watch','Repos conseillé'];
 if(!p||p.branch!==answers.lossBranch)return acts;
 if(!careProductBlocked()&&['digestive','heat'].includes(p.id))acts.push('Eau potable proposée et tolérance vérifiée','Protection contre la chaleur et les efforts');
 if(['dehydrationDanger','anemiaDanger','bloodloss','activeBleeding','intolerance'].includes(p.id)||careProductBlocked())acts.push('Prise en charge urgente organisée');
 // Blood loss reported is not proof of an externally visible bleeding site.
 if(p.id==='bloodloss')acts.push('Pertes de sang recherchées');
 if(p.id==='activeBleeding')acts.push('bleeding');
 return acts;
}
sceneEndings.fluidLoss=['Reprendre le motif et les signes constatés.','« Prévenez-moi de tout malaise ou changement de votre souffle. »','Repos, réévaluation et contrôle des signes.','Confusion, souffle difficile, saignement ou impossibilité de boire.'];
careMemoRows.fluidLoss=['Réactions · souffle · pertes · faiblesse','Distinguer liquides et sang ; repos et examen','Eau si patient capable de boire ; fer seulement pour carence retenue','Malaise / confusion / souffle difficile : priorité urgente'];
interventionMaterials.fluidLoss=['Eau potable','Gobelet propre','Couverture','Linge propre'];
