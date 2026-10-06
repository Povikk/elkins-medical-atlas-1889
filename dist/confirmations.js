// Explicit, transient confirmations. Never advance the route or administer a product.
function careConfirm(key,value,index,kind){
 if(typeof careRegisterScope==='function')careRegisterScope(key,index,kind);
 answers.careConfirmed={...(answers.careConfirmed||{})};
 if(answers.careConfirmed[key]===value)delete answers.careConfirmed[key];else answers.careConfirmed[key]=value;
 if(key==='closure')answers.reportClosure=answers.careConfirmed[key]||'';
 if(key==='bleedingStatus'&&answers.careConfirmed[key])answers.latestBleeding=value==='controlled'?'none':'major';
 if(key==='bleedingStatus'&&!answers.careConfirmed[key]){const prior=answers.careScopes?.[key]?.priorBleeding;if(prior===undefined)delete answers.latestBleeding;else answers.latestBleeding=prior;}
 if(key==='closure')document.querySelectorAll('.suture-count').forEach(label=>label.hidden=answers.reportClosure!=='sutured');
 // Refresh button state only: no navigation, no focus/scroll loss, no rewritten notes.
 document.querySelectorAll('[data-confirm-key]').forEach(button=>button.setAttribute('aria-pressed',String(answers.careConfirmed[button.dataset.confirmKey]===button.dataset.confirmValue)));
}
function careConfirmButtons(label,key,options){
 return `<div class="care-confirm-row"><span>${reportEscape(label)}</span>${options.map(([value,text])=>`<button type="button" data-confirm-key="${reportEscape(key)}" data-confirm-value="${value}" aria-pressed="${answers.careConfirmed?.[key]===value}" onclick="careConfirm(${reportEscape(JSON.stringify(key))},'${value}')">${text}</button>`).join('')}</div>`;
}
function stepConfirmMarkup(step,kind,html){
 const index=kind==='surgery'?surgeryStepIndex:stepIndex,route=kind==='surgery'?surgeries[currentSurgery]:flows[currentFlow];
 const raw=document.createElement('div');raw.innerHTML=html;
 const names=[...raw.querySelectorAll('.med-item > strong')].map(el=>el.textContent.trim());
 // Include named topical products in authored supply panels, not instruments or dressings.
 raw.querySelectorAll('.route-supplies li').forEach(li=>{const name=li.querySelector('b,strong')?.textContent.trim();if(name&&/arnica|phénol|carbol|zinc|éther|chloroforme|morphine|laudanum/i.test(name))names.push(name);});
 const rows=[...new Set(names)].filter(name=>/morphine|laudanum|opium|éther|chloroforme/i.test(name)).map(name=>careConfirmButtons(name,'product:'+name,[['used','Utilisé'],['not','Non utilisé']]));
 for(const name of step.confirmActs||[])rows.push(careConfirmButtons(name,'act:'+name,[['done','Réalisé'],['not','Non réalisé']]));
 const operations=[];
 if(!step.choices){
  const title=step.title;
  if(step.dynamicAnimal==='clean'&&animalHasWound()||/nettoy|traiter la blessure/i.test(title))operations.push('Nettoyage de la plaie');
  if(step.dynamicAnimal==='protect'||/panser|pansement|protéger|protection/i.test(title))operations.push('Pansement posé');
  if(step.dynamicAnimal==='priority'||step.dynamicConscious||/saignement|hémorrag/i.test(title))operations.push('Contrôle du saignement');
  if(/immobilis|soutenir|soutien/i.test(title))operations.push('Soutien / immobilisation');
  if(/drainage/i.test(title))operations.push('Drainage réalisé');
  if(index===route.steps.length-1)operations.push('Consignes de repos et de contrôle données');
 }
 // Routine gestures are acknowledged with Next; invasive decisions still need a choice.
 operations.filter(name=>name==='Drainage réalisé').forEach(name=>rows.push(careConfirmButtons(name,'act:'+name,[['done','Réalisé'],['not','Non réalisé']])));
 const closure=!step.choices&&(step.closureDecision||step.dynamicSuture||step.dynamicAnimal==='protect'&&animalHasWound()&&!animalIsVenom()||/sutur|refermer|fermeture|décider de la protection/i.test(step.title));
 if(closure){
  rows.push(careConfirmButtons('Fermeture','closure',[['sutured','Suture faite'],['none','Sans suture'],['deferred','Différée']]));
  rows.push(`<label class="suture-count" ${answers.reportClosure==='sutured'?'':'hidden'}>Points <input type="number" min="1" max="999" step="1" inputmode="numeric" value="${answers.sutureCount||''}" aria-label="Nombre de points de suture" oninput="setSutureCount(this.value)"></label>`);
 }
 if(kind==='flow'&&currentFlow==='gunshot'&&step.dynamic&&answers.bullet==='in'||kind==='surgery'&&currentSurgery==='deep_bullet'&&answers.bullet!=='out'&&answers.bullet!=='graze'&&/retirer|extract|projectile|explor/i.test(step.title))rows.push(careConfirmButtons('Projectile','projectile',[['removed','Retiré'],['retained','Laissé en place'],['unknown','Incertain']]));
 if(['major','minor'].includes(answers.latestBleeding||answers.animalBleeding||answers.unknownBleeding)&&(step.dynamicAnimal==='priority'||step.dynamicUnknownBleeding||step.title==='Contrôler le saignement'))rows.push(careConfirmButtons('Après contrôle','bleedingStatus',[['controlled','Saignement maîtrisé'],['ongoing','Saignement persistant']]));
 if(index===route.steps.length-1&&!answers.latestState&&!['awake','yes'].includes(answers.conscious||answers.headState||answers.breathing)){
  rows.push(careConfirmButtons('État final','finalState',[['awake','Conscient'],['confused','Confus'],['unresponsive','Inconscient']]));
 }
 return rows.length?`<div class="care-confirmations" aria-label="Ce qui a réellement été fait">${rows.join('').replace(/onclick="careConfirm\((.*?)\)"/g,`onclick="careConfirm($1,${index},'${kind}')"`)}<small>Les soins courants sont repris avec Étape suivante. Préciser ici les décisions variables.</small></div>`:'';
}
function reportConfirmedFindings(){
 const c=answers.careConfirmed||{},items=[];
 if(c.projectile==='unknown')items.push('Retrait du projectile non déterminé');
 if(c.finalState)items.push({awake:'État final confirmé : conscient',confused:'État final confirmé : confus',unresponsive:'État final confirmé : inconscient'}[c.finalState]);
 return items.length?' '+items.join(' ; ')+'.':'';
}
function reportConfirmedCare(){
 const c=answers.careConfirmed||{},items=[];
 for(const [key,value]of Object.entries(c))if(key.startsWith('product:'))items.push(key.slice(8)+(value==='used'?' utilisé':' non utilisé'));
 return items.length?' Confirmé : '+items.join(' ; ')+'.':'';
}
