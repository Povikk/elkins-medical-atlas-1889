const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
  const browser=await chromium.launch({headless:true});
  const page=await browser.newPage({viewport:{width:2560,height:1440}});
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto('http://127.0.0.1:4173/');
  await page.evaluate(()=>start('minor'));
  assert.equal(await page.getByRole('button',{name:/En scène/}).count(),0);
  await page.evaluate(()=>{next();next();applyChoice({needsSuture:false});});
  assert.equal(await page.evaluate(()=>stepIndex),4);
  assert.match(await page.locator('#flow').innerText(),/Pas de points/);
  await page.evaluate(()=>prev());
  assert.equal(await page.evaluate(()=>stepIndex),2);
  assert.equal(await page.evaluate(()=>answers.needsSuture),undefined);
  await page.evaluate(()=>applyChoice({needsSuture:true}));
  assert.equal(await page.evaluate(()=>stepIndex),3);
  const initial=await page.evaluate(()=>JSON.stringify({stepIndex,answers}));
  await page.evaluate(()=>openSceneReferences());
  for(const tab of ['meds','equipment','anatomy']){
    await page.evaluate(tab=>setSceneReferenceTab(tab),tab);
    assert.ok(await page.locator('.reference-picker button').count());
    await page.locator('.reference-picker button').first().click();
    assert.ok(!(await page.locator('.reference-detail').innerText()).includes('undefined'));
  }
  await page.keyboard.press('Escape');
  assert.equal(await page.evaluate(()=>JSON.stringify({stepIndex,answers})),initial);
  for(const kind of ['conscious','breathing','bleeding']){
    await page.evaluate(kind=>{openIncident();selectIncident(kind);resolveIncident();},kind);
    assert.equal(await page.evaluate(()=>stepIndex),3);
  }
  await page.evaluate(()=>{openIncident();selectIncident('bleeding');escalateIncident();});
  await page.locator('#incidentContent .next').click();
  assert.equal(await page.evaluate(()=>currentSurgery),'major_bleeding');
  assert.equal(await page.evaluate(()=>Object.keys(answers).length),0);
  await page.evaluate(()=>{start('gunshot');applyChoice({conscious:'awake'});next();});
  assert.ok(await page.locator('.patient-question').count());
  assert.ok((await page.locator('#flow .choices').boundingBox()).y<1440);
  await page.screenshot({path:'tmp/site-qa/scene-desktop.png',fullPage:true});
  await page.setViewportSize({width:390,height:844});
  await page.screenshot({path:'tmp/site-qa/scene-mobile.png',fullPage:true});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  assert.deepEqual(errors,[]);
  await browser.close();console.log('RP QA passed: branching/back, references, incidents, desktop/mobile; scene mode removed.');
})().catch(error=>{console.error(error);process.exit(1);});
