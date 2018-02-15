const path = require('path');
const GamesManager = require(path.resolve('src/models/gamesManager.js'));
const Game = require(path.resolve('src/models/game.js'));
const assert = require('chai').assert;

describe('#GamesManager', () => {
  let gamesManager;
  beforeEach(function() {
    gamesManager = new GamesManager();
  });

  describe('#addGame', () => {
    it('should create a new game with given name and store it', () => {
      let game = gamesManager.addGame('newGame');
      assert.deepEqual(game, new Game('newGame'));
    });
  });

  describe('#doesGameExists', () => {
    it('should return true if game of given name exists ', () => {
      gamesManager.addGame('newGame');
      assert.isOk(gamesManager.doesGameExists('newGame'));
    });
    it('should return false if game of given name does not exists ', () => {
      assert.isNotOk(gamesManager.doesGameExists('newGame'));
    });
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
