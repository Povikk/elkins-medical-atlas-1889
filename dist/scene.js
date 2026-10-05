// Scene UI and transient navigation only. No records, storage or generated outcomes.
let flowHistory = [];
let interventionEnded = false;
let surgeryEnded = false;
let referenceTab = "meds";
let incidentKind = "";

function sceneToolbar(kind){
  return `<div class="scene-tools">
    <button type="button" class="secondary" onclick="reassessCare()">Réévaluer le patient</button>
    <button type="button" class="secondary" onclick="openSceneReferences()">Références</button>
    <button type="button" class="incident-button" onclick="openIncident()">Son état change</button>
  </div>`;
}
function shouldSkipStep(step){
  if(currentFlow==='minor'&&answers.minorIssue&&answers.minorIssue!=='wound'&&(step.dynamicSuture||step.title==='Faut-il refermer ?'))return true;
  if(currentFlow==='gunshot' && answers.bullet==='graze' && (step.dynamicSuture || step.title==='La plaie peut-elle être suturée ?')) return true;
  if(step.dynamicSuture && answers.needsSuture === false) return true;
  if(step.dynamicHorsePain && answers.horsePain === 'mild') return true;
  if(currentFlow === 'fracture' && step.title === 'Soulager la douleur' && answers.fracturePain === 'mild') return true;
  return false;
}
function sceneMaterialMarkup(kind){
  const surgery=kind==='surgery';
  const step=surgery?surgeries[currentSurgery].steps[surgeryStepIndex]:flows[currentFlow].steps[stepIndex];
  let probable=[...((surgery?surgeryMaterials[currentSurgery]:interventionMaterials[currentFlow]) || [])];
  if(surgery&&additionalSurgeries[currentSurgery])probable=[...new Set(surgeries[currentSurgery].steps.flatMap(stage=>stage.care?.material||[]))];
  if(!surgery){
    if(answers.needsSuture===false || answers.needsSuture==='avoid')probable=probable.filter(x=>!/suture/i.test(x));
    if(answers.bullet && answers.bullet!=='in')probable=probable.filter(x=>!/forceps/i.test(x));
    if(['mild','moderate','unsafe'].includes(answers.rpPain) || answers.horsePain==='mild' || answers.fracturePain==='mild')probable=probable.filter(x=>!/seringue/i.test(x));
  }
  const now=careMaterialForStep(step,kind);
  const list=items=>`<ul>${items.map(x=>`<li>${x}</li>`).join('')}</ul>`;
  return `<div class="material-panel"><h3>Matériel nécessaire</h3><h4>Pour cette étape</h4>${now.length?list(now):'<p>Aucun instrument particulier indiqué à cette étape : observation et préparation selon la scène.</p>'}<details><summary>Éventuellement pour la suite</summary>${list(probable)}<p class="muted">À préparer selon les choix à venir, pas à utiliser systématiquement. Les produits sont des alternatives, pas une liste à administrer.</p></details></div>`;
}
function visibleFlowSteps(){
  return flows[currentFlow].steps.map((step,index)=>({step,index})).filter(({step})=>!shouldSkipStep(step));
}
function patientQuestion(step){
  const keys = step.choices ? Object.keys(step.choices[0].set || {}) : [];
  const questions = {
    gunArea:"« Montrez-moi où vous avez mal, sans vous relever. »",
    knifeArea:"« Où ressentez-vous la douleur ? »",
    horseArea:"« Où avez-vous le plus mal depuis la chute ? »",
    horsePain:"« C'est supportable, ou la douleur vous empêche de bouger ? »",
    fracturePain:"« Comment décririez-vous la douleur, là, maintenant ? »",
    fightIssue:"« Qu'est-ce qui vous gêne le plus depuis les coups ? »"
  };
  const question = questions[keys[0]];
  if(!question) return '';
  const unable = ['asleep','unresponsive','uncertain'].includes(rpPatientState()) || incidentKind;
  return `<div class="patient-question"><b>${unable ? 'Si le patient ne peut pas répondre' : 'À demander au joueur'}</b><p>${unable ? "Observe les signes visibles ou utilise une réponse incertaine. Ne lui impose pas une sensation." : question}</p></div>`;
}
function flowRouteNote(){
  if(answers.needsSuture !== false) return '';
  const previous=flows[currentFlow].steps[stepIndex-1];
  if(!previous?.dynamicSuture) return '';
  return `<div class="route-note">Pas de points dans ce parcours : nettoyer et protéger la petite plaie. « Je vais simplement nettoyer et poser un pansement. »</div>`;
}

