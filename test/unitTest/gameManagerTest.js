const assert = require('chai').assert;
const path = require('path');
const GameManager = require(path.resolve('src/models/gamesManager.js'));

describe('GameManager', () => {
  beforeEach(() => {
    gameManager = new GameManager();
    gameManager.addGame('samaj');
  });
  describe('#addGame', () => {
    it('should add new game to running games with given name as key', () => {
      assert.property(gameManager.allRunningGames, 'samaj');
    });
  });
  describe('#addPlayerTo', () => {
    it('should add player to given specific game', () => {
      gameManager.addPlayerTo('samaj', 'john');
      assert.deepPropertyVal(gameManager.allRunningGames, 'samaj', {
        name: 'samaj',
        players: [{
          name: 'john'
        }]
      });
    });
  });
  describe('#getAvailableGames', () => {
    it(`should give empty list if all games have 4 players`, () => {
      gameManager.addPlayerTo('samaj', 'john');
      gameManager.addPlayerTo('samaj', 'sandy');
      gameManager.addPlayerTo('samaj', 'mandy');
      gameManager.addPlayerTo('samaj', 'alex');
      assert.deepEqual(gameManager.getAvailableGames(), []);
    });
    it(`should give all games which don't have 4 players`, () => {
      gameManager.addPlayerTo('samaj', 'john');
      gameManager.addPlayerTo('samaj', 'sandy');
      gameManager.addPlayerTo('samaj', 'mandy');
      let expectation = [{
        name: 'samaj',
        players: [{
          name: 'john'
        }, {
          name: 'sandy'
        }, {
          name: 'mandy'
        }]
      }];
      assert.deepEqual(gameManager.getAvailableGames(), expectation);
    });
  });
});
