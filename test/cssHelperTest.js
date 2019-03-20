var expect = require("chai").expect;
var assert = require("chai").assert;
const cssHelper = require("../src/cssHelper");

describe("cssHelper", function () {
  it("should exist", function () {
    expect(cssHelper).to.be.not.null;
  });


  //
  //rgbToHex function
  //
  context("rgbToHex", function () {
    it("should return hex value converting 3 digits rgb", function () {
      const rgbString = "rgb(255, 255, 255)";
      let hex = cssHelper.rgbToHex(rgbString);
      expect(hex).to.be.equals("#ffffff");
    });
    it("should return hex value converting 2 digits rgb", function () {
      const rgbString = "rgb(25, 25, 25)";
      let hex = cssHelper.rgbToHex(rgbString);
      expect(hex).to.be.equals("#191919");
    });
    it("should return hex value converting 1 digits rgb", function () {
      const rgbString = "rgb(5, 5, 5)";
      let hex = cssHelper.rgbToHex(rgbString);
      expect(hex).to.be.equals("#050505");
    });
    it("should throw error if rgb parameter is not a string", function () {
      const rgbString = 1;
      assert.throws(() => cssHelper.rgbToHex(rgbString), Error, "rgbString is not a string");
    });
    it("should return empty hex value if rgb is not well formatted", function () {
      const rgbString = "fake(5, 5, 5)";
      let hex = cssHelper.rgbToHex(rgbString);
      expect(hex).to.be.equals("#");
    });
  });

});
