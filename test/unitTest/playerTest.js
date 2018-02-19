const assert = require('chai').assert;
const path = require('path');
const Player = require(path.resolve('src/models/player.js'));
const Coin = require(path.resolve('src/models/coin.js'));

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
  describe('#rollDice', () => {
    it('should return a number', () => {
      let move = player.rollDice(dice);
      assert.isNumber(move);
      assert.equal(move,4);
    });
  });
});
