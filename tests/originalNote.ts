import {expect} from '@playwright/test'
import type {Page} from '@playwright/test'

// Encounter now opens the 3.0 portal. Exercise the preserved Field Note 001
// through its original hero control, including its own focus restoration.
// These note/layout checks use the real Skip action; cinema has separate
// complete-film tests and must not be replayed in every typography assertion.
export async function openOriginalNote(page:Page){
 await page.locator('#forest').evaluate(e=>e.scrollIntoView({block:'start',behavior:'instant'}))
 await page.locator('.fungus-annotation').click()
 await expect(page.locator('.skip-awakening,dialog[open]')).toBeVisible()
 if(await page.locator('.skip-awakening').isVisible())await page.locator('.skip-awakening').click()
 await expect(page.getByRole('dialog')).toBeVisible()
}
