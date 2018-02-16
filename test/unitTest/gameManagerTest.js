const assert = require('chai').assert;
const path = require('path');
const GameManager = require(path.resolve('src/models/gamesManager.js'));
const Game = require(path.resolve('src/models/game.js'));
const ColorDistributer = function() {
  this.colors = ['red','green','blue','yellow'];
}
ColorDistributer.prototype = {
  getColor:function() {
    return this.colors.shift();
  }
}
describe('GameManager', () => {
  let gameManager;
  let game;
  beforeEach(() => {
    let colorDistributor = new ColorDistributer();
    gameManager = new GameManager(colorDistributor);
    game = gameManager.addGame('newGame',colorDistributor);
  });
  describe('#addGame', () => {
    it('should create a new game with given name and store it', () => {
      assert.deepEqual(game, new Game('newGame',new ColorDistributer()));
      assert.instanceOf(game,Game);
    });
  });
  describe.skip('#addPlayerTo', () => {
    it('should add player to given specific game', () => {
      gameManager.addPlayerTo('newGame', 'john');
      let expectedGame = new Game('newGame');
      expectedGame.addPlayer('john');
      assert.deepEqual(gameManager.getGame('newGame'),expectedGame);
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
        name:'newGame',
        remain:1,
        createdBy: 'john'
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
    //   let expectedGame = {
    //     name:'newGame',
    //     numberOfPlayers: 4,
    //     players: [],
    //     status: {}
    //   };
      assert.deepEqual(gameManager.getGame('newGame'), new Game('newGame',new ColorDistributer));
      assert.isUndefined(gameManager.getGame('badGame'));
    });
  });
});
