const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage({viewport:{width:2560,height:1440}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:4173/');
  await page.evaluate(()=>{start('gunshot');applyChoice({conscious:'awake'});});
  assert.match(await page.locator('#flow .rp-choice-recap').innerText(),/Conscient/);
  await page.evaluate(()=>{next();applyChoice({gunArea:'arm'});});
  assert.match(await page.locator('#flow .rp-choice-recap').innerText(),/Bras/);
  await page.evaluate(()=>prev());
  assert(!/Bras/.test(await page.locator('#flow .rp-choice-recap').innerText()));
  await page.evaluate(()=>{start('gunshot');applyChoice({conscious:'awake'});});
  const sample=page.locator('#flow .section').first();
  const normal=await sample.evaluate(el=>parseFloat(getComputedStyle(el).fontSize));
  await page.locator('#readingSize').selectOption('large');
  assert(await sample.evaluate(el=>parseFloat(getComputedStyle(el).fontSize))>normal);
  await page.locator('#readingSize').selectOption('xlarge');
  assert(await sample.evaluate(el=>parseFloat(getComputedStyle(el).fontSize))>normal*1.3);
  await page.evaluate(()=>toggleCompact('flow'));
  assert.equal(await page.locator('#flow .rp-current-phrase').count(),1);
  assert.equal(await page.locator('#readingSize').inputValue(),'xlarge');
  await page.reload();
  assert.equal(await page.locator('#readingSize').inputValue(),'xlarge');
  assert.equal(await page.evaluate(()=>rpPhraseHistory.size),0);
  await page.evaluate(()=>{
   start('gunshot');answers={conscious:'awake'};stepIndex=1;render();
   rpPhraseHistory.set('prior-step',new Set(['« Qu’est-ce qui vous gêne le plus à cet instant ? »']));
   rpPhraseOrder.clear();stepIndex=2;render();
  });
  assert(!(await page.locator('#flow .rp-current-phrase').allTextContents()).includes('« Qu’est-ce qui vous gêne le plus à cet instant ? »'));
  assert(await page.evaluate(()=>rpPhraseBlocks[0].pool.includes('« Qu’est-ce qui vous gêne le plus à cet instant ? »')));
  const first=await page.locator('#flow .rp-current-phrase').allTextContents();
  await page.evaluate(()=>render());
  assert.deepEqual(await page.locator('#flow .rp-current-phrase').allTextContents(),first);
  for(const theme of ['dark','light'])for(const width of [2560,390]){
   await page.setViewportSize({width,height:width===390?844:1440});
   await page.evaluate(theme=>{applyTheme(theme);start('gunshot');answers={conscious:'awake',gunArea:'arm'};stepIndex=5;render();},theme);
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   assert.equal(await page.locator('#readingSize').isVisible(),true);
   assert(await page.locator('#flow .choice').first().evaluate(el=>parseFloat(getComputedStyle(el).fontSize)>21));
   await page.screenshot({path:`tmp/site-qa/reading-${width}-${theme}.png`,fullPage:true});
   await page.evaluate(()=>showLexique());
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   await page.evaluate(()=>{openSurgery('amputation');nextSurgery();});
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  }
  await page.evaluate(()=>start('minor'));
  assert.equal(await page.locator('#flow .rp-choice-recap').count(),0);
  assert([...await page.evaluate(()=>Object.keys(localStorage))].every(key=>['elkins-theme','elkins-reading-size'].includes(key)));
  assert.deepEqual(errors,[]);
  console.log('Text sizing, preference reload, choice recap/back/reset, phrase ordering, compact, desktop/mobile and themes OK');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
