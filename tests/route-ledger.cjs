const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const element=()=>({innerHTML:'',textContent:'',dataset:{},classList:{add(){},remove(){},contains(){return false;}},querySelectorAll(){return [];},querySelector(){return null;},setAttribute(){},addEventListener(){},append(){}});
const context={console,document:{addEventListener(){},querySelectorAll(){return [];},querySelector(){return null;},getElementById(){return element();},createElement:element,documentElement:element()},localStorage:{getItem(){return null;},setItem(){}},hooks:[],caseEmoji:{},window:{addEventListener(){}},matchMedia:()=>({matches:false,addEventListener(){}}),innerWidth:1920,emojiIcon:()=>'',urgencyBadge:()=>'',normalize:s=>String(s).toLowerCase(),escapeHTML:s=>String(s)};
context.document.body=element();context.sleepingSurgery=()=>false;vm.createContext(context);
for(const file of ['data','surgery-extra','pharmacy','atlas-labels','lexicon-extra','icons','scene','rp-ui','care','app','condensed','care-memo','report','confirmations','animal','zones','hoof','route-products','zone-parts','fluid-loss','recovery','route-ledger','followup','consultation-products','route-layout'])vm.runInContext(fs.readFileSync(`dist/${file}.js`,'utf8'),context,{filename:file});
const run=source=>vm.runInContext(source,context);
run(`currentFlow='fluidLoss';activeRouteKind='flow';answers={lossBranch:'liquids',lossProfile:'heat',conscious:'awake'};stepIndex=flows.fluidLoss.steps.length-1;completeRoutineStep('flow')`);
assert.match(run('reportActualCare()'),/Eau potable proposée/);assert.doesNotMatch(run('reportActualCare()'),/fer prescrite/);
assert.match(run("reportFindings('flow')"),/Chaleur/);
assert.equal(run("lossCareStep(flows.fluidLoss.steps.find(s=>s.dynamicLossAssessment)).choices.length"),4);
run(`answers={lossBranch:'anemia',lossProfile:'iron',conscious:'awake'};completeRoutineStep('flow')`);
assert.doesNotMatch(run('reportActualCare()'),/fer prescrite|Eau potable/);
assert.equal(run("lossCareStep(flows.fluidLoss.steps.at(-1)).confirmActs.length"),1);
run(`careConfirm('act:Préparation de fer prescrite','done')`);assert.match(run('reportActualCare()'),/fer prescrite/);
run(`careInvalidateFrom(stepIndex)`);assert.doesNotMatch(run('reportActualCare()'),/fer prescrite/);
for(const profile of ['bloodloss','anemiaDanger','intolerance','dehydrationDanger']){
 run(`answers={lossBranch:'${['bloodloss','anemiaDanger'].includes(profile)?'anemia':'liquids'}',lossProfile:'${profile}',conscious:'awake'};completeRoutineStep('flow')`);
 assert.match(run('reportActualCare()'),/urgente organisée/);assert.doesNotMatch(run('reportActualCare()'),/Eau potable proposée|fer prescrite/);
}
run(`answers={lossBranch:'liquids',lossProfile:'heat',conscious:'unconscious_breathing'};completeRoutineStep('flow')`);assert.doesNotMatch(run('reportActualCare()'),/Eau potable proposée/);
assert.equal(run("lossCareStep(flows.fluidLoss.steps.at(-1)).med.length"),0);
assert(run("followupMenuKeys.includes('fluidLoss')"));
for(const profile of run('lossProfiles')){
 run(`answers={lossBranch:'${profile.branch}',lossProfile:'${profile.id}',conscious:'awake'};stepIndex=flows.fluidLoss.steps.length-1`);
 const html=run('render(true)');assert(!/undefined|NaN/.test(html));assert.match(run("reportFindings('flow')"),new RegExp(profile.label.slice(0,8)));
}
run(`answers={lossBranch:'anemia',lossProfile:'activeBleeding',conscious:'awake'};completeRoutineStep('flow')`);assert.match(run('reportActualCare()'),/Contrôle du saignement/);
run(`stepIndex=0;applyChoice({lossBranch:'liquids'})`);assert.equal(run('answers.lossProfile'),undefined);assert.doesNotMatch(run('reportActualCare()'),/saignement|fer prescrite/);
run(`currentFlow='hoof';activeRouteKind='flow';answers={conscious:'awake',hoofSigns:'bruise',hoofArea:'abdomen'};stepIndex=flows.hoof.steps.findIndex(s=>s.dynamicHoof);completeRoutineStep('flow');completeRoutineStep('flow');`);
assert.match(run('reportActualCare()'),/arnica/);assert.equal((run('reportActualCare()').match(/arnica/g)||[]).length,1);
run(`answers={conscious:'awake',hoofSigns:'wound',hoofArea:'arm'};completeRoutineStep('flow')`);
assert.match(run('reportActualCare()'),/Nettoyage/);assert.match(run('reportActualCare()'),/Antisepsie au phénol/);assert.doesNotMatch(run('reportActualCare()'),/arnica/);
run(`currentFlow='animal';answers={conscious:'awake',animalSpecies:'cougar',animalInjury:'bite',animalDepth:'deep',animalBleeding:'none'};stepIndex=flows.animal.steps.findIndex(s=>s.dynamicAnimal==='clean');completeRoutineStep('flow')`);
assert.match(run('reportActualCare()'),/Nettoyage/);assert.match(run("reportClosureMarkup('flow')"),/Fermeture/);
run(`careConfirm('product:Phénol / acide carbolique','used');careConfirm('closure','sutured');setSutureCount('7');`);
assert.match(run('reportActualCare()'),/phénol/i);assert.equal((run('reportActualCare()').match(/Antisepsie/g)||[]).length,1);assert.match(run('reportActualCare()'),/7 points/);assert.match(run('reportActualCare()'),/24 h/);
run(`careInvalidateFrom(stepIndex);`);
assert.doesNotMatch(run('reportActualCare()'),/phénol|Suture|Nettoyage/i);assert.equal(run('answers.sutureCount'),undefined);
run(`answers={animalBleeding:'major'};careConfirm('bleedingStatus','controlled');careInvalidateFrom(stepIndex)`);
assert.equal(run('answers.latestBleeding'),undefined);
run(`answers={latestBleeding:'major'};careConfirm('bleedingStatus','controlled');careConfirm('bleedingStatus','controlled')`);
assert.equal(run('answers.latestBleeding'),'major');
run(`currentFlow='drowning';answers={breathing:'yes'};stepIndex=flows.drowning.steps.findIndex(s=>s.title==='Réchauffer et surveiller');completeRoutineStep('flow')`);
assert.match(run('reportActualCare()'),/Réchauffement/);
run(`currentFlow='burn';answers={burnSeverity:'minor'};stepIndex=flows.burn.steps.findIndex(s=>s.dynamicBurn);completeRoutineStep('flow')`);
assert.match(run('reportActualCare()'),/Refroidissement/);
run(`currentFlow='gunshot';answers={conscious:'unconscious_breathing'};stepIndex=1;completeRoutineStep('flow');`);
assert.match(run('reportActualCare()'),/Sels odorants/);assert.doesNotMatch(run('reportActualCare()'),/Morphine/);
run(`currentSurgery='deep_bullet';activeRouteKind='surgery';answers={conscious:'unconscious_breathing'};surgeryStepIndex=4;completeRoutineStep('surgery');careConfirm('projectile','removed');careConfirm('closure','sutured');setSutureCount(4);`);
assert.match(run('reportActualCare()'),/Nettoyage/);assert.match(run('reportActualCare()'),/Projectile retiré/);assert.match(run('reportActualCare()'),/4 points/);
assert.doesNotMatch(run('reportConfirmedFindings()'),/Projectile retiré/);
run(`answers.reportDraft={surgery:{findings:reportFindings('surgery'),care:reportActualCare()+' Note personnelle.',generatedFindings:reportFindings('surgery'),generatedCare:reportActualCare()}};answers.reportClosure='none';syncReportDraft('surgery')`);
assert.match(run('answers.reportDraft.surgery.care'),/Note personnelle/);assert.match(run('answers.reportDraft.surgery.care'),/Sans suture/);assert.doesNotMatch(run('answers.reportDraft.surgery.care'),/4 points/);
run(`activeRouteKind='flow';currentFlow='horse';answers={conscious:'awake'};`);
assert.equal(run('routeScreenGroups().find(g=>g.length===3).length'),3);
assert.equal(run('routeScreenGroups().length'),6);
run(`currentFlow='animal';answers={conscious:'awake'};`);
assert.equal(run('routeScreenGroups().find(g=>g.length===3).length'),3);
assert.equal(run("flows.animal.steps.some(step=>step.dynamicAnimal==='context')"),false);
run("answers={conscious:'awake',animalSpecies:'cougar',animalInjury:'bite',animalExposure:'known'}");
assert.doesNotMatch(run("reportFindings('flow')"),/défensive|provocation|Rencontre en milieu sauvage/);
// Exercise metadata and generated HTML for every authored stage under varied observations.
assert.equal(run('Object.values(consultationProducts).flat().flatMap(p=>p.names).every(name=>lexique.some(item=>item.name===name))'),true,'Every product resolves to a historical lexicon card');
for(const id of ['fever','cough','fatigue','digestive','dental']){
 run(`currentFlow='${id}';activeRouteKind='flow';stepIndex=flows[currentFlow].steps.length-1;answers={conscious:'awake',consultEvolution:'stable'};`);
 assert.match(run('render(true)'),/Produit proposé selon la plainte/,'Consultation products rendered: '+id);
 run(`if('${id}'==='fatigue')setConsultationProfile('appetite');chooseConsultationProduct(0,'prescribed');`);
 assert.match(run('reportActualCare()'),/prescrit/,'Prescription enters recap');
 run(`chooseConsultationProduct(0,'given');`);
 assert.match(run('reportActualCare()'),/administré/);
 assert.doesNotMatch(run('reportActualCare()'),/prescrit/,'Only one administration decision');
 run(`chooseConsultationProduct(0,'given');`);
 assert.equal(run('answers.consultMedication'),undefined,'Decision can be cancelled');
 run(`answers.conscious='unconscious_breathing';chooseConsultationProduct(0,'given');`);
 assert.equal(run('answers.consultMedication'),undefined,'No oral medicine for unconscious patient');
 run(`currentFlow='followup_${id}';stepIndex=1;answers={followupFindings:['Amélioration rapportée']};if('${id}'==='fatigue')setConsultationProfile('appetite');chooseConsultationProduct(0,'given');`);
 assert.equal(run('answers.consultMedication'),undefined,'Follow-up checks ability to swallow');
 run(`setConsultationOralReady();chooseConsultationProduct(0,'given');`);
 assert.match(run('reportActualCare()'),/administré/);
 run(`toggleFollowupChoice('care',0)`);
 assert.ok(run('answers.consultMedication'),'Adding a care choice keeps the medicine');
 run(`followupNoCare()`);
 assert.equal(run('answers.consultMedication'),undefined,'Exam-only cancels medication');
}
run(`currentFlow='followup_digestive';stepIndex=1;answers={followupFindings:['Constipation persistante'],consultOralReady:true};`);
assert.equal(run('consultationProfile().id'),'constipation','Follow-up reuses symptom choice');
assert.equal(run("Object.keys(flows).filter(id=>!flows[id].followup&&id!=='unknown').every(id=>followupMenuKeys.includes(id))"),true,'Every visible intervention has a follow-up');
assert.equal(run("Object.keys(surgeries).every(id=>followupMenuKeys.includes('operation_'+id))"),true,'Every surgery has a follow-up');
assert.equal(run('new Set(followupMenuKeys).size'),run('followupMenuKeys.length'),'No duplicated follow-up cards');
assert.equal(run("followupMenuKeys.includes('sutures')"),false,'Duplicate sutured-wound card removed');
run(`var testOriginalStart=start;var patientSessions=[{number:1,state:{currentFlow:'gunshot',answers:{gunAreaSelections:[{...flows.gunshot.steps.find(s=>zoneKeyForStep(s)==='gunArea').choices[0],detail:'index'}]}}}];var activePatientNumber=1;start=id=>{currentFlow=id;stepIndex=0;answers={};};startFollowup('gunshot');start=testOriginalStart;`);
assert.equal(run('answers.followupZones.length'),1,'Matching patient intervention prefills zones');
assert.match(run('followupZoneLabels()'),/index/,'Precise location retained in reminder');
run(`start=id=>{currentFlow=id;stepIndex=0;answers={};};startFollowup('knife');start=testOriginalStart;`);
assert.equal(run('answers.followupZones.length'),0,'No location copied from a different intervention');
for(const source of ['gunshot','knife','horse','fracture','minor','animal','hoof']){
 run(`currentFlow='followup_${source}';stepIndex=0;answers={};`);
 assert.equal(run('JSON.stringify(followupZoneSource().choices)'),run(`JSON.stringify(flows.${source}.steps.find(s=>zoneKeyForStep(s)).choices)`),'Same zone catalogue: '+source);
 run(`toggleFollowupZone(0);toggleFollowupZone(1);`);
 assert.equal(run('answers.followupZones.length'),2,'Multiple locations retained: '+source);
 assert.match(run("reportFindings('flow')"),/Zones du suivi/);
 run(`stepIndex=1`);
 assert.match(run('render(true)'),/Zones du suivi/,'Location reminder on care screen');
 run(`toggleFollowupZone(0)`);
 assert.equal(run('answers.followupZones.length'),1,'Location can be deselected');
}
for(const id of run('followupMenuKeys')){
 run(`currentFlow='followup_${id}';activeRouteKind='flow';stepIndex=0;answers={};flowHistory=[];followupNext();`);
 assert.equal(run('stepIndex'),0,'Follow-up requires observations');
 run(`toggleFollowupChoice('findings',0);toggleFollowupChoice('findings',1);`);
 assert.ok(run('answers.followupFindings.length')>=1,'Follow-up offers observations');
 run(`if(followupZoneSource())toggleFollowupZone(0);`);
 run(`followupSetNote('Bras gauche');followupNext();`);
 assert.equal(run('stepIndex'),1);
 assert.match(run("reportFindings('flow')"),/Bras gauche/);
 run(`toggleFollowupChoice('care',0);completeRoutineStep('flow');`);
 assert.match(run('reportActualCare()'),new RegExp(run('followupType().care[0]')));
 run(`followupNoCare();completeRoutineStep('flow')`);
 assert.match(run('reportActualCare()'),/sans soin supplémentaire/);
 assert.equal(run('answers.followupCare.length'),0);
 run(`toggleFollowupChoice('care',0);`);
 assert.equal(run('answers.followupNoCare'),false);
 assert.match(run('followupEndingMarkup()'),/Suivi terminé/);
}
run(`currentFlow='followup_fever';stepIndex=0;answers={};toggleFollowupChoice('findings',0);toggleFollowupChoice('findings',2)`);
assert.deepEqual(JSON.parse(run('JSON.stringify(answers.followupFindings)')),['Fièvre aggravée'],'Contradictory fever observations excluded');
run(`currentFlow='followup_bruise';stepIndex=1;answers={followupFindings:['Plaie constatée']};toggleFollowupChoice('care',1);`);
assert.equal(run('(answers.followupCare||[]).length'),0,'No arnica selected without intact skin');
for(const [id,key,flag]of [['horse','horseVisible','dynamicHorseCare'],['fight','fightIssue','dynamicFightCare'],['hoof','hoofSigns','dynamicHoof'],['animal','animalDepth','dynamicAnimal']]){
 run(`currentFlow='${id}';activeRouteKind='flow';answers={conscious:'awake',${key}:'dislocation',horseArea:'arm',hoofArea:'arm',animalArea:'arm',animalSpecies:'cougar',animalInjury:'blunt',animalBleeding:'none'};stepIndex=flows[currentFlow].steps.findIndex(s=>${id==='animal'?"s.dynamicAnimal==='protect'":'s.'+flag});completeRoutineStep('flow');`);
 assert.equal(run(`flows[currentFlow].steps.some(s=>s.choices?.some(c=>c.set.${key}==='dislocation'))`),true,id+' has explicit option');
 assert.match(run("reportFindings('flow')"),/luxation possible/i,id+' findings');
 assert.match(run('reportActualCare()'),/Soutien \/ immobilisation/,id+' support');
 assert.doesNotMatch(run('reportActualCare()'),/arnica|Antisepsie|réduction effectuée/i,id+' no invented acts');
 assert.match(run('render(true)'),/sans forcer|sans le forcer|sans forcer l’articulation/i,id+' care instructions');
}
run(`currentFlow='horse';answers={conscious:'awake',horseVisible:'dislocation',horseArea:'arm'};stepIndex=flows.horse.steps.findIndex(s=>s.dynamicMovementQuestion)`);
assert.doesNotMatch(run('render(true)'),/applyChoice\(/,'No forced mobility choices for a deformed joint');
run(`let stages=0;for(const [id,route]of Object.entries(flows)){currentFlow=id;activeRouteKind='flow';for(const state of ['awake','unconscious_breathing','unknown']){answers={conscious:state,latestState:state==='awake'?'awake':undefined,animalSpecies:'cougar',animalInjury:'bite',animalDepth:'surface',animalBleeding:'none',hoofSigns:'bruise',hoofArea:'arm',minorIssue:'wound',burnSeverity:'minor',bullet:'out'};for(let i=0;i<route.steps.length;i++){stepIndex=i;const html=render(true);if(!html||/undefined|NaN/.test(html))throw Error(id+': invalid stage '+i);completeRoutineStep('flow');stages++;}if(!reportFindings('flow'))throw Error('Missing findings');}}for(const [id,route]of Object.entries(surgeries)){currentSurgery=id;activeRouteKind='surgery';answers={};for(let i=0;i<route.steps.length;i++){surgeryStepIndex=i;const html=renderSurgery(true);if(!html||/NaN/.test(html))throw Error(id+': invalid stage '+i);completeRoutineStep('surgery');stages++;}}console.log(stages+' stage renderings and care plans checked (DOM stub, not visual QA).');`);
console.log('Structured acts, products, suture count, invalidation, manual notes and screen groups passed.');
run(`
 render=()=>{};renderSurgery=()=>{};
 let runs=0;
 for(const [id,route]of Object.entries(flows))for(const last of [false,true]){
  currentFlow=id;activeRouteKind='flow';stepIndex=0;answers={};flowHistory=[];interventionEnded=false;
  for(let guard=0;guard<70&&!interventionEnded;guard++){
   const step=route.steps[stepIndex],key=zoneKeyForStep(step),choices=step.dynamicAnimal?animalChoicesForStep(step):step.choices;
   if(choices?.length){const choice=choices[last?choices.length-1:0];if(key){Object.assign(answers,choice.set);answers[key+'Selections']=[choice];answers[key+'Confirmed']=true;next(true);}else applyChoice(choice.set);}
   else next();
  }
  if(!interventionEnded)throw Error('Route did not end: '+id);runs++;
 }
 for(const id of Object.keys(surgeries)){currentSurgery=id;activeRouteKind='surgery';answers={};surgeryStepIndex=0;surgeryEnded=false;for(let guard=0;guard<20&&!surgeryEnded;guard++)nextSurgery();if(!surgeryEnded)throw Error('Surgery did not end: '+id);runs++;}
 console.log(runs+' route progression runs passed (first/last choices and all surgeries).');
 currentFlow='gunshot';activeRouteKind='flow';answers={conscious:'awake',bullet:'in'};stepIndex=flows.gunshot.steps.findIndex(s=>s.dynamic);careConfirm('projectile','removed');stepIndex=flows.gunshot.steps.findIndex(s=>s.choices?.some(c=>c.set.bullet));applyChoice({bullet:'out'});if(answers.careConfirmed.projectile)throw Error('Stale extraction survived branch change');
 currentFlow='knife';answers={conscious:'awake'};stepIndex=flows.knife.steps.findIndex(s=>s.title==='Nettoyer');for(const step of flows.knife.steps.slice(0,stepIndex)){if(step.choices){const choice=step.choices[0];Object.assign(answers,choice.set);const key=zoneKeyForStep(step);if(key){answers[key+'Selections']=[choice];answers[key+'Confirmed']=true;}}}const target=stepIndex+2;condensedMark(target,'flow');if(!reportActualCare().includes('Nettoyage'))throw Error('Condensed navigation omitted completed care');
`);
