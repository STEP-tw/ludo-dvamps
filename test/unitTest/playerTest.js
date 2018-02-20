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
  let player;
  beforeEach(function(){
    player = new Player('ashish','red');
  })
  it('should give name of player', () => {
    assert.equal(player.getName(),'ashish');
  });
  it('should give color of player', () => {
    assert.equal(player.getColor(),'red');
  })
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
      let coins = [new Coin(1,-2),new Coin(2,-3)];
      let player = new Player('ashish','red',coins);
      assert.deepEqual(player.getCoins(),coins);
    });
  });
  describe('#getPath', () => {
    it('should return path of the player', () => {
      let path = new Path();
      let coins = [];
      path.addCell(1);
      path.addCell(1);
      let player = new Player('kaka','red',coins,path);
      assert.deepEqual(player.getPath(),path);
    });
  });
});
