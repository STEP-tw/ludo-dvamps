const assert = require('chai').assert;
const _path = require('path');
const Path = require(_path.resolve('src/models/path.js'));
const Player = require(_path.resolve('src/models/player.js'));
const Coin = require(_path.resolve('src/models/coin.js'));
const SafeCell = require(_path.resolve('src/models/safeCell.js'));
const DestinationCell = require(_path.resolve('src/models/destinationCell.js'));
const EventEmitter = require('events');
const dice = {
  roll : function(){
    return 4;
  }
};

const generateSafeCells = function(from,to) {
  let cells = [];
  for(let index=from;index<=to;index++){
    cells.push(new SafeCell(index));
  };
  return cells;
};

describe('#Player', () => {
  let player,coins,path,firstCoin,secondCoin,thirdCoin,fourthCoin,eventEmitter;
  beforeEach(function(){
    path = new Path(2);
    eventEmitter = new EventEmitter();
    firstCoin = new Coin(1,-2,eventEmitter);
    secondCoin = new Coin(2,-3,eventEmitter);
    thirdCoin = new Coin(3,-4,eventEmitter);
    fourthCoin = new Coin(4,-5,eventEmitter);
    firstCoin.setPosition(-2)
    secondCoin.setPosition(-3)
    thirdCoin.setPosition(-4)
    fourthCoin.setPosition(-5)
    coins = [firstCoin,secondCoin];
    path.addCell(new SafeCell(-2));
    path.addCell(new SafeCell(-3));
    player = new Player('ashish','red',coins,path);
  })
  describe('#getName', () => {
    it('should give name of player', () => {
      assert.equal(player.getName(),'ashish');
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
      let player = new Player('ashish','red',coins);
      let expectedStatus={
        name:'ashish',
        color:'red',
        coins:[{id:1,color:'red',position:-2},
          {id:2,color:'red',position:-3}]
      };
      assert.deepEqual(player.getStatus(),expectedStatus);
    });
  });
  describe('#getCoins', () => {
    it('should return the coins of the player', () => {
      coins = [new Coin(1,-2,eventEmitter),new Coin(2,-3,eventEmitter)];
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
      player.path.addCell(new SafeCell(1));
      player.path.addCell(new SafeCell(2));
      player.path.addCell(new SafeCell(3));
      player.path.addCell(new SafeCell(4));
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
    beforeEach(()=>{
      player.path.addCell(new SafeCell(1));
      player.path.addCell(new SafeCell(2));
      player.path.addCell(new SafeCell(3));
      player.path.addCell(new SafeCell(4));
      player.path.addCell(new SafeCell(5));
      player.path.addCell(new SafeCell(6));
    })
    it('should move given coin by given specific moves', () => {
      player.path.getCell(-2).addCoin(firstCoin);
      player.moveCoin(1,6);
      assert.equal(player.getCoin(1).position,1);
      assert.lengthOf(player.path.getCell(-2).coins,0);
      assert.lengthOf(player.path.getCell(1).coins,1);
    });
    it('should not move given coin by given specific moves if move is not posible', () => {
      player.path.getCell(-2).addCoin(firstCoin);
      player.moveCoin(1,3);
      assert.equal(player.getCoin(1).position,-2)
      assert.lengthOf(player.path.getCell(-2).coins,1);
      assert.lengthOf(player.path.getCell(1).coins,0);
    });
  });
  describe('#putAtHome', () => {
    it('should put coin at homePosition', () => {
      player.path.add(generateSafeCells(-4,4));
      player.moveCoinToHome(1);
      assert.equal(player.getCoins()[0].getPosition(),-2);
    });
  });
  describe('#getNoOfCoinsInDest', () => {
    beforeEach(()=>{
      player.path.addCell(new DestinationCell(61));
    })
    it('should give number of coins in destination', () => {
      player.path.getCell(61).addCoin(firstCoin);
      player.path.getCell(61).addCoin(secondCoin);
      player.path.getCell(61).addCoin(thirdCoin);
      assert.equal(player.getNoOfCoinsInDest(),3);
    });
    it('should give number of coins in destination', () => {
      player.path.getCell(61).addCoin(firstCoin);
      player.path.getCell(61).addCoin(secondCoin);
      player.path.getCell(61).addCoin(thirdCoin);
      player.path.getCell(61).addCoin(fourthCoin);
      assert.equal(player.getNoOfCoinsInDest(),4);
    });
  });
  describe('#kill Event',() => {
    let coin1;
    beforeEach(function(){
      coin1 = new Coin(1,-1);
      coin1.setColor('red')
      coin1.setPosition(10);
      let coin2 = new Coin(2,-2);
      let coin3 = new Coin(3,-3);
      path = new Path(1);
      path.add(generateSafeCells(-1,20));
      player = new Player('player','red',[coin1,coin2,coin3],path);
      player.listenDiedEvent();
    })
    it('player should put coin to home if died event is fired by coin is his coin',() => {
      assert.equal(coin1.getPosition(),10);
      coin1.die();
      assert.equal(coin1.getPosition(),-1);
    });
    it('player should not put coin to home if died event is fired by someother player',() => {
      assert.equal(coin1.getPosition(),10);
      eventEmitter.emit('died',{id:1,color:'green'});
      assert.equal(coin1.getPosition(),10);
    });
  });
});
