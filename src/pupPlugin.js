const puppeteer = require("puppeteer");

async function initBrowser() {
	const browser = await puppeteer.launch();
	return browser;
}

async function getPage(viewport) {
	let page = await this.browser.newPage();
	await page.setViewport(viewport);
	await page.goto(this.url);
	await page.addStyleTag({
		path: this.cssPath
	});
	await page.waitFor(100);
	return page;
}

module.exports = {
	browser: undefined,
	url: undefined,
	cssPath: undefined,
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
	getPage: getPage,
	getInnerText: async function (page, querySelector) {
		await page.waitFor(querySelector);
		return await page.$eval(querySelector, element => element.innerText);
	},
	getCSSProperty: async function (page, querySelector, property) {
		if (!page) {
			throw new Error("page is undefined");
		}

		return await page.evaluate((querySelector, property) => {
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
