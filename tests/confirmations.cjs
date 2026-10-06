const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const context=vm.createContext({answers:{},document:{querySelectorAll:()=>[]}});
vm.runInContext(fs.readFileSync('dist/confirmations.js','utf8'),context);
const run=code=>vm.runInContext(code,context);
assert.equal(run('reportConfirmedFindings()'),'');assert.equal(run('reportConfirmedCare()'),'');
run("careConfirm('product:Arnica','used')");assert.match(run('reportConfirmedCare()'),/Arnica utilisé/);
run("careConfirm('product:Arnica','used')");assert.equal(run('reportConfirmedCare()'),'');
run("careConfirm('projectile','retained');careConfirm('finalState','awake')");
assert.doesNotMatch(run('reportConfirmedFindings()'),/laissé en place/);assert.match(run('reportConfirmedFindings()'),/conscient/);
assert.equal(run('reportConfirmedCare()'),'');
run("careConfirm('closure','sutured')");assert.equal(run('answers.reportClosure'),'sutured');
run("careConfirm('closure','sutured')");assert.equal(run('answers.reportClosure'),'');
console.log('Optional confirmations, cancellation and non-repeated findings passed.');
// Structured route recording is exercised in route-ledger.cjs with the full load order.
