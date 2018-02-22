const assert = require('chai').assert;
const path = require('path');
let Board = require(path.resolve('src/models/board.js'));
let SafeCell = require(path.resolve('src/models/safeCell.js'));
let UnsafeCell = require(path.resolve('src/models/unsafeCell.js'));

describe('Board', () => {
  let board;
  beforeEach(() => {
    board = new Board();
  })
  describe('#generateCommonRoute', () => {
    it('should generate and return route for number of Player given, ' +
      'where specific cells will be safe cells', () => {
        let commonRoute = board.generateCommonRoute(4);
        let expectedSafeCells = [0, 8, 13, 21, 26, 34, 39, 47];
        assert.lengthOf(commonRoute, 52);
        expectedSafeCells.forEach(ele => {
          assert.instanceOf(commonRoute[ele], SafeCell);
        });
        assert.instanceOf(commonRoute[1], UnsafeCell);
        assert.instanceOf(commonRoute[51], UnsafeCell);
        assert.notInstanceOf(commonRoute[1], SafeCell);
      });
  });
  describe('#generateHomeCells', () => {
    it('should generate and return home(safe) cells for number of Players given ', () => {
      let homeCells = board.generateHomeCells(4);
      assert.lengthOf(homeCells, 16);
      homeCells.forEach((cell, index) => {
        assert.instanceOf(cell, SafeCell);
        assert.equal(cell.position, (index + 1) * -1);
      });
    });
  });
  describe('#generateFinalPaths', () => {
    it('should generate and return final paths for each player', () => {
      let finalPaths = board.generateFinalPaths(4);
      assert.lengthOf(Object.keys(finalPaths), 4);
      Object.values(finalPaths).forEach((path) => {
        path.forEach(cell => {
          assert.instanceOf(cell, SafeCell)
          assert.isAbove(cell.position, 110);
          assert.isBelow(cell.position, 155);
        });
      })
    });
  });
  describe('#generate', () => {
    it('should generate all board cells for given number of players', () => {
      board.generate(4);
      assert.property(board,'commonRoute');
      assert.lengthOf(board.commonRoute,52);
      assert.property(board,'homeCells');
      assert.lengthOf(board.homeCells,16);
      assert.property(board,'finalPaths');
      assert.hasAllKeys(board.finalPaths,[0,1,2,3]);
    });
  });
});
