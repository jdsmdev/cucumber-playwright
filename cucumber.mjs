const config = {
  requireModule: ['ts-node/register'],
  require: ['src/**/*.ts'],
  format: [
    'json:reports/cucumber-report.json',
    'html:reports/report.html',
    'cucumber-console-formatter',
  ],
  formatOptions: { snippetInterface: 'async-await' },
  publishQuiet: true,
};

export default config;
