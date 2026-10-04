// Multiple observed locations, kept only for the current intervention.
const zoneKeys=['gunArea','knifeArea','horseArea','fractureArea','minorArea','animalArea'];
function zoneKeyForStep(step){return zoneKeys.find(key=>step?.choices?.some(c=>Object.hasOwn(c.set,key)));}
function zoneSelections(key){
 if(Array.isArray(answers[key+'Selections']))return answers[key+'Selections'];
 if(!Object.hasOwn(answers,key))return [];
 const step=flows[currentFlow]?.steps.find(s=>zoneKeyForStep(s)===key);
 const choice=step?.choices.find(c=>Object.entries(c.set).every(([k,v])=>answers[k]===v));
 return choice?[choice]:[];
}
function zoneHas(key,value){return zoneSelections(key).some(c=>c.set[key]===value)||answers[key]===value;}
function zoneLabels(key){return zoneSelections(key).map(c=>c.label+(key==='gunArea'?gunDetailLabel(c):'')).join(' ; ');}
function gunDetailLabel(choice){
 const detail=choice.shot;if(!detail)return '';
 const type={solid:'balle pleine',pellets:'grenaille',unknown:'projectile indéterminé'}[detail.type]||'projectile indéterminé';
 return ` (${type} ; ${detail.count||'nombre indéterminé'}${detail.count?(detail.type==='pellets'?' impact(s) observé(s)':' projectile(s) signalé(s)'):''})`;
}
function gunDetailsControls(selected){
 if(!selected.length)return '';
 return `<div class="gun-details"><small>Facultatif : quantité signalée, ou impacts observés pour la grenaille. Une entrée et une sortie ne comptent pas comme deux balles.</small>${selected.map((choice,i)=>`<div class="gun-detail-row"><b>${reportEscape(choice.label)}</b><select aria-label="Projectile : ${reportEscape(choice.label)}" onchange="updateGunDetail(${i},'type',this.value)">${[['unknown','Type indéterminé'],['solid','Balle pleine'],['pellets','Grenaille']].map(([value,label])=>`<option value="${value}" ${(choice.shot?.type||'unknown')===value?'selected':''}>${label}</option>`).join('')}</select><label>${choice.shot?.type==='pellets'?'Impacts':'Nombre'}<input type="number" min="1" step="1" inputmode="numeric" placeholder="?" aria-label="Quantité : ${reportEscape(choice.label)}" value="${choice.shot?.count||''}" onchange="updateGunDetail(${i},'count',this.value)"></label></div>`).join('')}</div>`;
}
function updateGunDetail(index,field,value){
 if(currentFlow!=='gunshot'||!['type','count'].includes(field))return;
 const selected=zoneSelections('gunArea').map(c=>({...c,set:{...c.set},shot:{type:'unknown',count:null,...c.shot}}));
 const choice=selected[index];if(!choice)return;
 if(field==='type'){if(!['unknown','solid','pellets'].includes(value))return;choice.shot.type=value;choice.shot.count=null;}
 else choice.shot.count=/^[1-9]\d*$/.test(value)&&Number.isSafeInteger(Number(value))?Number(value):null;
 answers.gunAreaSelections=selected;delete answers.reportDraft;
 render();
}
function zoneComplete(step){const key=zoneKeyForStep(step);return !key||zoneSelections(key).length>0&&answers[key+'Confirmed']!==false;}
function zoneIsSelected(key,set){return zoneSelections(key).some(c=>Object.entries(set).every(([k,v])=>c.set[k]===v));}
function zoneInvalidateAfter(index){
 const later=flows[currentFlow].steps.slice(index+1);
 for(const step of later)for(const choice of step.choices||[])for(const key of Object.keys(choice.set)){
  delete answers[key];if(zoneKeys.includes(key)){delete answers[key+'Selections'];delete answers[key+'Confirmed'];}
 }
 if(later.some(s=>s.dynamicMovementQuestion))delete answers.horseMove;
 delete answers.rpPain;
}
function toggleZoneSelection(index,set){
 const step=flows[currentFlow].steps[index],key=zoneKeyForStep(step);
 const choice=step?.choices?.find(c=>JSON.stringify(c.set)===JSON.stringify(set));if(!key||!choice)return;
 let selected=zoneSelections(key);
 const exclusive=c=>['unknown','none','general'].includes(c.set[key]);
 if(zoneIsSelected(key,set))selected=selected.filter(c=>JSON.stringify(c.set)!==JSON.stringify(set));
 else selected=exclusive(choice)?[choice]:[...selected.filter(c=>!exclusive(c)),choice];
 zoneInvalidateAfter(index);
 for(const c of step.choices)for(const k of Object.keys(c.set))delete answers[k];
 answers[key+'Selections']=selected.map(c=>({label:c.label,set:{...c.set},...(c.shot?{shot:{...c.shot}}:{})}));
 answers[key+'Confirmed']=false;
 // Keep legacy branch selectors conservative; all locations remain available separately.
 const priority=currentFlow==='horse'?['head','back','ribs','chest','abdomen','unknown']:['head','chest','abdomen','unknown','hand','foot','back'];
 const primary=[...selected].sort((a,b)=>{const rank=c=>{const n=priority.indexOf(c.set[key]);return n<0?99:n;};return rank(a)-rank(b);})[0];
 if(primary)Object.assign(answers,primary.set);
 flowHistory=flowHistory.filter(entry=>entry.index<index);
 if(index<stepIndex)stepIndex=index;
 render();
}
function confirmZoneSelection(index){
 const step=flows[currentFlow].steps[index],key=zoneKeyForStep(step);
 if(!key||!zoneSelections(key).length)return;
 answers[key+'Confirmed']=true;stepIndex=index;
 flowHistory.push({index,answers:{...answers}});next(true);
}
function zoneSelectionControls(step,index,disabled=false){
 const key=zoneKeyForStep(step),selected=zoneSelections(key);
 return `${key==='gunArea'?gunDetailsControls(selected):''}<div class="zone-selection-footer"><span role="status">${selected.length?selected.length+' zone'+(selected.length>1?'s':'')+' sélectionnée'+(selected.length>1?'s':''):'Sélectionner une ou plusieurs zones'}</span><button type="button" class="next" onclick="confirmZoneSelection(${index})" ${disabled||!selected.length?'disabled':''}>Valider les zones</button></div>`;
}
function condensedZones(step,index,pending){
 const key=zoneKeyForStep(step);
 return `<fieldset class="condensed-choice zone-checks" ${pending?'disabled':''}><legend>Zones atteintes</legend><details ${index===stepIndex?'open':''}><summary>${zoneSelections(key).length?condensedEscape(zoneLabels(key)):'Sélectionner plusieurs zones'}</summary><div class="zone-check-list">${step.choices.map(c=>`<label><input type="checkbox" ${zoneIsSelected(key,c.set)?'checked':''} onchange='toggleZoneSelection(${index},${JSON.stringify(c.set)})'>${condensedEscape(c.label)}</label>`).join('')}</div>${zoneSelectionControls(step,index,pending)}</details></fieldset>`;
}
function multiZoneCareMarkup(step){
 if(currentFlow==='gunshot'&&(step.dynamic||step.title==='Examiner la plaie')){
  const selected=zoneSelections('gunArea'),pellets=selected.some(c=>c.shot?.type==='pellets');
  return `<div class="route-note"><b>Zones atteintes :</b> ${reportEscape(zoneLabels('gunArea'))}. Réévaluer chaque blessure séparément.${pellets?' Grenaille : repérer les impacts visibles ; ne pas supposer qu’ils sont superficiels ni que tous les plombs sont ressortis. Pas de recherche ou d’extraction systématique de chaque plomb.':''} Le type et le nombre ne suffisent pas à déterminer la profondeur ou la gravité ; surveiller saignement, respiration et fonction.</div>`;
 }
 if(!step.dynamicGunArea&&!step.dynamicHorseCare&&!['aspect','clean'].includes(step.dynamicAnimal)&&!/Examiner le membre|Nettoyage/.test(step.title))return '';
 const key=zoneKeys.find(k=>zoneSelections(k).length>1);if(!key||zoneKeyForStep(step))return '';
 const selected=zoneSelections(key);
 let details='';
 if(step.dynamicGunArea){
  const notes={head:'Tête / cou : surveiller réactions et respiration ; évaluation urgente.',chest:'Thorax : surveiller gêne respiratoire et sang craché ; organiser du renfort.',abdomen:'Abdomen : surveiller douleur, pâleur et réactions ; évaluation spécialisée.',arm:'Membre : vérifier sensibilité et fonction sans forcer.',leg:'Membre : vérifier sensibilité et fonction sans forcer.'};
  details=`<ul>${[...new Set(selected.map(c=>notes[c.set[key]]).filter(Boolean))].map(text=>`<li>${text}</li>`).join('')}</ul>`;
 }
 return `<div class="route-note multi-zone-note"><b>Plusieurs zones :</b> ${selected.map(c=>c.label).join(' ; ')}. Examiner et réévaluer chaque zone séparément. Les choix suivants ne décrivent pas automatiquement toutes les blessures.${details}</div>`;
}
// Ensure hands and feet can be identified in penetrating-injury routes too.
for(const id of ['gunshot','knife','horse']){
 const key={gunshot:'gunArea',knife:'knifeArea',horse:'horseArea'}[id],step=flows[id].steps.find(s=>zoneKeyForStep(s)===key);
 for(const [part,label] of [['hand','Main'],['foot','Pied']])for(const side of ['left','right'])step.choices.splice(step.choices.length-1,0,{label:label+' '+(side==='left'?'gauche':part==='hand'?'droite':'droit'),set:{[key]:id==='knife'?'limb':part==='hand'?'arm':'leg',[key+'Part']:part,[key+'Side']:side}});
}
const knifeZoneStep=flows.knife.steps.find(s=>zoneKeyForStep(s)==='knifeArea');
knifeZoneStep.choices.splice(knifeZoneStep.choices.length-1,0,{label:'Tête / cou',set:{knifeArea:'head',knifeAreaSide:null}});
