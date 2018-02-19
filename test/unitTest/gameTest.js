const assert = require('chai').assert;
const Game = require('../../src/models/game.js');
const Coin = require('../../src/models/coin.js');

const dice = {
  roll : function(){
    return 4;
  }
};

let game;
describe('#Game', () => {
  beforeEach(() => {
    let ColorDistributer = function() {
      this.colors = ['red','green','blue','yellow'];
    }
    ColorDistributer.prototype = {
      getColor:function() {
        return this.colors.shift();
      }
    }
    game = new Game('newGame',ColorDistributer, dice);
  });
  describe('#getStatus()', () => {
    it('should return game status', () => {
      let status = game.getStatus();
      assert.deepEqual(status, {});
    });
  });
  describe('#addPlayer()', () => {
    it('should addPlayer to game if player is not there', () => {
      assert.isOk(game.addPlayer('manish'));
      assert.isOk(game.doesPlayerExist('manish'));
    });

    it('should not addPlayer to game if player is in the game', () => {
      game.addPlayer('manish');
      assert.isNotOk(game.addPlayer('manish'));
    });
  });
  describe('#removePlayer()', () => {
    it('should removePlayer from game', () => {
      game.addPlayer('manish');
      assert.isOk(game.doesPlayerExist('manish'));
      game.removePlayer('manish');
      assert.isNotOk(game.doesPlayerExist('manish'));
    });
  });
  describe('#hasEnoughPlayers()', () => {
    it(`should give false when game don't have enough players`, () => {
      game.addPlayer('ram');
      assert.isNotOk(game.hasEnoughPlayers());
    });
    it(`should give true when game has enough players`, () => {
      game.addPlayer('ram');
      game.addPlayer('shyam');
      game.addPlayer('kaka');
      game.addPlayer('lala');
      assert.isOk(game.hasEnoughPlayers());
    });
  });
  describe('#neededPlayers()', () => {
    it(`should give number of needed players to start the game`, () => {
      game.addPlayer('ram');
      assert.equal(game.neededPlayers(),3);

      game.addPlayer('lala');
      game.addPlayer('shyam');
      game.addPlayer('kaka');
      assert.equal(game.neededPlayers(),0);
    });
  });
  describe('#getDetails', () => {
    it(`should give name, creator and player's needed for game`, () => {
      game.addPlayer('ram');
      let expected = {
        name:'newGame',
        createdBy:'ram',
        remain:3,
      };
      assert.deepEqual(expected,game.getDetails());
    });
  });
  describe('#doesPlayerExist', () => {
    it('should return true if player name is in the game', () => {
      game.addPlayer('kaka');
      assert.isOk(game.doesPlayerExist('kaka'));
    });
    it('should return false if player name is not in the game', () => {
      assert.isNotOk(game.doesPlayerExist('kaka'));
    });
  });
  describe('#getBoardStatus',() => {
    it('should give the color-coin pair', () => {
      game.addPlayer('ashish');
      game.addPlayer('joy');
      assert.deepEqual(game.getBoardStatus(),{'red':'ashish','green':'joy'});
    })
  });
  describe('#getNoOfPlayers',() => {
    it('should give total number of players in game', () => {
      game.addPlayer('ashish');
      game.addPlayer('joy');
      assert.equal(game.getNoOfPlayers(),2);
    })
  });
  describe('#rollDice', () => {
    it('should return a number', () => {
      game.addPlayer('salman');
      let move = game.rollDice();
      assert.isNumber(move);
      assert.equal(move,4);
    });
  });
});
