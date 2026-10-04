const {chromium}=require('playwright'),assert=require('node:assert/strict');
(async()=>{const b=await chromium.launch();try{
 const p=await b.newPage({viewport:{width:2560,height:1440}}),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto('http://127.0.0.1:4173/');
 const routes=await p.evaluate(()=>Object.keys(flows).filter(id=>flows[id].steps.some(s=>zoneKeyForStep(s))));
 for(const id of routes)for(const compact of [false,true]){
  const meta=await p.evaluate(({id,compact})=>{compactMode=compact;careMemoOnly=false;start(id);answers={conscious:'awake',animalSpecies:'grizzly',animalBleeding:'none'};stepIndex=flows[id].steps.findIndex(s=>zoneKeyForStep(s));const step=flows[id].steps[stepIndex],key=zoneKeyForStep(step);flows[id].steps.slice(0,stepIndex).forEach(s=>{if(s.choices&&!zoneKeyForStep(s))Object.assign(answers,s.choices[0].set);});render();return {index:stepIndex,key,choices:step.choices.filter(c=>!['unknown','none','general'].includes(c.set[key])).slice(0,5)};},{id,compact});
  for(const c of meta.choices){
   if(compact)await p.locator(`[data-step-index="${meta.index}"] .zone-checks label`).filter({hasText:c.label}).first().locator('input').check();
   else await p.locator('#flow button.choice').filter({hasText:c.label}).first().click();
   assert.equal(await p.evaluate(()=>stepIndex),meta.index,'selection must not advance');
  }
  assert.equal(await p.evaluate(key=>zoneSelections(key).length,meta.key),5);
  const region=compact?p.locator(`[data-step-index="${meta.index}"]`):p.locator('#flow');
  await region.getByRole('button',{name:'Valider les zones',exact:true}).click();
  assert(await p.evaluate(index=>stepIndex>index,meta.index));
  const finding=await p.evaluate(()=>reportFindings('flow'));
  for(const c of meta.choices)assert(finding.includes(c.label));
  await p.evaluate(()=>prev());
  assert.equal(await p.evaluate(()=>stepIndex),meta.index);
  assert.equal(await p.evaluate(key=>zoneSelections(key).length,meta.key),5,'back retains selection');
  await p.evaluate(({index,key})=>{const c=flows[currentFlow].steps[index].choices.find(c=>c.set[key]==='unknown');toggleZoneSelection(index,c.set);},{index:meta.index,key:meta.key});
  assert.equal(await p.evaluate(key=>zoneSelections(key).length,meta.key),1,'unknown exclusive');
  await p.evaluate(({index,set})=>toggleZoneSelection(index,set),{index:meta.index,set:meta.choices[0].set});
  assert.equal(await p.evaluate(key=>zoneSelections(key).length,meta.key),1,'known replaces unknown');
  await p.evaluate(({index,set})=>toggleZoneSelection(index,set),{index:meta.index,set:meta.choices[0].set});
  assert.equal(await p.evaluate(key=>zoneSelections(key).length,meta.key),0);
  assert(await (compact?p.locator(`[data-step-index="${meta.index}"]`):p.locator('#flow')).getByRole('button',{name:'Valider les zones',exact:true}).isDisabled());
 }
 for(const id of routes){
  await p.evaluate(id=>{compactMode=false;start(id);answers={conscious:'awake'};stepIndex=flows[id].steps.findIndex(s=>zoneKeyForStep(s));const s=flows[id].steps[stepIndex],k=zoneKeyForStep(s);const selected=s.choices.filter(c=>!['unknown','none','general'].includes(c.set[k])).slice(0,5);selected.forEach(c=>toggleZoneSelection(stepIndex,c.set));render();},id);
  for(const width of [2560,1920,390,320])for(const theme of ['dark','light']){
   await p.setViewportSize({width,height:width<500?844:1440});await p.evaluate(theme=>applyTheme(theme),theme);
   assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${id} width ${width}`);
  }
 }
 await p.evaluate(()=>{compactMode=true;start('gunshot');answers={conscious:'awake'};const index=flows.gunshot.steps.findIndex(s=>zoneKeyForStep(s));stepIndex=index;const step=flows.gunshot.steps[index];for(const area of ['arm','chest','abdomen','head'])toggleZoneSelection(index,step.choices.find(c=>c.set.gunArea===area).set);confirmZoneSelection(index);});
 assert.equal(await p.evaluate(()=>answers.gunArea),'head');
 assert.match(await p.locator('#flow').innerText(),/Thorax :.*Abdomen :/s);
 await p.evaluate(()=>{answers.latestBreathing='weak';const index=flows.gunshot.steps.findIndex(s=>zoneKeyForStep(s));toggleZoneSelection(index,flows.gunshot.steps[index].choices.find(c=>c.set.gunArea==='leg').set);});
 assert.equal(await p.evaluate(()=>answers.latestBreathing),'weak');
 await p.evaluate(()=>start('animal'));assert.equal(await p.evaluate(()=>Object.keys(answers).length),0);
 assert.deepEqual(errors,[]);console.log(`OK ${routes.length} routes, 5 zones, both views, validation/back/exclusive unknown/reset, multi-sensitive-area guidance, mobile and themes`);
}finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
