import { Locator, Page } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly banner: Locator;

  constructor(page: Page) {
    this.page = page;
    this.banner = page.getByRole('banner');
  }

  async goto() {
    await this.page.goto('/');
    await this.page.waitForLoadState();
  }

  getBanner() {
    return this.banner;
  }
}
