const {chromium}=require('playwright'),assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch();try{
 const p=await browser.newPage({viewport:{width:2560,height:1440}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
 const species=await p.evaluate(()=>animalSpecies);
 assert.equal(new Set(species.map(s=>s.id)).size,species.length);
 let runs=0;
 for(const compact of [false,true])for(const speciesItem of species){
  await p.evaluate(compact=>{compactMode=compact;careMemoOnly=false;start('animal');},compact);
  for(let n=0;n<30;n++){
   if(await p.evaluate(()=>interventionEnded))break;
   const choices=await p.evaluate(()=>{const raw=document.createElement('div');raw.innerHTML=render(true);return condensedStepChoices(raw);});
   if(choices.length){
    const index=Math.max(0,choices.findIndex(c=>c.set.animalSpecies===speciesItem.id||c.set.conscious==='awake'||c.set.animalBleeding==='minor'||c.set.animalInjury===(['bison','buck','elk','moose','ram'].includes(speciesItem.id)?'blunt':'bite')||c.set.animalArea==='arm'&&c.set.animalSide==='left'||c.set.animalDepth==='surface'||c.set.animalExposure==='wild'));
    if(compact)await p.locator('#flow .is-current .condensed-choice select:not([disabled])').selectOption(String(index));
    else await p.locator('#flow .choice').nth(index).click();
   }else await p.locator('#flow .next').click();
  }
  assert(await p.evaluate(()=>interventionEnded),speciesItem.name);
  assert.match(await p.locator('#report-findings').innerText(),new RegExp(speciesItem.name.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
  const care=await p.locator('#report-care').innerText();
  if(speciesItem.family==='venom'){assert.match(care,/prise en charge urgente/);assert(!/rage|Nettoyage|Morphine|Laudanum/.test(care));assert.match(await p.locator('.scene-ending').innerText(),/Pas de départ/);}
  if(speciesItem.family==='reptile')assert(!/rage/.test(care));
  if(['bison','buck','elk','moose','ram'].includes(speciesItem.id)){assert.match(care,/Pas de soin de plaie/);assert(!/Nettoyage|Évaluation du risque de rage/.test(care));}
  runs++;
 }
 for(const id of species.filter(s=>s.family==='venom').map(s=>s.id)){
  await p.evaluate(id=>{compactMode=false;start('animal');answers={conscious:'awake',animalSpecies:id,animalBleeding:'none',animalArea:'arm',animalSide:'left',animalDepth:'surface',animalInjury:'bite',animalMultiplicity:'single',animalExposure:'wild',rpPain:'strong'};stepIndex=4;render();},id);
  assert(!/Griffure|corn[e]|charge/i.test((await p.locator('#flow .choice').allTextContents()).join(' ')));
  await p.evaluate(()=>{stepIndex=8;render();});assert.match(await p.locator('#flow').innerText(),/Ne pas inciser, aspirer/);
  await p.evaluate(()=>{stepIndex=9;render();});assert.equal(await p.locator('#flow .med-item').count(),0);
  assert.equal(await p.evaluate(()=>careProductBlocked()),true);
  assert(!/rage/.test(await p.locator('.care-memo').innerText()));
 }
 for(const signs of ['local','progressing','danger','unknown']){
  await p.evaluate(signs=>{compactMode=false;start('animal');answers={conscious:'awake',animalSpecies:'rattlesnake',animalBleeding:'none',animalInjury:'bite',animalVenomSigns:signs};stepIndex=6;render();},signs);
  assert.equal(await p.locator('#flow .choice').count(),4);
  assert(!/Plaie superficielle|Plaie profonde/.test((await p.locator('#flow .choice').allTextContents()).join(' ')));
  if(signs==='danger'){assert.match(await p.locator('#flow .route-note').first().innerText(),/renfort immédiat/);assert.equal(await p.evaluate(()=>careUrgency('serious')),'critical');}
  assert.match(await p.evaluate(()=>reportFindings('flow')),new RegExp(signs==='danger'?'se dégradent':signs==='progressing'?'progressent':signs==='unknown'?'non déterminée':'aucun autre signe'));
 }
 await p.evaluate(()=>{compactMode=true;start('animal');answers={conscious:'awake',animalSpecies:'grizzly',animalBleeding:'none',animalArea:'arm',animalSide:'left',animalDepth:'surface',animalInjury:'bite',animalMultiplicity:'single',animalExposure:'wild',latestState:'awake'};stepIndex=11;render();});
 const snakeIndex=await p.evaluate(()=>animalSpecies.findIndex(s=>s.id==='rattlesnake'));
 await p.locator('[data-step-index="3"] .condensed-choice select').selectOption(String(snakeIndex));
 assert.equal(await p.evaluate(()=>answers.animalInjury),undefined);assert.equal(await p.evaluate(()=>answers.animalArea),undefined);assert.equal(await p.evaluate(()=>answers.latestState),'awake');
 assert(!/griffure/i.test((await p.locator('[data-step-index="4"] option').allTextContents()).join(' ')));
 for(const width of [2560,1920,390,320])for(const compact of [false,true]){
  await p.setViewportSize({width,height:width<500?844:1440});
  await p.evaluate(compact=>{compactMode=compact;start('animal');answers={conscious:'awake',animalBleeding:'none'};stepIndex=3;render();},compact);
  assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  if(width>=1920&&!compact)assert(await p.locator('#flow .choice').last().evaluate(e=>e.getBoundingClientRect().bottom<1440));
  if(width===2560||width===390)await p.screenshot({path:`tmp/site-qa/animal-species-${width}-${compact?'condensed':'detail'}.png`,fullPage:true});
 }
 assert.deepEqual(errors,[]);
 console.log(`OK ${species.length} animal choices, ${runs} complete species routes, venom/charge/reptile distinctions, dependent answers reset, desktop/mobile`);
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
