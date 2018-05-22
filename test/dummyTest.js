var expect = require('chai').expect;

describe('dummyTest', function () {
	it('true test', function () {
		expect('abc').to.be.equal('abc');
	});
	it('false test', function () {
		expect(true).to.be.equal(false);
	});
});