const assert = require('chai').assert;
const path = require('path');
let UnsafeCell = require(path.resolve('src/models/unsafeCell.js'));

describe('UnsafeCell', () => {
  let unsafeCell = {};
  class Coin {
    constructor(id) {
      this.id = id;
      this.died = false;
      this.position;
    }
    die(){
      this.died = true;
    }
    isDead(){
      return this.died;
    }
    setPosition(position){
      this.position = position;
    }
  }
  let coin = {}
  beforeEach(()=>{
    unsafeCell = new UnsafeCell(1);
    coin = new Coin(1);
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
      unsafeCell.addCoin(coin);
      assert.deepEqual(unsafeCell.coins[0], coin);
      let coin2 = new Coin(2);
      unsafeCell.addCoin(coin2);
      assert.deepEqual(unsafeCell.coins[0],coin2);
      assert.isOk(coin.isDead());
    });
  });
});