const sceneEndings = {
  unknown:["Réévaluation de la conscience, de la respiration et du saignement.","« Je reste avec vous. Nous allons poursuivre la surveillance. »","Ne conclure à une amélioration que si elle est jouée. Si la cause reste inconnue, poursuivre la prise en charge.","Absence de réveil, respiration inquiétante ou nouveau saignement."],
  gunshot:["Évaluation de la blessure, soins locaux et protection selon le parcours.","« Les soins de cette étape sont finis. Je vais encore vérifier comment vous vous sentez. »","Ménager la zone blessée et prévoir une réévaluation dans le RP.","Douleur qui augmente, saignement qui reprend, malaise ou gêne respiratoire."],
  knife:["Évaluation de la plaie, contrôle du saignement et protection.","« Je vais vérifier une dernière fois la plaie et votre état. »","Garder le pansement propre et prévoir un contrôle.","Nouveau saignement, douleur croissante, fièvre ou malaise."],
  fight:["Soins adaptés au signe principal et vérification finale.","« Avant de vous laisser, dites-moi ce qui vous gêne encore. »","Repos adapté à la scène ; réévaluation si les symptômes changent.","Confusion, douleur thoracique, essoufflement ou aggravation."],
  horse:["Examen de la zone douloureuse et soins adaptés aux observations.","« Comment vous sentez-vous maintenant par rapport au début ? »","Ménager la zone ; pas d'appui forcé si la douleur ou la mobilité restent inquiétantes.","Vertiges, douleur croissante, perte de sensibilité ou difficulté à bouger."],
  fracture:["Examen et immobilisation du membre selon la scène.","« Le membre est protégé. Dites-moi si les doigts deviennent engourdis ou si la douleur change. »","Repos et suivi RP ; ne pas faire jouer une guérison immédiate.","Perte de sensibilité, changement de couleur ou douleur qui augmente."],
  minor:["Observation et soin local de la zone.","« Dites-moi si ça tire encore. Je vous explique comment surveiller la zone. »","Garder la zone protégée et ménager les frottements.","Douleur croissante, rougeur qui s'étend, écoulement ou fièvre."],
  drowning:["Mise à l'abri et surveillance respiratoire dans la scène.","« Je reste avec vous pour vérifier que la respiration ne se dégrade pas. »","Ne pas confondre réveil et fin du risque ; poursuivre la surveillance RP.","Toux ou gêne respiratoire qui s'aggrave, somnolence ou malaise."],
  head:["Observation de la conscience et surveillance après le choc.","« Nous allons encore vous surveiller. Dites-moi si vous vous sentez différent. »","Pas de guérison déduite du seul réveil ; poursuivre la surveillance dans la scène.","Vomissements, confusion, somnolence ou perte de connaissance."],
  burn:["Évaluation, protection locale et surveillance.","« La zone est protégée. Je veux savoir si la douleur ou la respiration change. »","Repos et contrôle adapté à l'étendue jouée.","Gêne respiratoire, malaise ou aggravation de la douleur."],
  poison:["Recherche du produit et surveillance de la conscience et de la respiration.","« Même si vous vous sentez mieux, je vais encore vous surveiller. »","Pas de sortie automatique après un réveil ; prolonger la surveillance dans le RP.","Somnolence croissante, respiration faible ou perte de connaissance."]
};
const surgeryEndings={
  amputation:['Reprendre uniquement l’acte et le pansement effectivement joués.','« Nous avons fini les gestes prévus. La surveillance continue avant toute autre décision. »','Repos, protection de la zone opérée et contrôle du pansement dans la scène.','Reprise du saignement, pâleur, douleur, respiration ou conscience qui changent.'],
  major_bleeding:['Vérifier à nouveau le saignement, sans présumer que la ligature a suffi.','« Je vais revérifier le saignement et votre état avant de poursuivre. »','Rester sous surveillance RP ; ne pas annoncer un départ après la seule fin des gestes.','Saignement qui reprend, faiblesse, pâleur ou perte de connaissance.'],
  deep_bullet:['Préciser si le projectile a réellement été retiré ou si l’exploration a été interrompue.','« Je vous expliquerai ce qui a pu être fait, puis la suite de la surveillance. »','Contrôle de la plaie et du pansement ; expliquer si le projectile reste en place dans la scène.','Saignement, douleur croissante, malaise ou changement de respiration.'],
  abdominal:['Reprendre les gestes joués sans conclure que toutes les lésions internes sont réparées.','« La surveillance reste importante après ces gestes. Nous allons rester auprès de vous. »','Repos et surveillance prolongée dans le RP ; aucune guérison ou sortie automatique.','Douleur abdominale, ventre qui se tend, faiblesse, saignement ou conscience qui changent.'],
  trepanation:['La fin du geste ne garantit ni réveil ni amélioration.','« Nous allons continuer à observer ses réactions et sa respiration. »','Surveillance prolongée de la conscience et de l’évolution jouée, même après un réveil.','Confusion, somnolence, vomissements, respiration ou réactions qui changent.'],
  infected_wound:['Reprendre le nettoyage et le drainage réellement joués ; ne pas annoncer l’infection guérie.','« Le soin ne termine pas la surveillance de cette plaie. Je veux la revoir dans la scène. »','Prévoir une inspection et le renouvellement du pansement selon le RP.','Fièvre, douleur croissante, rougeur qui s’étend ou nouvel écoulement.']
};
Object.entries(additionalSurgeries).forEach(([id,entry])=>surgeryEndings[id]=entry.ending);
function endingMarkup(kind){
  const surgery=kind==='surgery';
  const entry=surgery ? surgeries[currentSurgery] : flows[currentFlow];
  const notes=surgery ? surgeryEndings[currentSurgery] : currentFlow==='animal'?animalEndingNotes():sceneEndings[currentFlow];
  rpPhraseBlocks=[];
  let variant='';
  if(!surgery && answers.needsSuture === true) variant='Des points ont été proposés dans le parcours : mentionne-les seulement si tu les as joués.';
  if(!surgery && answers.needsSuture === false) variant='Pas de points nécessaires selon tes choix : conclure sur le nettoyage et la protection.';
  if(!surgery && answers.needsSuture === 'avoid') variant='Fermeture simple écartée : ne pas annoncer une plaie refermée.';
  const unresolved=['asleep','unresponsive','uncertain','confused'].includes(rpPatientState()) || ['no','weak'].includes(answers.latestBreathing || answers.breathing || answers.unknownBreathing) || (answers.latestBleeding||answers.animalBleeding)==='major' || (!surgery&&currentFlow==='animal'&&(animalNeedsAssessment()||animalUnsafe()));
  return `<div class="section scene-ending"><span class="badge">${entry.title}</span><h2>${surgery ? 'Scène chirurgicale terminée' : 'Intervention terminée'}</h2>
    <p class="muted">Conclusion à adapter aux gestes et à l'évolution réellement joués. Aucun dossier n'est créé.</p>
    ${rpChoicesMarkup()}
    ${sceneToolbar(kind)}
    ${unresolved ? '<div class="route-note">Un signe inquiétant a été choisi dans ce parcours. La fin des étapes ne signifie pas que le patient peut repartir : réévalue son état dans la scène.</div>' : ''}
    <h3>Pour conclure la scène</h3><p>${notes[0]}</p>${variant ? `<p>${variant}</p>` : ''}
    ${sayLines([notes[1]])}<h3>Consignes RP</h3><p>${notes[2]}</p><h3>À surveiller / motif de retour</h3><p>${notes[3]}</p>
    ${reportMarkup(kind)}
    <div class="nav"><button class="secondary" onclick="${surgery ? 'surgeryEnded=false;renderSurgery()' : 'interventionEnded=false;render()'}">Revoir la dernière étape</button><button class="next" onclick="${surgery ? 'showSurgery()' : 'showCases()'}">${surgery ? 'Autre chirurgie' : 'Nouvelle intervention'}</button><button class="secondary" onclick="goHome()">Accueil</button></div></div>`;
}

