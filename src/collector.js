const fs = require("fs");
const kjsReporter = require("./reporter");
const debug = require("debug");
const dbg = debug("kandinskijs:collector");
const path = require("path");
const toAlias = function(prop) {
  return (prop.indexOf("-") > -1 ? prop.replace("-", "") : prop).toLowerCase();
};
module.exports = function(opts) {
  let outDir = "__logs__/";
  let reporter = undefined;
  const _collector = {
    mappings: { cssPath: undefined, maps: [] },
    suite: undefined,
    cssPath: undefined,
    viewport: undefined,
    startCollect: async function(opts) {
      const { suite, cssPath, page, viewport } = opts;
      outDir = "__logs__/";
      this.mappings.cssPath = cssPath;
      if (suite && suite.test) {
        const cwd = path.normalize(process.cwd());
        const suiteFile = path.parse(suite.test.file);
        outDir = `${outDir}${suiteFile.name}/`;
        if (!fs.existsSync(`${outDir}`)) {
          fs.mkdirSync(`${outDir}`);
        }
      }
      reporter = new kjsReporter({ outDir });
      await page._client.send("DOM.enable");
      await page._client.send("CSS.enable");
      const doc = await page._client.send("DOM.getFlattenedDocument");
      const nodes = doc.nodes;
      const stylesForNodes = [];
      for (n in nodes) {
        const node = nodes[n];
        if (!(node.nodeType === 1)) {
          continue;
        }
        stylesForNodes.push(
          await page._client.send("CSS.getMatchedStylesForNode", {
            nodeId: node.nodeId
          })
        );
      }
      const mappings = {
        __viewport__: viewport
      };
      for (style of stylesForNodes) {
        const matchedRules = style.matchedCSSRules;
        const regularRules = matchedRules.filter(
          r => r.rule.origin !== "user-agent"
        );
        regularRules.forEach(r => {
          const selector = r.rule.selectorList.text;
          const media = r.rule.media || [];
          if (!media.length) {
            media.push({
              text: "*"
            });
          }
          mappings[media[0].text] = mappings[media[0].text] || {};
          mappings[media[0].text][selector] = mappings[media[0].text][
            selector
          ] || {
            cssText: r.rule.style.cssText,
            props: []
          };
          r.rule.style.cssProperties.forEach(prop => {
            mappings[media[0].text][selector].props.push({
              name: prop.name,
              value: prop.value,
              text: prop.text,
              alias: toAlias(prop.name)
            });
          });
        });
      }
      var result = JSON.stringify(stylesForNodes, null, 2);

      /* uncomment those line to see output from mapping and from page */
      // fs.writeFileSync(
      //   `${outDir}log_full_${viewport.width}_${viewport.height}.json`,
      //   result
      // );
      // fs.writeFileSync(
      //   `${outDir}log_${viewport.width}_${viewport.height}.json`,
      //   JSON.stringify(mappings, null, 2)
      // );

      this.mappings.maps.push(mappings);
    },
    stopCollect: function() {
      reporter.writeMappings(this.mappings);
    },

    collect: function(viewport, element, property) {
      const mappingByViewport = this.mappings.maps.find(
        m =>
          m.__viewport__.width === viewport.width &&
          m.__viewport__.height === viewport.height
      );
      if (!mappingByViewport) {
        dbg(`mapping not found for ${viewport}`);
        return;
      }
      for (const rule in mappingByViewport) {
        if (rule === "__viewport__") {
          continue;
        }
        const _map = mappingByViewport[rule];
        const elmMapping = _map[element];
        if (!elmMapping) {
          dbg(`${rule} > ${element} not found`);
          continue;
        }
        const propMapping = elmMapping.props.find(
          p => toAlias(p.name) === toAlias(property)
        );
        if (!propMapping) {
          dbg(`${rule} > ${element} > ${property} not found`);
          continue;
        }
        propMapping.hit = propMapping.hit || 0;
        propMapping.hit++;
      }
    }
  };
  return _collector;
};
