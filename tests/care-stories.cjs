const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage({viewport:{width:2560,height:1440}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
  const counts=await page.evaluate(()=>({flows:Object.keys(flows),hooks:hooks.length,equipment:equipmentLexicon.length,symptoms:symptomLexicon.length}));
  assert.equal(counts.flows.length,18);assert.equal(counts.hooks,60);assert.equal(counts.equipment,21);assert.equal(counts.symptoms,20);
  let runs=0;
  for(const id of counts.flows)for(const last of [false,true]){
   await page.evaluate(id=>start(id),id);
   for(let n=0;n<50;n++){
    if(await page.evaluate(()=>interventionEnded))break;
    await page.evaluate(()=>{materialPanelOpen=true;render();});
    const choices=page.locator('#flow .choice');
    if(await choices.count()){const isZone=await page.evaluate(()=>!!zoneKeyForStep(flows[currentFlow].steps[stepIndex]));await choices.nth(last?(await choices.count())-1:0).click();if(isZone)await page.getByRole('button',{name:'Valider les zones',exact:true}).click();}
    else await page.locator('#flow .next').click();
   }
   assert(await page.evaluate(()=>interventionEnded),`${id} completes`);runs++;
  }
  await page.evaluate(()=>{start('gunshot');answers={conscious:'unconscious_breathing'};stepIndex=6;render();});
  assert.equal(await page.locator('#flow .med-item').count(),0);
  await page.locator('#flow button').filter({hasText:'Réévaluer le patient'}).click();
  await page.locator('[onclick="updateCareObservation(\'latestState\',\'awake\')"]').click();
  await page.locator('[onclick="updateCareObservation(\'latestBreathing\',\'yes\')"]').click();
  await page.locator('[onclick="updateCareObservation(\'latestBleeding\',\'none\')"]').click();
  await page.getByRole('button',{name:'Revenir au soin',exact:true}).click();
  assert.equal(await page.evaluate(()=>rpPatientState()),'awake');
  assert.match(await page.locator('#flow .rp-choice-recap').innerText(),/État actuel : Conscient/);
  assert(!/Critique/.test(await page.locator('#flow .topbar').innerText()));
  await page.locator('#flow .rp-choice-recap summary').click();
  assert.match(await page.locator('#flow .rp-choice-recap').innerText(),/Inconscient/);
  await page.evaluate(()=>{answers.latestBreathing='no';render();});
  assert.equal(await page.evaluate(()=>rpPatientState()),'unresponsive');
  assert.equal(await page.locator('#flow .med-item').count(),0);
  assert.match(await page.locator('#flow .current-warning').innerText(),/suspendre/);
  await page.evaluate(()=>reassessCare());
  await page.locator('[onclick="updateCareObservation(\'latestBreathing\',\'yes\')"]').click();
  await page.keyboard.press('Escape');await page.locator('#incidentDialog').waitFor({state:'hidden'});
  assert.equal(await page.evaluate(()=>rpPatientState()),'awake');assert.equal(await page.locator('#flow .current-warning').count(),0);
  await page.evaluate(()=>{next();prev();});assert.equal(await page.evaluate(()=>answers.latestState),'awake');
  await page.evaluate(()=>{answers.burnSeverity='airway';});assert.equal(await page.evaluate(()=>careUrgency('serious')),'critical');
  await page.evaluate(()=>{start('horse');answers={conscious:'awake',horseArea:'unknown',horsePain:'unknown',horseVisible:'unknown',horseMove:'unknown'};stepIndex=6;render();});
  assert.match(await page.locator('#flow').innerText(),/examen reste incomplet/);
  await page.evaluate(()=>{stepIndex=7;render();});
  assert.equal(await page.locator('#flow .med-item').count(),0);
  const fullActions=await page.evaluate(()=>compactActions('À faire',['A.','B.','C.','D.','E.']).join(' '));
  for(const action of ['A.','B.','C.','D.','E.'])assert(fullActions.includes(action));
  await page.evaluate(()=>{start('gunshot');answers={conscious:'awake',bullet:'out',needsSuture:false};stepIndex=9;materialPanelOpen=true;render();});
  assert(!/Aiguille/.test(await page.locator('.material-panel').innerText()));
  await page.evaluate(()=>{start('gunshot');answers={conscious:'awake'};stepIndex=4;render();});
  page.once('dialog',dialog=>dialog.dismiss());await page.getByRole('button',{name:'Changer de cas',exact:true}).click();
  assert(await page.locator('#flow').isVisible());
  page.once('dialog',dialog=>dialog.accept());await page.getByRole('button',{name:'Changer de cas',exact:true}).click();
  assert(await page.locator('#cases').isVisible());assert.equal(await page.evaluate(()=>Object.keys(answers).length),0);
  await page.evaluate(()=>{start('gunshot');answers.latestState='awake';render();});
  page.once('dialog',dialog=>dialog.dismiss());await page.locator('#flow .nav button').click();assert(await page.locator('#flow').isVisible());
  page.once('dialog',dialog=>dialog.accept());await page.locator('[data-shell-view="stories"]').click();assert.equal(await page.evaluate(()=>Object.keys(answers).length),0);
  await page.evaluate(()=>{start('fever');setRpContext('resources','limited','flow');});
  assert.match(await page.locator('#flow').innerText(),/Moyens limités/);
  await page.evaluate(()=>{setRpContext('team','assistant','flow');});
  assert(await page.locator('.assistant-note').isVisible());
  await page.evaluate(()=>showStories());
  assert.equal(await page.locator('.story-card').count(),counts.hooks);
  assert(await page.evaluate(()=>new Set(hooks.map(h=>h.id)).size===hooks.length&&hooks.every(h=>h.routes.every(r=>flows[r])&&['title','moment','phrase','followup','opens'].every(k=>h[k].trim()))));
  assert.equal(await page.locator('#storyDetail,#storyPeriod').count(),0);
  for(const category of await page.evaluate(()=>[...new Set(hooks.map(s=>s.category))])){
   await page.locator('#storyCategory').selectOption(category);assert((await page.locator('.story-card').count())>0);
   for(const text of await page.locator('.story-card .cat-badge').allTextContents())assert.equal(text,category);
  }
  await page.locator('#storyCategory').selectOption('');
  for(const id of counts.flows){
   await page.locator('#hookRoute').selectOption(id);
   assert((await page.locator('.story-card').count())>0,id);
   assert.equal(await page.locator('.story-card').count(),await page.evaluate(id=>hooks.filter(h=>h.routes.includes(id)).length,id));
  }
  await page.locator('#hookRoute').selectOption('');
  await page.locator('#storySearch').fill('stethoscope');assert.equal(await page.locator('.story-card').count(),1);
  await page.locator('.hook-card summary').click();assert.match(await page.locator('.hook-card').innerText(),/sans insister/);
  await page.locator('#storySearch').fill('zzzznotfound');assert.equal(await page.locator('.story-card').count(),0);
  await page.locator('#storySearch').fill('');
  await page.evaluate(()=>start('minor'));
  assert.equal(await page.locator('.care-hook').count(),0);
  await page.evaluate(()=>showAtlas());
  for(const term of ['cubitus','omoplate','cœur','péroné']){
   await page.locator('#atlasSearch').fill(term);assert((await page.locator('#atlasSearchResults button').count())>0,term);
  }
  await page.locator('#atlasSearch').fill('cubitus');await page.locator('#atlasSearchResults button').first().click();
  assert(await page.evaluate(()=>anatomyPinned));
  await page.mouse.move(0,0);await page.waitForTimeout(220);assert(await page.locator('#anatomyTooltip').isVisible());
  await page.keyboard.press('Escape');assert.equal(await page.evaluate(()=>anatomyPinned),false);
  await page.evaluate(()=>{openSceneReferences();setSceneReferenceTab('symptoms');});
  await page.locator('#sceneReferenceSearch').fill('frissons');await page.locator('.reference-picker button').click();
  assert.match(await page.locator('.reference-detail').innerText(),/Frissons/);await page.evaluate(()=>closeSceneReferences());
  for(const theme of ['dark','light'])for(const width of [2560,1920,390,320]){
   await page.setViewportSize({width,height:width<500?844:1440});await page.waitForTimeout(60);
   await page.evaluate(theme=>{applyTheme(theme);setReadingSize('xlarge',false);showStories();},theme);
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`story width ${width}`);
   assert(await page.locator('#readingSize').isVisible());assert(await page.locator('#themeToggle').isVisible());
   await page.screenshot({path:`tmp/site-qa/hooks-${width}-${theme}.png`,fullPage:true});
   await page.evaluate(()=>{setReadingSize('normal',false);start('gunshot');answers={conscious:'awake'};render();});
   const choices=page.locator('#flow .choice');
   if(width>=1920)for(const box of await choices.evaluateAll(nodes=>nodes.map(e=>e.getBoundingClientRect().bottom)))assert(box<1440);
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`care width ${width}`);
   await page.screenshot({path:`tmp/site-qa/care-${width}-${theme}.png`,fullPage:true});
   if(width<500){const themeBox=await page.locator('#themeToggle').boundingBox(),navBox=await page.locator('.side-nav').boundingBox();assert(themeBox.y+themeBox.height<navBox.y);}
  }
  assert.deepEqual(errors,[]);
  await page.setViewportSize({width:1920,height:1080});await page.waitForTimeout(60);
  let choiceLayouts=0;
  for(const size of ['normal','large','xlarge'])for(const id of counts.flows){
   const stages=await page.evaluate(({id,size})=>{
    start(id);setReadingSize(size,false);
    answers={conscious:'awake',horseArea:'arm',horsePain:'moderate',horseVisible:'bruise',horseMove:'painful',headState:'awake',poisonState:'sleepy',breathing:'yes',unknownBreathing:'yes',unknownBleeding:'minor',unknownWake:'awake',gunArea:'arm',bullet:'out',needsSuture:true};
    return flows[id].steps.map((s,i)=>({i,choices:!!s.choices||!!s.dynamicHorseMove})).filter(x=>x.choices).map(x=>x.i);
   },{id,size});
   for(const i of stages){
    await page.evaluate(i=>{stepIndex=i;render();scrollTo(0,0);},i);
    const bottoms=await page.locator('#flow .choice').evaluateAll(es=>es.map(e=>e.getBoundingClientRect().bottom));
    assert(Math.max(...bottoms)<1080,`${id} step ${i} size ${size}: desktop choices without scrolling`);choiceLayouts++;
   }
  }
  assert.deepEqual(errors,[]);
  assert((await page.evaluate(()=>Object.keys(localStorage))).every(k=>['elkins-theme','elkins-reading-size'].includes(k)));
  for(const file of fs.readdirSync('dist').filter(s=>/\.(html|js|css)$/.test(s)))assert(!/[\u2013\u2014]/.test(fs.readFileSync('dist/'+file,'utf8')),`long dash in ${file}`);
  console.log(JSON.stringify({status:'ok',runs,choiceLayouts,...counts,checks:'reassessment, medication guards, uncertain branches, compact completeness, materials, abandon confirmation, resources, stories, atlas search/pin, references, text sizing, desktop/mobile themes'}));
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
