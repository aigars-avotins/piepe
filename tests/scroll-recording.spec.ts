import { test, expect } from '@playwright/test'
import { mkdir } from 'node:fs/promises'
test('silent fifteen-second before and after scroll captures', async ({ browser, browserName }, testInfo) => {
  test.skip(browserName !== 'chromium' || !process.env.CI, 'Recording runs in the supported CI browser environment')
  test.setTimeout(65000)
  for (const [name,url] of [['before','https://pie.pe/'],['after','http://127.0.0.1:4173/']]) {
    const dir=testInfo.outputPath(name); await mkdir(dir,{recursive:true})
    const context=await browser.newContext({viewport:{width:1440,height:900},recordVideo:{dir,size:{width:1440,height:900}}})
    await context.addInitScript(()=>sessionStorage.setItem('piepe-entered','1'))
    const page=await context.newPage(); await page.goto(url); await page.evaluate(()=>document.fonts.ready)
    await page.screenshot({path:testInfo.outputPath(`${name}-hero.png`)})
    await page.evaluate(async()=>{const distance=document.documentElement.scrollHeight-innerHeight;const start=performance.now();await new Promise<void>(resolve=>{function frame(now:number){const progress=Math.min(1,(now-start)/15000);scrollTo({top:distance*progress,behavior:'instant'});if(progress<1)requestAnimationFrame(frame);else resolve()}requestAnimationFrame(frame)})})
    await expect(page.getByRole('button',{name:/^(Return to forest|Atgriezties mežā)$/})).toBeVisible()
    await context.close()
  }
})
