const assert = require('chai').assert;
const _path = require('path');
const Path = require(_path.resolve('src/models/path.js'));
const Player = require(_path.resolve('src/models/player.js'));
const Coin = require(_path.resolve('src/models/coin.js'));

const dice = {
  roll : function(){
    return 4;
  }
};

describe('#Player', () => {
  let player,coins,path;
  beforeEach(function(){
    path = new Path();
    coins = [new Coin(1,-2),new Coin(2,-3)];
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
    it('should return empty list if there are no movable coins', () => {
      player.path.addCell(1);
      player.path.addCell(2);
      player.path.addCell(3);
      player.path.addCell(4);
      let expected = [];
      assert.deepEqual(player.getMovableCoins(3),expected);
    });
    it('should return coins list if there are movable coins', () => {
      let expected = [{homePosition:-2,id:1,position:-2},
        {homePosition:-3,id:2,position:-3}];
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
});
