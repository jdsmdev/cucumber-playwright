import { PlaywrightWorld, TRACES_DIR } from '../world/playwright';
import config from '../config';
import { Before, After, BeforeAll, AfterAll, setDefaultTimeout } from '@cucumber/cucumber';
import { Browser, chromium, firefox, webkit } from '@playwright/test';
import { ITestCaseHookParameter } from '@cucumber/cucumber/lib/support_code_library_builder/types';
import { ensureDir } from 'fs-extra';

let browser: Browser;

setDefaultTimeout(process.env.DEBUG ? -1 : config.timeout || -1);

BeforeAll(async function () {
  if (!config.projects) {
    throw new Error('No browser is configured!');
  }

  const options = {
    ...config.use?.launchOptions,
    headless: config.use?.headless || config.use?.launchOptions?.headless,
    channel: config.use?.channel || config.use?.launchOptions?.channel,
  };

  switch (config.projects[0].name) {
    case 'firefox':
      browser = await firefox.launch(options);
      break;
    case 'webkit':
      browser = await webkit.launch(options);
      break;
    default:
      browser = await chromium.launch(options);
  }

  if (config.use?.trace !== 'off') {
    await ensureDir(TRACES_DIR);
  }
});

Before(async function (this: PlaywrightWorld, { pickle }: ITestCaseHookParameter) {
  await this.startScenario(pickle, browser);
});

After(async function (this: PlaywrightWorld, { result }: ITestCaseHookParameter) {
  await this.endScenario(result);
});

AfterAll(async function () {
  await browser.close();
});
