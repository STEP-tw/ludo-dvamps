const assert = require('chai').assert;
const path = require('path');
const Player = require(path.resolve('src/models/player.js'));

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
  describe('#addCoin', () => {
    it('should add new coin to player ', () => {
      let player = new Player('ashish','red');
      player.addCoin();
      assert.equal(player.coins.length,1);
      player.addCoin();
      assert.equal(player.coins.length,2);
    });
  });
  describe('#getStatus', () => {
    it('should return playerStatus', () => {
      let player = new Player('ashish','red');
      player.addCoin();
      player.addCoin();
      player.addCoin();
      player.addCoin();
      let expectedStatus={
        name:'ashish',
        color:'red',
        coins:['home','home','home','home']
      };
      assert.deepEqual(player.getStatus(),expectedStatus);
    });
  });
});
