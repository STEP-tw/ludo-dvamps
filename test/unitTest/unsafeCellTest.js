const assert = require('chai').assert;
const path = require('path');
let UnsafeCell = require(path.resolve('src/models/unsafeCell.js'));
const Coin = require(path.resolve('src/models/coin.js'));
describe('UnsafeCell', () => {
  let unsafeCell = {};
  let coin = {}
  beforeEach(()=>{
    unsafeCell = new UnsafeCell(1);
    coin = new Coin(1,-1);
  })
  describe('#removeCoin', () => {
    it('should remove coin from cell and return it ', () => {
      unsafeCell.addCoin(coin);
      assert.deepEqual(unsafeCell.removeCoin(1), coin);
    });
  });
  describe('#addCoin', () => {
    it('should add coin in cell', () => {
      unsafeCell.addCoin(coin);
      assert.deepEqual(unsafeCell.coins[0], coin);
    });
    it('should remove existing coin if new coin comes', () => {
      let death = {status:false};
      coin.on('died',()=>death.status=true);
      unsafeCell.addCoin(coin);
      assert.deepEqual(unsafeCell.coins[0], coin);
      let coin2 = new Coin(2);
      unsafeCell.addCoin(coin2);
      assert.deepEqual(unsafeCell.coins[0],coin2);
      assert.isOk(death.status);
    });
    it('should give status of what happened when a coin is added', () => {
      let status = unsafeCell.addCoin(coin);
      assert.isNotOk(status.killedOppCoin);
      let coin2 = new Coin(2);
      status = unsafeCell.addCoin(coin2);
      assert.isOk(status.killedOppCoin);
      assert.deepEqual(status.diedCoin,coin.getStatus());
    });
  });
});
