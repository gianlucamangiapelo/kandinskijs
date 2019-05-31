const kjsReporter = require("../src/reporter/reporter");
const reporter = new kjsReporter({
  outDir: "__logs__/css-stressKTest/"
});
reporter.writeReport();
