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
    coin.setColor('red');
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

    it('should remove existing coin of different color if new coin comes', () => {
      unsafeCell.addCoin(coin);
      assert.deepEqual(unsafeCell.coins[0], coin);
      let coin2 = new Coin(2);
      coin2.setColor('blue');
      unsafeCell.addCoin(coin2);
      assert.deepEqual(unsafeCell.coins[0],coin2);
    });
    it('should give status of what happened when a coin is added', () => {
      let status = unsafeCell.addCoin(coin);
      assert.isNotOk(status.killedOppCoin);
      let coin2 = new Coin(2);
      coin2.setColor('blue');
      status = unsafeCell.addCoin(coin2);
      assert.isOk(status.killedOppCoin);
      assert.deepEqual(status.diedCoin,coin.getStatus());
    });
    it('should give status of how many coins with their color', () => {
      let status = unsafeCell.addCoin(coin);
      assert.isNotOk(status.killedOppCoin);
      let coin2 = new Coin(2);
      coin2.setColor('red');
      status = unsafeCell.addCoin(coin2);
      assert.isNotOk(status.killedOppCoin);
      assert.equal(status.red,2);
    });
  });

  describe('#hasCoinOfSameColor', () => {
    it('should return true if there is a coin of same color in the cell',()=>{
      let secondCoin =new Coin(2,-2);
      secondCoin.setColor('red');
      unsafeCell.addCoin(coin);
      assert.isOk(unsafeCell.canPlace(secondCoin));
    });
    it('should return false if there is a coin of other color in the cell',()=>{
      let secondCoin =new Coin(2,-2);
      secondCoin.setColor('yellow');
      unsafeCell.addCoin(coin);
      assert.isOk(unsafeCell.canPlace(secondCoin));
    });
  });

  describe('#canPlace', () => {
    it('should return true if there is a coin of same color in the cell',()=>{
      let secondCoin =new Coin(2,-2);
      secondCoin.setColor('red');
      unsafeCell.addCoin(coin);
      assert.isOk(unsafeCell.canPlace(secondCoin));
    });
    it('should return true if there is no coin in the cell',()=>{
      let secondCoin =new Coin(2,-2);
      unsafeCell.addCoin(coin);
      assert.isOk(unsafeCell.canPlace(secondCoin));
    });
    it('should return false if there are 2 coins of same color in the cell',()=>{
      let secondCoin =new Coin(2,-2);
      let thirdCoin =new Coin(2,-2);
      secondCoin.setColor('red');
      thirdCoin.setColor('red');
      unsafeCell.addCoin(coin);
      unsafeCell.addCoin(secondCoin);
      assert.isNotOk(unsafeCell.canPlace(thirdCoin));
    });
  });
});
