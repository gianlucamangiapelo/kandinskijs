const fs = require("fs");
const debug = require("debug");
const dbg = debug("kandinskijs:collector");
module.exports = {
  mappings: undefined,
  cssPath: undefined,
  toAlias: function(prop) {
    return (prop.indexOf("-") > -1
      ? prop.replace("-", "")
      : prop
    ).toLowerCase();
  },
  destroy: function() {
    fs.writeFileSync(
      `__logs__/log_mappings.json`,
      JSON.stringify(this.mappings, null, 2)
    );
    this.generateLCov();
  },
  generateLCov: function() {
    let totalRules = 0;
    let testedRules = 0;
    const mappings = this.mappings["*"];
    for (const selector in mappings) {
      totalRules += mappings[selector].props.length;
      testedRules += mappings[selector].props.filter(p => p.hit).length;
    }
    dbg(
      "Code coverage (tested/total): " +
        testedRules +
        "/" +
        totalRules +
        " (" +
        (testedRules / totalRules) * 100 +
        "%)"
    );
    fs.writeFileSync(
      "__logs__/lcov.info",
      "TN:\r\nSF:" + this.cssPath + "\r\nend_of_record"
    );
  },
  collect: function(viewport, element, property) {
    const allMappings = this.mappings["*"];
    const elmMapping = allMappings[element];
    if (!elmMapping) {
      dbg(element, "not found");
      return;
    }
    const propMapping = elmMapping.props.find(
      p => this.toAlias(p.name) === this.toAlias(property)
    );
    dbg(property, propMapping);
    if (!propMapping) {
      dbg(property, "not found");
      return;
    }
    propMapping.hit = propMapping.hit || 0;
    propMapping.hit++;
  },
  init: async function(page, viewport, cssPath) {
    this.cssPath = cssPath;
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
            alias: this.toAlias(prop.name)
          });
        });
      });
    }
    var result = JSON.stringify(stylesForNodes, null, 2);
    fs.writeFileSync(
      `__logs__/log_full_${viewport.width}_${viewport.height}.json`,
      result
    );
    this.mappings = mappings;
    fs.writeFileSync(
      `__logs__/log_${viewport.width}_${viewport.height}.json`,
      JSON.stringify(mappings, null, 2)
    );
  }
};
