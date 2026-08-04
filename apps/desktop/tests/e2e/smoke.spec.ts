import { expect, test } from '@playwright/test'

test('foundation route is reachable', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByLabel('foundation-ready')).toBeVisible()
})