function openSceneReferences(index){
  const dialog=document.getElementById('sceneReferenceDialog');
  referenceTab='meds';
  document.getElementById('sceneReferenceSearch').value='';
  renderSceneReferences();
  if(Number.isInteger(index)) showSceneReferenceItem(index);
  dialog.showModal();
}
function closeSceneReferences(){hideAnatomyTooltip();document.getElementById('sceneReferenceDialog').close();}
function setSceneReferenceTab(tab){
  referenceTab=tab;
  document.getElementById('sceneReferenceSearch').value='';
  renderSceneReferences();
}
function renderSceneReferences(){
  document.querySelectorAll('[data-scene-ref]').forEach(button=>{button.classList.toggle('active',button.dataset.sceneRef===referenceTab);button.setAttribute('aria-pressed',String(button.dataset.sceneRef===referenceTab));});
  const normalize=text=>String(text).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  const query=normalize(document.getElementById('sceneReferenceSearch').value.trim());
  const list=referenceTab==='meds' ? lexique : referenceTab==='equipment' ? equipmentLexicon : referenceTab==='symptoms'?symptomLexicon:Object.entries(anatomyPlates).flatMap(([key,plate])=>plate.hotspots.map(spot=>({...spot,plate:plate.title})));
  const matches=list.map((item,index)=>({item,index})).filter(({item})=>normalize([item.name,item.label,item.tags,item.category,item.use,item.role,item.plate,item.desc,item.rp].join(' ')).includes(query)).sort((a,b)=>(a.item.name || a.item.label).localeCompare(b.item.name || b.item.label,'fr'));
  document.getElementById('sceneReferenceContent').innerHTML=matches.length ? `<div class="reference-picker">${matches.map(({item,index})=>`<button type="button" class="secondary" onclick="showSceneReferenceItem(${index})">${item.name || item.label}${item.plate ? ` <small>(${item.plate})</small>` : ''}</button>`).join('')}</div>` : '<p>Aucun résultat.</p>';
}
function showSceneReferenceItem(index){
  let html='';
  if(referenceTab==='meds'){
    const item=lexique[index];if(!item) return;
    html=`<h3>${item.name}</h3><span class="cat-badge">${item.category}</span><p><b>Forme :</b> ${item.form}</p><p><b>Administration :</b> ${item.admin}</p><p><b>Usage RP :</b> ${item.use}</p><p><b>Composition :</b> ${item.composition || item.form}</p><p><b>Précautions :</b> ${item.warning || 'Référence historique, pas un conseil de soin réel.'}</p>${item.sensory || sensoryCue(item.name) ? `<p><b>Sensations / odeur :</b> ${item.sensory || sensoryCue(item.name)[1]}</p>` : ''}`;
  } else if(referenceTab==='equipment'){
    const item=equipmentLexicon[index];if(!item)return;
    html=`<h3>${item.name}</h3><p>${item.desc}</p><p><b>Usage RP :</b> ${item.use}</p>`;
  } else if(referenceTab==='symptoms'){
    const item=symptomLexicon[index];if(!item)return;
    html=`<h3>${item.name}</h3><p>${item.desc}</p><p><b>Observation RP :</b> ${item.rp}</p><small>Un signe isolé ne décide pas du diagnostic.</small>`;
  } else {
    const items=Object.values(anatomyPlates).flatMap(plate=>plate.hotspots.map(spot=>({plate,spot})));
    if(!items[index])return;
    html=anatomyInfoMarkup(items[index].plate,items[index].spot);
  }
  document.getElementById('sceneReferenceContent').innerHTML=`<button type="button" class="secondary" onclick="renderSceneReferences()">Retour aux références</button><article class="reference-detail">${html}</article>`;
}
function medicineReferenceButton(name){
  const normalize=value=>value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’']/g,' ');
  const n=normalize(name);
  const index=lexique.findIndex(item=>normalize(item.name)===n || normalize(item.name).split(' / ')[0]===n.split(' / ')[0] || /arnica/.test(n) && /arnica/.test(item.name) || /sels|ammoniaque/.test(n) && /ammoniaque/i.test(item.name));
  return index<0 ? '' : `<button type="button" class="reference-link" onclick="openSceneReferences(${index})">Voir la fiche</button>`;
}

