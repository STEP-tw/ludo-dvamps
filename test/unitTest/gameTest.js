const assert = require('chai').assert;
const Game = require('../../src/models/game.js');
let game;
describe('#Game', () => {
  beforeEach(() => {
    game = new Game('newGame');
  });
  describe('#getStatus()', () => {
    it('should return game status', () => {
      let status = game.getStatus();
      assert.deepEqual(status, {});
    });
  });
  describe('#addPlayer()', () => {
    it('should addPlayer to game', () => {
      game.addPlayer('manish');
      assert.deepEqual(game.getPlayer('manish'), {
        name: 'manish'
      });
    });
  });
  describe('#removePlayer()', () => {
    it('should removePlayer from game', () => {
      game.addPlayer('manish');
      assert.deepEqual(game.getPlayer('manish'), {name: 'manish'});
      game.removePlayer('manish');
      assert.isUndefined(game.getPlayer('manish'));
    });
  });
});
