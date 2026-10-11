// Shared tariffs only. Counts and debt never leave this browser.
let sharedCabinetRates=null,cabinetRatesSyncedAt=0,cabinetRatesRequest=null,cabinetRatesOffline=false,cabinetRatesDialogRevision=null;
const cabinetRatesCacheKey='elkins-cabinet-rates-v1';
function validCabinetRates(r){return r&&['kitCents','syringeCents'].every(k=>Number.isSafeInteger(r[k])&&r[k]>=0&&r[k]<=10000)&&typeof r.revision==='string'&&r.revision.length<=64;}
function cabinetRateMoney(cents){return (cents/100).toLocaleString('fr-FR',{minimumFractionDigits:2,maximumFractionDigits:2})+' $';}
function updateCabinetRatesUI(){
 const r=sharedCabinetRates;
 document.querySelectorAll('.cabinet-item-buttons button').forEach(button=>{button.disabled=!r;const kit=button.getAttribute('onclick').includes("'kits'");button.title=r?(kit?'Kit de soin':'Seringue vivifiante')+' : +'+cabinetRateMoney(kit?r.kitCents:r.syringeCents)+' à reverser au cabinet':'Chargement des tarifs partagés…';});
 const legend=document.querySelector('.cabinet-mobile-legend');if(legend)legend.textContent=r?'Kit : +'+cabinetRateMoney(r.kitCents)+' · Seringue : +'+cabinetRateMoney(r.syringeCents):'Chargement des tarifs…';
 document.getElementById('cabinetSettings').hidden=!r?.canEdit;
 const status=document.getElementById('cabinetRatesStatus');status.hidden=!cabinetRatesOffline;status.textContent=r?'Connexion indisponible : derniers tarifs connus utilisés.':'Tarifs indisponibles. Réessaie avec une connexion.';
}
async function requestCabinetRates(method='GET',body){
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),4000);
 try{const response=await fetch('/api/cabinet-rates',{method,credentials:'same-origin',cache:'no-store',signal:controller.signal,...(body?{headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}:{})});const data=await response.json();if(!response.ok)throw Object.assign(Error(data.error||'Tarifs indisponibles.'),{status:response.status});if(!validCabinetRates(data))throw Error('Réponse de tarifs invalide.');return data;}finally{clearTimeout(timer);}
}
function acceptCabinetRates(data){
 sharedCabinetRates=data;cabinetRatesOffline=false;cabinetRatesSyncedAt=Date.now();
 try{localStorage.setItem(cabinetRatesCacheKey,JSON.stringify({kitCents:data.kitCents,syringeCents:data.syringeCents,revision:data.revision}));}catch{}
 updateCabinetRatesUI();
}
async function refreshCabinetRates(force=false){
 if(cabinetRatesRequest)return cabinetRatesRequest;
 if(!force&&Date.now()-cabinetRatesSyncedAt<10000)return Boolean(sharedCabinetRates);
 cabinetRatesRequest=(async()=>{try{acceptCabinetRates(await requestCabinetRates());}catch{cabinetRatesOffline=true;updateCabinetRatesUI();}return Boolean(sharedCabinetRates);})();
 try{return await cabinetRatesRequest;}finally{cabinetRatesRequest=null;}
}
async function ensureCabinetRates(){return refreshCabinetRates();}
async function openCabinetSettings(){
 await refreshCabinetRates(true);if(!sharedCabinetRates?.canEdit||cabinetRatesOffline)return;
 cabinetRatesDialogRevision=sharedCabinetRates.revision;
 document.getElementById('cabinetKitRate').value=(sharedCabinetRates.kitCents/100).toFixed(2);
 document.getElementById('cabinetSyringeRate').value=(sharedCabinetRates.syringeCents/100).toFixed(2);
 document.getElementById('cabinetSettingsMessage').textContent='';
 document.getElementById('cabinetSettingsDialog').showModal();
}
function parseCabinetRate(value){
 const text=String(value).trim().replace(',','.');if(!/^\d{1,3}(?:\.\d{1,2})?$/.test(text))return null;
 const [whole,fraction='']=text.split('.'),cents=Number(whole)*100+Number(fraction.padEnd(2,'0'));return cents<=10000?cents:null;
}
async function saveCabinetRates(event){
 event.preventDefault();const message=document.getElementById('cabinetSettingsMessage'),button=document.getElementById('cabinetRatesSave');
 const kitCents=parseCabinetRate(document.getElementById('cabinetKitRate').value),syringeCents=parseCabinetRate(document.getElementById('cabinetSyringeRate').value);
 if(kitCents===null||syringeCents===null){message.textContent='Saisis deux montants de 0 à 100 $, avec deux décimales maximum.';return;}
 button.disabled=true;message.textContent='Enregistrement…';
 try{acceptCabinetRates(await requestCabinetRates('PUT',{kitCents,syringeCents,revision:cabinetRatesDialogRevision}));cabinetRatesDialogRevision=sharedCabinetRates.revision;message.textContent='Appliqué à tous. Les montants déjà dus restent inchangés.';}
 catch(error){message.textContent=error.message;if(error.status===409)message.textContent+=' Ferme puis rouvre les réglages pour les actualiser.';if(error.status===403)await refreshCabinetRates(true);}
 finally{button.disabled=false;}
}
document.addEventListener('DOMContentLoaded',()=>{
 try{const cache=JSON.parse(localStorage.getItem(cabinetRatesCacheKey));if(validCabinetRates(cache)){sharedCabinetRates={...cache,canEdit:false};cabinetRatesOffline=true;}}catch{}
 updateCabinetRatesUI();refreshCabinetRates(true);
 setInterval(()=>{if(document.visibilityState==='visible')refreshCabinetRates();},10000);
 document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')refreshCabinetRates(true);});
 window.addEventListener('focus',()=>refreshCabinetRates(true));
});
