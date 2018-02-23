const assert = require('chai').assert;
const path = require('path');
let SafeCell = require(path.resolve('src/models/safeCell.js'));

describe('SafeCell', () => {
  describe('#removeCoin', () => {
    it('should remove coin from cell and return it ', () => {
      let safeCell = new SafeCell(1);
      let firstCoin = {id:1,setPosition:(pos)=>this.position=pos};
      let secondCoin = {id:2,setPosition:(pos)=>this.position=pos};
      safeCell.addCoin(firstCoin);
      safeCell.addCoin(secondCoin);
      assert.deepEqual(safeCell.removeCoin(1), firstCoin);
      assert.include(safeCell.coins, secondCoin);
    });
  });
});
