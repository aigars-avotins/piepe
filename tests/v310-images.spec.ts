import {test,expect} from '@playwright/test'

for(const locale of ['lv','en'] as const)test(`3.1 ${locale} no-JS reading retains factual imagery, native explanations and original-photo links`,async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});try{
  const page=await context.newPage(),guide=locale==='lv'?'/kas-ir-piepe/':'/en/what-is-a-bracket-fungus/';await page.goto(guide);await expect(page.locator('[data-xray-story]')).toHaveCount(3);await expect(page.locator('[data-xray-story]').nth(1)).toBeVisible();await expect(page.locator('.xray-images')).toHaveAttribute('aria-label',/.+/);await expect(page.locator('[data-atlas-open]').first()).not.toBeVisible();await expect(page.locator('.atlas-original')).toHaveCount(3);await expect(page.locator('.raster-status').first()).not.toBeVisible()
  await page.locator('[data-xray-point="hyphae"]').click();await expect(page).toHaveURL(/#xray-hyphae$/);const event=context.waitForEvent('page',{timeout:300}).catch(()=>null);await page.locator('.atlas-original').first().click();await expect(page).toHaveURL(/\/images\/interactive\/atlas-pores\.jpg$/);expect(await event).toBeNull();await page.goBack();await expect(page).toHaveURL(/#xray-hyphae$/)
 }finally{await context.close()}
})

test('3.1 a slow paired image gives a neutral placeholder, then reveals both real layers together',async({page})=>{
 let release!:()=>void;const gate=new Promise<void>(resolve=>release=resolve);await page.route('**/responsive/xray-wood-mycelium-*.webp',async route=>{await gate;await route.continue()})
 await page.goto('/en/what-is-a-bracket-fungus/');const view=page.locator('.xray-view');await view.evaluate(e=>e.scrollIntoView({block:'center',behavior:'instant'}));await expect(view).toHaveAttribute('aria-busy','true');await expect.poll(()=>page.locator('.xray-images').evaluate(e=>getComputedStyle(e).opacity)).toBe('0');await expect(view.locator('[data-image-status]')).not.toBeVisible();release();await expect(view).toHaveAttribute('data-images-ready','');await expect.poll(()=>page.locator('.xray-images').evaluate(e=>getComputedStyle(e).opacity)).toBe('1')
})

test('3.1 real first-layer image failure and full fallback failure remain accessible and retryable',async({page})=>{
 let fail=true;await page.route('**/images/interactive/**',route=>fail&&route.request().url().includes('xray-bark-surface')?route.abort():route.continue());await page.route('**/wallpapers/previews/desktop.webp',route=>fail?route.abort():route.continue())
 await page.goto('/en/what-is-a-bracket-fungus/');const view=page.locator('.xray-view');await view.evaluate(e=>e.scrollIntoView({block:'center',behavior:'instant'}));await expect(view.locator('[data-image-status]')).toBeVisible();await expect(view.locator('img[data-original-src$="xray-bark-surface.jpg"]')).toHaveAttribute('data-image-state','failed');await expect(view.getByRole('button',{name:'Try again'})).toBeVisible();fail=false;await view.getByRole('button',{name:'Try again'}).click();await expect(view).toHaveAttribute('data-images-ready','');await expect(view.locator('[data-image-status]')).not.toBeVisible();await expect(view).not.toHaveAttribute('data-image-error','')
})

test('3.1 the last Deadwood image can fail and recover without substituting a false mixed stage',async({page})=>{
 let fail=true;await page.route('**/images/interactive/**',route=>fail&&route.request().url().includes('deadwood-stage-04')?route.abort():route.continue())
 await page.goto('/en/field-notes/005-deadwood-and-time/');const view=page.locator('.time-visual');await view.evaluate(e=>e.scrollIntoView({block:'center',behavior:'instant'}));const range=page.locator('[data-time-range]');await range.evaluate((e:HTMLInputElement)=>{e.value='85';e.dispatchEvent(new Event('input',{bubbles:true}))});await expect(view.locator('[data-image-status]')).toBeVisible();await expect(page.locator('[data-time-capsule]')).toHaveAttribute('data-stage','0');fail=false;await view.getByRole('button',{name:'Try again'}).click();await expect(page.locator('[data-time-capsule]')).toHaveAttribute('data-stage','3');await expect(view.locator('[data-image-status]')).not.toBeVisible()
})

test('3.1 inactive Deadwood sources wait for near-view intent and use responsive source-quality copies',async({page})=>{
 await page.setViewportSize({width:320,height:568});const later:string[]=[];page.on('request',r=>{if(/deadwood-stage-0[234]/.test(r.url())&&r.resourceType()==='image')later.push(r.url())});await page.goto('/en/field-notes/005-deadwood-and-time/');await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));expect(await page.locator('.time-visual').evaluate(e=>e.getBoundingClientRect().top)).toBeGreaterThan(808);expect(later).toEqual([]);await page.locator('.time-visual').evaluate(e=>e.scrollIntoView({block:'center',behavior:'instant'}));await expect.poll(()=>later.length).toBeGreaterThanOrEqual(3);expect(later.every(url=>url.includes('/responsive/')&&url.endsWith('.webp'))).toBe(true)
})

for(const locale of ['lv','en'] as const)test(`3.1.1 ${locale} reading header retains accessible native language targets without the retired selector`,async({page})=>{
 await page.setViewportSize({width:320,height:568});await page.goto(locale==='lv'?'/kas-ir-piepe/':'/en/what-is-a-bracket-fungus/');await expect(page.locator('.reading-header fieldset')).toHaveCount(0)
 for(const link of await page.locator('.reading-languages a').all()){const visible=(await link.innerText()).trim();await expect(link).toHaveAccessibleName(visible);const b=(await link.boundingBox())!;expect(b.width).toBeGreaterThanOrEqual(44);expect(b.height).toBeGreaterThanOrEqual(44);expect(b.x).toBeGreaterThanOrEqual(0);expect(b.x+b.width).toBeLessThanOrEqual(320)}
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true)
})
