module.exports = {
  hexToRgb: function (hex) {
    const hs = hex[0] === '#' ? hex.slice(1) : hex;
    return [
      parseInt(hs[0] + hs[1], 16),
      parseInt(hs[2] + hs[3], 16),
      parseInt(hs[4] + hs[5], 16)
    ];
  },
  rgbToHex: function (rgbString) {
    let rgbArray = rgbStringToArray(rgbString);
    return rgbArray.reduce((hex, c) => hex + padHex(c.toString(16)), '#');
  }
};

const rgbStringToArray = function (rgbString) {
  if (typeof (rgbString) != "string") {
    throw new Error("rgbString is not a string");
  }

  let rgbArray = [];
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
}

const padHex = hexStr => hexStr.length === 1 ? `0${hexStr}` : hexStr;