const fs = require("fs");
const kjsReporter = require("./reporter");
const debug = require("debug");
const dbg = debug("kandinskijs:collector");
const path = require("path");
const toAlias = function(prop) {
  return (prop.indexOf("-") > -1 ? prop.replace("-", "") : prop).toLowerCase();
};
module.exports = function(suite) {
  let outDir = "__logs__/";
  if (suite && suite.test) {
    const cwd = path.normalize(process.cwd());
    const suiteFile = path.parse(suite.test.file);
    outDir = `${outDir}${suiteFile.name}/`;
    if (!fs.statSync(`${outDir}`)) {
      fs.mkdirSync(`${outDir}`);
    }
  }
  const reporter = new kjsReporter({ outDir });
  const _collector = {
    mappings: undefined,
    cssPath: undefined,
    init: async function(page, viewport) {
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
      const mappings = {};
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
      fs.writeFileSync(
        `${outDir}log_full_${viewport.width}_${viewport.height}.json`,
        result
      );
      this.mappings = mappings;
      fs.writeFileSync(
        `${outDir}log_${viewport.width}_${viewport.height}.json`,
        JSON.stringify(mappings, null, 2)
      );
    },
    destroy: function() {
      reporter.writeMappings(this.mappings);
    },

    collect: function(viewport, element, property) {
      const allMappings = this.mappings["*"];
      const elmMapping = allMappings[element];
      if (!elmMapping) {
        dbg(element, "not found");
        return;
      }
      const propMapping = elmMapping.props.find(
        p => toAlias(p.name) === toAlias(property)
      );
      if (!propMapping) {
        dbg(property, "not found");
        return;
      }
      propMapping.hit = propMapping.hit || 0;
      propMapping.hit++;
    }
  };
  return _collector;
};