function openIncident(){
  incidentKind='';
  const content=document.getElementById('incidentContent');
  content.innerHTML=`<p>Choisis ce que le joueur vient de décrire ou ce que tu observes. Le soin reste à son étape actuelle.</p><div class="choices">${[['conscious','Il perd connaissance'],['breathing','Sa respiration devient difficile'],['bleeding','Le saignement augmente']].map(([key,label])=>`<button type="button" class="choice" onclick="selectIncident('${key}')">${label}</button>`).join('')}</div>`;
  document.getElementById('incidentDialog').showModal();
}
function selectIncident(kind){
  incidentKind=kind;
  careObservationDirty=true;
  if(kind==='conscious')answers.latestState='unresponsive';
  if(kind==='breathing')answers.latestBreathing='weak';
  if(kind==='bleeding')answers.latestBleeding='major';
  const data={
    conscious:['Réévaluer avant de poursuivre',['Suspendre le soin en cours.','Vérifier réaction à la voix, respiration et saignement visible.','Demander à un assistant de rester auprès du patient.'],'« Il ne me répond plus. Je vérifie sa respiration avant de continuer. »'],
    breathing:['La respiration devient prioritaire',['Suspendre le soin en cours.','Observer la respiration et dégager ce qui gêne le cou ou la poitrine.','Reprendre le parcours respiratoire si nécessaire.'],'« Arrêtez un instant, sa respiration a changé. Je m’en occupe d’abord. »'],
    bleeding:['Reprendre le contrôle du saignement',['Suspendre le soin en cours.','Maintenir la pression avec les compresses.','Prévoir une prise en charge plus lourde si le saignement ne ralentit pas.'],'« Gardez la pression ici. Nous reprendrons le reste après. »']
  }[kind];
  document.getElementById('incidentContent').innerHTML=`<h3>${data[0]}</h3><ul>${data[1].map(text=>`<li>${text}</li>`).join('')}</ul><div class="rp-lines">${data[2]}</div><p>La suite dépend de ce qui est effectivement joué, pas d'un résultat automatique.</p><div class="choices"><button type="button" class="choice" onclick="resolveIncident()">État stabilisé dans la scène : reprendre</button><button type="button" class="choice" onclick="escalateIncident()">Toujours inquiétant : réorienter</button></div>`;
}
function closeIncident(){incidentKind='';document.getElementById('incidentDialog').close();if(careObservationDirty){careObservationDirty=false;refreshCare();}}
function resolveIncident(){
  // No automatic recovery assigned to the patient. Resume the same step, reassess pain.
  answers.rpPain='unknown';
  closeIncident();reassessCare();
}
function escalateIncident(){
  const bleeding=incidentKind==='bleeding';
  document.getElementById('incidentContent').innerHTML=`<p>Ne reprends pas le soin tant que l'état reste inquiétant. Tu peux garder cette fenêtre pour jouer la surveillance, ou quitter volontairement le parcours actuel.</p><button type="button" class="next" onclick="closeIncident();${bleeding ? "openSurgery('major_bleeding')" : "start('unknown')"}">${bleeding ? 'Passer à Hémorragie majeure' : 'Passer à Patient inconscient / cause inconnue'}</button><p class="muted">Changer de parcours remet ses réponses à zéro. Fermer cette fenêtre conserve le soin actuel, sans affirmer que le patient va mieux.</p>`;
}
document.addEventListener('DOMContentLoaded',()=>{
  document.getElementById('incidentDialog').addEventListener('cancel',()=>{if(careObservationDirty){careObservationDirty=false;refreshCare();}});
  document.getElementById('incidentDialog').addEventListener('close',()=>{incidentKind='';if(careObservationDirty){careObservationDirty=false;refreshCare();}});
});
