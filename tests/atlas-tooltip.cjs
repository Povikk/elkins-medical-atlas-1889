const {chromium} = require('playwright');
const assert = require('node:assert/strict');
const path = require('node:path');
(async()=>{
  const browser=await chromium.launch({headless:true});
  try {
    const page=await browser.newPage({viewport:{width:2560,height:1440}});
    const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    await page.goto('http://127.0.0.1:4173/');
    await page.evaluate(()=>showAtlas());
    const tip=page.locator('#anatomyTooltip');
    let count=0;
    for(const key of ['skeleton','muscles','organs']){
      await page.evaluate(k=>selectAnatomyPlate(k),key);
      await page.locator('#anatomyStage img').evaluate(img=>img.decode());
      const labels=page.locator('#anatomyStage .anatomy-label');
      for(let i=0;i<await labels.count();i++){
        const button=labels.nth(i);
        await button.hover();
        await tip.waitFor({state:'visible'});
        assert.equal(await tip.locator('strong').innerText(),(await button.getAttribute('aria-label')).replace('Afficher la fiche : ',''));
        const rect=await tip.boundingBox();
        assert(rect.x>=0 && rect.y>=0 && rect.x+rect.width<=2560 && rect.y+rect.height<=1440);
        count++;
      }
    }
    await page.screenshot({path:path.resolve('tmp/site-qa/atlas-tooltip-desktop.png')});
    await page.evaluate(()=>applyTheme('light'));
    await page.screenshot({path:path.resolve('tmp/site-qa/atlas-tooltip-light.png')});
    await page.evaluate(()=>applyTheme('dark'));
    await tip.hover();
    await page.waitForTimeout(220);
    assert(await tip.isVisible());
    await page.keyboard.press('Escape');
    assert(await tip.isHidden());
    const first=page.locator('#anatomyStage .anatomy-label').first();
    await first.focus();
    assert(await tip.isVisible());
    await page.keyboard.press('Tab');
    assert(await tip.isVisible());
    await page.getByRole('button',{name:'Agrandir la planche'}).click();
    const zoomLabel=page.locator('#anatomyZoomStage .anatomy-label').first();
    await zoomLabel.hover();
    assert(await tip.isVisible());
    assert.equal(await tip.evaluate(el=>el.parentElement.id),'anatomyDialog');
    await page.getByRole('button',{name:'Fermer',exact:true}).click();
    assert(await tip.isHidden());
    await first.hover();
    await page.evaluate(()=>showLexique());
    assert(await tip.isHidden());
    const touch=await browser.newPage({viewport:{width:390,height:844},hasTouch:true,isMobile:true});
    await touch.goto('http://127.0.0.1:4173/');
    await touch.evaluate(()=>showAtlas());
    await touch.locator('#anatomyStage img').evaluate(img=>img.decode());
    await touch.locator('#anatomyStage .anatomy-label').first().tap();
    assert(await touch.locator('#anatomyTooltip').isVisible());
    assert(await touch.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    await touch.screenshot({path:path.resolve('tmp/site-qa/atlas-tooltip-mobile.png')});
    await touch.getByRole('button',{name:'Agrandir la planche'}).click();
    assert(await touch.locator('#anatomyZoomStage img').evaluate(img=>Math.abs(img.getBoundingClientRect().width-img.parentElement.clientWidth)<2));
    await touch.locator('#anatomyZoomStage .anatomy-label').first().tap();
    assert(await touch.locator('#anatomyTooltip').isVisible());
    await touch.getByRole('button',{name:'Fermer',exact:true}).tap();
    assert(await touch.locator('#anatomyTooltip').isHidden());
    assert.deepEqual(errors,[]);
    console.log(`${count} labels: hover, viewport edges, keyboard, Escape, zoom and mobile touch OK`);
  } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
