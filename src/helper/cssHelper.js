const debug = require("debug");
const dbg = debug("kandinskijs:cssHelper");
module.exports = {
  hexToRgb: function(hex) {
    const hs = hex[0] === "#" ? hex.slice(1) : hex;
    return [
      parseInt(hs[0] + hs[1], 16),
      parseInt(hs[2] + hs[3], 16),
      parseInt(hs[4] + hs[5], 16)
    ];
  },
  rgbToHex: function(rgbString) {
    const rgbArray = rgbStringToArray(rgbString);
    return rgbArray.reduce((hex, c) => hex + padHex(c.toString(16)), "#");
  },
  pxToPerc: function(pxSelector, pxParent) {
    if (!pxParent) {
      return -Infinity;
    }
    const intPxSelector = parsePx(pxSelector);
    if (isNaN(intPxSelector)) {
      return -Infinity;
    }
    return Math.ceil(parseFloat(intPxSelector / pxParent) * 100)
      .toString()
      .concat("%");
  }
};

const parsePx = function(pxString) {
  const regex = /[0-9]+/gm;
  return regex.exec(pxString)[0];
};

const rgbStringToArray = function(rgbString) {
  if (typeof rgbString != "string") {
    throw new Error("rgbString is not a string");
  }

  const rgbArray = [];
  let matches;
  const regex = /rgb\(([0-9]{1,3}),([0-9]{1,3}),([0-9]{1,3})\)/gm;

  rgbString = rgbString.replace(/\s+/g, "");

  while ((matches = regex.exec(rgbString)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (matches.index === regex.lastIndex) {
      regex.lastIndex++;
    }
    for (var i = 1; i < matches.length; i++) {
      rgbArray.push(parseInt(matches[i], 10));
    }
  }
  return rgbArray;
};

const padHex = hexStr => (hexStr.length === 1 ? `0${hexStr}` : hexStr);
