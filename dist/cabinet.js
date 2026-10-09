// Explicit device-local counter only. No patient information is stored.
const cabinetStorageKey='elkins-cabinet-counter-v1';
let cabinetCounts={kits:0,syringes:0,dueCents:0},cabinetStorageError=false;
function loadCabinetCounts(){
 try{const raw=localStorage.getItem(cabinetStorageKey);if(!raw){cabinetStorageError=false;return {kits:0,syringes:0,dueCents:0};}const data=JSON.parse(raw);
  if(!['kits','syringes'].every(key=>Number.isSafeInteger(data[key])&&data[key]>=0&&data[key]<=1000000))throw Error('Invalid counter');
  // Preserve debt accumulated at the old rate. New clicks use the new rates.
  const dueCents=data.dueCents??(data.kits+data.syringes)*50;
  if(!Number.isSafeInteger(dueCents)||dueCents<0)throw Error('Invalid cabinet debt');
  cabinetStorageError=false;return {kits:data.kits,syringes:data.syringes,dueCents};
 }catch(error){cabinetStorageError=true;return {...cabinetCounts};}
}
function renderCabinetCounter(){
 document.getElementById('cabinetKitCount').textContent=cabinetCounts.kits;
 document.getElementById('cabinetSyringeCount').textContent=cabinetCounts.syringes;
 document.getElementById('cabinetTotal').textContent=(cabinetCounts.dueCents/100).toLocaleString('fr-FR',{minimumFractionDigits:2,maximumFractionDigits:2})+' $';
 document.getElementById('cabinetStatus').textContent=cabinetStorageError?'Sauvegarde locale indisponible : compteurs conservés seulement pour cette page.':'';
 document.getElementById('cabinetStatus').hidden=!cabinetStorageError;
}
function saveCabinetCounts(){try{localStorage.setItem(cabinetStorageKey,JSON.stringify(cabinetCounts));cabinetStorageError=false;}catch(error){cabinetStorageError=true;}renderCabinetCounter();}
function addCabinetItem(key){
 if(!['kits','syringes'].includes(key))return;
 cabinetCounts=loadCabinetCounts();
 const contribution=key==='kits'?37:57;
 if(cabinetCounts[key]>=1000000||!Number.isSafeInteger(cabinetCounts.dueCents+contribution))return;
 cabinetCounts[key]++;cabinetCounts.dueCents+=contribution;saveCabinetCounts();
}
function resetCabinetCounter(){if(!confirm('As-tu bien mis l’argent sur le compte du cabinet ?'))return;cabinetCounts={kits:0,syringes:0,dueCents:0};saveCabinetCounts();}
function placeCabinetCounter(){const panel=document.querySelector('.cabinet-counter');if(innerWidth>760)document.getElementById('themeToggle').before(panel);else document.getElementById('mainContent').append(panel);}
document.addEventListener('DOMContentLoaded',()=>{cabinetCounts=loadCabinetCounts();renderCabinetCounter();placeCabinetCounter();matchMedia('(max-width:760px)').addEventListener('change',placeCabinetCounter);});
window.addEventListener('storage',event=>{if(event.key===cabinetStorageKey||event.key===null){cabinetCounts=loadCabinetCounts();renderCabinetCounter();}});
