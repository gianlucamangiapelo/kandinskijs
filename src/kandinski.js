const puppeteer = require("puppeteer");
const cssHelper = require("./helper/cssHelper");
const kjsCollector = require("./reporter/collector");
const collector = new kjsCollector();
const debug = require("debug");
const dbg = debug("kandinskijs:main");
module.exports = {
  browser: undefined,
  page: undefined,
  url: undefined,
  cssPath: undefined,
  suite: undefined,
  parentBoxModel: undefined,
  viewport: undefined,
  cssHelper: cssHelper,
  collector: collector,
  init: async function(suite, url, cssPath) {
    this.browser = await initBrowser();
    this.cssPath = cssPath;
    this.suite = suite;
    if (!url) {
      throw new Error("url is undefined");
    }
    this.url = url;
  },
  destroy: async function() {
    if (this.collector) {
      this.collector.stopCollect();
    }
    if (!this.browser) {
      return;
    }
    this.browser.close();
  },
  closePage: async function() {
    if (!this.page) {
      dbg("this.page is undefined");
      return;
    }
    await this.page.close();
  },
  getPage: async function(viewport) {
    this.viewport = undefined;
    if (!this.browser) {
      throw new Error("browser is not initialized");
    }

    if (!viewport) {
      throw new Error("viewport has not been defined");
    }

    if (!viewport["width"]) {
      throw new Error("viewport.width has not been defined");
    }

    if (!viewport["height"]) {
      throw new Error("viewport.height has not been defined");
    }

    const page = await this.browser.newPage();
    page.on("console", msg => console.log("PAGE LOG:", msg.text));
    await page.exposeFunction("dbg", dbg);

    await page.setViewport(viewport);
    await page.goto(this.url);
    if (this.cssPath) {
      await page.addStyleTag({
        path: this.cssPath
      });
    }
    await this.collector.startCollect({
      suite: this.suite,
      cssPath: this.cssPath,
      page,
      viewport
    });
    this.viewport = viewport;
    this.page = page;
  },
  getInnerText: async function(querySelector) {
    const _page = this.page;
    if (!_page) {
      throw new Error("page is undefined");
    }
    await _page.waitFor(querySelector);
    return await _page.$eval(querySelector, element => element.innerText);
  },
  getCSSProperty: async function(querySelector, property) {
    const _page = this.page;
    if (!_page) {
      throw new Error("page is undefined");
    }
    this.parentBoxModel = await getParentNode(_page, querySelector);
    this.collector.collect(this.viewport, querySelector, property);

    return await _page.evaluate(
      (querySelector, property) => {
        const element = document.querySelector(querySelector);
        if (!element) {
          throw new Error(
            `Element with querySelector ${querySelector} not found`
          );
        }
        const style = getComputedStyle(element)[property];
        return JSON.parse(JSON.stringify(style));
      },
      querySelector,
      property
    );
  },
  getPctCSSProperty: async function(querySelector, property) {
    const _page = this.page;
    if (!_page) {
      throw new Error("page is undefined");
    }

    this.parentBoxModel = await getParentNode(_page, querySelector);
    this.collector.collect(this.viewport, querySelector, property);

    var propValue = await _page.evaluate(
      (querySelector, property) => {
        const element = document.querySelector(querySelector);
        if (!element) {
          throw new Error(
            `Element with querySelector ${querySelector} not found`
          );
        }
        const style = getComputedStyle(element)[property];
        return JSON.parse(JSON.stringify(style));
      },
      querySelector,
      property
    );

    return cssHelper.pxToPerc(propValue, this.parentBoxModel[property]);
  }
};

async function initBrowser() {
  const browser = await puppeteer.launch();
  return browser;
}

async function getParentNode(page, querySelector) {
  const selector = await page.$(querySelector);
  try {
    const parent = await page.evaluateHandle(el => el.parentElement, selector);
    return await parent.boxModel();
  } catch (error) {
    return undefined;
  }
}
