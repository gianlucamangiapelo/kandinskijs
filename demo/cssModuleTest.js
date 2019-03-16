var expect = require("chai").expect;
const pup = require("../src/pupPlugin");

describe("h2 css test", function () {
	let page;

	const url = "http://localhost:4000";
	const cssPath = "demo/base.css";

	before(async function () {
		await pup.init(url, cssPath);
	});

	after(async function () {
		await pup.destroy();
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

		it("h2 should have a display: flex", async function () {
			const display = await pup.getCSSProperty(page, "h2", "display");

			expect(display).to.eql("flex");
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

		it("h2 should have a display: block", async function () {
			const display = await pup.getCSSProperty(page, "h2", "display");

			expect(display).to.eql("block");
		});

		it("should have a heading color", async function () {
			const color = await pup.getCSSProperty(page, "h2", "color");

			expect(color).to.eql("rgb(255, 255, 255)");
		});

		it("should have a margin-top: 20px", async function () {
			const marginTop = await pup.getCSSProperty(page, "h2", "marginTop");

			expect(marginTop).to.eql("20px");
		});


		it("should have a font-size: 64px", async function () {
			const fontSize = await pup.getCSSProperty(page, "h2", "fontSize");

			expect(fontSize).to.eql("64px");
		});
		it("should have a heading", async function () {
			const HEADING_SELECTOR = "h2";
			const headingText = await pup.getInnerText(page, HEADING_SELECTOR);
			expect(headingText).to.eql("Schedule");
		});
	});
});
