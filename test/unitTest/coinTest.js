const Coin = require('../../src/models/coin.js');
const assert = require('chai').assert;
describe('#Coin', () => {
  describe('#getPosition', () => {
    it('should return position of coin', () => {
      let coin = new Coin(1);
      assert.equal(coin.getPosition(),"home");
    });
  });
});
