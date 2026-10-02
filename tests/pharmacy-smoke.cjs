const {chromium} = require('playwright');
const assert = require('node:assert/strict');
const path = require('node:path');
(async () => {
  const browser = await chromium.launch({headless:true});
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    for(const viewport of [{width:2560,height:1440},{width:390,height:844}]){
      await page.setViewportSize(viewport);
      await page.goto('http://127.0.0.1:4173/');
      await page.evaluate(()=>showLexique());
      const total = await page.locator('#lexGrid .lex-card').count();
      assert(total >= 50);
      for(const theme of ['dark','light']){
        await page.evaluate(t=>document.documentElement.dataset.theme=t,theme);
        await page.locator('#lexSearch').fill('cocaine');
        assert.equal(await page.locator('#lexGrid .lex-card').count(),1);
        await page.locator('.lex-details summary').click();
        assert.match(await page.locator('#lexGrid').innerText(),/1884|cardiaque/);
        assert.equal(await page.locator('.lex-details a').count(),1);
        await page.screenshot({path:path.resolve(`tmp/site-qa/pharmacy-${viewport.width}-${theme}.png`)});
        assert(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth));
        await page.locator('#lexSearch').fill('');
      }
      const categories = await page.locator('#lexCategory option').evaluateAll(options=>options.slice(1).map(x=>x.value));
      for(const category of categories){
        await page.locator('#lexCategory').selectOption(category);
        assert(await page.locator('#lexGrid .lex-card').count()>0);
        assert(await page.locator('#lexGrid .cat-badge').evaluateAll((els,c)=>els.every(x=>x.textContent===c),category));
      }
      await page.locator('#lexCategory').selectOption('');
      for(const context of ['Pharmacopée XIXe','Spécialisé',"Nouveauté de l'époque",'Historique dangereux']){
        await page.locator('#lexContext').selectOption(context);
        assert(await page.locator('#lexGrid .lex-card').count()>0);
      }
      await page.locator('#lexContext').selectOption('');
      await page.locator('#lexSearch').fill('aucunproduitxyz');
      assert.match(await page.locator('#lexGrid').innerText(),/Aucun résultat/);
      await page.getByRole('button',{name:'Matériel',exact:true}).click();
      assert(await page.locator('#lexFilters').isHidden());
      assert(await page.locator('#lexGrid > *').count()>0);
      await page.getByRole('button',{name:'Symptômes',exact:true}).click();
      await page.locator('#lexSearch').fill('paleur');
      assert.match(await page.locator('#lexGrid').innerText(),/Pâleur/);
      await page.evaluate(()=>showLexique());
      assert.equal(await page.locator('#lexGrid .lex-card').count(),total);
    }
    assert.deepEqual(errors,[]);
    console.log('Pharmacy: search, all categories, all contexts, details, tabs, desktop/mobile, light/dark OK');
  } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
