const fs = require("fs");
const istanbul = require("istanbul");
const debug = require("debug");
const dbg = debug("kandinskijs:reporter");
const FALLBACK_MAPPINGS = { "*": {} };
module.exports = function(opts) {
  let _mappings = Object.assign({}, FALLBACK_MAPPINGS);
  const outDir = (opts || {}).outDir || "__logs__/";
  const loadMappings = function() {
    if (!fs.existsSync(`${outDir}log_mappings.json`)) {
      dbg("mappings file not found");
      return FALLBACK_MAPPINGS;
    }
    return JSON.parse(fs.readFileSync(`${outDir}log_mappings.json`, "utf8"));
  };
  return {
    writeMappings: function(mappings) {
      fs.writeFileSync(
        `${outDir}log_mappings.json`,
        JSON.stringify(mappings || FALLBACK_MAPPINGS, null, 2)
      );
    },
    generateCoverageObject: function() {
      _mappings = loadMappings();
      let totalRules = 0;
      let testedRules = 0;

      for (const selector in _mappings) {
        const elmMapping = _mappings[selector];
        if (!(elmMapping && elmMapping.props)) {
          continue;
        }
        totalRules += elmMapping.props.length;
        testedRules += elmMapping.props.filter(p => p.hit).length;
      }
      dbg(
        `Code coverage (tested/total): ${testedRules}/${totalRules} (${(testedRules /
          totalRules) *
          100}"%)`
      );
      return {};
    },
    writeReport: function(reportDoneCallback) {
      const report = istanbul.Report.create("lcov", {
        dir: `./${outDir}`
      });
      const Collector = istanbul.Collector;
      const collector = new Collector();
      collector.add(this.generateCoverageObject());
      report.on("done", function() {
        dbg("done");
        if (reportDoneCallback) {
          reportDoneCallback();
        }
      });
      report.writeReport(collector);
    }
  };
};
