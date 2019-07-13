var expect = require("chai").expect;
const kisk = require("../src/kandinski");
const cssHelper = kisk.cssHelper;

describe("m-news-main", function() {
  const url = "https://www.deltatre.com";
  const cssPath = "demo-stress/localBase.css";

  before(async function() {
    await kisk.init(this, url, cssPath);
  });

  after(async function() {
    await kisk.destroy();
  });

  context("desktop viewport", function() {
    before(async function() {
      await kisk.getPage({ width: 1024, height: 2480 });
    });
    after(async function() {
      await kisk.closePage();
    });

    it("should have a display: flex", async function() {
      const display = await kisk.getCSSProperty(".m-news-main", "display");
      expect(display).to.eql("flex");
    });
  });
});
