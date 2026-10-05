const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch();const context=await browser.newContext({viewport:{width:1920,height:1080}});const page=await context.newPage();
 await page.goto('http://127.0.0.1:4173/');
 await page.evaluate(()=>localStorage.setItem('elkins-cabinet-counter-v1',JSON.stringify({kits:2,syringes:3})));
 await page.reload();
 const state=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('elkins-cabinet-counter-v1')));
 assert.match(await page.locator('#personalTotal').textContent(),/4,00/);
 await page.getByRole('button',{name:'Ajouter un kit de soin',exact:true}).click();
 assert.deepEqual(await state(),{kits:3,syringes:3,personalCents:450});
 page.once('dialog',d=>d.dismiss());await page.getByRole('button',{name:'Réinitialiser le montant du cabinet',exact:true}).click();assert.equal((await state()).kits,3);
 page.once('dialog',d=>d.accept());await page.getByRole('button',{name:'Réinitialiser le montant du cabinet',exact:true}).click();assert.deepEqual(await state(),{kits:0,syringes:0,personalCents:450});
 await page.reload();assert.match(await page.locator('#personalTotal').textContent(),/4,50/);
 await page.getByRole('button',{name:'Ajouter une seringue vivifiante',exact:true}).click();
 page.once('dialog',d=>d.accept());await page.getByRole('button',{name:'Réinitialiser mes gains',exact:true}).click();assert.deepEqual(await state(),{kits:0,syringes:1,personalCents:0});
 await page.reload();assert.match(await page.locator('#personalTotal').textContent(),/0,00/);assert.match(await page.locator('#cabinetTotal').textContent(),/0,50/);
 const other=await context.newPage();await other.goto('http://127.0.0.1:4173/');await other.getByRole('button',{name:'Ajouter un kit de soin',exact:true}).click();await page.waitForFunction(()=>document.getElementById('cabinetKitCount').textContent==='1');
 for(const width of [1920,1366,390,320]){await page.setViewportSize({width,height:900});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert(await page.locator('#personalTotal').isVisible());}
 await page.setViewportSize({width:1920,height:1080});await page.screenshot({path:'tmp/cabinet-preview.png'});
 await browser.close();console.log('Counter migration, independent resets, persistence, tab sync and responsive checks passed.');
})().catch(e=>{console.error(e);process.exit(1)});
