const assert = require('chai').assert;
const path = require('path');
const GameManager = require(path.resolve('src/models/gamesManager.js'));
const Game = require(path.resolve('src/models/game.js'));

describe('GameManager', () => {
  let gameManager;
  let game;
  beforeEach(() => {
    gameManager = new GameManager();
    game = gameManager.addGame('newGame');
  });
  describe('#addGame', () => {
    it('should create a new game with given name and store it', () => {
      assert.deepEqual(game, new Game('newGame'));
      assert.instanceOf(game,Game);
    });
  });
  describe('#addPlayerTo', () => {
    it('should add player to given specific game', () => {
      gameManager.addPlayerTo('newGame', 'john');
      assert.deepPropertyVal(gameManager.allRunningGames, 'newGame', {
        players: [{
          name: 'john'
        }],
        status:{}
      });
    });
  });
  describe('#getAvailableGames', () => {
    it(`should give empty list if all games have 4 players`, () => {
      gameManager.addPlayerTo('newGame', 'john');
      gameManager.addPlayerTo('newGame', 'sandy');
      gameManager.addPlayerTo('newGame', 'mandy');
      gameManager.addPlayerTo('newGame', 'alex');
      assert.deepEqual(gameManager.getAvailableGames(), []);
    });
    it(`should give all games which don't have 4 players`, () => {
      gameManager.addPlayerTo('newGame', 'john');
      gameManager.addPlayerTo('newGame', 'sandy');
      gameManager.addPlayerTo('newGame', 'mandy');
      let expectation = [{
        players: [{
          name: 'john'
        }, {
          name: 'sandy'
        }, {
          name: 'mandy'
        }],
        status :{}
      }];
      assert.deepEqual(gameManager.getAvailableGames(), expectation);
    });
  });
  describe('#doesGameExists', () => {
    it('should return true if game of given name exists ', () => {
      assert.isOk(gameManager.doesGameExists('newGame'));
    });
    it('should return false if game of given name does not exists ', () => {
      assert.isNotOk(gameManager.doesGameExists('badGame'));
    });
  });
  describe('#getGame()', () => {
    it('should return Game', () => {
      let expectedGame = {
        players: [],
        status: {}
      };
      assert.deepEqual(gameManager.getGame('newGame'), expectedGame);
      assert.isUndefined(gameManager.getGame('SAMAJ'));
    });
  });
});
