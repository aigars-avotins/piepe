import { test, expect } from '@playwright/test'
import { readingPath } from '../src/i18n'

// 3.3 regressions. Each case names the audited defect it guards.
test('3.3 atlas loupe never requests an owner JPEG; explicit zoom requests exactly the chosen one', async ({ page }) => {
  const originals: string[] = []
  page.on('request', request => { const path = new URL(request.url()).pathname; if (/\/images\/interactive\/atlas-[a-z]+\.jpg$/.test(path)) originals.push(path) })
  await page.goto(readingPath('en') + '#surface-atlas')
  const pictures = page.locator('.atlas-picture')
  await expect(pictures).toHaveCount(3)
  for (let index = 0; index < 3; index++) {
    const picture = pictures.nth(index), image = picture.locator('img[data-interactive-image]')
    await picture.scrollIntoViewIfNeeded(); await expect(image).toHaveAttribute('data-image-state', 'ready')
    const box = (await image.boundingBox())!
    await page.mouse.move(box.x + box.width * .4, box.y + box.height * .5); await page.mouse.move(box.x + box.width * .6, box.y + box.height * .5)
    await expect(picture.locator('.atlas-loupe')).toBeVisible()
    await expect.poll(() => picture.locator('.atlas-loupe img').evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0 && element.currentSrc)).toMatch(/\/responsive\/atlas-[a-z]+-(960|1600|2400)\.(?:avif|webp)$/)
  }
  expect(originals).toEqual([])
  await page.locator('[data-atlas-open]').nth(1).click()
  const dialog = page.locator('[data-atlas-dialog]')
  await expect(dialog).toBeVisible(); await expect(dialog.locator('img')).toHaveCount(3)
  await expect(dialog.locator('img').first()).toHaveAttribute('loading', 'eager')
  await expect.poll(() => dialog.locator('img').first().evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth)).toBe(2400)
  await expect(dialog.locator('img').nth(1)).toHaveAttribute('loading', 'lazy'); await expect(dialog.locator('img').nth(2)).toHaveAttribute('srcset', /responsive\/atlas-[a-z]+-960\.(?:avif|webp) 960w/)
  expect(originals).toEqual(['/images/interactive/atlas-gills.jpg'])
})
