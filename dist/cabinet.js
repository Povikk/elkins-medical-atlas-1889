// Explicit device-local counter only. No patient information is stored.
const cabinetStorageKey='elkins-cabinet-counter-v1';
let cabinetCounts={kits:0,syringes:0},cabinetStorageError=false;
function loadCabinetCounts(){
 try{const raw=localStorage.getItem(cabinetStorageKey);if(!raw)return {kits:0,syringes:0};const data=JSON.parse(raw);
  if(!['kits','syringes'].every(key=>Number.isSafeInteger(data[key])&&data[key]>=0&&data[key]<=1000000))throw Error('Invalid counter');
  cabinetStorageError=false;return {kits:data.kits,syringes:data.syringes};
 }catch(error){cabinetStorageError=true;return {...cabinetCounts};}
}
function renderCabinetCounter(){
 document.getElementById('cabinetKitCount').textContent=cabinetCounts.kits;
 document.getElementById('cabinetSyringeCount').textContent=cabinetCounts.syringes;
 document.getElementById('cabinetTotal').textContent=((cabinetCounts.kits+cabinetCounts.syringes)*.5).toLocaleString('fr-FR',{minimumFractionDigits:2,maximumFractionDigits:2})+' $';
 document.getElementById('cabinetStatus').textContent=cabinetStorageError?'Sauvegarde locale indisponible : compteur conservé seulement pour cette page.':'Conservé sur ce navigateur uniquement.';
}
function saveCabinetCounts(){try{localStorage.setItem(cabinetStorageKey,JSON.stringify(cabinetCounts));cabinetStorageError=false;}catch(error){cabinetStorageError=true;}renderCabinetCounter();}
function addCabinetItem(key){if(!['kits','syringes'].includes(key))return;cabinetCounts=loadCabinetCounts();if(cabinetCounts[key]>=1000000)return;cabinetCounts[key]++;saveCabinetCounts();}
function resetCabinetCounter(){if(!confirm('As-tu bien mis l’argent sur le compte du cabinet ?'))return;cabinetCounts={kits:0,syringes:0};saveCabinetCounts();}
function placeCabinetCounter(){const panel=document.querySelector('.cabinet-counter');if(innerWidth>760)document.getElementById('themeToggle').before(panel);else document.getElementById('mainContent').append(panel);}
document.addEventListener('DOMContentLoaded',()=>{cabinetCounts=loadCabinetCounts();renderCabinetCounter();placeCabinetCounter();matchMedia('(max-width:760px)').addEventListener('change',placeCabinetCounter);});
window.addEventListener('storage',event=>{if(event.key===cabinetStorageKey||event.key===null){cabinetCounts=loadCabinetCounts();renderCabinetCounter();}});
