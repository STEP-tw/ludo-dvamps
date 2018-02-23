const assert = require('chai').assert
const path = require('path');
const Path= require(path.resolve('src/models/path.js'));
const Coin= require(path.resolve('src/models/coin.js'));
const Cell= require(path.resolve('src/models/safeCell.js'));
const DestinationCell= require(path.resolve('src/models/destinationCell.js'));

describe('Path', () => {
  let redPath;
  beforeEach(()=>{
    redPath = new Path(1);
  })
  describe('#addCell', () => {
    it('should add a cell to the path ', () => {
      let cell = 10;
      assert.deepEqual(redPath.getPath(),[]);
      redPath.addCell(cell);
      assert.deepEqual(redPath.getPath(),[10]);
    });
  });
  describe('#add', () => {
    it('should add given path to itself', () => {
      let route = [1,2,3,4,5,6,7,8,9];
      redPath.add(route);
      assert.deepEqual(redPath.cells,route);
    });
  });
  describe('#getCell', () => {
    it('should return the specific cell with given position', () => {
      let route = [{position:1},{position:2},{position:3},{position:4}];
      redPath.add(route);
      assert.deepEqual(redPath.getCell(3),{position:3});
    });
  });
  describe('#isAbleToStart', () => {
    it('should return true if coin is in home and move is 6', () => {
      assert.isOk(redPath.isAbleToStart(-1,6));
    });
    it('should return false if coin is in home and move is not 6', () => {
      assert.isNotOk(redPath.isAbleToStart(-1,2));
    });
  });
  describe('#getNextMove', () => {
    let coin;
    beforeEach(()=>{
      coin = new Coin(1,-1);
    })
    it('should return next position of the coin if the coin is movable', () => {
      coin = new Coin(1,5);
      redPath.addCell({position:5});
      redPath.addCell({position:6});
      redPath.addCell({position:7});
      redPath.addCell({position:11});
      assert.deepEqual(redPath.getNextMove(coin,3),{position:11});
      assert.deepEqual(redPath.getNextMove(coin,2),{position:7});
    });
    it('should return same position of the coin if the coin is not movable', () => {
      coin = new Coin(1,5);
      redPath.addCell({position:5});
      redPath.addCell({position:6});
      redPath.addCell({position:7});
      redPath.addCell({position:11});
      assert.deepEqual(redPath.getNextMove(coin,5),{position:5});
    });
    it('should return same position of coin if Coin is in home and move is less than 6', () => {
      coin = new Coin(1,-1);
      redPath.addCell({position:-1});
      redPath.addCell({position:1});
      redPath.addCell({position:2});
      redPath.addCell({position:3});
      assert.deepEqual(redPath.getNextMove(coin,3),{position:-1});
    });
    it('should return first position after home of coin if Coin is in home and move is 6', () => {
      redPath.addCell({position:-1});
      redPath.addCell({position:1});
      redPath.addCell({position:2});
      redPath.addCell({position:3});
      assert.deepEqual(redPath.getNextMove(coin,6),{position:1});
    });
  });
  describe('#isMovePossible', () => {
    let coin;
    beforeEach(()=>{
      coin = new Coin(1,5);
    })
    it('should return true if move is possible', () => {
      redPath.addCell({position:5});
      redPath.addCell({position:6});
      redPath.addCell({position:7});
      redPath.addCell({position:11});
      assert.isOk(redPath.isMovePossible(coin,3));
    });
    it('should return false if move is not possible', () => {
      redPath.addCell({position:5});
      redPath.addCell({position:6});
      redPath.addCell({position:7});
      redPath.addCell({position:11});
      assert.isNotOk(redPath.isMovePossible(coin,5));
    });
  });
  describe('#moveCoin', () => {
    let coin;
    beforeEach(()=>{
      coin = new Coin(1,1);
    })
    it('should remove coin from first cell and add it to next specific cell moves', () => {
      let cellWithCoin = new Cell(1);
      let CellWhereCoinWillGo = new Cell(4);
      cellWithCoin.addCoin(coin);
      redPath.addCell(cellWithCoin);
      redPath.addCell(new Cell(2));
      redPath.addCell(new Cell(3));
      redPath.addCell(CellWhereCoinWillGo);
      redPath.addCell(new Cell(5));
      redPath.moveCoin(coin,3);
      assert.lengthOf(cellWithCoin.coins,0);
      assert.notInclude(cellWithCoin.coins,coin);
      assert.equal(coin.position,4);
      assert.lengthOf(CellWhereCoinWillGo.coins,1);
      assert.include(CellWhereCoinWillGo.coins,coin);
    });
    it('should not move coin if move is not possible', () => {
      let cellWithCoin = new Cell(1);
      cellWithCoin.addCoin(coin);
      redPath.addCell(cellWithCoin);
      redPath.addCell(new Cell(2));
      redPath.addCell(new Cell(3));
      redPath.addCell(new Cell(4));
      redPath.moveCoin(coin,5);
      assert.lengthOf(cellWithCoin.coins,1);
      assert.include(cellWithCoin.coins,coin);
    });
  });
  describe('#getDestination', () => {
    it('should give destinationCell back', () => {
      let destinationCell = new DestinationCell(61);
      redPath.addCell(new Cell(3));
      redPath.addCell(new Cell(4));
      redPath.addCell(destinationCell);
      assert.deepEqual(redPath.getDestination(),destinationCell);
    });
  });
  describe('#getCoinsInDestination', () => {
    it('should give number of coins in destinationCell', () => {
      let destinationCell = new DestinationCell(61);
      redPath.addCell(new Cell(3));
      redPath.addCell(new Cell(4));
      redPath.addCell(destinationCell);
      destinationCell.addCoin(new Coin(1,-1));
      assert.equal(redPath.getCoinsInDest(),1);
    });
    it('should give number of coins in destinationCell', () => {
      let destinationCell = new DestinationCell(61);
      redPath.addCell(new Cell(3));
      redPath.addCell(new Cell(4));
      redPath.addCell(destinationCell);
      destinationCell.addCoin(new Coin(1,-1));
      destinationCell.addCoin(new Coin(2,-2));
      destinationCell.addCoin(new Coin(3,-3));
      assert.equal(redPath.getCoinsInDest(),3);
    });
  });
  describe('#putAtHome', () => {
    it('should put coin in homeCell ', () => {
      let cell1 = new Cell(-1);
      let cell2 = new Cell(-2);
      let cell3 = new Cell(-3);
      let coin = new Coin(1,-2,{});
      coin.setPosition(4);
      assert.equal(coin.getPosition(),4);
      redPath.add([cell1,cell2,cell3]);
      redPath.putAtHome(coin);
      assert.equal(coin.getPosition(),-2);
    });
  });
});
