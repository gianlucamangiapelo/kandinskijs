const puppeteer = require('puppeteer');


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
	getPage: getPage,
	init: async function (url, cssPath) {
		this.browser = await initBrowser();
		this.url = url;
		this.cssPath = cssPath;
	}
};

