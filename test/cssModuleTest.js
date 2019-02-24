var expect = require('chai').expect;
const pup = require('../src/pupPlugin');

describe('h2 css test', function () {
	let page;

	const url = 'http://localhost:4000';
	const cssPath = 'css/base.css';

	before(async function () {
		await pup.init(url, cssPath);
	});

	after(async function () {
		await pup.browser.close();
	});

	context("mobile viewport", function () {
		before(async function () {
			this.timeout(1000000);
			page = await pup.getPage({ width: 320, height: 1 });
		});
		after(async function () {
			await page.close();
		});

	});

	context("tablet viewport", function () {
		before(async function () {
			this.timeout(1000000);
			page = await pup.getPage({ width: 768, height: 1 });
		});
		after(async function () {
			await page.close();
		});

		it('h2 should have a display: flex', async function () {
			let display;

			display = await page.evaluate(() => {
				const h1 = document.querySelector("h2");
				const color = JSON.parse(JSON.stringify(getComputedStyle(h1).display));
				return color;
			});


			expect(display).to.eql('flex');
		});
	});

	context("desktop viewport", function () {
		before(async function () {
			this.timeout(1000000);
			page = await pup.getPage({ width: 1024, height: 1 });
			//await page.screenshot({ path: 'page.png' })
		});
		after(async function () {
			await page.close();
		});

		it('h2 should have a display: block', async function () {
			let display;

			display = await page.evaluate(() => {
				const h1 = document.querySelector("h2");
				const color = JSON.parse(JSON.stringify(getComputedStyle(h1).display));
				return color;
			});


			expect(display).to.eql('block');
		});

		it('should have a heading color', async function () {
			let color;

			color = await page.evaluate(() => {
				const h1 = document.querySelector("h2");
				const color = JSON.parse(JSON.stringify(getComputedStyle(h1).color));
				return color;
			});


			expect(color).to.eql('rgb(255, 255, 255)');
		});

		it('should have a margin-top: 20px', async function () {
			let margin;

			margin = await page.evaluate((rgb2hex) => {
				const h1 = document.querySelector("h2");
				const margin = JSON.parse(JSON.stringify(getComputedStyle(h1).marginTop));
				return margin;
			});


			expect(margin).to.eql('20px');
		});

		it('should have a margin-bottom: 15%', async function () {
			let margin;

			margin = await page.evaluate((rgb2hex) => {
				const h1 = document.querySelector("h2");
				const margin = JSON.parse(JSON.stringify(getComputedStyle(h1).marginBottom));
				return margin;
			});


			expect(margin).to.eql('15%');
		});

		it('should have a font-size: 64px', async function () {
			let font_size;

			font_size = await page.evaluate((rgb2hex) => {
				const h1 = document.querySelector("h2");
				const style = JSON.parse(JSON.stringify(getComputedStyle(h1).fontSize));
				return style;
			});


			expect(font_size).to.eql('64px');
		});
		it('should have a heading', async function () {
			const HEADING_SELECTOR = 'h2';
			let heading;

			await page.waitFor(HEADING_SELECTOR);
			heading = await page.$eval(HEADING_SELECTOR, heading => heading.innerText);

			expect(heading).to.eql('Schedule');
		});
	});

});