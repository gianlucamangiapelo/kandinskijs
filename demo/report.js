const kjsReporter = require("../src/reporter");
const reporter = new kjsReporter({
  outDir: "__logs__/cssKTest/"
});
reporter.writeReport();
