import { PlaywrightWorld } from '../../world/playwright';
import { HomePage } from '../../pages/home';
import { Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

When('I am on the playwright website', async function (this: PlaywrightWorld) {
  const page = this.page(HomePage);
  await page.goto();
});

Then('the text {string} is visible', async function (this: PlaywrightWorld, text: string) {
  const page = this.page(HomePage);
  await expect(page.getBanner()).toContainText(text);
});
