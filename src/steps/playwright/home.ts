import { PlaywrightWorld } from '../../world/playwright';
import { Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

When('I am on the playwright website', async function (this: PlaywrightWorld) {
  const page = this.page();
  await page.goto('/');
  await page.waitForLoadState();
});

Then('the text {string} is visible', async function (this: PlaywrightWorld, text: string) {
  const page = this.page();
  await expect(page.locator('body')).toContainText(text);
});
