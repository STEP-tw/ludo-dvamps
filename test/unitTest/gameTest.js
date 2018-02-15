const assert = require('chai').assert;
const Game = require('../../src/models/game.js');
let game;
describe('#Game', () => {
  beforeEach(()=>{
    game= new Game();
  });
  describe('#getStatus()', () => {
    it('should return game status', () => {
      let status=game.getStatus();
      assert.isObject(status,'game status is object');
      assert.isArray(status.players,'Players is a List');
    });
  });
});
