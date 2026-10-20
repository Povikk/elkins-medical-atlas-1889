// Overview shares the detailed renderer and branch rules. No second medical decision engine.
function condensedEscape(text){return String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function condensedStepChoices(raw){
 const groups=[...raw.querySelectorAll('.choices')];
 return groups.flatMap(group=>[...group.querySelectorAll('button.choice')].map(button=>({label:button.textContent.trim(),set:JSON.parse(button.getAttribute('onclick').match(/^applyChoice\((.*)\)$/)[1])})));
}
function renderCondensed(kind){
 const surgery=kind==='surgery',root=document.getElementById(surgery?'surgeryFlow':'flow');
 const route=surgery?surgeries[currentSurgery]:flows[currentFlow];
 const saved={index:stepIndex,surgeryIndex:surgeryStepIndex,title:activeStepTitle,kind:activeRouteKind};
 activeRouteKind=kind;
 const stages=surgery?route.steps.map((step,index)=>({step,index})):visibleFlowSteps();
 // Future conditional instructions stay unresolved until preceding observations are chosen.
 let unresolved=false;
 const cards=[];
 try{
  stages.forEach(({step,index},position)=>{
   stepIndex=surgery?saved.index:index;surgeryStepIndex=surgery?index:saved.surgeryIndex;
   const raw=document.createElement('div');raw.innerHTML=surgery?renderSurgery(true):render(true);
   const choices=condensedStepChoices(raw);
   const selected=choices.findIndex(c=>Object.entries(c.set).every(([key,value])=>answers[key]===value));
   const pending=unresolved;
   const dynamic=Object.keys(step).some(key=>key.startsWith('dynamic')&&step[key]);
   const current=index===(surgery?saved.surgeryIndex:saved.index);
   let body='';
   if(pending&&dynamic){body='<p class="muted">La marche à suivre sera précisée après les choix précédents.</p>';}
   else{
    const sections=[...raw.querySelectorAll(':scope > .section')].filter(panel=>panel.querySelector('ul')&&panel.querySelector('h3')?.textContent!=='Matériel');
    body=sections.map(panel=>{panel.querySelectorAll('.action-cue').forEach(c=>c.remove());const heading=panel.querySelector('h3')?.textContent.replace(/Si nécessaire|À surveiller/g,'').trim();const items=[...panel.querySelectorAll('li')].map(li=>li.textContent.trim());return `${heading&&heading!=='À faire'?`<b class="condensed-subtitle">${condensedEscape(heading)}</b>`:''}<ul>${items.map(item=>`<li>${condensedEscape(item)}</li>`).join('')}</ul>`;}).join('');
    body+=[...raw.querySelectorAll(':scope > .route-note,:scope > .assistant-note')].map(note=>`<p class="condensed-alert">${condensedEscape(note.textContent)}</p>`).join('');
    body+=[...raw.querySelectorAll(':scope > .route-links')].map(note=>note.outerHTML).join('');
    if(!pending)body+=[...raw.querySelectorAll('.condensed-products')].map(panel=>panel.outerHTML.replace('setRpPain(this.value)',`condensedPain(${index},this.value,'${kind}')`)).join('');
   }
   if(zoneKeyForStep(step)){
    body+=condensedZones(step,index,pending);
    if(pending||!zoneComplete(step))unresolved=true;
   }else if(choices.length){
    body+=`<label class="condensed-choice">${pending?'Après les choix précédents':'Observation jouée'}<select aria-label="${condensedEscape(step.title)}" ${pending?'disabled':''} onchange="condensedChoice(${index},this.value)"><option value="">Choisir…</option>${choices.map((choice,i)=>`<option value="${i}" ${selected===i?'selected':''}>${condensedEscape(choice.label)}</option>`).join('')}</select></label>`;
    if(selected<0)unresolved=true;
   }
   if(/Soulager la douleur|Douleur et soins locaux/.test(step.title)&&!pending){
    const products=[...raw.querySelectorAll('.condensed-products')].map(panel=>panel.outerHTML.replace('setRpPain(this.value)',`condensedPain(${index},this.value,'${kind}')`)).join('');
    body='<ul><li>Évaluer la douleur et l’état vital avant un produit facultatif.</li><li>Privilégier installation, repos et soin de la blessure ; surveiller conscience et respiration.</li></ul>'+products+[...raw.querySelectorAll(':scope > .route-note,:scope > .assistant-note')].map(note=>`<p class="condensed-alert">${condensedEscape(note.textContent)}</p>`).join('');
   }
   if(!pending)body+=[...raw.querySelectorAll('.care-confirmations')].map(panel=>panel.outerHTML).join('');
   if(!body)body='<p>Vérifier les observations avant de poursuivre.</p>';
   cards.push(`<article class="condensed-step ${current?'is-current':''} ${pending?'is-pending':''}" data-step-index="${index}" ${current?'aria-current="step"':''}><h3><span>${position+1}</span>${condensedEscape(step.title)}${current?'<small>En cours</small>':''}</h3>${body}<button class="condensed-mark" ${pending?'disabled':''} onclick="condensedMark(${index},'${kind}')">${current?'Étape actuelle':pending?'À venir':'Se placer ici'}</button></article>`);
  });
 }finally{stepIndex=saved.index;surgeryStepIndex=saved.surgeryIndex;activeStepTitle=saved.title;activeRouteKind=saved.kind;}
 const warning=answers.latestBreathing==='no'||answers.latestBreathing==='weak'||answers.latestBleeding==='major'||answers.latestState==='unresponsive';
 root.classList.add('condensed-workspace');
 root.innerHTML=`<div class="topbar condensed-topbar"><div><span class="badge">Condensé</span>${urgencyBadge(careUrgency(surgery?'critical':route.urgency))}<h2>${condensedEscape(route.title)}</h2></div><div class="condensed-controls">${compactButton(kind)}<button class="material-btn" onclick="toggleMaterialPanel('${kind}')" aria-expanded="${materialPanelOpen}">Matériel nécessaire</button><button class="secondary" onclick="reassessCare()">Réévaluer le patient</button><button class="danger" onclick="${surgery?'showSurgery()':'showCases()'}">Changer de cas</button></div></div>${warning?'<p class="condensed-alert current-warning">Dernière observation inquiétante : suspendre le soin non prioritaire, réévaluer et organiser du renfort. Passer à une autre étape ne signifie pas une stabilisation.</p>':''}<p class="condensed-note">Choisir les observations pour adapter la suite. Les étapes à venir ne sont pas des gestes déjà réalisés.</p>${materialPanel(kind)}<div class="condensed-grid">${cards.join('')}</div><div class="nav"><button class="secondary" onclick="${surgery?'prevSurgery()':'prev()'}">Précédent</button><button class="next" onclick="${surgery?'nextSurgery()':'next()'}" ${rootChoiceMissing(route,surgery)?'disabled':''}>${(surgery?surgeryStepIndex:stepIndex)===route.steps.length-1?'Terminer':'Étape suivante'}</button></div>`;
 const incident=document.createElement('button');incident.className='incident-button';incident.textContent='Son état change';incident.onclick=()=>openIncident();root.querySelector('.condensed-controls').append(incident);
 root.querySelector('.material-btn')?.remove();
 if(!surgery&&route.obstetric)root.querySelector('.condensed-controls .danger')?.setAttribute('onclick','returnToCareCatalog()');
 if(surgery)root.querySelector('.condensed-controls .danger')?.remove();
 const grid=root.querySelector('.condensed-grid');grid.insertAdjacentHTML('beforebegin',careMemoMarkup(kind));
 if(careMemoOpen&&careMemoOnly){
  const active=grid.querySelector('.is-current');
  const choices=active?.querySelector('.condensed-choice');
  const current=document.createElement('div');current.className='care-memo-current';
  const activeIndex=surgery?saved.surgeryIndex:saved.index,position=stages.findIndex(stage=>stage.index===activeIndex)+1;
  current.innerHTML=`<b>Étape actuelle : ${position} / ${stages.length} - ${condensedEscape(route.steps[activeIndex].title)}</b>${choices?choices.outerHTML:'<span>Les étapes détaillées restent accessibles en décochant « Pense-bête seul ».</span>'}`;
  grid.before(current);grid.hidden=true;
 }
}
function rootChoiceMissing(route,surgery){if(surgery)return false;if(zoneKeyForStep(route.steps[stepIndex]))return !zoneComplete(route.steps[stepIndex]);const raw=document.createElement('div');raw.innerHTML=render(true);const choices=condensedStepChoices(raw);return choices.length>0&&!choices.some(c=>Object.entries(c.set).every(([k,v])=>answers[k]===v));}
function condensedChoice(index,value){
 if(value==='')return;
 const saved=stepIndex;stepIndex=index;
 let choices;try{const raw=document.createElement('div');raw.innerHTML=render(true);choices=condensedStepChoices(raw);}finally{stepIndex=saved;activeStepTitle=flows[currentFlow].steps[saved].title;}
 const choice=choices[Number(value)];if(!choice)return;
 // Changing an earlier branch invalidates later observations, never the latest vital reassessment.
 const later=flows[currentFlow].steps.slice(index+1).flatMap(step=>(step.choices||[]).flatMap(c=>Object.keys(c.set)));
 if(flows[currentFlow].steps.slice(index+1).some(step=>step.dynamicMovementQuestion))later.push('horseMove');
 if(index<saved)later.push('rpPain');
 later.forEach(key=>{if(!key.startsWith('latest')){delete answers[key];if(zoneKeys.includes(key)){delete answers[key+'Selections'];delete answers[key+'Confirmed'];}}});
 flowHistory=flowHistory.filter(entry=>entry.index<index);stepIndex=index;applyChoice(choice.set);
}
function condensedMark(index,kind){
 if(document.querySelector(`#${kind==='flow'?'flow':'surgeryFlow'} [data-step-index="${index}"] .condensed-mark`)?.disabled)return;
 if(kind==='flow'){
  const earlier=flows[currentFlow].steps.slice(0,index).some(step=>zoneKeyForStep(step)?!zoneComplete(step):step.choices&&!step.choices.some(c=>Object.entries(c.set).every(([k,v])=>answers[k]===v)));
  if(earlier)return;
  if(index!==stepIndex)flowHistory.push({index:stepIndex,answers:{...answers}});
   if(index>stepIndex)for(let i=stepIndex;i<index;i++){stepIndex=i;if(!shouldSkipStep(flows[currentFlow].steps[i]))completeRoutineStep('flow');}
   stepIndex=index;render();
  }else{if(index>surgeryStepIndex)for(let i=surgeryStepIndex;i<index;i++){surgeryStepIndex=i;completeRoutineStep('surgery');}surgeryStepIndex=index;renderSurgery();}
}
function condensedPain(index,value,kind){if(kind==='surgery')surgeryStepIndex=index;else stepIndex=index;setRpPain(value);}
