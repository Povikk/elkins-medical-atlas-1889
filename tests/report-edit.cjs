const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch();
 try{
  const context=await browser.newContext({permissions:['clipboard-read','clipboard-write']});
  const page=await context.newPage(),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto('http://127.0.0.1:4173/');
  await page.evaluate(()=>{start('gunshot');renderEnd();});
  await page.getByRole('button',{name:'Modifier le compte rendu',exact:true}).click();
  await page.locator('.report-editor textarea').nth(0).fill('Plaie au bras gauche <sans fracture>.');
  await page.locator('.report-editor textarea').nth(1).fill('Trois points de suture ; repos ; contrôle dans 24 h.');
  await page.getByRole('button',{name:'Copier les deux lignes'}).click();
  assert.match(await page.evaluate(()=>navigator.clipboard.readText()),/Trois points de suture/);
  await page.getByRole('button',{name:'Terminer la modification'}).click();
  assert.equal(await page.locator('#report-findings').innerText(),'Plaie au bras gauche <sans fracture>.');
  await page.evaluate(()=>{addPatient();start('knife');renderEnd();});
  assert(!(await page.locator('#report-findings').innerText()).includes('sans fracture'));
  await page.evaluate(()=>selectPatient(1));
  assert.match(await page.locator('#report-care').innerText(),/Trois points/);
  await page.setViewportSize({width:390,height:844});
  await page.getByRole('button',{name:'Modifier le compte rendu',exact:true}).click();
  assert(await page.locator('.report-editor textarea').nth(1).isVisible());
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.reload();
  assert.equal(await page.evaluate(()=>Object.keys(answers).length),0);
  assert.deepEqual(errors,[]);
  console.log('OK compte rendu modifiable, copie, texte échappé, isolation patients, mobile et aucune persistance');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
