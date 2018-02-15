const assert = require('chai').assert;
const utility = require('../../src/lib/utility.js');
describe('#utility', () => {
  describe('toS()', () => {
    it('should convert and return given value into string', () => {
      assert.equal(utility.toS(1),'1');
      assert.equal(utility.toS({}),'{}');
      assert.equal(utility.toS("hi"),'"hi"');
    });
  });
});
