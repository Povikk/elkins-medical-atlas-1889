const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage({viewport:{width:2560,height:1440}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:4173/');
  await page.evaluate(()=>{start('gunshot');answers={conscious:'awake',bullet:'out',needsSuture:false};stepIndex=10;materialPanelOpen=true;render();});
  let text=await page.locator('.material-panel').innerText();
  assert.match(text,/Pour cette étape/);
  await page.locator('.material-panel summary').click();
  text=await page.locator('.material-panel').innerText();
  assert(!/Forceps|Aiguille et fil/.test(text));
  await page.evaluate(()=>{answers.needsSuture=true;stepIndex=9;render();});
  assert.match(await page.locator('.material-panel').innerText(),/Aiguille et fil/);
  await page.evaluate(()=>{answers.rpPain='moderate';render();});
  assert(!/Seringue/.test(await page.locator('.material-panel').innerText()));
  for(const id of await page.evaluate(()=>Object.keys(flows))){
   await page.evaluate(id=>{start(id);answers.conscious='awake';stepIndex=flows[id].steps.length-1;renderEnd();},id);
   assert.match(await page.locator('#flow').innerText(),/Consignes RP/);
   assert.equal(await page.locator('#flow .rp-current-phrase').count(),3);
   const before=await page.locator('#flow .rp-current-phrase').allTextContents();
   await page.getByRole('button',{name:'Autre formulation',exact:true}).click();
   assert.notDeepEqual(await page.locator('#flow .rp-current-phrase').allTextContents(),before);
  }
  for(const id of await page.evaluate(()=>Object.keys(surgeries))){
   await page.evaluate(id=>{openSurgery(id);surgeryStepIndex=surgeries[id].steps.length-1;renderSurgery();nextSurgery();},id);
   assert.match(await page.locator('#surgeryFlow').innerText(),/surveillance|Surveillance/);
  }
  await page.evaluate(()=>{start('unknown');answers={unknownBreathing:'no',unknownWake:'awake'};stepIndex=5;render();});
  assert.equal(await page.evaluate(()=>rpPatientState()),'awake');
  await page.evaluate(()=>{start('gunshot');answers={conscious:'awake',needsSuture:true};stepIndex=9;materialPanelOpen=true;render();});
  await page.screenshot({path:'tmp/site-qa/guidance-desktop.png',fullPage:true});
  await page.setViewportSize({width:390,height:844});
  await page.screenshot({path:'tmp/site-qa/guidance-mobile.png',fullPage:true});
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  assert.deepEqual(errors,[]);
  console.log('Guidance, conditional materials, endings, wake state and responsive checks OK');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
