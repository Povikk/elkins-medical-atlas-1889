const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const ctx={currentFlow:'gunshot',answers:{needsSuture:true,bullet:'out'},careProductBlocked:()=>false};vm.createContext(ctx);vm.runInContext(fs.readFileSync('dist/report.js','utf8'),ctx);
for(const id of ['gunshot','knife','minor']){ctx.currentFlow=id;ctx.answers.needsSuture=true;assert.match(ctx.reportSuggestedCare('flow'),/Repasser dans 24 h/);for(const value of [false,'avoid',undefined]){ctx.answers.needsSuture=value;assert.doesNotMatch(ctx.reportSuggestedCare('flow'),/24 h/);}}
assert.match(ctx.reportSuggestedCare('surgery'),/Si une suture a été effectuée/);
console.log('OK rappel conditionnel, retrait distinct, choix modifié et chirurgie');
