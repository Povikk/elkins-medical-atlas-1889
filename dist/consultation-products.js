// Fictional 1889 consultation choices, grounded in the existing historical lexicon.
// No doses, preparation recipes, automatic administration or patient storage.
const consultationProducts={
 fever:[
  {id:'fever',label:'Fièvre constatée',names:['Antifébrine / acétanilide','Phénacétine'],note:'Antipyrétiques récents en 1889, de disponibilité variable et toxiques. Choix historique, pas un traitement de la cause.'},
  {id:'intermittent',label:'Fièvre intermittente / contexte paludéen',names:['Quinine','Quinquina'],note:'Quinine et quinquina ne sont pas interchangeables ; aucun n’est proposé pour toute fièvre.'}
 ],
 cough:[
  {id:'dry',label:'Toux sèche / gorge irritée',names:['Préparation de réglisse'],note:'Préparation adoucissante d’époque ; ne traite pas une détresse respiratoire.'},
  {id:'wet',label:'Toux avec sécrétions',names:['Chlorure d’ammonium'],note:'Expectorant historique, distinct des sels odorants ; pas de réponse à une asphyxie.'}
 ],
 fatigue:[
  {id:'rest',label:'Fatigue isolée',names:[],note:'Repos, sommeil et alimentation à reprendre. Aucun tonique automatique pour une fatigue inexpliquée.'},
  {id:'appetite',label:'Appétit diminué / convalescence',names:['Teinture de gentiane'],note:'Tonique amer historique, sans promesse de corriger toute fatigue.'},
  {id:'anemia',label:'Anémie déjà retenue à l’examen',names:['Préparation de fer'],note:'Préparation martiale historique ; une pâleur seule ne suffit pas, et ce n’est pas un traitement d’une hémorragie aiguë.'}
 ],
 digestive:[
  {id:'acid',label:'Aigreurs d’estomac',names:['Bicarbonate de sodium'],note:'Usage antiacide historique ; ne banalise pas une douleur abdominale ou thoracique.'},
  {id:'bloating',label:'Ballonnements',names:['Préparation de gingembre','Essence de menthe poivrée'],note:'Préparations pharmaceutiques digestives ; pas d’essence concentrée donnée telle quelle.'},
  {id:'diarrhea',label:'Diarrhée sans signe inquiétant',names:['Sous-nitrate de bismuth'],note:'Usage historique pour certains troubles diarrhéiques. Sang, fièvre ou aggravation : reprendre l’examen.'},
  {id:'constipation',label:'Constipation évaluée',names:['Séné','Huile de ricin'],note:'Purgatifs d’époque seulement dans ce contexte ; aucun purgatif pour une douleur inexpliquée.'}
 ],
 dental:[
  {id:'pain',label:'Douleur dentaire évaluée',names:['Laudanum'],note:'Soulagement historique facultatif après examen. Opiacé : vigilance et respiration à surveiller ; pas d’extraction automatique.'}
 ]
};
// Keep the lexicon’s exact names, including its apostrophe spelling.
for(const profiles of Object.values(consultationProducts))for(const profile of profiles)profile.names=profile.names.map(name=>lexique.find(item=>item.name.replace(/['’]/g,'’')===name.replace(/['’]/g,'’'))?.name||name);
for(const id of Object.keys(consultationProducts))flows[id].steps.at(-1).consultationTreatment=id;
followupTypes.checkup.title='Autre suivi';flows.followup_checkup.title='Suivi : Autre suivi';
function consultationProductId(){return flows[currentFlow]?.followup?followupType().sourceFlow:currentFlow;}
function consultationProfile(){
 const id=consultationProductId(),profiles=consultationProducts[id]||[],signs=answers.followupFindings||[];
 const inferred=id==='digestive'?(signs.includes('Constipation persistante')?'constipation':signs.includes('Diarrhée persistante')?'diarrhea':null):id==='fatigue'&&signs.includes('Appétit diminué')?'appetite':null;
 return profiles.find(p=>p.id===(answers.consultProfile||inferred))||profiles[0];
}
function consultationProductBlocked(){
 const followup=!!flows[currentFlow]?.followup;
 if(!followup)return careProductBlocked()||answers.consultEvolution==='worse';
 return !answers.consultOralReady||['no','weak','unknown'].includes(answers.latestBreathing)||['unresponsive','confused','unknown'].includes(answers.latestState)||(answers.followupFindings||[]).some(s=>['Gêne respiratoire','Somnolence inhabituelle','Confusion rapportée','Sang craché rapporté','Sang rapporté dans les selles','Vomissements rapportés','Douleur aggravée','Malaise rapporté','Fièvre aggravée','Aggravation rapportée'].includes(s));
}
function clearConsultationMedication(){delete answers.consultMedication;delete answers.careScopes?.consultMedication;}
function setConsultationProfile(id){
 if(!(consultationProducts[consultationProductId()]||[]).some(p=>p.id===id))return;
 answers.consultProfile=id;clearConsultationMedication();render();
}
function setConsultationOralReady(){answers.consultOralReady=!answers.consultOralReady;if(!answers.consultOralReady)clearConsultationMedication();render();}
function chooseConsultationProduct(index,action){
 if(!['given','prescribed'].includes(action)||consultationProductBlocked())return;
 const name=consultationProfile()?.names[index];if(!name||!lexique.some(item=>item.name===name))return;
 if(answers.consultMedication?.name===name&&answers.consultMedication.action===action)clearConsultationMedication();
 else{answers.consultMedication={name,action};careRegisterScope('consultMedication');}
 if(flows[currentFlow]?.followup)answers.followupNoCare=false;
 render();
}
function consultationMedicationLabel(){
 const medication=answers.consultMedication;
 return medication?medication.name+(medication.action==='given'?' administré':' prescrit'):'';
}
function consultationProductsMarkup(){
 const id=consultationProductId(),profiles=consultationProducts[id];if(!profiles)return '';
 const profile=consultationProfile(),blocked=consultationProductBlocked(),medication=answers.consultMedication;
 return `<div class="section consultation-products"><h3>Produit proposé selon la plainte</h3><div class="followup-choices">${profiles.map(p=>`<button type="button" class="secondary" aria-pressed="${p.id===profile.id}" onclick="setConsultationProfile('${p.id}')">${reportEscape(p.label)}</button>`).join('')}</div>${flows[currentFlow]?.followup?`<button type="button" class="secondary consult-oral-ready" aria-pressed="${!!answers.consultOralReady}" onclick="setConsultationOralReady()">Patient conscient et capable d’avaler</button>`:''}<p class="muted">${reportEscape(profile.note)}</p>${blocked?'<p class="route-note">Réévaluer le patient avant un produit oral. Les propositions restent visibles, mais ne peuvent pas être validées dans cet état.</p>':''}<div class="consult-product-list">${profile.names.map((name,index)=>{
 const item=lexique.find(entry=>entry.name===name);if(!item)return '';
 return `<article class="consult-product"><strong>${reportEscape(name)}</strong><div class="consult-product-actions">${[['given','Administré'],['prescribed','Prescrit']].map(([action,label])=>`<button type="button" class="secondary" aria-pressed="${medication?.name===name&&medication.action===action}" onclick="chooseConsultationProduct(${index},'${action}')" ${blocked?'disabled':''}>${label}</button>`).join('')}</div><details><summary>Forme, application et vigilance</summary><p>${reportEscape(item.form||item.composition||'Préparation pharmaceutique historique')} · ${reportEscape(item.admin||'')}</p><p>${reportEscape(item.sensory||'')}</p><p>${reportEscape(item.warning||'')}</p>${item.sources?.[0]?`<a href="${reportEscape(item.sources[0].url)}" target="_blank" rel="noopener noreferrer">Source historique</a>`:''}</details></article>`;
 }).join('')}</div><small>Choisir une seule préparation parmi les alternatives. Aucun médicament n’est ajouté au compte rendu sans validation.</small></div>`;
}
