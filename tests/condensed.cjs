const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch();try{
 const page=await browser.newPage({viewport:{width:1920,height:1080}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:4173/');
 const ids=await page.evaluate(()=>Object.keys(flows));let layouts=[];
 for(const id of ids){
  await page.evaluate(id=>{compactMode=false;start(id);toggleCompact('flow');},id);
  assert.equal(await page.locator('.condensed-step').count(),await page.evaluate(()=>visibleFlowSteps().length));
  assert.equal(await page.locator('#flow .rp-dialogue,#flow .rp-gesture,#flow .care-hook').count(),0);
  const before=await page.evaluate(()=>JSON.stringify({answers,stepIndex,flowHistory,phrases:[...rpPhraseHistory]}));
  await page.getByRole('button',{name:'Vue détaillée',exact:true}).click();
  assert.equal(await page.evaluate(()=>JSON.stringify({answers,stepIndex,flowHistory})),JSON.stringify(JSON.parse(before),['answers','stepIndex','flowHistory']));
  await page.getByRole('button',{name:'Condensé',exact:true}).click();
  await page.evaluate(()=>{answers={conscious:'awake',headState:'awake',poisonState:'sleepy',unknownWake:'awake',unknownBreathing:'yes',unknownBleeding:'minor',breathing:'yes',gunArea:'arm',gunAreaSide:'left',gunAreaPart:'arm',bullet:'out',needsSuture:true,knifeArea:'arm',knifeSeverity:'shallow',horseArea:'arm',horseAreaSide:'left',horseAreaPart:'arm',horsePain:'moderate',horseVisible:'bruise',horseMove:'painful',fracturePain:'moderate',fightIssue:'bruise',burnSeverity:'minor',consultEvolution:'stable'};render();});
  layouts.push({id,bottom:await page.locator('.condensed-grid').evaluate(e=>e.getBoundingClientRect().bottom)});
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 }
 await page.evaluate(()=>{start('gunshot');compactMode=true;answers={conscious:'awake',gunArea:'arm',gunAreaSide:'left',gunAreaPart:'arm',bullet:'out',needsSuture:true,latestState:'awake'};stepIndex=10;render();});
 await page.locator('[data-step-index="8"] .condensed-choice select').selectOption('1');
 assert.equal(await page.evaluate(()=>answers.needsSuture),false);assert.equal(await page.locator('[data-step-index="9"]').count(),0);
 assert.equal(await page.evaluate(()=>answers.latestState),'awake');
 await page.getByRole('button',{name:'Vue détaillée',exact:true}).click();assert.equal(await page.evaluate(()=>answers.needsSuture),false);
 await page.evaluate(()=>{start('horse');compactMode=true;answers={conscious:'awake',horseArea:'arm',horseAreaSide:'left',horseAreaPart:'arm',horsePain:'moderate',horseVisible:'bruise',horseMove:'painful'};stepIndex=7;render();});
 await page.locator('[data-step-index="2"] .zone-checks details').evaluate(e=>e.open=true);
 await page.locator('[data-step-index="2"] .zone-checks input').nth(1).check();
 assert.equal(await page.evaluate(()=>answers.horseMove),undefined);
 for(const id of await page.evaluate(()=>Object.keys(surgeries))){await page.evaluate(id=>{openSurgery(id);compactMode=true;renderSurgery();},id);assert.equal(await page.locator('#surgeryFlow .condensed-step').count(),await page.evaluate(()=>surgeries[currentSurgery].steps.length));layouts.push({id,bottom:await page.locator('#surgeryFlow .condensed-grid').evaluate(e=>e.getBoundingClientRect().bottom)});}
 for(const width of [2560,1920,390,320])for(const theme of ['dark','light']){
  await page.setViewportSize({width,height:width<500?844:1440});await page.evaluate(theme=>{applyTheme(theme);setReadingSize('xlarge',false);start('gunshot');compactMode=true;render();},theme);
  await page.waitForTimeout(300);
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${width} ${theme}`);
  await page.screenshot({path:`tmp/site-qa/condensed-${width}-${theme}.png`});
 }
 let runs=0;
 await page.setViewportSize({width:1920,height:1080});
 await page.evaluate(()=>setReadingSize('normal',false));
 for(const id of ids)for(const last of [false,true]){
  await page.evaluate(id=>{compactMode=true;start(id);},id);
  for(let n=0;n<50;n++){
   if(await page.evaluate(()=>interventionEnded))break;
   const select=page.locator('#flow .is-current .condensed-choice select:not([disabled])');
   const zones=page.locator('#flow .is-current .zone-checks input');
   if(await zones.count()){await zones.nth(last?(await zones.count())-1:0).check();await page.locator('#flow .is-current').getByRole('button',{name:'Valider les zones',exact:true}).click();}
   else if(await select.count()){const options=await select.locator('option').count();await select.selectOption(String(last?options-2:0));}
   else await page.locator('#flow>.nav .next').click();
  }
  assert(await page.evaluate(()=>interventionEnded),id);runs++;
 }
 for(const id of await page.evaluate(()=>Object.keys(surgeries))){
  await page.evaluate(id=>{compactMode=true;openSurgery(id);},id);
  for(let n=0;n<30;n++){if(await page.evaluate(()=>surgeryEnded))break;await page.locator('#surgeryFlow .next').click();}
  assert(await page.evaluate(()=>surgeryEnded),id);runs++;
 }
 assert.deepEqual(errors,[]);console.log(JSON.stringify({status:'ok',runs,layouts}));
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
