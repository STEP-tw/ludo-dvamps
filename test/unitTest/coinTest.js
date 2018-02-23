const Coin = require('../../src/models/coin.js');
const assert = require('chai').assert;
describe('#Coin', () => {
  describe('#getPosition', () => {
    it('should return position of coin', () => {
      let coin = new Coin(1,-1);
      assert.equal(coin.getPosition(),-1);
    });
  });
  describe('#setPosition', () => {
    it('should should set coin position to given position', () => {
      let coin = new Coin(1,-1);
      coin.setPosition(10);
      assert.equal(coin.getPosition(),10);
    });
  });
});
