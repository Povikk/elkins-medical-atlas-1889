// Screen groups preserve authored steps, branch data and the reversible detailed engine.
function routeScreenGroups(){
 const steps=flows[currentFlow].steps,groups=[];
 const titles=currentFlow==='strangulation'?[['Aspect du cou','Voix, déglutition et souffle']]:currentFlow==='horse'?[['Quelle intensité ?','Que vois-tu ?','Peut-il bouger ?']]:currentFlow==='animal'?[['Soin local adapté','Soulager la douleur','Protéger et soutenir']]:['gunshot','knife'].includes(currentFlow)?[['Suture / fermeture',currentFlow==='gunshot'?'Pansement':'Pansement et repos']]:careConsultations.some(([id])=>id===currentFlow)?[['Comprendre la demande','Évolution observée']]:[];
 const bundled=new Map();
 for(const list of titles){const indices=list.map(title=>steps.findIndex(s=>s.title===title));if(indices.every(i=>i>=0)&&indices.every((v,i)=>i===0||v===indices[i-1]+1))bundled.set(indices[0],indices);}
 for(let i=0;i<steps.length;i++){
  if(shouldSkipStep(steps[i]))continue;
  const indices=(bundled.get(i)||[i]).filter(index=>!shouldSkipStep(steps[index]));
  groups.push(indices);if(bundled.has(i))i=bundled.get(i).at(-1);
 }
 return groups;
}
function groupChoice(index,set){
 careInvalidateFrom(index);
 const keys=Object.keys(set),step=flows[currentFlow].steps[index];
 Object.assign(answers,set);
 if(keys.includes('horseVisible'))delete answers.horseMove;
 if(Object.hasOwn(set,'needsSuture')&&set.needsSuture===false){answers.reportClosure='none';careRegisterScope('closure');}
 render();
}
function groupedStepRaw(index){
 const saved={index:stepIndex,title:activeStepTitle,kind:activeRouteKind};
 try{stepIndex=index;const raw=document.createElement('div');raw.innerHTML=render(true);return raw;}
 finally{stepIndex=saved.index;activeStepTitle=saved.title;activeRouteKind=saved.kind;}
}
function groupReady(indices){
 return indices.every(index=>{
  const raw=groupedStepRaw(index),choices=condensedStepChoices(raw);
  return !choices.length||choices.some(choice=>Object.entries(choice.set).every(([key,value])=>answers[key]===value));
 });
}
function groupNext(){
 const indices=routeScreenGroups().find(group=>group.includes(stepIndex));if(!indices||!groupReady(indices))return;
 flowHistory.push({index:indices[0],answers:{...answers}});
 for(const index of indices){stepIndex=index;completeRoutineStep('flow');}
 next(true);
}
function renderGroupedRoute(){
 const groups=routeScreenGroups(),indices=groups.find(group=>group.includes(stepIndex));if(!indices||indices.length<2)return false;
 const saved=stepIndex,parts=[];activeRouteKind='flow';rpPhraseBlocks=[];
 const first=groupedStepRaw(indices[0]),top=first.querySelector('.topbar');
 top.querySelector('h2').textContent=`${groups.indexOf(indices)+1} / ${groups.length} - ${currentFlow==='strangulation'?'Cou, voix et respiration':currentFlow==='horse'?'Douleur, aspect et mobilité':currentFlow==='animal'?'Soins et protection':careConsultations.some(([id])=>id===currentFlow)?'Examen et évolution':'Fermeture et pansement'}`;
 for(const index of indices){
  const step=flows[currentFlow].steps[index],raw=groupedStepRaw(index);
  raw.querySelectorAll('.topbar,.progress,.nav,.rp-context,.scene-tools,.rp-choice-recap,.rp-choice-question').forEach(el=>el.remove());
  // Pain relief was addressed on its own screen. Do not ask again during suturing.
  if(step.dynamicSuture){
   raw.querySelectorAll('.section').forEach(panel=>{if(panel.querySelector('.med-item')||panel.querySelector('h3')?.textContent.trim()==='Médicament / produit')panel.remove();});
   raw.querySelectorAll('.care-confirm-row').forEach(row=>{if(row.querySelector('[data-confirm-key^="product:"]'))row.remove();});
  }
  raw.querySelectorAll('.section').forEach(panel=>{
   if(panel.querySelector('h3')?.textContent.trim()!=='Matériel')return;
   const details=document.createElement('details'),summary=document.createElement('summary');
   details.className='group-detail';summary.textContent='Matériel de cette étape';panel.before(details);details.append(summary,panel);
  });
  raw.querySelectorAll('.choice').forEach(button=>{
   const match=button.getAttribute('onclick')?.match(/^applyChoice\((.*)\)$/);if(!match)return;
   const set=JSON.parse(match[1]);button.setAttribute('onclick',`groupChoice(${index},${JSON.stringify(set)})`);
   button.setAttribute('aria-pressed',String(Object.entries(set).every(([key,value])=>answers[key]===value)));
  });
  raw.querySelectorAll('[data-confirm-key]').forEach(button=>button.setAttribute('onclick',`groupConfirm(${index},${JSON.stringify(button.dataset.confirmKey)},${JSON.stringify(button.dataset.confirmValue)})`));
  raw.querySelectorAll('.rp-dialogue,.rp-gesture,.assistant-note,.route-supplies').forEach(panel=>{
   const details=document.createElement('details'),summary=document.createElement('summary');
   details.className='group-detail';summary.textContent=panel.classList.contains('route-supplies')?'Produits et matériel':panel.classList.contains('assistant-note')?'Assistant':'Gestes et formulations';details.append(summary);panel.before(details);details.append(panel);
  });
  parts.push(`<article class="group-panel"><h3 class="group-title">${reportEscape(step.title)}</h3>${raw.innerHTML}</article>`);
 }
 stepIndex=saved;
 const root=document.getElementById('flow');root.classList.remove('condensed-workspace');root.classList.add('care-screen-fit');
 root.innerHTML=top.outerHTML+careMemoMarkup('flow')+`<details class="group-detail"><summary>Réévaluation et références</summary>${sceneToolbar('flow')}</details><div class="group-route-grid">${parts.join('')}</div><div class="nav"><button class="secondary" onclick="prev()">Précédent</button><button class="next" onclick="groupNext()" ${groupReady(indices)?'':'disabled'}>Étape suivante</button></div>`;
 if(['no','weak'].includes(answers.latestBreathing)||answers.latestState==='unresponsive'||answers.latestBleeding==='major')root.querySelector('.group-detail').open=true;
 finalizeCareLayout(root);return true;
}
function groupConfirm(index,key,value){
 const saved=stepIndex;stepIndex=index;try{careConfirm(key,value);}finally{stepIndex=saved;}
}
