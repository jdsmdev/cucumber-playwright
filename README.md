# cucumber-playwright-starter

Starter project to write and debug cucumber-js features using playwright in TypeScript

## After cloning the repo

- run the command `npm install`.

## Execute the tests locally

- run the command `npm test <FEATURES>` to execute a feature.
- run the command `npm run test:all` to execute all scenarios.
- run the command `npm run test:parallel <NUMBER_OF_WORKERS>` to execute all scenarios in parallel.

## Configure cucumber

In the [cucumber.mjs](cucumber.mjs) file, you can modify reporting/plugins/formatters/etc. on the cucumber configuration.

## Configure playwright

In the [config.ts](src/config.ts) file, you can modify timeouts/headless/screenshot/trace/etc. on the playwright configuration.


## Debug a scenario in Visual Studio Code

- set the breakpoints in the typescript code
- run the command `npm test:debug <FEATURES>`

## Check for typescript, linting and gherkin errors

- run the command `npm run build`.

## View the steps usage

- run the command `npm run steps-usage`.

## View the html report of the last run

- run the command `npm run report`.

## Create a new step

- first write the Given/When/Then sentence:

  ```gherkin
  Given I push "foo" on "bar"
  ```

- run the npm script:

  ```sh
  npm run snippets
  ```

- the script will report the missing step(s): you just need to copy and paste them in the step definitions file:

  ```sh
  Given('I push {string} on {string}', async function (string, string2) {
    // Write code here that turns the phrase above into concrete actions
    return 'pending';
  });
  ```
