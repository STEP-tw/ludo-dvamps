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
    let secondCoin,thirdCoin;
    beforeEach(()=>{
      secondCoin =new Coin(2,-2);
      thirdCoin =new Coin(2,-2);
      secondCoin.setColor('red');
      thirdCoin.setColor('red');
    })
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
      unsafeCell.addCoin(coin);
      unsafeCell.addCoin(secondCoin);
      assert.isNotOk(unsafeCell.canPlace(thirdCoin,false));
    });
    it('should return false for paired coin to be placed if single coin of same color is there',()=>{
      unsafeCell.addCoin(coin);
      assert.isNotOk(unsafeCell.canPlace(secondCoin,true));
    });
    it('should return true for paired coin to be placed if single coin of different color is there',()=>{
      let green1 = new Coin(4,-4);
      green1.setColor('green');
      unsafeCell.addCoin(green1);
      assert.isOk(unsafeCell.canPlace(secondCoin,true));
    });
    it('should return true for paired coin to be placed if paired Coin of different color is there',()=>{
      let green1 = new Coin(4,-4);
      green1.setColor('green');
      unsafeCell.addCoin(secondCoin);
      unsafeCell.addCoin(thirdCoin);
      assert.isOk(unsafeCell.canPlace(green1,true));
    });
    it('should return false for paired coin to be placed if paired Coin of same color is there',()=>{
      unsafeCell.addCoin(secondCoin);
      unsafeCell.addCoin(thirdCoin);
      assert.isNotOk(unsafeCell.canPlace(coin,true));
    });
  });
  describe('#canPassOver',()=>{
    it('should return true when there is no coin in cell',()=>{
      assert.isOk(unsafeCell.canPassOver(true));
      assert.isOk(unsafeCell.canPassOver(false));
    });
    it('should return true when there is only one coin in cell',()=>{
      unsafeCell.addCoin(coin);
      assert.isOk(unsafeCell.canPassOver(true));
      assert.isOk(unsafeCell.canPassOver(false));
    });
    it('should return true when there is two coin in cell and given coin is paired',()=>{
      unsafeCell.addCoin(coin);
      let coin2 = new Coin(2,-2);
      coin2.setColor('red');
      unsafeCell.addCoin(coin2);
      assert.isOk(unsafeCell.canPassOver(true));
      assert.isNotOk(unsafeCell.canPassOver(false));
    });
  });
});
