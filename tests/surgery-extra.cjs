const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch();try{
 const page=await browser.newPage({viewport:{width:2560,height:1440}}),errors=[];
 page.on('pageerror',error=>errors.push(error.message));
 await page.goto('http://127.0.0.1:4173/');
 const ids=await page.evaluate(()=>Object.keys(additionalSurgeries));assert.equal(ids.length,6);
 assert.equal(await page.locator('#surgery .case').count(),12);
 for(const id of ids){
  await page.evaluate(()=>{compactMode=false;showSurgery();});
  await page.locator(`#surgery button[onclick="openSurgery('${id}')"]`).click();
  const count=await page.evaluate(()=>surgeries[currentSurgery].steps.length);
  assert.equal(count,6,id);
  for(let index=0;index<count;index++){
   const text=await page.locator('#surgeryFlow').innerText();
   assert(!/undefined|NaN|\[object Object\]/.test(text),id);
   assert(await page.locator('#surgeryFlow .care-memo').isVisible());
   assert(await page.locator('#surgeryFlow .rp-lines').count()>0);
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),id);
   await page.locator('#surgeryFlow .nav .next').click();
  }
  assert(await page.getByRole('heading',{name:'Scène chirurgicale terminée'}).isVisible());
  assert.match(await page.locator('#report-care').innerText(),/Gestes à confirmer/);
  await page.getByRole('button',{name:'Modifier le compte rendu',exact:true}).click();
  await page.locator('.report-editor textarea').nth(1).fill('Soins à confirmer pour '+id);
  await page.getByRole('button',{name:'Terminer la modification'}).click();
  assert.match(await page.locator('#report-care').innerText(),new RegExp(id));
  await page.getByRole('button',{name:'Revoir la dernière étape'}).click();
  await page.locator('#surgeryFlow .nav .secondary').click();
  assert.equal(await page.evaluate(()=>surgeryStepIndex),4);
  await page.evaluate(()=>{compactMode=true;renderSurgery();});
  assert.equal(await page.locator('#surgeryFlow .condensed-step').count(),count);
  for(const width of [2560,1366,390,320])for(const theme of ['dark','light']){
   await page.setViewportSize({width,height:width>500?900:844});
   await page.evaluate(theme=>{applyTheme(theme);setReadingSize('xlarge',false);renderSurgery();},theme);
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),id+' '+width);
  }
  await page.setViewportSize({width:2560,height:1440});
  await page.evaluate(()=>{compactMode=false;setReadingSize('normal',false);renderSurgery();});
 }
 await page.evaluate(()=>{openSurgery('empyema');surgeryStepIndex=3;rpContext.resources='limited';renderSurgery();addPatient();openSurgery('open_fracture');selectPatient(1);});
 assert.equal(await page.evaluate(()=>currentSurgery),'empyema');
 assert.equal(await page.evaluate(()=>surgeryStepIndex),3);
 assert.match(await page.locator('#surgeryFlow').innerText(),/Moyens limités/);
 await page.evaluate(()=>{answers.latestBreathing='weak';renderSurgery();nextSurgery();});
 assert.equal(await page.evaluate(()=>answers.latestBreathing),'weak');
 await page.screenshot({path:'tmp/surgery-extra-desktop.png',fullPage:true});
 assert.deepEqual(errors,[]);
 await page.reload();assert.equal(await page.evaluate(()=>Object.keys(answers).length),0);
 console.log('OK 6 parcours, 36 étapes, navigation réelle, fins éditables, condensé, 2K/mobile, thèmes, patients, moyens limités et aucune persistance');
}finally{await browser.close();}})().catch(error=>{console.error(error);process.exitCode=1;});
