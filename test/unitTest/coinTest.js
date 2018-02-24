const path = require('path');
const Coin = require(path.resolve('src/models/coin.js'));
const assert = require('chai').assert;
describe('#Coin', () => {
  let coin = {};
  beforeEach(()=>{
    coin = new Coin(1,-1);
  })
  describe('#getPosition', () => {
    it('should return position of coin', () => {
      assert.equal(coin.getPosition(),-1);
    });
  });
  describe('#setPosition', () => {
    it('should should set coin position to given position', () => {
      coin.setPosition(10);
      assert.equal(coin.getPosition(),10);
    });
  });
  describe('#die', () => {
    it('should fire a died event', () => {
      let person = {};
      coin.on('died',()=>person.firedEvent='died');
      assert.isUndefined(person.fired);
      coin.die();
      assert.equal(person.firedEvent,'died');
    });
  });
});
