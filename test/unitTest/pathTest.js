const assert = require('chai').assert
const path = require('path');
const Path= require(path.resolve('src/models/path.js'));
const Coin= require(path.resolve('src/models/coin.js'));

describe('Path', () => {
  describe('#addCell', () => {
    it('should add a cell to the path ', () => {
      let redPath = new Path();
      let cell = 10;
      assert.deepEqual(redPath.getPath(),[]);
      redPath.addCell(cell);
      assert.deepEqual(redPath.getPath(),[10]);
    });
  });
  describe('#getNextMove', () => {
    it('should return next position of the coin if the coin is movable', () => {
      let redPath = new Path();
      let coin = new Coin(1,5);
      redPath.addCell(5);
      redPath.addCell(6);
      redPath.addCell(7);
      redPath.addCell(11);
      assert.equal(redPath.getNextMove(coin,3),11);
      assert.equal(redPath.getNextMove(coin,2),7);
    });
    it('should return same position of the coin if the coin is not movable', () => {
      let redPath = new Path();
      let coin = new Coin(1,5);
      redPath.addCell(5);
      redPath.addCell(6);
      redPath.addCell(7);
      redPath.addCell(11);
      assert.equal(redPath.getNextMove(coin,5),5);
    });
  });
  describe('#isMovePossible', () => {
    it('should return true if move is possible', () => {
      let redPath = new Path();
      let coin = new Coin(1,5);
      redPath.addCell(5);
      redPath.addCell(6);
      redPath.addCell(7);
      redPath.addCell(11);
      assert.isOk(redPath.isMovePossible(coin,3));
    });
    it('should return false if move is not possible', () => {
      let redPath = new Path();
      let coin = new Coin(1,5);
      redPath.addCell(5);
      redPath.addCell(6);
      redPath.addCell(7);
      redPath.addCell(11);
      assert.isNotOk(redPath.isMovePossible(coin,5));
    });
  });
});
