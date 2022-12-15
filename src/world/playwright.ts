import config from '../config';
import { setWorldConstructor, World, IWorldOptions, Status } from '@cucumber/cucumber';
import * as messages from '@cucumber/messages';
import { Browser, BrowserContext, ConsoleMessage, Page } from '@playwright/test';

export const TRACES_DIR = 'traces';

export class PlaywrightWorld extends World {
  constructor(options: IWorldOptions) {
    super(options);
  }

  context?: BrowserContext;
  pageObj?: Page;
  testName?: string;
  scenario?: messages.Pickle;
  startTime?: Date;

  anyPage(): Page {
    if (!this.pageObj) {
      throw new Error('No page is defined!');
    }

    return this.pageObj;
  }

  page<T>(pageConstructor: new (page: Page) => T): T {
    return new pageConstructor(this.anyPage());
  }

  async startScenario(scenario: messages.Pickle, browser: Browser) {
    this.startTime = new Date();
    this.scenario = scenario;
    this.testName = scenario.name.replace(/\W/g, '-');

    this.context = await browser.newContext(config.use);

    await this.startTracing(scenario);
    await this.initPage();
  }

  async endScenario(result?: messages.TestStepResult) {
    if (!result) {
      return;
    }

    await this.saveScreenshot(result.status);
    await this.endTracing(result.status);

    await this.pageObj?.close();
    await this.context?.close();
  }

  async startTracing(scenario: messages.Pickle) {
    if (config.use?.trace === 'off') {
      return;
    }

    await this.context?.tracing.start({
      title: scenario.name,
      screenshots: true,
      snapshots: true,
    });
  }

  async endTracing(status: messages.TestStepResultStatus) {
    if (
      config.use?.trace === 'off' ||
      (config.use?.trace === 'retain-on-failure' && status === Status.PASSED)
    ) {
      return;
    }

    await this.context?.tracing.stop({
      path: `${TRACES_DIR}/${this.testName}-${
        this.startTime?.toISOString().split('.')[0]
      }trace.zip`,
    });
  }

  async saveScreenshot(status: messages.TestStepResultStatus) {
    if (
      config.use?.screenshot === 'off' ||
      (config.use?.screenshot === 'only-on-failure' && status === Status.PASSED)
    ) {
      return;
    }

    const image = await this.anyPage().screenshot();
    await this.attach(image, 'image/png');
  }

  async initPage() {
    if (!this.context) {
      return;
    }

    this.pageObj = await this.context.newPage();
    this.pageObj.on(
      'console',
      async (msg: ConsoleMessage) => msg.type() === 'log' && (await this.attach(msg.text())),
    );
  }
}

setWorldConstructor(PlaywrightWorld);
