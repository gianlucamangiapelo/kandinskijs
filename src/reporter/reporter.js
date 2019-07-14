const fs = require("fs");
const istanbul = require("istanbul");
const debug = require("debug");
const dbg = debug("kandinskijs:reporter");
const FALLBACK_MAPPINGS = { "*": {} };

module.exports = function(opts) {
  let _mappings = Object.assign({}, FALLBACK_MAPPINGS);
  const outDir = (opts || {}).outDir || "__logs__/";
  const singleDir = (opts || {}).singleDir || false;
  const getMappingFilePath = function(dir) {
    const _outDir = dir || outDir;
    dbg(`_outDir ${_outDir}`);
    return `${_outDir}log_mappings.json`;
  };
  const loadMappings = function(dir) {
    const mappingFilePath = getMappingFilePath(dir);
    if (!fs.existsSync(mappingFilePath)) {
      dbg(`mappings file not found: ${mappingFilePath}`);
      return FALLBACK_MAPPINGS;
    }
    return JSON.parse(fs.readFileSync(mappingFilePath, "utf8"));
  };
  const getSubDirectories = function(source) {
    if (singleDir) {
      return [""];
    }
    return fs.readdirSync(source);
  };

  return {
    writeMappings: function(mappings) {
      fs.writeFileSync(
        getMappingFilePath(),
        JSON.stringify(mappings || FALLBACK_MAPPINGS, null, 2)
      );
    },
    generateCoverageObject: function(dir) {
      const _mappings = loadMappings(dir);
      const { cssPath, maps } = _mappings;
      const result = {};
      const code = fs.readFileSync(cssPath, "utf8");
      const lines = {};
      const stmtMaps = {};
      maps.forEach(m => {
        for (const rule in m) {
          if (rule === "__viewport__") {
            continue;
          }
          _map = m[rule];
          for (const selector in _map) {
            const elmMapping = _map[selector];
            if (!(elmMapping && elmMapping.props)) {
              continue;
            }
            const propsLength = elmMapping.props.length;
            for (let i = propsLength - 1; i >= 0; i--) {
              const prop = elmMapping.props[i];
              lines[prop.range.startLine + 1] =
                lines[prop.range.startLine + 1] || 0;
              lines[prop.range.startLine + 1] += prop.hit || 0;
              stmtMaps[prop.range.startLine + 1] = {
                start: {
                  column: prop.range.startColumn,
                  line: prop.range.startLine + 1
                },
                end: {
                  column: prop.range.endColumn,
                  line: prop.range.endLine + 1
                }
              };
            }
          }
        }
      });
      result[cssPath] = {
        path: cssPath,
        code,
        s: lines,
        statementMap: stmtMaps,
        l: lines,
        f: {},
        b: {}
      };
      return result;
    },
    writeReport: function(reportDoneCallback) {
      var subDirs = getSubDirectories(outDir);

      for (let i = 0; i < subDirs.length; i++) {

        const _outDir = `${outDir}${subDirs[i]}/`;
        const report = istanbul.Report.create("lcov", {
          dir: `./${_outDir}`
        });
        const Collector = istanbul.Collector;
        const collector = new Collector();
        collector.add(this.generateCoverageObject(_outDir));
        report.on("done", function() {
          if (reportDoneCallback) {
            reportDoneCallback();
          }
        });
        report.writeReport(collector);
      }
    }
  };
};
