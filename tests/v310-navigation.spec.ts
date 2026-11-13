import {test,expect} from '@playwright/test'
import {readingPath,localePath} from '../src/i18n'
import {fieldNotesPath,notePath,wallpapersPath} from '../src/forestPaths'

test.beforeEach(async({page})=>{await page.addInitScript(()=>{sessionStorage.setItem('piepe-entered','1');localStorage.setItem('piepe-forest-sound','off')})})
for(const locale of ['lv','en'] as const)test.describe(`3.1 native navigation ${locale}`,()=>{
 test('homepage, guide, collection, related notes, home and Back stay in one tab and preserve scroll',async({page,context})=>{
  test.setTimeout(40000);await page.goto(localePath(locale));await expect(page.locator('.world')).not.toHaveClass(/prerendered/);await page.evaluate(()=>document.fonts.ready);const guide=page.locator(`.facts-context a[href="${readingPath(locale)}"]`);await guide.evaluate(e=>e.scrollIntoView({block:'center',behavior:'instant'}));await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));const before=await page.evaluate(()=>({url:location.href,y:scrollY}))
  // Native focus can make a final small scroll adjustment during activation.
  // Compare Back with the position actually left, captured at pagehide.
  // Chromium + the unchanged GSAP refresh restores four CSS pixels earlier in
  // BOTH archived 3.0 and this candidate; require the same bounded native result.
  await page.evaluate(()=>addEventListener('pagehide',()=>sessionStorage.setItem('v310-departure-y',String(scrollY)),{once:true}))
  await guide.click();await expect(page).toHaveURL(new RegExp(readingPath(locale)+'$'));expect(context.pages()).toHaveLength(1)
  const departureY=await page.evaluate(()=>Number(sessionStorage.getItem('v310-departure-y')))
  await page.locator(`.reading-next a[href="${fieldNotesPath(locale)}"]`).click();await expect(page).toHaveURL(new RegExp(fieldNotesPath(locale)+'$'));expect(context.pages()).toHaveLength(1)
  await page.locator(`.knowledge-index a[href="${notePath(locale,'005')}"]`).click();await expect(page).toHaveURL(new RegExp(notePath(locale,'005')+'$'));expect(context.pages()).toHaveLength(1)
  const next=await page.locator('.knowledge-related a').first().getAttribute('href');await page.locator('.knowledge-related a').first().click();await expect(page).toHaveURL(new RegExp(next!+'$'));expect(context.pages()).toHaveLength(1)
  await page.locator('.reading-return a').click();await expect(page).toHaveURL(new RegExp(localePath(locale)+'$'));await expect(page.locator('.world')).toHaveAttribute('data-intro-state','complete');expect(context.pages()).toHaveLength(1)
  for(const expected of [next!,notePath(locale,'005'),fieldNotesPath(locale),readingPath(locale),new URL(before.url).pathname]){await page.goBack();await expect(page).toHaveURL(new RegExp(expected+'$'))}
  await expect(page.locator('.world')).not.toHaveClass(/prerendered/);await expect.poll(async()=>Math.abs(await page.evaluate(()=>scrollY)-departureY)).toBeLessThanOrEqual(4);await expect(page.locator('.facts-context a').first()).toBeInViewport();expect(context.pages()).toHaveLength(1)
 })
 test('locale links, native fragments and same-origin downloads preserve their own native behavior',async({page,context})=>{
  await page.goto(readingPath(locale));const other=locale==='lv'?'en':'lv';await page.locator(`.reading-languages a[lang="${other}"]`).click();await expect(page).toHaveURL(new RegExp(readingPath(other)+'$'));await expect(page.locator('html')).toHaveAttribute('lang',other);expect(context.pages()).toHaveLength(1);await page.goBack();await expect(page).toHaveURL(new RegExp(readingPath(locale)+'$'))
  await page.locator('.reading-citations a').first().click();await expect(page).toHaveURL(/#source-/);expect(context.pages()).toHaveLength(1);await page.goBack();await expect(page).not.toHaveURL(/#source-/)
  await page.goto(wallpapersPath(locale));const url=page.url(),event=page.waitForEvent('download');await page.locator('.knowledge-downloads a[download]').first().click();const download=await event;expect(download.suggestedFilename()).toBe('piepe-forest-desktop-5120x2880.jpg');expect(await download.failure()).toBeNull();expect(page.url()).toBe(url);expect(context.pages()).toHaveLength(1)
  await page.goto(notePath(locale,'001'));const note=page.waitForEvent('download');await page.locator('.knowledge-original[download]').click();expect((await note).suggestedFilename()).toBe(`field-note-${locale}.txt`);expect(context.pages()).toHaveLength(1)
 })
})

test('3.1 two actual external reference links create isolated new tabs with no referrer',async({page,context})=>{
 await context.route('https://www.woodlandtrust.org.uk/**',route=>route.fulfill({status:200,contentType:'text/html',body:'<!doctype html><title>Reference navigation test</title><p>Controlled response: this test verifies navigation, not the external publisher availability.</p>'}))
 await context.route('https://archive.bio.ed.ac.uk/**',route=>route.fulfill({status:200,contentType:'text/html',body:'<!doctype html><title>Reference navigation test</title>'}))
 await page.goto('/en/');await page.locator('.fact-sources').evaluate(e=>e.scrollIntoView({block:'center',behavior:'instant'}));const original=page.url(),links=page.locator('.fact-sources a')
 for(let i=0;i<2;i++){
  const href=(await links.nth(i).getAttribute('href'))!;let referrer:string|undefined;const listen=(request:import('@playwright/test').Request)=>{if(request.url()===href)referrer=request.headers().referer};context.on('request',listen)
  const event=context.waitForEvent('page');await links.nth(i).click();const popup=await event;await popup.waitForLoadState('domcontentloaded');expect(popup.url()).toBe(href);expect(await popup.evaluate(()=>window.opener)).toBeNull();expect(referrer).toBeUndefined();expect(page.url()).toBe(original);await popup.close();context.off('request',listen)
 }
 expect(context.pages()).toHaveLength(1)
})

test('3.1 a user-modified locale link does not mutate the current homepage',async({page,context,browserName})=>{
 test.skip(browserName==='webkit'&&process.platform==='linux','Modified popup behavior is exercised in Chromium and native WebKit; Linux WebKit headless desktop may not expose OS modifier mappings.')
 await page.goto('/#fungus-facts');await expect(page.locator('.world')).not.toHaveClass(/prerendered/);const before=page.url(),popup=context.waitForEvent('page');await page.locator('.world > header .language-switch a[lang="en"]').click({modifiers:[process.platform==='darwin'?'Meta':'Control']});const next=await popup;await next.waitForLoadState();expect(next.url()).toMatch(/\/en\/$/);expect(page.url()).toBe(before);await expect(page.locator('html')).toHaveAttribute('lang','lv');await next.close()
})
