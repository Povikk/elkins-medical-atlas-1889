const {chromium}=require('playwright'),assert=require('node:assert/strict');
(async()=>{const b=await chromium.launch();try{const p=await b.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto('http://127.0.0.1:4173/');
 await p.evaluate(()=>{showLexique();setLexTab('techniques');});
 assert.equal(await p.locator('#lexGrid article').count(),36);
 await p.locator('#lexSearch').fill('debridement');assert.equal(await p.locator('#lexGrid article').count(),1);await p.locator('#lexGrid summary').click();assert.match(await p.locator('#lexGrid').innerText(),/1889/);
 for(const width of [2560,1920,390]){await p.setViewportSize({width,height:width===390?844:1440});await p.evaluate(()=>{document.getElementById('lexSearch').value='';filterLexique();});assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));}
 for(const compact of [false,true]){await p.evaluate(compact=>{compactMode=compact;start('gunshot');answers={conscious:'awake',gunArea:'arm',bullet:'graze',needsSuture:false};stepIndex=7;render();},compact);
 const treatment=await p.evaluate(()=>{const d=document.createElement('div');d.innerHTML=render(true);return d.textContent;});assert.match(treatment,/éraflure/);assert.match(treatment,/Aucun projectile/);
 assert(await p.evaluate(()=>shouldSkipStep(flows.gunshot.steps[8])&&shouldSkipStep(flows.gunshot.steps[9])));
 assert(await p.evaluate(()=>!shouldSkipStep(flows.gunshot.steps[5])));
 }
 const labels=await p.evaluate(()=>flows.animal.steps.find(s=>s.dynamicAnimal==='context').choices.map(c=>c.label));assert(labels.every(x=>!/identifi|retrouvé/.test(x)));
 assert.deepEqual(errors,[]);console.log('36 techniques, recherche, desktop/mobile, éraflure deux modes, circonstances animales : OK');
 }finally{await b.close();}})().catch(e=>{console.error(e);process.exit(1);});
