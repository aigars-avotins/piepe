import { test, expect } from '@playwright/test'
import { readFile } from 'node:fs/promises'
import { messages } from '../src/i18n'
import { nativeDiagnostics } from './nativeDiagnostics'
nativeDiagnostics()

// Production smoke is manual-only; retain actual live playback evidence on success.
test.use({ video: 'on' })
test.beforeEach(async({page})=>{await page.bringToFront()})

for (const locale of ['lv','en'] as const) test(`${locale}: released application, cinema, discovery, wallpapers and media delivery`, async ({page, request}, testInfo) => {
  test.setTimeout(65000)
  const t=messages[locale], path=locale==='lv'?'/':'/en/'
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message))
  const raw=await request.get(path);expect(raw.status()).toBe(200);expect(await raw.text()).toContain(t.factsTitle)
  await page.goto(path)
  await expect(page.locator('.world')).toHaveAttribute('data-version','2.5.2')
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
    await page.locator('#'+id).evaluate(element=>element.scrollIntoView({block:'start'}))
    const layer=page.locator(`[data-clip="${clip}"]`)
    await expect(layer).toHaveAttribute('data-clip-ready','true',{timeout:11000})
    if(id==='understory'){
      const budget=await page.locator('#understory').evaluate(e=>{const r=e.getBoundingClientRect(),heading=document.getElementById('encounter-title')!.getBoundingClientRect();return{section:r.height/innerHeight,nextHeading:(heading.top-r.top-innerHeight+48)/innerHeight,mobile:innerWidth<700}})
      expect(budget.section).toBeCloseTo(budget.mobile?1.7:1.6,2)
      expect(budget.nextHeading).toBeLessThan(budget.mobile?1.7:1.2)
    }
    const frames=await layer.locator('video').evaluate(async(video:HTMLVideoElement)=>{
      const canvas=document.createElement('canvas');canvas.width=64;canvas.height=36;const ctx=canvas.getContext('2d')!
      const samples:{time:number;hash:number}[]=[]
      await new Promise<void>((resolve,reject)=>{
        const timeout=setTimeout(()=>reject(Error('Production cinema did not present moving frames')),4000)
        const frame:VideoFrameRequestCallback=(_,metadata)=>{
          ctx.drawImage(video,0,0,64,36);const pixels=ctx.getImageData(0,0,64,36).data;let hash=2166136261
          for(let i=0;i<pixels.length;i+=4)hash=Math.imul(hash^pixels[i],16777619)
          samples.push({time:metadata.mediaTime,hash:hash>>>0})
          if(samples.length===3){clearTimeout(timeout);resolve()}else setTimeout(()=>video.requestVideoFrameCallback(frame),250)
        };video.requestVideoFrameCallback(frame)
      })
      let opacity=1;for(let element:Element|null=video;element;element=element.parentElement)opacity*=Number(getComputedStyle(element).opacity)
      return{samples,paused:video.paused,opacity}
    })
    expect(frames.paused).toBe(false);expect(frames.opacity).toBeGreaterThan(.98);expect(new Set(frames.samples.map(frame=>frame.hash)).size).toBe(3)
    expect(frames.samples.slice(1).reduce((sum,frame,i)=>sum+Math.max(0,frame.time-frames.samples[i].time),0)).toBeGreaterThan(.3)
    await page.screenshot({path:testInfo.outputPath(`${locale}-production-${clip}.png`),scale:'css'})
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
    const range=await request.get(`/media/forest-${clip}.mp4?v=2.3`,{headers:{Range:'bytes=0-63'}});expect(range.status()).toBe(206);expect((await range.body()).length).toBe(64)
    expect((await request.get(`/media/forest-${clip}.mp4?v=2.3`,{headers:{Range:'bytes=999999999-'}})).status()).toBe(416)
  }
  expect((await request.get('/favicon.ico')).status()).toBe(200);expect((await request.get('/no-such-page')).status()).toBe(404)
  if(testInfo.project.name==='chrome-desktop'){await page.setViewportSize({width:390,height:664});await page.screenshot({path:testInfo.outputPath(`${locale}-production-mobile.png`),scale:'css'})}
  expect(errors).toEqual([])
})
