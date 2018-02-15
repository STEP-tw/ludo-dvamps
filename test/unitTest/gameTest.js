const assert = require('chai').assert;
const Game = require('../../src/models/game.js');
let game;
describe('#Game', () => {
  beforeEach(()=>{
    game= new Game('newGame');
  });
  describe('#getStatus()', () => {
    it('should return game status', () => {
      let status=game.getStatus();
      assert.deepEqual(status,{});
    });
  });
});
