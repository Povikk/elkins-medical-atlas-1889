// Scene UI and transient navigation only. No records, storage or generated outcomes.
let sceneMode = false;
let flowHistory = [];
let interventionEnded = false;
let surgeryEnded = false;
let referenceTab = "meds";
let incidentKind = "";

function sceneToolbar(kind){
  return `<div class="scene-tools">
    <button type="button" class="secondary" aria-pressed="${sceneMode}" onclick="toggleSceneMode('${kind}')">En scène : ${sceneMode ? 'oui' : 'non'}</button>
    <button type="button" class="secondary" onclick="openSceneReferences()">Références</button>
    <button type="button" class="incident-button" onclick="openIncident()">Son état change</button>
  </div>`;
}
function toggleSceneMode(kind){
  sceneMode = !sceneMode;
  kind === 'surgery' ? renderSurgery() : render();
}
function shouldSkipStep(step){
  if(step.dynamicSuture && answers.needsSuture === false) return true;
  if(step.dynamicHorsePain && answers.horsePain === 'mild') return true;
  if(currentFlow === 'fracture' && step.title === 'Soulager la douleur' && answers.fracturePain === 'mild') return true;
  return false;
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
  const unable = /unconscious|not_breathing|unknown/.test(answers.conscious || '') || incidentKind;
  return `<div class="patient-question"><b>${unable ? 'Si le patient ne peut pas répondre' : 'À demander au joueur'}</b><p>${unable ? "Observe les signes visibles ou utilise une réponse incertaine. Ne lui impose pas une sensation." : question}</p></div>`;
}
function prepareSceneView(root){
  root.classList.toggle('scene-active',sceneMode);
  root.querySelectorAll('.rp-lines').forEach(block=>{
    if(sceneMode) [...block.children].slice(1).forEach(line=>line.remove());
  });
  if(!sceneMode) return;
  root.querySelectorAll(':scope > .section').forEach(section=>{
    const heading=section.querySelector('h3')?.textContent;
    if(!['Matériel','Médicament / produit'].includes(heading)) return;
    const assessment=section.querySelector('.pain-assessment');
    if(assessment) root.insertBefore(assessment,section);
    const details=document.createElement('details');
    details.className='scene-secondary';
    const summary=document.createElement('summary');
    summary.textContent=heading;
    details.append(summary);
    section.replaceWith(details);
    details.append(section);
  });
  [...root.querySelectorAll(':scope > .section')].find(section=>section.querySelector('h3')?.textContent==='À faire')?.classList.add('scene-primary');
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
function endingMarkup(kind){
  const surgery=kind==='surgery';
  const entry=surgery ? surgeries[currentSurgery] : flows[currentFlow];
  const notes=surgery ? ["Fin du parcours opératoire : reprendre uniquement les gestes effectivement joués.","« L'acte est fini, mais la surveillance continue. Nous allons vérifier votre état. »","Pansement, repos et surveillance prolongée selon la scène, sans guérison automatique.","Saignement, respiration, conscience, douleur et évolution de la plaie."] : sceneEndings[currentFlow];
  let variant='';
  if(!surgery && answers.needsSuture === true) variant='Des points ont été proposés dans le parcours : mentionne-les seulement si tu les as joués.';
  if(!surgery && answers.needsSuture === false) variant='Pas de points nécessaires selon tes choix : conclure sur le nettoyage et la protection.';
  if(!surgery && answers.needsSuture === 'avoid') variant='Fermeture simple écartée : ne pas annoncer une plaie refermée.';
  const unresolved=!surgery && (/unconscious|not_breathing|unknown/.test(answers.conscious || '') || ['unconscious','not_breathing'].includes(answers.headState) || ['unconscious','not_breathing'].includes(answers.poisonState) || ['no','weak'].includes(answers.breathing) || answers.unknownWake !== 'awake' && currentFlow==='unknown');
  return `<div class="section scene-ending"><span class="badge">${entry.title}</span><h2>${surgery ? 'Scène chirurgicale terminée' : 'Intervention terminée'}</h2>
    <p class="muted">Conclusion à adapter aux gestes et à l'évolution réellement joués. Aucun dossier n'est créé.</p>
    ${unresolved ? '<div class="route-note">Un signe inquiétant a été choisi dans ce parcours. La fin des étapes ne signifie pas que le patient peut repartir : réévalue son état dans la scène.</div>' : ''}
    <h3>Pour conclure la scène</h3><p>${notes[0]}</p>${variant ? `<p>${variant}</p>` : ''}
    ${sayLines([notes[1]])}<h3>Consignes RP</h3><p>${notes[2]}</p><h3>À surveiller / motif de retour</h3><p>${notes[3]}</p>
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
  const list=referenceTab==='meds' ? lexique : referenceTab==='equipment' ? equipmentLexicon : Object.entries(anatomyPlates).flatMap(([key,plate])=>plate.hotspots.map(spot=>({...spot,plate:plate.title})));
  const matches=list.map((item,index)=>({item,index})).filter(({item})=>normalize([item.name,item.label,item.tags,item.use,item.role,item.plate].join(' ')).includes(query)).sort((a,b)=>(a.item.name || a.item.label).localeCompare(b.item.name || b.item.label,'fr'));
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
  const data={
    conscious:['Réévaluer avant de poursuivre',['Suspendre le soin en cours.','Vérifier réaction à la voix, respiration et saignement visible.','Demander à un assistant de rester auprès du patient.'],'« Il ne me répond plus. Je vérifie sa respiration avant de continuer. »'],
    breathing:['La respiration devient prioritaire',['Suspendre le soin en cours.','Observer la respiration et dégager ce qui gêne le cou ou la poitrine.','Reprendre le parcours respiratoire si nécessaire.'],'« Arrêtez un instant, sa respiration a changé. Je m’en occupe d’abord. »'],
    bleeding:['Reprendre le contrôle du saignement',['Suspendre le soin en cours.','Maintenir la pression avec les compresses.','Prévoir une prise en charge plus lourde si le saignement ne ralentit pas.'],'« Gardez la pression ici. Nous reprendrons le reste après. »']
  }[kind];
  document.getElementById('incidentContent').innerHTML=`<h3>${data[0]}</h3><ul>${data[1].map(text=>`<li>${text}</li>`).join('')}</ul><div class="rp-lines">${data[2]}</div><p>La suite dépend de ce qui est effectivement joué, pas d'un résultat automatique.</p><div class="choices"><button type="button" class="choice" onclick="resolveIncident()">État stabilisé dans la scène : reprendre</button><button type="button" class="choice" onclick="escalateIncident()">Toujours inquiétant : réorienter</button></div>`;
}
function closeIncident(){incidentKind='';document.getElementById('incidentDialog').close();}
function resolveIncident(){
  // No automatic recovery assigned to the patient. Resume the same step, reassess pain.
  answers.rpPain='unknown';
  closeIncident();
  if(!document.getElementById('surgeryFlow').classList.contains('hidden')) renderSurgery();else render();
}
function escalateIncident(){
  const bleeding=incidentKind==='bleeding';
  document.getElementById('incidentContent').innerHTML=`<p>Ne reprends pas le soin tant que l'état reste inquiétant. Tu peux garder cette fenêtre pour jouer la surveillance, ou quitter volontairement le parcours actuel.</p><button type="button" class="next" onclick="closeIncident();${bleeding ? "openSurgery('major_bleeding')" : "start('unknown')"}">${bleeding ? 'Passer à Hémorragie majeure' : 'Passer à Patient inconscient / cause inconnue'}</button><p class="muted">Changer de parcours remet ses réponses à zéro. Fermer cette fenêtre conserve le soin actuel, sans affirmer que le patient va mieux.</p>`;
}
document.addEventListener('DOMContentLoaded',()=>{
  document.getElementById('incidentDialog').addEventListener('close',()=>{incidentKind='';});
});
