module.exports = {
	hexToRgb: function (hex) {
		const hs = hex[0] === '#' ? hex.slice(1) : hex;
		return [
			parseInt(hs[0] + hs[1], 16),
			parseInt(hs[2] + hs[3], 16),
			parseInt(hs[4] + hs[5], 16)
		];
	},
	rgbToHex: function (rgb) {
		rgb.reduce((hex, c) => hex + padHex(c.toString(16)), '#');
	}
};