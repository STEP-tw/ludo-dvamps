const assert = require('chai').assert;
const _path = require('path');
const Path = require(_path.resolve('src/models/path.js'));
const Player = require(_path.resolve('src/models/player.js'));
const Coin = require(_path.resolve('src/models/coin.js'));
const SafeCell = require(_path.resolve('src/models/safeCell.js'));
const MockEventEmitter = require(_path.resolve('test/mockEventEmitter.js'));
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
  let player,coins,path,firstCoin,secondCoin,eventEmitter;
  beforeEach(function(){
    path = new Path(2);
    eventEmitter = new MockEventEmitter();
    firstCoin = new Coin(1,-2,eventEmitter);
    secondCoin = new Coin(2,-3,eventEmitter);
    firstCoin.setPosition(-2)
    secondCoin.setPosition(-3)
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
      let coins = [new Coin(1,-2),new Coin(2,-3)];
      let player = new Player('ashish','red',coins);
      let expectedStatus={
        name:'ashish',
        color:'red',
        coins:[-2,-3]
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
      let expected = [{homePosition:-2,id:1,position:-2,eventEmitter:eventEmitter},
        {homePosition:-3,id:2,position:-3,eventEmitter:eventEmitter}];
      player.path.addCell(-2);
      player.path.addCell(-3);
      player.path.addCell(1);
      player.path.addCell(2);
      player.path.addCell(3);
      player.path.addCell(4);
      player.path.addCell(5);
      player.path.addCell(6);
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
  describe('#entertainDiedEvent', () => {
    it('should put coin at home ', () => {
      player.path.add(generateSafeCells(-4,4));
      player.entertainDiedEvent({id:1,color:'red'});
      assert.equal(player.getCoins()[0].getPosition(),-2);
    });
    it('should not put coin at home if given coin detail doesnt match player coins', () => {
      let coin3 = new Coin(3,-4,{});
      coin3.setPosition(8);
      let coin4 = new Coin(4,-5,{});
      coin4.setPosition(5);
      path.add(generateSafeCells(-4,4));
      player = new Player('john','red',[coin3,coin4],new Path());
      player.entertainDiedEvent({id:1,color:'green'});
      assert.equal(coin3.getPosition(),8);
      assert.equal(coin4.getPosition(),5);
    });
  });
  describe('#listenDiedEvent', () => {
    it('should add entertainDiedEvent as eventListener to died event ', () => {
      player.listenDiedEvent(eventEmitter);
      assert.isOk(eventEmitter.isRegisteredEvent('died'));
      assert.equal(eventEmitter.getCallBackOf('died'),player.entertainDiedEvent);
    });
  });
});
