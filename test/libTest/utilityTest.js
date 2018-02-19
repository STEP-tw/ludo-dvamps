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
  describe('#getRandomNumBetween', () => {
    let randomNumber;
    before(()=>{
      randomNumber = utility.getRandomNumBetween(1,6)();
    })
    it('should return a number between 1 and 6', () => {
      assert.isAtLeast(randomNumber,1);
      assert.isAtMost(randomNumber,6);
    });
  });
});
