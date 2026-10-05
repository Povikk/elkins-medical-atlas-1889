const {chromium}=require('playwright');const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch(),page=await browser.newPage({viewport:{width:1920,height:1080}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:4173/');
 const result=await page.evaluate(()=>{
  let steps=0,variants=0;const checked=[];
  for(const [kind,routes] of [['flow',flows],['surgery',surgeries]])for(const [id,route] of Object.entries(routes)){
   if(kind==='flow')currentFlow=id;else currentSurgery=id;
   activeRouteKind=kind;compactMode=false;answers={};
   for(const step of route.steps){const choice=(step.choices||[])[0];if(choice)Object.assign(answers,choice.set);}
   Object.assign(answers,{latestState:'awake',latestBreathing:'yes',latestBleeding:'none',rpPain:'mild'});
   for(const step of route.steps){const key=zoneKeyForStep(step);if(key){answers[key+'Selections']=[step.choices[0]];answers[key+'Confirmed']=true;}}
   for(let i=0;i<route.steps.length;i++){
    stepIndex=i;surgeryStepIndex=i;const html=kind==='flow'?render(true):renderSurgery(true);
    if(!html.includes('Produits et matériel')&&!html.includes('Médicament / produit'))throw Error(id+': missing supply indication at '+i);
    steps++;
    const saved={...answers};for(const choice of route.steps[i].choices||[]){answers={...saved,...choice.set};for(let j=i;j<route.steps.length;j++){stepIndex=j;surgeryStepIndex=j;kind==='flow'?render(true):renderSurgery(true);}variants++;}answers=saved;
   }
   compactMode=true;stepIndex=0;surgeryStepIndex=0;renderCondensed(kind);checked.push(id);
  }
  compactMode=false;
  currentFlow='hoof';answers={conscious:'awake',hoofArea:'arm',hoofSigns:'wound',latestState:'awake',latestBreathing:'yes'};stepIndex=4;const wound=render(true);
  if(!wound.includes('Phénol / acide carbolique')||wound.includes('med-item cat-skin'))throw Error('Hoof wound products');
  currentFlow='minor';answers={minorIssue:'wound',minorArea:'arm',conscious:'awake'};stepIndex=2;if(render(true).includes('Onguent à l’oxyde de zinc'))throw Error('Ointment on wound');
  currentFlow='gunshot';answers={conscious:'awake'};const step=flows.gunshot.steps.find(s=>zoneKeyForStep(s)==='gunArea');
  const shoulder=step.choices.find(c=>c.set.gunAreaPart==='shoulder'&&c.set.gunAreaSide==='left');const arm=step.choices.find(c=>c.set.gunAreaPart==='arm'&&c.set.gunAreaSide==='left');
  if(!shoulder||!arm||shoulder.label===arm.label)throw Error('Separate shoulder/arm');
  answers.gunAreaSelections=[arm,shoulder];Object.assign(answers,arm.set);updateZonePrecision('gunArea',0,'index <gauche>');
  if(!zoneLabels('gunArea').includes('index <gauche>')||!reportFindings('flow').includes('index <gauche>'))throw Error('Precision recap');
  if(rpChoicesMarkup().includes('index <gauche>'))throw Error('Unescaped precision');
  return {routes:checked.length,steps,choiceVariants:variants};
 });
 assert.deepEqual(errors,[]);console.log(JSON.stringify(result));
 await page.evaluate(()=>{compactMode=false;start('hoof');answers={conscious:'awake',hoofArea:'arm',hoofSigns:'wound',latestState:'awake',latestBreathing:'yes'};stepIndex=4;render();});
 for(const width of [1920,1366,390,320]){await page.setViewportSize({width,height:1080});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Overflow ${width}`);}
 await page.setViewportSize({width:1920,height:1080});await page.screenshot({path:'tmp/route-audit-hoof.png'});
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
