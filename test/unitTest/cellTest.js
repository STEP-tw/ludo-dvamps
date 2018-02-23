const assert = require('chai').assert;
const path = require('path');
let Cell = require(path.resolve('src/models/cell.js'));

describe('Cell', () => {
  describe('#addCoin', () => {
    it('should add coin into cell ', () => {
      let cell = new Cell(1);
      let coin = {id:1,setPosition:(pos)=>this.position=pos};
      cell.addCoin(coin);
      assert.include(cell.coins,coin);
    });
  });
  describe('#getPosition', () => {
    it('should give position of cell ', () => {
      let cell = new Cell(2);
      assert.equal(cell.getPosition(),2);
    });
  });
});
