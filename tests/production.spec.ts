import { test, expect } from '@playwright/test'
import { readFile } from 'node:fs/promises'
import { messages } from '../src/i18n'

for (const locale of ['lv','en'] as const) test(`${locale}: released application, cinema, discovery, wallpapers and media delivery`, async ({page, request}, testInfo) => {
  test.setTimeout(65000)
  const t=messages[locale], path=locale==='lv'?'/':'/en/'
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message))
  const raw=await request.get(path);expect(raw.status()).toBe(200);expect(await raw.text()).toContain(t.factsTitle)
  await page.goto(path)
  await expect(page.locator('.world')).toHaveAttribute('data-version','2.2')
  const local=await readFile('dist/index.html','utf8');const script=/src="(\/assets\/[^"]+\.js)"/.exec(local)![1]
  await expect(page.locator('head script[type="module"][src^="/assets/"]')).toHaveAttribute('src',script)
  await expect(page.locator('.world')).toHaveAttribute('data-exit-reason','ended',{timeout:13000})
  await expect(page.locator('video.forest-film')).toHaveCount(0)
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true)
  await page.screenshot({path:testInfo.outputPath(`${locale}-production-hero.png`),scale:'css'})
  await page.getByRole('button',{name:t.closer,exact:true}).click()
  await expect(page.getByRole('dialog')).toBeVisible({timeout:11000})
  await expect(page.getByRole('heading',{name:t.observations[0].title.split('\n')[0],exact:false})).toBeVisible({timeout:11000})
  await page.screenshot({path:testInfo.outputPath(`${locale}-production-discovery.png`),scale:'css'})
  await page.getByRole('tab',{name:new RegExp(t.observations[0].label)}).press('End')
  const download=page.waitForEvent('download');await page.getByRole('link',{name:t.keepNote,exact:false}).click()
  expect((await download).suggestedFilename()).toBe(`piepe-field-note-001-${locale}.txt`)
  await expect(page.getByRole('status')).toContainText(t.collected)
  await page.getByRole('button',{name:t.closeDiscovery}).click();await expect(page.getByRole('dialog')).not.toBeVisible()
  await expect(page.getByRole('button',{name:t.closer,exact:true})).toBeFocused()
  for(const [id,clip] of [['understory','understory'],['return','breathing']]){
    await page.locator('#'+id).scrollIntoViewIfNeeded()
    await expect(page.locator(`[data-clip="${clip}"]`)).toHaveAttribute('data-clip-reason','ended',{timeout:11000})
  }
  const wallpaper=page.waitForEvent('download');await page.getByRole('link',{name:t.downloadPhone}).click()
  expect((await wallpaper).suggestedFilename()).toBe('piepe-forest-mobile-1440x3120.jpg')
  // In-app URL changes preserve experience; direct locale navigation above also checks the static route.
  const other=locale==='lv'?'EN':'LV'
  await page.evaluate(value=>(document.querySelector(`.site-header .language-switch a[lang="${value.toLowerCase()}"]`) as HTMLElement).click(),other)
  await expect(page.locator('html')).toHaveAttribute('lang',other.toLowerCase());await expect(page.locator('video.forest-film')).toHaveCount(0)
  const now=messages[other==='LV'?'lv':'en'];await page.getByRole('button',{name:now.returnForest,exact:true}).click()
  await expect.poll(()=>page.evaluate(()=>scrollY)).toBeLessThan(5)
  await page.reload();await expect(page.locator('video.forest-film')).toHaveCount(0)
  await page.getByRole('button',{name:now.replayLabel}).click();await expect(page.locator('video.forest-film')).toHaveCount(1)
  await page.getByRole('button',{name:now.skipIntro}).click();await expect(page.getByRole('button',{name:now.closer,exact:true})).toBeFocused()
  for(const clip of ['reveal','awakening','understory','breathing']){
    const range=await request.get(`/media/forest-${clip}.mp4`,{headers:{Range:'bytes=0-63'}});expect(range.status()).toBe(206);expect((await range.body()).length).toBe(64)
    expect((await request.get(`/media/forest-${clip}.mp4`,{headers:{Range:'bytes=999999999-'}})).status()).toBe(416)
  }
  expect((await request.get('/favicon.ico')).status()).toBe(200);expect((await request.get('/no-such-page')).status()).toBe(404)
  if(testInfo.project.name==='chrome-desktop'){await page.setViewportSize({width:390,height:664});await page.screenshot({path:testInfo.outputPath(`${locale}-production-mobile.png`),scale:'css'})}
  expect(errors).toEqual([])
})
