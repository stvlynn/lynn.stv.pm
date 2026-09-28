/** Browser regression for opaque character regions and transparent exterior silhouettes. */
import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';

const baseUrl = process.env.CHARACTER_PREVIEW_URL ?? 'http://localhost:5173';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(`${baseUrl}/character`);
  await page.getByRole('button', { name: /Silver-white bob/ }).click();
  await page.waitForTimeout(1000);
  for (const theme of ['dark', 'light']) {
    await page.evaluate((value) => document.documentElement.setAttribute('data-theme', value), theme);
    const coverage = await page.locator('clipPath').evaluate((clip) => {
      const paths = [...clip.querySelectorAll('path')];
      const contains = ([x, y]) => paths.some((path) => path.isPointInFill(new DOMPoint(x, y)));
      return {
        // Crown, bangs, left/right bob, and cheek: all must expose the color artwork.
        interior: [[190, 100], [160, 150], [90, 210], [295, 220], [205, 250]].map(contains),
        exterior: [[20, 170], [390, 250], [170, 0]].map(contains),
      };
    });
    assert.ok(coverage.interior.every(Boolean), `${theme}: missing hair or face fill`);
    assert.ok(coverage.exterior.every((value) => !value), `${theme}: exterior halo exposed`);
    await page.getByRole('button', { name: 'View full figure' }).click();
    for (const view of ['Left', 'Back', 'Right', 'Front']) {
      await page.getByRole('button', { name: view, exact: true }).click();
      await page.waitForTimeout(400);
      assert.equal(await page.locator('svg image').count(), 1);
      assert.match(await page.locator('svg image').getAttribute('clip-path'), /^url\(#figure-silhouette-/);
    }
    await page.getByRole('button', { name: /Silver-white bob/ }).click();
    await page.waitForTimeout(900);
  }
  assert.deepEqual(errors, []);
  console.log('Character color checks passed: hair/face coverage, exterior exclusion, four views, both themes.');
} finally {
  await browser.close();
}
