const puppeteer = require("puppeteer");
const cssHelper = require("./cssHelper");

async function initBrowser() {
  const browser = await puppeteer.launch();
  return browser;
}

module.exports = {
  browser: undefined,
  page: undefined,
  url: undefined,
  cssPath: undefined,
  cssHelper: cssHelper,
  init: async function (url, cssPath) {
    this.browser = await initBrowser();
    this.url = url;
    this.cssPath = cssPath;
  },
  destroy: async function () {
    if (!this.browser) {
      return;
    }
    this.browser.close();
  },
  getPage: async function getPage(viewport) {
    const page = await this.browser.newPage();
    await page.setViewport(viewport);
    await page.goto(this.url);
    await page.addStyleTag({
      path: this.cssPath
    });
    await page.waitFor(100);
    this.page = page;
  },
  getInnerText: async function (querySelector) {
    const _page = this.page;
    if (!_page) {
      throw new Error("page is undefined");
    }
    await _page.waitFor(querySelector);
    return await _page.$eval(querySelector, element => element.innerText);
  },
  getCSSProperty: async function (querySelector, property) {
    const _page = this.page;
    if (!_page) {
      throw new Error("page is undefined");
    }
    return await _page.evaluate((querySelector, property) => {
      const element = document.querySelector(querySelector);
      if (!element) {
        throw new Error(
          "Element with querySelector " + querySelector + " not found"
        );
      }
      return JSON.parse(JSON.stringify(getComputedStyle(element)[property]));
    }, querySelector, property);
  }
};
