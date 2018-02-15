const assert = require('chai').assert;
const GameManager = require('../../src/models/gameManager.js');
let gameManager;
describe('#GameManager', () => {
  beforeEach(() => {
    gameManager = new GameManager();
  });
  describe('#getGame()', () => {
    it('should return Game', () => {
      let expectedGame = {
        players: [],
        status: {
          players: []
        }
      };
      assert.deepEqual(gameManager.getGame('D-VAMPS'), expectedGame);
      assert.isUndefined(gameManager.getGame('SAMAJ'));
    });
  });
});
