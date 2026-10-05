const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const context={answers:{},currentFlow:'gunshot',activeRouteKind:'flow',rpContext:{},zoneKeys:[],zoneSelections:()=>[],zoneHas:()=>false,sleepingSurgery:()=>false};
vm.createContext(context);
vm.runInContext(fs.readFileSync('dist/data.js','utf8'),context);
vm.runInContext(fs.readFileSync('dist/recovery.js','utf8'),context);
const rp=fs.readFileSync('dist/rp-ui.js','utf8'),scene=fs.readFileSync('dist/scene.js','utf8');
vm.runInContext(rp.slice(rp.indexOf('function rpPatientState()'),rp.indexOf('function rpGesture()')),context);
vm.runInContext(scene.slice(scene.indexOf('function shouldSkipStep('),scene.indexOf('function sceneMaterialMarkup(')),context);
vm.runInContext(fs.readFileSync('dist/report.js','utf8'),context);
vm.runInContext(`
 const wake=flows.gunshot.steps.find(s=>s.recoveryCheck);
 if(!wake)throw Error('Missing recovery step');
 answers={conscious:'unconscious_breathing'};
 if(shouldSkipStep(wake)||rpPatientState()!=='unresponsive')throw Error('Initial unconscious state');
 Object.assign(answers,wake.choices[0].set);
 if(rpPatientState()!=='awake')throw Error('Recovery did not update state');
 const recap=reportFindings('flow');
 if(!recap.includes('À l’arrivée : Inconscient')||!recap.includes('Conscient à la dernière'))throw Error('Missing chronological recap');
 Object.assign(answers,wake.choices[2].set);
 if(rpPatientState()!=='unresponsive')throw Error('Still unconscious branch');
 Object.assign(answers,wake.choices[1].set);
 if(rpPatientState()!=='confused')throw Error('Confused branch');
 answers={conscious:'awake'};
 if(!shouldSkipStep(wake))throw Error('Unnecessary step for awake patient');
 for(const route of Object.values(flows)){
  const before=route.steps.findIndex(s=>s.dynamicConscious||s.dynamicHead||s.dynamicBreathing||s.dynamicPoison);
  if(before>=0&&!route.steps[before+1].recoveryCheck)throw Error('Recovery misplaced');
 }
`,context);
console.log('Recovery choices, initial/current state, recap and conditional navigation passed.');
