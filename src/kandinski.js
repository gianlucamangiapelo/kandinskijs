const puppeteer = require("puppeteer");
const cssHelper = require("./cssHelper");

module.exports = {
  browser: undefined,
  page: undefined,
  url: undefined,
  cssPath: undefined,
  parentBoxModel: undefined,
  cssHelper: cssHelper,
  init: async function (url, cssPath) {
    this.browser = await initBrowser();
    this.cssPath = cssPath;
    if (!url) {
      throw new Error("url is undefined");
    }
    this.url = url;
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
    if (this.cssPath) {
      await page.addStyleTag({
        path: this.cssPath
      });
    }

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

    this.parentBoxModel = await getParentNode(_page, querySelector);

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


async function initBrowser() {
  const browser = await puppeteer.launch();
  return browser;
}

async function getParentNode(page, querySelector) {
  const selector = await page.$(querySelector);
  const parent = await page.evaluateHandle(el => el.parentElement, selector);
  return await parent.boxModel();
};
