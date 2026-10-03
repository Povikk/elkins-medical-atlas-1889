const {chromium}=require('playwright');const assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch();try{
 const page=await browser.newPage({viewport:{width:1920,height:1080}}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('http://127.0.0.1:4173/');
 await page.evaluate(()=>{start('gunshot');toggleCompact('flow');});
 const before=await page.evaluate(()=>JSON.stringify({answers,stepIndex,flowHistory}));
 await page.getByRole('button',{name:'Pense-bête',exact:true}).click();
 assert.equal(await page.locator('.care-memo-cell').count(),4);assert(!await page.locator('.condensed-grid').isVisible());assert.equal(await page.evaluate(()=>JSON.stringify({answers,stepIndex,flowHistory})),before);
 assert.match(await page.locator('.care-memo-row').innerText(),/réévaluer avant un opiacé/);
 await page.locator('.care-memo-current select').selectOption('0');assert.equal(await page.evaluate(()=>answers.conscious),'awake');assert.match(await page.locator('.care-memo-row').innerText(),/Laudanum ou morphine/);
 await page.locator('#flow .next').click();await page.locator('.care-memo-current select').selectOption('3');assert.equal(await page.evaluate(()=>answers.gunArea),'abdomen');assert.match(await page.locator('.care-memo h3').innerText(),/abdomen/);
 await page.getByRole('checkbox',{name:'Pense-bête seul',exact:true}).uncheck();assert(await page.locator('.condensed-grid').isVisible());assert(await page.locator('.care-memo').isVisible());
 await page.evaluate(()=>{answers.gunArea='chest';answers.latestBreathing='no';render();});assert.match(await page.locator('.care-memo-row').innerText(),/Suspendre le soin/);assert(!/Laudanum ou morphine/.test(await page.locator('.care-memo-row').innerText()));
 await page.getByRole('button',{name:'Masquer le pense-bête',exact:true}).click();assert.equal(await page.locator('.care-memo').count(),0);
 await page.getByRole('button',{name:'Vue détaillée',exact:true}).click();assert.equal(await page.evaluate(()=>answers.latestBreathing),'no');assert.equal(await page.locator('.care-memo').count(),0);
 let runs=0;
 for(const id of await page.evaluate(()=>Object.keys(flows))){
  await page.evaluate(id=>{compactMode=true;careMemoOpen=true;careMemoOnly=true;start(id);},id);assert.equal(await page.locator('.care-memo-cell').count(),4,id);
  for(let n=0;n<50;n++){if(await page.evaluate(()=>interventionEnded))break;const select=page.locator('.care-memo-current select');if(await select.count())await select.selectOption('0');else await page.locator('#flow .next').click();}
  assert(await page.evaluate(()=>interventionEnded),id);runs++;
 }
 for(const id of await page.evaluate(()=>Object.keys(surgeries))){await page.evaluate(id=>{compactMode=true;careMemoOpen=true;careMemoOnly=true;openSurgery(id);},id);assert.equal(await page.locator('.care-memo-cell').count(),4,id);for(let n=0;n<30;n++){if(await page.evaluate(()=>surgeryEnded))break;await page.locator('#surgeryFlow .next').click();}assert(await page.evaluate(()=>surgeryEnded),id);runs++;}
 for(const width of [2560,1920,390,320])for(const theme of ['dark','light']){
  await page.setViewportSize({width,height:width<500?844:1080});await page.evaluate(theme=>{applyTheme(theme);setReadingSize('xlarge',false);compactMode=true;careMemoOpen=true;careMemoOnly=true;start('knife');},theme);await page.waitForTimeout(250);
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${width} ${theme}`);
  if(width>=1920)assert((await page.locator('.care-memo').boundingBox()).y+(await page.locator('.care-memo').boundingBox()).height<1080);
  await page.screenshot({path:`tmp/site-qa/memo-${width}-${theme}.png`});
 }
 assert.deepEqual(errors,[]);assert((await page.evaluate(()=>Object.keys(localStorage))).every(k=>['elkins-theme','elkins-reading-size'].includes(k)));console.log(JSON.stringify({status:'ok',runs,checks:'four cells, standalone/combined, choices/branches, medication guards, detail return, desktop/mobile themes, no storage'}));
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
