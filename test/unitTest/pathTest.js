const assert = require('chai').assert
const path = require('path');
const Path= require(path.resolve('src/models/path.js'));
const Coin= require(path.resolve('src/models/coin.js'));
const UnsafeCell= require(path.resolve('src/models/unsafeCell.js'));
const Cell= require(path.resolve('src/models/cell.js'));
const DestinationCell= require(path.resolve('src/models/destinationCell.js'));

const generateSafeCells = function(from,to){
  let cells = [];
  for(let index=from;index<=to;index++){
    cells.push(new Cell(index));
  }
  return cells;
};

const initCoin = function(id,homePos,color){
  let coin = new Coin(id,homePos);
  coin.setColor(color);
  return coin;
};

const generateUnsafeCells = function(from,to){
  let cells = [];
  for(let index=from;index<=to;index++){
    cells.push(new UnsafeCell(index));
  }
  return cells;
};

describe('Path', () => {

  let redPath,coin;
  beforeEach(()=>{
    let tenSafeCells =  generateSafeCells(0,10);
    redPath = new Path(4,tenSafeCells);
    coin = new Coin(1,-1);
  })
  describe('#getCell', () => {
    it('should return the specific cell with given position', () => {
      assert.deepEqual(redPath.getCell(3),new Cell(3));
    });
  });
  describe('#isAbleToStart', () => {
    it('should return true if coin is in home and move is 6', () => {
      assert.isOk(redPath.isAbleToStart(coin,6));
    });
    it('should return false if coin is in home and move is not 6', () => {
      assert.isNotOk(redPath.isAbleToStart(coin,2));
    });
  });
  describe('#getNextMove', () => {
    let coin;
    beforeEach(()=>{
      coin = new Coin(1,-1);
    })
    it('should return next position of the coin if the coin is movable', () => {
      coin = new Coin(1,5);
      let initCell = new Cell(5);
      let finalCell = new Cell(8);
      initCell.addCoin(coin);
      let cells = [initCell,new Cell(6),new Cell(7),finalCell];
      // redPath.addCell(initCell);
      // redPath.addCell(new Cell(6));
      // redPath.addCell(new Cell(7));
      // redPath.addCell(finalCell);
      redPath = new Path(4,cells);
      assert.deepEqual(redPath.getNextMove(coin,3,true),finalCell);
    });
    it('should return same position of the coin if the coin is not movable', () => {
      coin = new Coin(1,8);
      // redPath = new Path(4,cells);
      // redPath.addCell({position:5});
      // redPath.addCell({position:6});
      // redPath.addCell({position:7});
      // redPath.addCell({position:11});
      assert.deepEqual(redPath.getNextMove(coin,5),new Cell(8));
    });
    it('should return same position of coin if Coin is in home and move is less than 6', () => {
      let homeCell =new Cell(-1);
      homeCell.addCoin(coin)
      let cells = generateUnsafeCells(0,4);
      cells.unshift(homeCell);
      // redPath.addCell(home);
      // redPath.addCell(new UnsafeCell(1));
      // redPath.addCell(new UnsafeCell(2));
      // redPath.addCell(new UnsafeCell(3));
      redPath = new Path(4,cells);
      assert.deepEqual(redPath.getNextMove(coin,3),homeCell);
    });
    it('should return first position after home of coin if Coin is in home and move is 6', () => {
      let cells = generateSafeCells(-4,0);
      // redPath.addCell({position:-1});
      // redPath.addCell({position:1});
      // redPath.addCell({position:2});
      // redPath.addCell({position:3});
      redPath = new Path(4,cells);
      assert.deepEqual(redPath.getNextMove(coin,6),new Cell(0));
    });
    it('should return same position if there is coin of same color in next cell', () => {
      // let firstCoin = new Coin(1,1);
      // let secondCoin = new Coin(2,3);
      // firstCoin.setColor('red');
      // secondCoin.setColor('red');
      let firstCoin = initCoin(1,1,'red');
      let secondCoin = initCoin(2,3,'red');

      let initCell= new UnsafeCell(1);
      let finalCell= new UnsafeCell(3);
      initCell.addCoin(firstCoin);
      finalCell.addCoin(secondCoin);

      // redPath.addCell(initCell);
      // redPath.addCell(new UnsafeCell(2));
      redPath = new Path(1,[initCell,finalCell]);
      assert.deepEqual(redPath.getNextMove(firstCoin,2),initCell);
    });
    it('should return same position if player has not killed opp', ()=>{
      //[1,2,3,4].forEach((cellPos)=>redPath.addCell(new Cell(cellPos)));
      let cells = generateSafeCells(1,4);
      redPath = new Path(4,cells);
      coin = new Coin(1,3);
      let thirdCell = redPath.getCell(3);
      thirdCell.addCoin(coin);
      assert.deepEqual(redPath.getNextMove(coin,1,false),thirdCell);
    });
    it('should return destination position if player has not killed opp', ()=>{
      // [1,2,3,4].forEach((cellPos)=>redPath.addCell(new Cell(cellPos)));
      let cells = generateSafeCells(1,4);
      redPath = new Path(4,cells);
      coin = new Coin(1,3);
      let thirdCell = redPath.getCell(3);
      let destination = redPath.getCell(4);
      thirdCell.addCoin(coin);
      assert.deepEqual(redPath.getNextMove(coin,1,true),destination);
    });
  });
  describe('#isMovePossible', () => {
    let coin;
    beforeEach(()=>{
      coin = new Coin(1,5);
    })
    it('should return true if move is possible', () => {
      let cells = generateUnsafeCells(5,11);
      redPath = new Path(4,cells);
      coin.setColor('red');
      assert.isOk(redPath.isMovePossible(coin,3,true));
    });
    it('should return false if move is not possible', () => {
      let cells = generateUnsafeCells(5,9);
      redPath = new Path(4,cells)
      assert.isNotOk(redPath.isMovePossible(coin,5,false));
    });
  });
  describe('#moveCoin', () => {
    let myCoin,oppCoin,firstCell,thirdCell;
    beforeEach(()=>{
      myCoin = initCoin(1,1,'red');
      oppCoin = initCoin(4,3,'green');
      let cells = generateUnsafeCells(1,5);
      redPath = new Path(4,cells);
      firstCell = redPath.cells[0];
      thirdCell = redPath.cells[2];
    })
    it('should remove coin from first cell and add it to next specific cell moves', () => {
      firstCell.addCoin(myCoin);
      let moveStatus = redPath.moveCoin(myCoin,2);
      assert.deepEqual(firstCell.coins,[]);
      assert.deepEqual(thirdCell.coins,[myCoin]);
      assert.isNotOk(moveStatus.killedOppCoin);
    });
    it('should not move coin if move is not possible', () => {
      firstCell.addCoin(myCoin);
      redPath.moveCoin(myCoin,5);
      assert.deepEqual(firstCell.coins,[myCoin]);
    });
    it('should give detail of opp coin which got killed while moving coin in unsafe cell', ()=> {
      firstCell.addCoin(myCoin);
      thirdCell.addCoin(oppCoin);
      let moveStatus = redPath.moveCoin(myCoin,2);
      assert.isOk(moveStatus.killedOppCoin);
      assert.deepEqual(moveStatus.diedCoin,oppCoin.getStatus());
    });

  });
  describe('#getDestination', () => {
    it('should give destinationCell back', () => {
      let destinationCell = new DestinationCell(61);
      let cells = generateUnsafeCells(1,4);
      cells.push(destinationCell);
      redPath = new Path(4,cells);
      assert.deepEqual(redPath.getDestination(),destinationCell);
    });
  });
  describe('#getCoinsInDestination', () => {
    it('should give number of coins in destinationCell', () => {
      let destinationCell = new DestinationCell(61);
      let cells = generateUnsafeCells(1,4);
      cells.push(destinationCell);
      redPath = new Path(4,cells);
      destinationCell.addCoin(new Coin(1,-1));
      assert.equal(redPath.getCoinsInDest(),1);
    });
    it('should give number of coins in destinationCell', () => {
      let destinationCell = new DestinationCell(61);
      let cells = generateUnsafeCells(1,4);
      cells.push(destinationCell);
      redPath = new Path(4,cells);
      destinationCell.addCoin(new Coin(1,-1));
      destinationCell.addCoin(new Coin(2,-2));
      destinationCell.addCoin(new Coin(3,-3));
      assert.equal(redPath.getCoinsInDest(),3);
    });
  });
  describe('#putAtHome', () => {
    it('should put coin in homeCell ', () => {
      let coin = new Coin(1,-2,{});
      coin.setPosition(4);
      assert.equal(coin.getPosition(),4);
      let cells = generateUnsafeCells(-3,-1);
      redPath = new Path(4,cells);
      redPath.putAtHome(coin);
      assert.equal(coin.getPosition(),-2);
    });
  });
});
