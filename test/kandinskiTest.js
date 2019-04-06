var expect = require("chai").expect;
const kisk = require("../src/kandinski");
const sinon = require("sinon");

describe("kandinskijs", function () {
  it("should exist", function () {
    expect(kisk).to.be.not.null;
  });


  //
  //Properties declaration
  //
  context("module properties", function () {
    it("should have browser property", function () {
      const browser = "browser";
      expect(kisk).to.have.property(browser);
    });
    it("should have page property", function () {
      const page = "page";
      expect(kisk).to.have.property(page);
    });
    it("should have url property", function () {
      const url = "url";
      expect(kisk).to.have.property(url);
    });
    it("should have cssPath property", function () {
      const cssPath = "cssPath";
      expect(kisk).to.have.property(cssPath);
    });
  });


  //
  //Methods declaration
  //
  context("module methods", function () {
    it("should have init method", function () {
      const init = "init";
      expect(kisk).to.have.ownProperty(init);
      expect(kisk.init).to.be.a("function");
    });
    it("should have destroy method", function () {
      const destroy = "destroy";
      expect(kisk).to.have.ownProperty(destroy);
      expect(kisk.destroy).to.be.a("function");
    });
    it("should have getPage method", function () {
      const getPage = "getPage";
      expect(kisk).to.have.ownProperty(getPage);
      expect(kisk.getPage).to.be.a("function");
    });
    it("should have getInnerText method", function () {
      const getInnerText = "getInnerText";
      expect(kisk).to.have.ownProperty(getInnerText);
      expect(kisk.getInnerText).to.be.a("function");
    });
    it("should have getCSSProperty method", function () {
      const getCSSProperty = "getCSSProperty";
      expect(kisk).to.have.ownProperty(getCSSProperty);
      expect(kisk.getCSSProperty).to.be.a("function");
    });
    it("should have getPctCSSProperty method", function () {
      const getCSSProperty = "getPctCSSProperty";
      expect(kisk).to.have.ownProperty(getCSSProperty);
      expect(kisk.getCSSProperty).to.be.a("function");
    });
  });


  //
  //Helpers declaration
  //
  context("module helpers", function () {
    it("should have cssHelper", function () {
      const cssHelper = "cssHelper";
      expect(kisk).to.have.property(cssHelper);
    });
  });


  //
  //init()
  //
  context("init()", function () {
    afterEach(function () {
      kisk.destroy();
    });
    it("should initialize browser", function (done) {
      kisk.init("http://website.com", "path/file.css").then(function () {
        expect(kisk.browser).not.to.be.undefined;
        done();
      });
    });
    it("should initialize cssPath", function (done) {
      kisk.init("http://website.com", "path/file.css").then(function () {
        expect(kisk.cssPath).not.to.be.undefined;
        expect(kisk.cssPath).equal("path/file.css");
        done();
      });
    });
    it("should initialize cssPath if cssPath parameter is null", function (done) {
      kisk.init("http://website.com", null).then(function () {
        expect(kisk.cssPath).to.be.null;
        done();
      });
    });
    it("should initialize url", function (done) {
      kisk.init("http://website.com", "path/file.css").then(function () {
        expect(kisk.url).not.to.be.undefined;
        expect(kisk.url).equal("http://website.com");
        done();
      });
    });
    it("should throw error if url is null", function (done) {
      kisk.init(null, "path/file.css").catch(function (error) {
        expect(error).to.be.not.undefined;
        done();
      });
    });
  });



  //
  //getPage()
  //
  context("getPage", function () {
    afterEach(function () {
      kisk.destroy();
    });

    it("should throw error because kisk has not been initialized", function (done) {
      reset(kisk);
      kisk.getPage({}).catch(function (error) {
        expect(error).to.be.not.undefined;
        expect(error.message).to.be.equal("browser is not initialized");
        done();
      });
    });

    it("should throw error because viewport has not been passed", function (done) {
      kisk.init("http://website.com").then(function () {
        kisk.getPage().catch(function (error) {
          expect(error).to.be.not.undefined;
          expect(error.message).to.be.equal("viewport has not been defined");
          done();
        });
      });
    });

    it("should throw error because viewport.width has not been defined", function (done) {
      const viewport = {};
      kisk.init("http://website.com").then(function () {
        kisk.getPage(viewport).catch(function (error) {
          expect(error).to.be.not.undefined;
          expect(error.message).to.be.equal("viewport.width has not been defined");
          done();
        });
      });
    });

    it("should throw error because viewport.height has not been defined", function (done) {
      const viewport = { width: 320 };
      kisk.init("http://website.com").then(function () {
        kisk.getPage(viewport).catch(function (error) {
          expect(error).to.be.not.undefined;
          expect(error.message).to.be.equal("viewport.height has not been defined");
          done();
        });
      });
    });
  });
});

const reset = function (kisk) {
  kisk.browser = undefined;
  kisk.page = undefined;
  kisk.url = undefined;
  kisk.cssPath = undefined;
  kisk.parentBoxModel = undefined;
}
