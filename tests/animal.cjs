const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch();try{
 const p=await browser.newPage({viewport:{width:2560,height:1440}}),errors=[];
 p.on('pageerror',e=>errors.push(e.message));
 await p.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
 assert.equal(await p.locator('#cases .case').nth(2).getAttribute('onclick'),"start('animal')");
 assert(await p.locator('#cases img[src$="1f43e.svg"]').evaluate(e=>e.complete&&e.naturalWidth>0));
 const baseline={conscious:'awake',animalSpecies:'grizzly',animalBleeding:'minor',animalInjury:'bite',animalMultiplicity:'single',animalArea:'arm',animalSide:'left',animalDepth:'surface',animalExposure:'wild'};
 let runs=0;
 for(const compact of [false,true])for(const last of [false,true]){
  await p.evaluate(compact=>{compactMode=compact;careMemoOnly=false;start('animal');},compact);
  for(let n=0;n<30;n++){
   if(await p.evaluate(()=>interventionEnded))break;
   assert(await p.locator('.care-memo').isVisible());
   if(compact){const select=p.locator('#flow .is-current .condensed-choice select:not([disabled])');
    if(await select.count()){const count=await select.locator('option').count();await select.selectOption(String(last?count-2:0));}
    else await p.locator('#flow .next').click();
   }else{const choices=p.locator('#flow .choice');if(await choices.count())await choices.nth(last?(await choices.count())-1:0).click();else await p.locator('#flow .next').click();}
  }
  assert(await p.evaluate(()=>interventionEnded));assert(await p.locator('#report-findings').isVisible());runs++;
 }
 // Each observation is navigable in both views, with its full label preserved.
 for(const compact of [false,true])for(const index of [0,1,3,4,5,6,7]){
  const count=await p.evaluate(({index,baseline})=>{answers={...baseline};return animalChoicesForStep(flows.animal.steps[index]).length;},{index,baseline});
  for(let choice=0;choice<count;choice++){
   await p.evaluate(({compact,index,baseline})=>{compactMode=compact;start('animal');answers={...baseline};stepIndex=index;render();},{compact,index,baseline});
   const expected=await p.evaluate(({index,choice})=>animalChoicesForStep(flows.animal.steps[index])[choice],{index,choice});
   if(compact)await p.locator(`[data-step-index="${index}"] .condensed-choice select`).selectOption(String(choice));
   else await p.locator('#flow .choice').nth(choice).click();
   const found=await p.evaluate(keys=>Object.fromEntries(keys.map(key=>[key,answers[key]])),Object.keys(expected.set));
   assert.deepEqual(found,expected.set);
  }
 }
 for(const scenario of [
  {animalInjury:'scratch',animalDepth:'surface',animalArea:'leg',animalSide:'right',animalExposure:'known'},
  {animalInjury:'mixed',animalMultiplicity:'multiple',animalDepth:'deep',animalArea:'hand',animalSide:'left'},
  {animalDepth:'crush',animalArea:'arm'},
  {animalDepth:'unknown',animalArea:'unknown'},
  {conscious:'unconscious_breathing'},
  {conscious:'not_breathing'},
  {animalBleeding:'major'},
  {animalBleeding:'unknown'},
  {latestBreathing:'weak'},
  {latestState:'confused'}
 ]){
  await p.evaluate(({baseline,scenario})=>{compactMode=false;start('animal');answers={...baseline,...scenario};stepIndex=8;render();},{baseline,scenario});
  assert.match(await p.locator('#flow').innerText(),/fermeture|points|prioritaire/);
  const unsafe=await p.evaluate(()=>animalUnsafe());
  await p.evaluate(()=>{stepIndex=9;render();});
  if(unsafe)assert.equal(await p.locator('#flow .med-item').count(),0);
  await p.evaluate(()=>{stepIndex=11;render();});
  assert.match(await p.locator('#flow').innerText(),/rage/);
  await p.evaluate(()=>renderEnd());
  assert.match(await p.locator('#report-care').innerText(),/Pas de fermeture automatique/);
 }
 await p.evaluate(baseline=>{start('animal');answers={...baseline,animalBleeding:'major',conscious:'unconscious_breathing'};stepIndex=9;render();},baseline);
 assert.equal(await p.evaluate(()=>careUrgency('serious')),'critical');assert.equal(await p.locator('.med-item').count(),0);
 await p.evaluate(()=>{Object.assign(answers,{latestState:'awake',latestBreathing:'yes',latestBleeding:'none',rpPain:'moderate'});render();});
 assert.equal(await p.evaluate(()=>careUrgency('serious')),'serious');assert.equal(await p.evaluate(()=>animalUnsafe()),false);
 assert.match(await p.locator('.med-item').innerText(),/Laudanum/);assert(!/Morphine/.test(await p.locator('.med-item').innerText()));
 await p.evaluate(()=>{answers.rpPain='strong';render();});assert.equal(await p.locator('.med-item').count(),2);
 await p.evaluate(()=>{answers.rpPain='mild';render();});assert.equal(await p.locator('.med-item').count(),0);
 await p.evaluate(()=>{stepIndex=5;applyChoice(flows.animal.steps[5].choices[1].set);prev();});
 assert.equal(await p.evaluate(()=>answers.animalSide),'left');assert.equal(await p.evaluate(()=>answers.latestState),'awake');
 await p.evaluate(()=>{answers.animalSide='right';answers.animalArea='arm';renderEnd();});assert.match(await p.locator('#report-findings').innerText(),/Bras droit/);
 // Earlier condensed changes discard dependent observations, not current vitals.
 await p.evaluate(baseline=>{start('animal');compactMode=true;answers={...baseline,latestState:'awake',latestBleeding:'none'};stepIndex=11;render();},baseline);
 await p.locator('[data-step-index="4"] .condensed-choice select').selectOption('1');
 assert.equal(await p.evaluate(()=>answers.animalArea),undefined);assert.equal(await p.evaluate(()=>answers.animalExposure),undefined);assert.equal(await p.evaluate(()=>answers.latestState),'awake');
 for(const width of [2560,1920,390,320])for(const theme of ['dark','light'])for(const compact of [false,true]){
  await p.setViewportSize({width,height:width>500?1440:844});
  await p.evaluate(({baseline,compact,theme})=>{applyTheme(theme);setReadingSize('normal',false);compactMode=compact;start('animal');answers={...baseline};stepIndex=5;render();},{baseline,compact,theme});
  assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${width} ${theme} ${compact}`);
  if(width===2560&&!compact)assert((await p.locator('#flow .choice').last().boundingBox()).y<1440);
  if(width===2560&&compact)assert(await p.locator('.condensed-grid').evaluate(e=>e.getBoundingClientRect().bottom<1440),'Animal condensed route fits a 2K desktop viewport');
  if(width===2560&&theme==='dark'||width===390&&theme==='dark')await p.screenshot({path:`tmp/site-qa/animal-${width}-${compact?'condensed':'detail'}.png`,fullPage:true});
 }
 await p.evaluate(()=>{compactMode=false;start('knife');});assert.equal(await p.evaluate(()=>Object.keys(answers).length),0);
 assert.deepEqual(errors,[]);assert((await p.evaluate(()=>Object.keys(localStorage))).every(k=>['elkins-theme','elkins-reading-size'].includes(k)));
 console.log(`OK animal: ${runs} full routes, every choice in both views, priority/unknown/deep/crush/multiple, analgesics, latest state, back, summary, desktop/mobile/themes, transient state`);
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
