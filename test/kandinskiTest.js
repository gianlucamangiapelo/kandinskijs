var expect = require("chai").expect;
const kisk = require("../src/kandinski");

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
  //Method declaration
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
});
