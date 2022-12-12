import { ICustomWorld } from '../world/custom-world';
import config from '../config';
import { Before, After, BeforeAll, AfterAll, Status, setDefaultTimeout } from '@cucumber/cucumber';
import {
  chromium,
  ChromiumBrowser,
  ConsoleMessage,
  FirefoxBrowser,
  WebKitBrowser,
} from '@playwright/test';
import { ITestCaseHookParameter } from '@cucumber/cucumber/lib/support_code_library_builder/types';
import { ensureDir } from 'fs-extra';

let browser: ChromiumBrowser | FirefoxBrowser | WebKitBrowser;
const tracesDir = 'traces';

setDefaultTimeout(config.timeout || -1);

BeforeAll(async function () {
  const browserConfig = config.projects ? config.projects[0].name : 'chromium';

  switch (browserConfig) {
    default:
      browser = await chromium.launch();
  }

  await ensureDir(tracesDir);
});

Before({ tags: '@ignore' }, async function () {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return 'skipped' as any;
});

Before({ tags: '@debug' }, async function (this: ICustomWorld) {
  this.debug = true;
});

Before(async function (this: ICustomWorld, { pickle }: ITestCaseHookParameter) {
  this.startTime = new Date();
  this.testName = pickle.name.replace(/\W/g, '-');

  // customize the [browser context](https://playwright.dev/docs/next/api/class-browser#browsernewcontextoptions)
  this.context = await browser.newContext(config.use);

  await this.context.tracing.start({ screenshots: true, snapshots: true });

  this.pageObj = await this.context.newPage();
  this.pageObj.on('console', async (msg: ConsoleMessage) => {
    if (msg.type() === 'log') {
      await this.attach(msg.text());
    }
  });

  this.feature = pickle;
});

After(async function (this: ICustomWorld, { result }: ITestCaseHookParameter) {
  if (result) {
    await this.attach(`Status: ${result?.status}. Duration:${result.duration?.seconds}s`);

    if (result.status !== Status.PASSED) {
      const image = await this.page().screenshot();
      image && (await this.attach(image, 'image/png'));
      await this.context?.tracing.stop({
        path: `${tracesDir}/${this.testName}-${
          this.startTime?.toISOString().split('.')[0]
        }trace.zip`,
      });
    }
  }
  await this.page().close();
  await this.context?.close();
});

AfterAll(async function () {
  await browser.close();
});
