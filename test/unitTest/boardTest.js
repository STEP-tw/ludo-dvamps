const assert = require('chai').assert;
const path = require('path');
let Board = require(path.resolve('src/models/board.js'));
let SafeCell = require(path.resolve('src/models/safeCell.js'));
let UnsafeCell = require(path.resolve('src/models/unsafeCell.js'));
let DestinationCell = require(path.resolve('src/models/destinationCell.js'));

describe('Board', () => {
  let board;
  beforeEach(() => {
    board = new Board(4);
  })
  describe('#generateCommonRoute', () => {
    it('should generate and return route for number of Player given, ' +
      'where specific cells will be safe cells', () => {
        let commonRoute = board.generateCommonRoute();
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
      let homeCells = board.generateHomeCells();
      assert.lengthOf(homeCells, 16);
      homeCells.forEach((cell, index) => {
        assert.instanceOf(cell, SafeCell);
        assert.equal(cell.position, (index + 1) * -1);
      });
    });
  });
  describe('#generateFinalPaths', () => {
    it('should generate and return final paths for each player', () => {
      let finalPaths = board.generateFinalPaths();
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
  describe('#generateDestinations', () => {
    it('should generate and return destination cells for given number of players', () => {
      let destinations = board.generateDestinations();
      Object.values(destinations).forEach(cell=>{
        assert.instanceOf(cell,DestinationCell);
      })
      assert.propertyVal(destinations[0],'position',155);
      assert.propertyVal(destinations[1],'position',116);
      assert.propertyVal(destinations[2],'position',129);
      assert.propertyVal(destinations[3],'position',142);
    });
  });
  describe('#generate', () => {
    it('should generate all board cells for given number of players', () => {
      board.generate();
      assert.property(board,'commonRoute');
      assert.lengthOf(board.commonRoute,52);
      assert.property(board,'homeCells');
      assert.lengthOf(board.homeCells,16);
      assert.property(board,'finalPaths');
      assert.hasAllKeys(board.finalPaths,[0,1,2,3]);
      assert.property(board,'destinations');
      assert.hasAllKeys(board.destinations,[0,1,2,3]);
    });
  });
  describe('#getCommonPathFor', () => {
    it('should return common path for specific player', () => {
      board.generate();
      let path = board.getCommonPathFor(0);
      assert.lengthOf(path,51);
      assert.propertyVal(path[0],'position',0);
    });
  });
  describe('#getPathFor', () => {
    it('should return path for specific player', () => {
      board.generate();
      assert.lengthOf(board.getPathFor(0),61);
      assert.lengthOf(board.getPathFor(1),61);
      assert.lengthOf(board.getPathFor(2),61);
      assert.lengthOf(board.getPathFor(3),61);
    });
  });
});
