// Explicit device-local counter only. No patient information is stored.
const cabinetStorageKey='elkins-cabinet-counter-v1';
let cabinetCounts={kits:0,syringes:0,combos:0,personalCents:0},cabinetStorageError=false;
function loadCabinetCounts(){
 try{const raw=localStorage.getItem(cabinetStorageKey);if(!raw){cabinetStorageError=false;return {kits:0,syringes:0,combos:0,personalCents:0};}const data=JSON.parse(raw);
  if(!['kits','syringes'].every(key=>Number.isSafeInteger(data[key])&&data[key]>=0&&data[key]<=1000000))throw Error('Invalid counter');
  const personalCents=data.personalCents===undefined?data.kits*50+data.syringes*100:data.personalCents;
  if(!Number.isSafeInteger(personalCents)||personalCents<0)throw Error('Invalid earnings');
  const combos=data.combos??0;
  if(!Number.isSafeInteger(combos)||combos<0||combos>Math.min(data.kits,data.syringes))throw Error('Invalid combined count');
  cabinetStorageError=false;return {kits:data.kits,syringes:data.syringes,combos,personalCents};
 }catch(error){cabinetStorageError=true;return {...cabinetCounts};}
}
function renderCabinetCounter(){
 document.getElementById('cabinetKitCount').textContent=cabinetCounts.kits-cabinetCounts.combos;
 document.getElementById('cabinetComboCount').textContent=cabinetCounts.combos;
 document.getElementById('cabinetTotal').textContent=((cabinetCounts.kits+cabinetCounts.syringes)*.5).toLocaleString('fr-FR',{minimumFractionDigits:2,maximumFractionDigits:2})+' $';
 document.getElementById('personalTotal').textContent=(cabinetCounts.personalCents/100).toLocaleString('fr-FR',{minimumFractionDigits:2,maximumFractionDigits:2})+' $';
 document.getElementById('cabinetStatus').textContent=cabinetStorageError?'Sauvegarde locale indisponible : compteurs conservés seulement pour cette page.':'';
 document.getElementById('cabinetStatus').hidden=!cabinetStorageError;
}
function saveCabinetCounts(){try{localStorage.setItem(cabinetStorageKey,JSON.stringify(cabinetCounts));cabinetStorageError=false;}catch(error){cabinetStorageError=true;}renderCabinetCounter();}
function addCabinetItem(key){
 if(!['kits','combo'].includes(key))return;
 cabinetCounts=loadCabinetCounts();
 const gain=key==='combo'?150:100;
 const keys=key==='combo'?['kits','syringes']:[key];
 if(keys.some(k=>cabinetCounts[k]>=1000000)||!Number.isSafeInteger(cabinetCounts.personalCents+gain))return;
 keys.forEach(k=>cabinetCounts[k]++);if(key==='combo')cabinetCounts.combos++;
 cabinetCounts.personalCents+=gain;saveCabinetCounts();
}
function resetCabinetCounter(){if(!confirm('As-tu bien mis l’argent sur le compte du cabinet ?'))return;cabinetCounts=loadCabinetCounts();cabinetCounts.kits=0;cabinetCounts.syringes=0;cabinetCounts.combos=0;saveCabinetCounts();}
function resetPersonalCounter(){if(!confirm('Remettre tes gains personnels à zéro ? Le montant dû au cabinet restera inchangé.'))return;cabinetCounts=loadCabinetCounts();cabinetCounts.personalCents=0;saveCabinetCounts();}
function placeCabinetCounter(){const panel=document.querySelector('.cabinet-counter');if(innerWidth>760)document.getElementById('themeToggle').before(panel);else document.getElementById('mainContent').append(panel);}
document.addEventListener('DOMContentLoaded',()=>{cabinetCounts=loadCabinetCounts();renderCabinetCounter();placeCabinetCounter();matchMedia('(max-width:760px)').addEventListener('change',placeCabinetCounter);});
window.addEventListener('storage',event=>{if(event.key===cabinetStorageKey||event.key===null){cabinetCounts=loadCabinetCounts();renderCabinetCounter();}});
