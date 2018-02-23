const assert = require('chai').assert;
const path = require('path');
let UnsafeCell = require(path.resolve('src/models/unsafeCell.js'));
describe('UnsafeCell', () => {
  describe('#removeCoin', () => {
    it('should remove coin from cell and return it ', () => {
      let unsafeCell = new UnsafeCell(1);
      let firstCoin = {id:1,setPosition:(pos)=>this.position=pos};
      let secondCoin = {id:2,setPosition:(pos)=>this.position=pos};
      unsafeCell.addCoin(firstCoin);
      unsafeCell.addCoin(secondCoin);
      assert.deepEqual(unsafeCell.removeCoin(1), firstCoin);
      assert.include(unsafeCell.coins, secondCoin);
    });
  });
  });
