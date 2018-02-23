const path = require('path');
const Coin = require(path.resolve('src/models/coin.js'));
const assert = require('chai').assert;
const MockEventEmitter = require(path.resolve('test/mockEventEmitter.js'));
describe('#Coin', () => {
  let coin = {};
  let eventEmitter = {};
  beforeEach(()=>{
    eventEmitter = new MockEventEmitter();
    coin = new Coin(1,-1,eventEmitter);
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
      assert.isNotOk(eventEmitter.isFired('died'));
      coin.die();
      assert.isOk(eventEmitter.isFired('died'));
    });
  });
});
