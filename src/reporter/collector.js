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
    page: undefined,
    storeCache: {},
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
      this.page = page;
    },
    stopCollect: function() {
      if (reporter) {
        reporter.writeMappings(this.mappings);
      }
    },
    store: async function(viewport, querySelector) {
      if (this.storeCache[querySelector]) {
        return;
      }
      const doc = await this.page._client.send("DOM.getDocument");
      const element = await this.page._client.send("DOM.querySelector", {
        nodeId: doc.root.nodeId,
        selector: querySelector
      });
      const style = await this.page._client.send(
        "CSS.getMatchedStylesForNode",
        {
          nodeId: element.nodeId
        }
      );
      this.storeCache[querySelector] = 1;
      const mappings = {
        __viewport__: viewport
      };
      const matchedRules = style.matchedCSSRules;
      const regularRules = matchedRules.filter(
        r => r.rule.origin !== "user-agent"
      );
      const regularRulesLength = regularRules.length;
      for (let i = regularRulesLength - 1; i >= 0; i--) {
        const r = regularRules[i];
        const selector = r.rule.selectorList.text;
        const media = r.rule.media || [];
        if (!media.length) {
          media.push({
            text: "*"
          });
        }
        const map = mappings[media[0].text] || {};
        map[selector] = map[selector] || {
          cssText: r.rule.style.cssText,
          props: []
        };
        const cssPropertiesLength = r.rule.style.cssProperties.length;
        for (let j = cssPropertiesLength - 1; j >= 0; j--) {
          const prop = r.rule.style.cssProperties[j];
          if (!prop.range) {
            continue;
          }
          map[selector].props.push({
            name: prop.name,
            value: prop.value,
            text: prop.text,
            alias: toAlias(prop.name),
            range: prop.range
          });
        }
        mappings[media[0].text] = map;
      }
      this.mappings.maps.push(mappings);
    },
    collect: function(viewport, querySelector, property) {
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
        if (rule === "__viewport__") { //to-do: || rule === "*"
          continue;
        }
        const _map = mappingByViewport[rule];
        const elmMapping = _map[querySelector];
        if (!elmMapping) {
          dbg(`${rule} > ${querySelector} not found`);
          continue;
        }
        const propMappings = elmMapping.props.filter(
          p => toAlias(p.name) === toAlias(property)
        );
        if (!propMappings.length) {
          dbg(`${rule} > ${querySelector} > ${property} not found`);
          continue;
        }
        propMappings.forEach(p => {
          p.hit = p.hit || 0;
          p.hit++;
        });
      }
    }
  };
  return _collector;
};
