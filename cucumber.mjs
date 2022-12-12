const getWorldParams = () => {
  const params = {
    foo: "bar",
  };

  return params;
};

const config = {
  requireModule: ["ts-node/register"],
  require: ["src/**/*.ts"],
  format: [
    "json:reports/cucumber-report.json",
    "html:reports/report.html",
    "summary",
    "@cucumber/pretty-formatter",
    "cucumber-console-formatter",
  ],
  formatOptions: { snippetInterface: "async-await" },
  worldParameters: getWorldParams(),
  publishQuiet: true,
};

export default config;
