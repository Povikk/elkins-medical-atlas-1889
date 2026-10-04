// Transient patient workspaces only. No localStorage, sessionStorage or records.
const patientSessions=[{number:1,state:null}];
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
 bar.innerHTML=`<div class="patient-buttons">${patientSessions.map(p=>`<button type="button" class="patient-button ${p.number===activePatientNumber?'active':''}" aria-pressed="${p.number===activePatientNumber}" title="Patient ${p.number} : double-clic pour renommer" onclick="selectPatient(${p.number})" ondblclick="editPatientLabel()">${reportEscape(p.label||'Patient '+p.number)}</button>`).join('')}</div><button type="button" aria-label="Renommer le patient actif" title="Renommer le patient actif" onclick="editPatientLabel()">&#9998; Nom</button><button type="button" aria-label="Réinitialiser le nom du patient actif" title="Revenir à Patient ${activePatientNumber}, sans effacer les soins" onpointerdown="event.preventDefault()" onclick="resetPatientLabel()">Réinitialiser</button><button type="button" class="patient-add" aria-label="Ajouter un patient" title="Ajouter un patient" onclick="addPatient()">+</button>`;
}
function resetPatientLabel(){
 patientSessions.find(p=>p.number===activePatientNumber).label='';renderPatientBar();
}
function editPatientLabel(){
 if(document.querySelector('.patient-label-input')){document.querySelector('.patient-label-input').focus();return;}
 const patient=patientSessions.find(p=>p.number===activePatientNumber);
 const button=document.querySelector('#patientBar button[aria-pressed="true"]');
 const input=document.createElement('input');input.className='patient-label-input';input.maxLength=40;
 input.setAttribute('aria-label','Surnom du patient');input.placeholder='Patient '+patient.number;input.value=patient.label||'';
 let finished=false;
 const finish=save=>{if(finished)return;finished=true;if(save)patient.label=input.value.trim().replace(/\s+/g,' ').slice(0,40);renderPatientBar();document.querySelector('#patientBar button[aria-pressed="true"]')?.focus({preventScroll:true});};
 input.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key==='Escape'){e.preventDefault();finish(e.key==='Enter');}});
 input.addEventListener('blur',()=>finish(true));button.replaceWith(input);input.focus({preventScroll:true});input.select();
}
function addPatient(){
 const number=patientSessions.length+1;patientSessions.push({number,state:null});selectPatient(number);
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
  document.querySelector(`#patientBar button[aria-pressed="true"]`)?.focus({preventScroll:true});
 }finally{patientSwitchInProgress=false;}
}
function placePatientBar(){
 const bar=document.getElementById('patientBar');
 if(innerWidth>760)document.querySelector('.side-nav').before(bar);
 else document.getElementById('mainContent').prepend(bar);
}
document.addEventListener('DOMContentLoaded',()=>{renderPatientBar();placePatientBar();matchMedia('(max-width:760px)').addEventListener('change',placePatientBar);});
