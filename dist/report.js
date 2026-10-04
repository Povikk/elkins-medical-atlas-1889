// Two short lines derived from explicit choices. No automatic patient record.
function resetReportDraft(){}
function reportEscape(text){return String(text||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function reportFindings(kind){
 const surgery=kind==='surgery',route=surgery?surgeries[currentSurgery]:flows[currentFlow];
 const result=[route.title];
 const keys=['conscious','headState','poisonState','unknownBreathing','breathing','unknownBleeding','unknownWake','gunArea','knifeArea','knifeSeverity','horseArea','horsePain','fractureArea','fracturePain','minorArea','horseVisible','fightIssue','bullet','needsSuture','burnSeverity','consultEvolution'];
 const options=route.steps.flatMap(s=>!surgery&&currentFlow==='animal'?animalChoicesForStep(s):s.choices||[]);
 keys.push('animalSpecies','animalInjury','animalArea','animalBleeding','animalDepth','animalVenomSigns','animalExposure');
 keys.push('hoofArea','hoofSigns');
 for(const key of keys){
  if(!Object.hasOwn(answers,key))continue;
  if(['conscious','headState','poisonState','unknownWake'].includes(key)&&answers.latestState)continue;
  if(['breathing','unknownBreathing'].includes(key)&&answers.latestBreathing)continue;
  if(['unknownBleeding','animalBleeding'].includes(key)&&answers.latestBleeding)continue;
  const choice=options.find(c=>Object.hasOwn(c.set,key)&&Object.entries(c.set).every(([k,v])=>answers[k]===v));
  if(key==='needsSuture'){result.push(answers[key]===true?'Plaie nette, fermeture envisagée':answers[key]===false?'Fermeture non nécessaire selon le choix':'Fermeture simple écartée');}
  else if(zoneKeys.includes(key)&&zoneSelections(key).length)result.push(zoneLabels(key));
  else if(key==='bullet'&&zoneSelections('gunArea').some(c=>c.shot?.type==='pellets'))result.push({graze:'Atteintes superficielles constatées',out:'Sortie constatée pour les projectiles identifiés ; autres impacts à vérifier',in:'Projectile(s) / plomb(s) suspecté(s) retenu(s)',unknown:'Présence de projectiles indéterminée',unchecked:'Impacts non encore vérifiés'}[answers.bullet]||choice?.label||'Projectile à préciser');
  else if(choice)result.push(choice.label);
 }
 const movement={normal:'Mouvement conservé selon le choix',painful:'Mouvement douloureux',limited:'Mouvement limité',none:'Mouvement impossible',unknown:'Mouvement non évalué'};
 if(movement[answers.horseMove])result.push(movement[answers.horseMove]);
 const pain={mild:'Douleur réévaluée : légère',moderate:'Douleur réévaluée : modérée',strong:'Douleur réévaluée : forte',unknown:'Douleur non réévaluée',unsafe:'État vital à réévaluer avant antalgique'};
 if(pain[answers.rpPain])result.push(pain[answers.rpPain]);
 const latest={latestState:{awake:'Conscient à la dernière réévaluation',confused:'Confus à la dernière réévaluation',unresponsive:'Ne répond pas à la dernière réévaluation',unknown:'Conscience non déterminée'},latestBreathing:{yes:'Respiration présente sans gêne décrite',weak:'Respiration faible / difficile',no:'Respiration non constatée',unknown:'Respiration non déterminée'},latestBleeding:{major:'Saignement important',none:'Pas de saignement important observé',unknown:'Saignement non déterminé'}};
 for(const [key,labels] of Object.entries(latest))if(labels[answers[key]])result.push(labels[answers[key]]);
 return [...new Set(result)].join(' ; ')+'.';
}
function reportSuggestedCare(kind){
 if(kind==='surgery'&&surgeries[currentSurgery].reportCare)return surgeries[currentSurgery].reportCare+' Gestes à confirmer selon ce qui a été effectué. Si une suture a été réalisée : contrôle de la plaie et du pansement dans 24 h ; retrait des points selon la cicatrisation, pas automatiquement à 24 h.';
 if(kind==='surgery')return 'Acte chirurgical du parcours si justifié ; pansement ; surveillance ; repos ; contrôle. Si une suture a été effectuée : repasser dans 24 h pour contrôler la plaie et le pansement ; retrait des points à prévoir selon la cicatrisation, pas automatiquement à 24 h.';
 const id=currentFlow,items=[];
 if(id==='hoof')return 'Réévaluation de chaque zone frappée ; '+(answers.hoofSigns==='wound'?'nettoyage et protection des plaies accessibles si effectués ; ':answers.hoofSigns==='function'?'soutien / immobilisation si effectué ; ':answers.hoofSigns==='bruise'?'repos de la zone contuse ; soin local si approprié ; ':'soins à préciser selon les constatations ; ')+(['head','chest','abdomen','back'].some(zone=>zoneHas('hoofArea',zone))||['danger','unknown'].includes(answers.hoofSigns)?'avis / surveillance rapprochée selon l’état ; ':'')+'surveillance ; contrôle selon l’évolution. Gestes à confirmer, pas automatiquement effectués.';
 const unsafe=careProductBlocked();
 if(['gunshot','knife','minor'].includes(id)){
  if(id!=='minor')items.push('Contrôle du saignement si nécessaire');
  items.push('Nettoyage de la plaie','Pansement');
  if(id==='gunshot'&&zoneSelections('gunArea').some(c=>c.shot?.type==='pellets'))items.push('Évaluation de chaque zone de grenaille, sans recherche ni extraction systématique des plombs');
  if(answers.needsSuture===true)items.push('Suture si appropriée : nombre de points à préciser','Repasser dans 24 h pour contrôler la plaie et le pansement si la suture a été effectuée','Retrait des points à prévoir selon la cicatrisation, pas automatiquement à 24 h');
  if(id==='gunshot'&&answers.bullet==='in')items.push('Évaluer le projectile retenu, sans extraction systématique');
  if(id==='knife'&&answers.knifeSeverity==='deep'||id==='gunshot'&&['head','chest','abdomen'].includes(answers.gunArea))items.push('Orientation / renfort selon la scène');
 }else if(id==='animal'){
  if(animalIsVenom())return 'Protection simple ; calme et limitation des efforts ; surveillance continue ; prise en charge urgente / transport ; aucun sérum antivenimeux proposé en 1889. Gestes à confirmer, pas des soins automatiquement effectués.';
  items.push('Contrôle du saignement si nécessaire');
  if(animalHasWound())items.push('Nettoyage adapté des plaies accessibles','Protection / pansement','Pas de fermeture automatique');
  else items.push('Évaluation du choc et de la fonction','Repos / soutien selon les signes','Pas de soin de plaie sans plaie observée');
  if(answers.animalDepth==='crush')items.push('Soutien du membre si atteint');
  if(animalNeedsAssessment())items.push('Évaluation spécialisée de la blessure');
  if(animalProfile().family!=='reptile'&&animalHasWound())items.push('Évaluation du risque de rage selon animal et circonstances');
  items.push('Contrôle rapproché');
 }else if(id==='fracture')items.push('Soutien et immobilisation du membre','Pansement si plaie');
 else if(id==='horse'){
  if(answers.horseVisible==='wound')items.push('Nettoyage','Pansement');
  if(answers.horseVisible==='deformity'||['limited','none'].includes(answers.horseMove))items.push('Soutien / immobilisation','Réévaluation du membre');
  else items.push('Repos de la zone douloureuse','Réévaluation avant mobilisation');
 }else if(id==='fight')items.push(answers.fightIssue==='cut'?'Nettoyage et pansement':'Soin local si pertinent','Réévaluation si tête ou côtes');
 else if(id==='burn')items.push('Protection de la brûlure','Surveillance du souffle si fumée / visage');
 else if(id==='drowning')items.push('Priorité respiratoire','Réchauffement','Surveillance');
 else if(id==='head')items.push('Calme','Surveillance de la conscience');
 else if(id==='poison')items.push('Identifier le produit si possible','Surveillance respiratoire','Pas de remède automatique');
 else if(id==='unknown')items.push('Réévaluation de la conscience, du souffle et du saignement','Recherche de la cause après les priorités');
 else items.push('Soins selon les signes décrits','Contrôle de l’évolution');
 if(unsafe)items.push('Réévaluation / renfort si état inquiétant');
 items.push('Repos','Surveillance','Contrôle selon la scène');
 return [...new Set(items)].join(' ; ')+'.';
}
function reportMarkup(kind){
 const draft=answers.reportDraft?.[kind],findings=draft?.findings??reportFindings(kind),care=draft?.care??reportSuggestedCare(kind),editing=!!draft?.editing;
 return `<section class="care-report care-auto-summary" aria-label="Récapitulatif des choix"><h3>Récapitulatif</h3><p ${editing?'hidden':''}><b>Constatations :</b> <span id="report-findings">${reportEscape(findings)}</span></p><p ${editing?'hidden':''}><b>Soins suggérés :</b> <span id="report-care">${reportEscape(care)}</span></p><div class="report-editor" ${editing?'':'hidden'}><label>Constatations<textarea rows="3" oninput="updateReportText('${kind}','findings',this.value)">${reportEscape(findings)}</textarea></label><label>Soins et consignes<textarea rows="3" oninput="updateReportText('${kind}','care',this.value)">${reportEscape(care)}</textarea></label></div><small>Repères RP à adapter aux gestes réellement joués. Les suggestions ne confirment pas un soin effectué. Aucun enregistrement.</small><div class="report-actions"><button class="secondary" type="button" onclick="toggleReportEditor('${kind}')">${editing?'Terminer la modification':'Modifier le compte rendu'}</button><button class="secondary" type="button" onclick="copyReport()">Copier les deux lignes</button><span id="report-status" role="status"></span></div></section>`;
}
function toggleReportEditor(kind){
 answers.reportDraft??={};
 const draft=answers.reportDraft[kind]??={findings:document.getElementById('report-findings').textContent,care:document.getElementById('report-care').textContent,editing:false};
 draft.editing=!draft.editing;
 document.querySelector('.care-report').outerHTML=reportMarkup(kind);
 if(draft.editing)document.querySelector('.report-editor textarea')?.focus({preventScroll:true});
}
function updateReportText(kind,field,value){
 const draft=answers.reportDraft?.[kind];if(!draft||!['findings','care'].includes(field))return;
 draft[field]=value;document.getElementById(field==='findings'?'report-findings':'report-care').textContent=value;
}
async function copyReport(){
 const text=`Constatations : ${document.getElementById('report-findings').textContent}\nSoins suggérés : ${document.getElementById('report-care').textContent}`;
 const status=document.getElementById('report-status');
 try{await navigator.clipboard.writeText(text);status.textContent='Récapitulatif copié.';}
 catch(error){status.textContent='Copie automatique indisponible : sélectionne les deux lignes pour les copier.';}
}
