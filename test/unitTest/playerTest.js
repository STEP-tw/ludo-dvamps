const assert = require('chai').assert;
const _path = require('path');
const Path = require(_path.resolve('src/models/path.js'));
const Player = require(_path.resolve('src/models/player.js'));
const Coin = require(_path.resolve('src/models/coin.js'));
const UnsafeCell = require(_path.resolve('src/models/unsafeCell.js'));
const DestinationCell = require(_path.resolve('src/models/destinationCell.js'));
const dice = {
  roll : function(){
    return 4;
  }
};

const generateSafeCells = function(from,to) {
  let cells = [];
  for(let index=from;index<=to;index++){
    cells.push(new UnsafeCell(index));
  };
  return cells;
};

describe('#Player', () => {
  let player,coins,path,firstCoin,secondCoin,thirdCoin,fourthCoin,oppCoin;
  beforeEach(function(){
    path = new Path(2);
    firstCoin = new Coin(1,-2);
    secondCoin = new Coin(2,-3);
    thirdCoin = new Coin(3,-4);
    fourthCoin = new Coin(4,-5);
    coins = [firstCoin,secondCoin];
    path.addCell(new UnsafeCell(-2));
    path.addCell(new UnsafeCell(-3));
    player = new Player('john','red',coins,path);
  })
  describe('#getName', () => {
    it('should give name of player', () => {
      assert.equal(player.getName(),'john');
    });
  });
  describe('#getColor', () => {
    it('should give color of player', () => {
      assert.equal(player.getColor(),'red');
    })
  });
  describe('#getStatus', () => {
    it('should return playerStatus', () => {
      let firstCoin = new Coin(1,-2);
      let secondCoin = new Coin(2,-3);
      firstCoin.color = 'red';
      secondCoin.color = 'red';
      let coins = [firstCoin,secondCoin];
      let player = new Player('john','red',coins);
      let expectedStatus={
        name:'john',
        color:'red',
        coins:[{id:1,color:'red',position:-2},
          {id:2,color:'red',position:-3}]
      };
      assert.deepEqual(player.getStatus(),expectedStatus);
    });
  });
  describe('#getCoins', () => {
    it('should return the coins of the player', () => {
      coins = [new Coin(1,-2),new Coin(2,-3)];
      assert.deepEqual(player.getCoins(),coins);
    });
  });
  describe('#getPath', () => {
    it('should return path of the player', () => {
      coins = [];
      path.addCell(1);
      path.addCell(1);
      let player = new Player('kaka','red',coins,path);
      assert.deepEqual(player.getPath(),path);
    });
  });
  describe('#getMovableCoins', () => {
    beforeEach(()=>{
      player.path.addCell(new UnsafeCell(1));
      player.path.addCell(new UnsafeCell(2));
      player.path.addCell(new UnsafeCell(3));
      player.path.addCell(new UnsafeCell(4));
    })
    it('should return empty list if there are no movable coins', () => {
      let expected = [];
      assert.deepEqual(player.getMovableCoins(3),expected);
    });
    it('should return coins list if there are movable coins', () => {
      [-2,-3,1,2,3,4,5,6].forEach(function(cellPos){
        player.path.addCell(cellPos);
      })
      let expected = [new Coin(1,-2),new Coin(2,-3)]
      assert.deepEqual(player.getMovableCoins(6),expected);
    });
  });
  describe('#hasMovableCoins', () => {
    beforeEach(()=>{
      player.path.addCell(-2);
      player.path.addCell(-3);
      player.path.addCell(1);
      player.path.addCell(2);
      player.path.addCell(3);
      player.path.addCell(4);
      player.path.addCell(5);
      player.path.addCell(6);
    })
    it('should return true if there are movable coins', () => {
      assert.isOk(player.hasMovableCoins(6));
    });
    it('should return false if there are no movable coins', () => {
      assert.isNotOk(player.hasMovableCoins(3));
    });
  });
  describe('#moveCoin', () => {
    let oppCoin = new Coin(1,1);
    oppCoin.setColor('blue');
    beforeEach(()=>{
      [1,2,3,4,5,6].forEach(function(numb){
        player.path.addCell(new UnsafeCell(numb));
      })
    })
    it('should move given coin by given specific moves', () => {
      player.path.getCell(-2).addCoin(firstCoin);
      player.path.getCell(1).addCoin(oppCoin);
      let status = player.moveCoin(1,6);
      assert.isOk(status.killedOppCoin);
      assert.deepEqual(status.diedCoin,oppCoin.getStatus());
      assert.equal(firstCoin.getPosition(),1);
      assert.deepEqual(player.path.getCell(-2).coins,[]);
    });
    it('should not move given coin by given specific moves if move is not posible', () => {
      player.path.getCell(-2).addCoin(firstCoin);
      player.moveCoin(1,3);
      assert.equal(player.getCoin(1).position,-2)
      assert.lengthOf(player.path.getCell(-2).coins,1);
      assert.lengthOf(player.path.getCell(1).coins,0);
    });
  });
  describe('#getNoOfCoinsInDest', () => {
    beforeEach(()=>{
      player.path.addCell(new DestinationCell(61));
      [firstCoin,secondCoin,thirdCoin].forEach(function(coin){
        player.path.getCell(61).addCoin(coin);
      });
    });
    it('should give number of coins in destination', () => {
      assert.equal(player.getNoOfCoinsInDest(),3);
    });
    it('should give number of coins in destination', () => {
      player.path.getCell(61).addCoin(fourthCoin);
      assert.equal(player.getNoOfCoinsInDest(),4);
    });
  });
});
