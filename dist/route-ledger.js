// Explicit care metadata, shared by normal and condensed navigation. Transient only.
const careActs={exam:'Examen et réévaluation',bleeding:'Contrôle du saignement',clean:'Nettoyage de la plaie à l’eau propre',dressing:'Pansement posé',support:'Soutien / immobilisation',fresh:'Linge frais appliqué',arnica:'Baume à l’arnica appliqué sur peau intacte',zinc:'Onguent à l’oxyde de zinc appliqué',salts:'Sels odorants utilisés',respiration:'Soutien respiratoire',warm:'Réchauffement',cool:'Refroidissement de la brûlure',watch:'Surveillance des réactions et de la respiration',advice:'Consignes de repos et signes à surveiller expliqués'};
function ledgerId(kind,index){return `${kind}:${kind==='surgery'?currentSurgery:currentFlow}:${index}`;}
function woundObserved(){
 const a=answers;
 return ['gunshot','knife'].includes(currentFlow)||currentFlow==='minor'&&a.minorIssue==='wound'||currentFlow==='fight'&&a.fightIssue==='cut'||currentFlow==='horse'&&a.horseVisible==='wound'||currentFlow==='hoof'&&a.hoofSigns==='wound'||currentFlow==='animal'&&!animalIsVenom()&&animalHasWound();
}
function localCareReady(){
 // An anaesthetised surgical patient is not a reason to omit operative care.
 if(['minor','burn'].includes(currentFlow)&&!answers.conscious&&!answers.latestState&&!['no','weak','unknown'].includes(answers.latestBreathing))return true;
 return activeRouteKind==='surgery'||!careProductBlocked();
}
function routinePlan(step,kind){
 const a=answers,acts=[];const add=(...keys)=>acts.push(...keys);
 if(kind==='flow'&&step.dynamicLossCare)add(...lossRoutineActs());
 if(kind==='flow'&&step.dynamicStrangPriority)return strangulationRoutineActs(step);
 if(kind==='flow'&&step.dynamicStrangCare)add(...strangulationRoutineActs(step));
 if(kind==='flow'&&step.dynamicFollowup)return step.dynamicFollowup==='findings'?['Examen de suivi réalisé']:[...(a.followupCare||[]),...(a.followupNoCare?['Examen seul, sans soin supplémentaire']:[])];
 if(step.choices||zoneKeyForStep(step)||step.dynamicMovementQuestion)return acts;
 if(kind==='surgery'){
  if(step.ledgerActs)add(...step.ledgerActs);
 }else{
  if(step.dynamicConscious||step.dynamicHead||step.dynamicUnknownBreathing||step.dynamicBreathing||step.dynamicPoison||step.dynamicAnimal==='priority'){
   add('watch');
   const breathing=a.latestBreathing||a.breathing||a.unknownBreathing;
   if(breathing==='no'||a.conscious==='not_breathing')add('respiration');
   const state=a.latestState||a.conscious||a.headState||a.unknownWake||(currentFlow==='unknown'&&a.unknownBreathing==='yes'?'unconscious':undefined);
   if(['unconscious_breathing','unconscious','asleep'].includes(state)&&breathing!=='no'&&!step.dynamicPoison&&currentFlow!=='poison')add('salts');
   if(['major','minor'].includes(a.latestBleeding||a.animalBleeding||a.unknownBleeding))add('bleeding');
  }
  if(step.ledgerActs)add(...step.ledgerActs.filter(key=>!['clean','cool','arnica','zinc'].includes(key)||localCareReady()));
  if(step.dynamicUnknownBleeding&&['major','minor'].includes(a.unknownBleeding))add('bleeding');
  if(localCareReady()){
   if(step.dynamicSuture&&answers.needsSuture===true)add('clean');
   const local=step.dynamicHoof||step.dynamicHorseCare||step.dynamicFightCare||step.dynamicMinorCare||step.dynamicAnimal==='clean';
   if(local){
    if(woundObserved())add('clean','dressing');
    else if(currentFlow==='hoof'&&a.hoofSigns==='bruise'&&!zoneHas('hoofArea','unknown')||currentFlow==='horse'&&['bruise','swelling'].includes(a.horseVisible)||currentFlow==='fight'&&a.fightIssue==='bruise'||currentFlow==='minor'&&a.minorIssue==='bruise'||currentFlow==='animal'&&a.animalInjury==='blunt'&&a.animalDepth==='surface')add('fresh','arnica');
    else if(currentFlow==='minor'&&a.minorIssue==='irritation')add('zinc');
    if(currentFlow==='hoof'&&['function','dislocation'].includes(a.hoofSigns)||currentFlow==='horse'&&(['deformity','dislocation'].includes(a.horseVisible)||a.horseMove==='none')||currentFlow==='fight'&&a.fightIssue==='dislocation')add('support');
   }
   if(step.dynamicAnimal==='protect'){
    if(animalHasWound())add('dressing');
    if(['crush','dislocation'].includes(a.animalDepth)&&['arm','leg','hand','foot','shoulder','ankle'].some(z=>zoneHas('animalArea',z)))add('support');
   }
   if(step.dynamicBurn&&!['unknown','airway'].includes(a.burnSeverity))add('cool');
  }
 }
 // Antisepsis belongs to the acknowledged wound-care/preparation stage, not to an extra click.
 if(acts.includes('clean')&&!(kind==='flow'&&currentFlow==='animal'&&animalIsVenom()))add('antisepsis');
 if(kind==='surgery'&&step.ledgerAntisepsis)add('antisepsis');
 if((kind==='surgery'?surgeryStepIndex:stepIndex)===(kind==='surgery'?surgeries[currentSurgery]:flows[currentFlow]).steps.length-1)add('advice','watch');
 return [...new Set(acts)];
}
const ledgerTitles={
 gunshot:{'Contrôler le saignement':['bleeding'],'Traiter la blessure':['clean'],'Pansement':['dressing']},
 knife:{'Contrôler le saignement':['bleeding'],'Nettoyer':['clean'],'Pansement et repos':['dressing']},
 fracture:{'Immobiliser':['support']},drowning:{'Réchauffer et surveiller':['warm','watch']},
 head:{'Examiner la tête':['exam'],'Surveiller la commotion':['watch']},
 burn:{'Protéger la zone':['dressing']},poison:{'Soutenir la respiration':['watch'],'Surveillance prolongée':['watch']}
};
careActs.antisepsis='Antisepsie au phénol / acide carbolique, préparation externe adaptée';
const consultationActions={
 checkup:['Demander quels soins ont été effectués lors de la première visite.','Inspecter la plaie, le pansement ou l’immobilisation concernés.','Comparer douleur et aspect avec la précédente consultation.'],
 fever:['Observer frissons, sueurs et état général.','Demander depuis quand et ce qui accompagne la fièvre.','Ne pas attribuer une cause au seul signe de fièvre.'],
 cough:['Observer la respiration et écouter le récit du patient.','Demander depuis quand la toux dure et ce qui la déclenche.','Préciser la gêne pour parler, dormir ou travailler.'],
 fatigue:['Demander sommeil, travail, alimentation et évolution de la fatigue.','Observer pâleur et réactions du patient.','Ne pas conclure à une anémie sur la seule pâleur.'],
 digestive:['Demander où se situe la gêne, depuis quand et ce qui a changé.','Rechercher un repas ou un contexte commun avec d’autres personnes.','Ne pas proposer un purgatif pour une douleur inexpliquée.'],
 dental:['Demander quelle dent gêne, depuis quand et si manger devient difficile.','Observer la zone accessible avec un éclairage adapté.','Examiner avant de décider d’un geste ; aucune extraction automatique.']
};
for(const [id,actions]of Object.entries(consultationActions)){
 const examination=flows[id].steps.find(step=>step.title==='Comprendre la demande');examination.do=actions;examination.ledgerActs=['exam'];
 flows[id].steps.find(step=>step.title==='Évolution observée').do=['Préciser l’évolution rapportée par le patient.'];
 flows[id].steps.at(-1).do=['Expliquer les constatations et les points restant à vérifier.','Donner les signes à surveiller et convenir du contrôle.','Réévaluer les réactions et le souffle avant de terminer.'];
}
for(const [id,titles]of Object.entries(ledgerTitles))for(const step of flows[id].steps)if(titles[step.title])step.ledgerActs=titles[step.title];
const surgicalActs={amputation:{'Contrôler le saignement':['bleeding']}};
// Operative steps are explicitly marked in the authoring data below, not inferred from prose.
for(const [id,route]of Object.entries(surgeries)){
 for(const step of route.steps)if(surgicalActs[id]?.[step.title])step.ledgerActs=surgicalActs[id][step.title];
 route.steps.forEach(step=>{if(step.recovery)step.ledgerActs=['watch'];});
}
const surgicalChoices={amputation:[2,'Amputation'],major_bleeding:[3,'Ligature hémostatique'],abdominal:[3,'Traitement chirurgical de la lésion abdominale'],trepanation:[3,'Décompression par trépanation'],infected_wound:[2,'Nettoyage chirurgical / débridement'],open_fracture:[3,'Débridement des tissus lésés'],complex_wound:[3,'Nettoyage chirurgical / débridement'],strangulated_hernia:[3,'Traitement chirurgical de la hernie'],appendicitis:[3,'Intervention appendiculaire']};
for(const [id,[index,name]]of Object.entries(surgicalChoices))surgeries[id].steps[index].confirmActs=[name];
for(const route of Object.values(surgeries)){
 route.steps[0].ledgerActs=['exam','watch'];
 const closure=route.steps.filter(step=>!step.recovery).at(-1);
 closure.ledgerActs=[...(closure.ledgerActs||[]),'dressing','watch'];closure.closureDecision=true;
 const preparation=route.steps.find(step=>step.meds?.some(row=>/éther|chloroforme/i.test(row[0])));
 if(preparation)preparation.ledgerAntisepsis=true;
}
surgeries.major_bleeding.steps[2].ledgerAntisepsis=true;
surgeries.infected_wound.steps[2].ledgerActs=['clean'];
surgeries.deep_bullet.steps[4].ledgerActs=['clean','dressing'];
function completeRoutineStep(kind){
 const index=kind==='surgery'?surgeryStepIndex:stepIndex,route=kind==='surgery'?surgeries[currentSurgery]:flows[currentFlow];
 const step=route?.steps[index];if(!step)return;
 answers.completedCare={...(answers.completedCare||{}),[ledgerId(kind,index)]:routinePlan(step,kind).map(key=>careActs[key]||key)};
}
function careInvalidateFrom(index,kind='flow'){
 const route=kind==='surgery'?currentSurgery:currentFlow,prefix=`${kind}:${route}:`;
 answers.completedCare=Object.fromEntries(Object.entries(answers.completedCare||{}).filter(([key])=>!key.startsWith(prefix)||Number(key.slice(prefix.length))<index));
 const confirmed={...(answers.careConfirmed||{})},scopes={...(answers.careScopes||{})};
 for(const [key,scope]of Object.entries(scopes))if(scope.kind===kind&&scope.route===route&&scope.index>=index){
  if(key==='bleedingStatus'&&answers.latestBleeding===(confirmed[key]==='controlled'?'none':'major')){if(scope.priorBleeding===undefined)delete answers.latestBleeding;else answers.latestBleeding=scope.priorBleeding;}
  delete confirmed[key];delete scopes[key];if(key==='closure'){delete answers.reportClosure;delete answers.sutureCount;}
  if(key==='consultMedication')delete answers.consultMedication;
 }
 answers.careConfirmed=confirmed;answers.careScopes=scopes;
}
function careRegisterScope(key,index,kind){
 kind=kind|| (activeRouteKind==='surgery'?'surgery':'flow');
 const previous=answers.careScopes?.[key];
 answers.careScopes={...(answers.careScopes||{}),[key]:{kind,route:kind==='surgery'?currentSurgery:currentFlow,index:index??(kind==='surgery'?surgeryStepIndex:stepIndex),...(key==='bleedingStatus'?{priorBleeding:previous?previous.priorBleeding:answers.latestBleeding}:{})}};
}
function setSutureCount(value){
 answers.sutureCount=/^[1-9]\d{0,2}$/.test(String(value))?Number(value):null;
}
function reportActualCare(){
 const c=answers.careConfirmed||{},items=new Map();
 const add=(key,label)=>items.set(key,label);
 for(const label of Object.values(answers.completedCare||{}).flat())add(label,label);
 if(answers.consultMedication)add('consultMedication',consultationMedicationLabel());
 for(const [key,value]of Object.entries(c)){
  if(value==='used'&&key.startsWith('product:')){
   const name=key.slice(8);const alias=/phénol|carbol/i.test(name)?careActs.antisepsis:/arnica/i.test(name)?careActs.arnica:/sels odorants|ammoniaque/i.test(name)?careActs.salts:/zinc/i.test(name)?careActs.zinc:null;
   add(alias||key,alias||name+' utilisé');
  }
  if(value==='done'&&key.startsWith('act:')){const name=key.slice(4);add(name==='Nettoyage de la plaie'?careActs.clean:name,name==='Nettoyage de la plaie'?careActs.clean:name);}
 }
 if(c.projectile==='removed')add('extraction','Projectile retiré');
 if(c.projectile==='retained')add('extraction','Projectile laissé en place');
 if(answers.reportClosure==='sutured'){
  add('closure',answers.sutureCount?`Suture : ${answers.sutureCount} point${answers.sutureCount>1?'s':''}`:'Suture réalisée (nombre de points non renseigné)');
  add('followup','Contrôle de la plaie et du pansement dans 24 h ; retrait des points selon la cicatrisation');
 }else if(answers.reportClosure==='none')add('closure','Sans suture');
 else if(answers.reportClosure==='deferred')add('closure','Fermeture différée');
 return items.size?[...items.values()].join(' ; ')+'.':'Soins réalisés non renseignés.';
}
function syncReportDraft(kind){
 const draft=answers.reportDraft?.[kind];if(!draft)return;
 // Rebuild machine-owned fragments while retaining added or rewritten free text.
 for(const [field,source]of [['findings',reportFindings(kind)],['care',reportActualCare()]]){
  const generated=field==='care'?'generatedCare':'generatedFindings',previous=draft[generated];
  if(previous===undefined){draft[generated]=source;continue;}
  if(previous!==source){
   const parts=text=>String(text).replace(/\.$/,'').split(/\s*;\s*|\.\s+(?=[A-ZÀ-Ü])/).filter(Boolean);
   const old=new Set(parts(previous)),extra=parts(draft[field]).filter(part=>!old.has(part));
   draft[field]=[...new Set([...parts(source),...extra])].join(' ; ')+'.';draft[generated]=source;
  }
 }
}
