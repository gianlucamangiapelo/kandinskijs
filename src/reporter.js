const fs = require("fs");
const istanbul = require("istanbul");
const debug = require("debug");
const dbg = debug("kandinskijs:reporter");
const FALLBACK_MAPPINGS = { "*": {} };
module.exports = function(opts) {
  let _mappings = Object.assign({}, FALLBACK_MAPPINGS);
  const outDir = (opts || {}).outDir || "__logs__/";
  const getMappingFilePath = function() {
    return `${outDir}log_mappings.json`;
  };
  const loadMappings = function() {
    const mappingFilePath = getMappingFilePath();
    if (!fs.existsSync(mappingFilePath)) {
      dbg(`mappings file not found: ${mappingFilePath}`);
      return FALLBACK_MAPPINGS;
    }
    return JSON.parse(fs.readFileSync(mappingFilePath, "utf8"));
  };
  return {
    writeMappings: function(mappings) {
      fs.writeFileSync(
        getMappingFilePath(),
        JSON.stringify(mappings || FALLBACK_MAPPINGS, null, 2)
      );
    },
    generateCoverageObject: function() {
      const _mappings = loadMappings();
      const { cssPath, maps } = _mappings;
      const result = {};
      let lastIdx = 0;
      maps.forEach(m => {
        _map = m["*"];
        let totalRules = 0;
        let testedRules = 0;
        const code = [];
        const lines = {};
        const stmtMaps = {};
        for (const selector in _map) {
          const elmMapping = _map[selector];
          if (!(elmMapping && elmMapping.props)) {
            continue;
          }
          code.push(`${selector}{${elmMapping.cssText}}`);
          totalRules += elmMapping.props.length;
          testedRules += elmMapping.props.filter(p => p.hit).length;
          for (let i = 0; i < elmMapping.props.length; i++) {
            const prop = elmMapping.props[i];
            lines[lastIdx + i + 2] = prop.hit || 0;
            stmtMaps[lastIdx + i + 2] = {
              start: {
                column: 1,
                line: lastIdx + i + 2
              },
              end: {
                column: 100,
                line: lastIdx + i + 2
              }
            };
            dbg(`lines ${lines}`);
          }
          lastIdx = elmMapping.props.length + 1;
        }
        dbg(
          `Code coverage (tested/total): ${testedRules}/${totalRules} (${(testedRules /
            totalRules) *
            100}%)`
        );
        result[`viewports/${m.__viewport__.width}x${m.__viewport__.height}`] = {
          path: cssPath,
          code,
          s: lines,
          statementMap: stmtMaps,
          l: lines,
          f: {},
          b: {}
        };
      });
      return result;
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
