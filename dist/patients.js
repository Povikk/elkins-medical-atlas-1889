// Transient patient workspaces only. No localStorage, sessionStorage or records.
const patientSessions=[{number:1,state:null}];
let nextPatientNumber=2;
let activePatientNumber=1;
let patientSwitchInProgress=false;
function patientCareView(){
 return ['flow','surgeryFlow'].find(id=>!document.getElementById(id).classList.contains('hidden'))||null;
}
function capturePatientState(){
 const view=patientCareView();if(!view || (view==='flow'&&!currentFlow) || (view==='surgeryFlow'&&!currentSurgery))return;
 const state={view,currentFlow,currentSurgery,stepIndex,surgeryStepIndex,answers,flowHistory,
  interventionEnded,surgeryEnded,compactMode,activeRouteKind,activeStepTitle,
  rpContext,rpContextOpen,rpPhraseHistory,rpPhraseOrder,careMemoOpen,careMemoOnly,scroll:scrollY};
 patientSessions.find(p=>p.number===activePatientNumber).state=structuredClone(state);
}
function rememberPatientBeforeNavigation(id){
 if(!patientSwitchInProgress&&!['flow','surgeryFlow'].includes(id))capturePatientState();
}
function renderPatientBar(){
 const bar=document.getElementById('patientBar');
 bar.innerHTML=`<span class="patient-list-title">Patients</span><div class="patient-buttons">${patientSessions.map(p=>`<div class="patient-row" data-patient="${p.number}"><button type="button" class="patient-button ${p.number===activePatientNumber?'active':''}" aria-pressed="${p.number===activePatientNumber}" title="Patient ${p.number} : double-clic pour renommer" onclick="selectPatient(${p.number})" ondblclick="editPatientLabel(${p.number})">${reportEscape(p.label||'Patient '+p.number)}</button><div class="patient-row-actions"><button type="button" aria-label="${p.number===activePatientNumber?'Renommer le patient actif':'Renommer Patient '+p.number}" title="Renommer" onclick="editPatientLabel(${p.number})">&#9998;</button><button type="button" aria-label="Supprimer Patient ${p.number}" title="Supprimer" onclick="removePatient(${p.number})">×</button></div></div>`).join('')}</div><button type="button" class="patient-add" aria-label="Ajouter un patient" onclick="addPatient()">+ Ajouter</button>`;
}
function resetPatientLabel(){
 patientSessions.find(p=>p.number===activePatientNumber).label='';renderPatientBar();
}
function editPatientLabel(number=activePatientNumber){
 if(document.querySelector('.patient-label-input')){document.querySelector('.patient-label-input').focus();return;}
 const patient=patientSessions.find(p=>p.number===number);if(!patient)return;
 const button=document.querySelector(`[data-patient="${number}"] .patient-button`);
 const input=document.createElement('input');input.className='patient-label-input';input.maxLength=40;
 input.setAttribute('aria-label','Surnom du patient');input.placeholder='Patient '+patient.number;input.value=patient.label||'';
 let finished=false;
 const finish=save=>{if(finished)return;finished=true;if(save)patient.label=input.value.trim().replace(/\s+/g,' ').slice(0,40);renderPatientBar();document.querySelector('#patientBar button[aria-pressed="true"]')?.focus({preventScroll:true});};
 input.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key==='Escape'){e.preventDefault();finish(e.key==='Enter');}});
 input.addEventListener('blur',()=>finish(true));button.replaceWith(input);input.focus({preventScroll:true});input.select();
 const reset=document.createElement('button');reset.type='button';reset.className='patient-name-reset';reset.textContent='Réinitialiser';reset.setAttribute('aria-label','Réinitialiser le nom du patient');reset.addEventListener('pointerdown',e=>e.preventDefault());reset.addEventListener('click',()=>{input.value='';finish(true);});input.after(reset);
}
function addPatient(){
 const number=nextPatientNumber++;patientSessions.push({number,state:null});selectPatient(number);
}
function removePatient(number){
 capturePatientState();
 const index=patientSessions.findIndex(p=>p.number===number);if(index<0)return;
 const patient=patientSessions[index];
 if(patient.state&&!confirm(`Supprimer ${patient.label||'Patient '+number} et son parcours temporaire ? Cette suppression ne peut pas être annulée.`))return;
 if(patientSessions.length===1){
  currentFlow=null;currentSurgery=null;activePatientNumber=0;
  patientSessions.splice(0,1,{number:1,state:null});nextPatientNumber=2;
  selectPatient(1);return;
 }
 if(number===activePatientNumber){
  const replacement=patientSessions[index+1]||patientSessions[index-1];selectPatient(replacement.number);
 }
 patientSessions.splice(index,1);renderPatientBar();
}
function selectPatient(number){
 const patient=patientSessions.find(p=>p.number===number);if(!patient)return;
 // Clicking the active tab from a reference page resumes its cached care too.
 if(number===activePatientNumber&&patientCareView())return;
 document.querySelectorAll('dialog[open]').forEach(dialog=>dialog.close());
 capturePatientState();
 activePatientNumber=number;patientSwitchInProgress=true;
 try{
  materialPanelOpen=false;incidentKind='';careObservationDirty=false;rpPhraseBlocks=[];
  document.getElementById('flow').innerHTML='';document.getElementById('surgeryFlow').innerHTML='';
  if(!patient.state){
   currentFlow=null;currentSurgery=null;stepIndex=0;surgeryStepIndex=0;answers={};flowHistory=[];
   interventionEnded=false;surgeryEnded=false;activeStepTitle='';activeRouteKind='flow';
   careMemoOnly=false;resetRpScene();show('cases');
  }else{
   const s=structuredClone(patient.state);
   currentFlow=s.currentFlow;currentSurgery=s.currentSurgery;stepIndex=s.stepIndex;surgeryStepIndex=s.surgeryStepIndex;
   answers=s.answers;flowHistory=s.flowHistory;interventionEnded=s.interventionEnded;surgeryEnded=s.surgeryEnded;
   compactMode=s.compactMode;activeRouteKind=s.activeRouteKind;activeStepTitle=s.activeStepTitle;
   rpContext=s.rpContext;rpContextOpen=s.rpContextOpen;rpPhraseHistory=s.rpPhraseHistory;rpPhraseOrder=s.rpPhraseOrder;
   careMemoOpen=s.careMemoOpen;careMemoOnly=s.careMemoOnly;
   show(s.view);
   const ended=s.view==='surgeryFlow'?surgeryEnded:interventionEnded;
   if(ended)document.getElementById(s.view).innerHTML=endingMarkup(s.view==='surgeryFlow'?'surgery':'flow');
   else if(s.view==='surgeryFlow')renderSurgery();else render();
   window.scrollTo({top:s.scroll,behavior:'auto'});
  }
  renderPatientBar();
  const list=document.querySelector('.patient-buttons'),row=document.querySelector(`[data-patient="${number}"]`);
  if(list&&row){const bounds=list.getBoundingClientRect(),item=row.getBoundingClientRect();if(item.bottom>bounds.bottom)list.scrollTop+=item.bottom-bounds.bottom;if(item.top<bounds.top)list.scrollTop-=bounds.top-item.top;}
  document.querySelector(`#patientBar button[aria-pressed="true"]`)?.focus({preventScroll:true});
 }finally{patientSwitchInProgress=false;}
}
function placePatientBar(){
 const bar=document.getElementById('patientBar');
 if(innerWidth>760)document.querySelector('.side-nav').before(bar);
 else document.getElementById('mainContent').prepend(bar);
}
document.addEventListener('DOMContentLoaded',()=>{renderPatientBar();placePatientBar();matchMedia('(max-width:760px)').addEventListener('change',placePatientBar);});
