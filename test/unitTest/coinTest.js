const path = require('path');
const Coin = require(path.resolve('src/models/coin.js'));
const assert = require('chai').assert;
describe('#Coin', () => {
  let coin = {};
  beforeEach(()=>{
    coin = new Coin(1,-1);
    coin.setColor('red');
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
  describe('#getStatus',() => {
    it('should give coin id,position,homePosition and color of coin',function(){
      assert.deepEqual(coin.getStatus(),{id:1,color:'red',position:-1});
    });
  });
});
