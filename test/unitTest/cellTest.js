const assert = require('chai').assert;
const path = require('path');
let Cell = require(path.resolve('src/models/cell.js'));

describe('Cell', () => {
  describe('#addCoin', () => {
    let cell , redCoin ;
    beforeEach(function(){
      cell = new Cell(1);
      redCoin = {
        id: 1,
        setPosition: (pos) => this.position = pos,
        getColor: () =>'red'
      };
    });

    it('should add coin into cell ', () => {
      cell.addCoin(redCoin);
      assert.include(cell.coins, redCoin);
    });
    it('should give number of coins of one color coins in a cell ', () => {
      let status = cell.addCoin(redCoin);
      let expectedStatus={
        killedOppCoin:false,
        red:1
      }
      assert.include(cell.coins, redCoin);
      assert.deepEqual(status,expectedStatus );
    });
    it('should give number of coins of different color coins in a cell  ', () => {
      let blueCoin = {
        id: 1,
        setPosition: (pos) => this.position = pos,
        getColor: () =>'blue'
      };
      let expectedStatus={
        killedOppCoin:false,
        red:1,
        blue:1
      };
      cell.addCoin(redCoin);
      let status = cell.addCoin(blueCoin);
      assert.deepEqual(status,expectedStatus);
    });
  });
  
  describe('#getPosition', () => {
    it('should give position of cell ', () => {
      let cell = new Cell(2);
      assert.equal(cell.getPosition(), 2);
    });
  });
});
