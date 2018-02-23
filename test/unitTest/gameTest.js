const assert = require('chai').assert;
const path = require('path');
const Player = require(path.resolve('src/models/player.js'));
const Game = require(path.resolve('src/models/game.js'));
const Turn = require(path.resolve('src/models/turn.js'));
const Coin = require(path.resolve('src/models/coin.js'));

const dice = {
  roll: function() {
    return 4;
  }
};

describe('#Game', () => {
  let game,ColorDistributer;
  beforeEach(() => {
    ColorDistributer = function() {
      this.colors = ['red', 'green', 'blue', 'yellow'];
    }
    ColorDistributer.prototype = {
      getColor: function() {
        return this.colors.shift();
      },
      addColor:function(color){
        if(this.colors.includes(color)){
          return;
        }
        this.colors.push(color);
      }
    }
    game = new Game('newGame', ColorDistributer, dice);
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
    it('should initiate turn if four players are added ', () => {
      game.addPlayer('lala');
      game.addPlayer('manish');
      game.addPlayer('kaka');
      game.addPlayer('ram');
      assert.property(game, 'turn');
      assert.instanceOf(game.turn, Turn);
    });
  });
  describe('#getPlayer', () => {
    it('should give the player with given player name', () => {
      game.addPlayer('lala');
      let player = game.getPlayer('lala');
      assert.propertyVal(player,'name','lala');
      assert.propertyVal(player,'color','red');
      assert.property(player,'coins');
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
      assert.equal(game.neededPlayers(), 3);

      game.addPlayer('lala');
      game.addPlayer('shyam');
      game.addPlayer('kaka');
      assert.equal(game.neededPlayers(), 0);
    });
  });
  describe('#getDetails', () => {
    it(`should give name, creator and player's needed for game`, () => {
      game.addPlayer('ram');
      let expected = {
        name: 'newGame',
        createdBy: 'ram',
        remain: 3,
      };
      assert.deepEqual(expected, game.getDetails());
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
  describe('#getNoOfPlayers', () => {
    it('should give total number of players in game', () => {
      game.addPlayer('ashish');
      game.addPlayer('joy');
      assert.equal(game.getNoOfPlayers(), 2);
    })
  });
  describe('#rollDice', () => {
    beforeEach(function() {
      game.addPlayer('salman');
      game.addPlayer('lala');
      game.addPlayer('lali');
      game.addPlayer('lalu');
    });
    it('should return a dice roll status with no movable coins and change turn ', () => {
      let rollStatus = game.rollDice();
      assert.equal(rollStatus.move, 4);
      assert.notPropertyVal(rollStatus,'coins');
      assert.equal(game.getCurrentPlayer().getName(),'lala');
    });
    it(`should return a dice roll status with movable coins and don't change turn`, () => {
      let dice = {
        roll:function(){
          return 6;
        }
      };
      game = new Game('newGame', ColorDistributer, dice);
      game.addPlayer('salman');
      game.addPlayer('lala');
      game.addPlayer('lali');
      game.addPlayer('lalu');
      game.start();
      let rollStatus = game.rollDice();
      assert.equal(rollStatus.move, 6);
      assert.property(rollStatus,'coins');
      assert.lengthOf(rollStatus.coins,4);
      assert.equal(game.getCurrentPlayer().getName(),'salman')
    });
    it('should return dice status with move undefined if there are no player chances ', () => {
      game.turn.playerChances = 0;
      assert.equal(game.getCurrentPlayer().getName(),'salman')
      let rollStatus = game.rollDice();
      assert.isUndefined(rollStatus.move);
      assert.notPropertyVal(rollStatus,'coins');
      assert.equal(game.getCurrentPlayer().getName(),'lala')
    });
    it('should register move in activity log', () => {
      game.rollDice();
      let logs = game.getLogs();
      assert.match(JSON.stringify(logs[0]),/salman/);
    });
  });
  describe('#getCurrentPlayer', () => {
    it('should return the current player name', () => {
      game.addPlayer('salman');
      game.addPlayer('lala');
      game.addPlayer('lali');
      game.addPlayer('lalu');
      assert.propertyVal(game.getCurrentPlayer(),'name','salman');
      assert.propertyVal(game.getCurrentPlayer(),'color','red');
    });
  });
  describe('#arrangePlayers', () => {
    it('should arrange Players in required sequence', () => {
      game.addPlayer('lala');
      game.addPlayer('kaka');
      game.addPlayer('ram');
      game.addPlayer('shyam');
      let expection = ['lala', 'kaka', 'shyam', 'ram'];
      assert.deepEqual(expection, game.arrangePlayers());
    });
  });
  describe('#start', () => {
    it('should arrangePlayers in order and initiat turn object ', () => {
      game.addPlayer('lala');
      game.addPlayer('kaka');
      game.addPlayer('ram');
      game.addPlayer('shyam');
      assert.property(game, 'turn');
      assert.propertyVal(game.getCurrentPlayer(),'name','lala');
    });
  });
  describe('#getGameStatus', () => {
    it('should give game status', () => {
      game.addPlayer('lala');
      game.addPlayer('kaka');
      game.addPlayer('ram');
      game.addPlayer('shyam');
      let gameStatus = game.getGameStatus();
      assert.equal(gameStatus.currentPlayerName, 'lala');
      assert.lengthOf(gameStatus.players, 4);
    });
  });
  describe('#moveCoin', () => {
    beforeEach(function() {
    });
    it('should move coin of specific id if coin is valid of current player '+
    ' with specific moves, update game status and return true', () => {
      let dice = {
        roll:function(){
          return 6;
        }
      };
      game = new Game('newGame', ColorDistributer, dice);
      game.addPlayer('salman');
      game.addPlayer('lala');
      game.addPlayer('lali');
      game.addPlayer('lalu');
      game.rollDice();
      let currPlayer = game.getCurrentPlayer();
      assert.isOk(game.moveCoin(1));
      assert.equal(currPlayer.getCoin(1).position,0);
      game.rollDice();
      assert.isOk(game.moveCoin(1));
      assert.equal(currPlayer.getCoin(1).position,6);
    });
    it('should not move coin of specific id if coin is not valid of current player '+
    'and return false', () => {
      let dice = {
        roll:function(){
          return 4;
        }
      };
      game = new Game('newGame', ColorDistributer, dice);
      game.addPlayer('salman');
      game.addPlayer('lala');
      game.addPlayer('lali');
      game.addPlayer('lalu');
      game.rollDice();
      let currPlayer = game.getPlayer('salman');
      assert.isNotOk(game.moveCoin(1));
      assert.equal(currPlayer.getCoin(1).position,-1);
    });
  });
  describe('#hasWon',()=>{
    it('should return true if player has 4 coins in destination cell',()=>{
      game.addPlayer('kaka');
      game.addPlayer('lala');
      game.addPlayer('lali');
      game.addPlayer('lalu');
      let currentPlayer = game.getCurrentPlayer();
      let path = currentPlayer.getPath();
      let destination = path.getDestination();
      destination.addCoin(new Coin(1));
      destination.addCoin(new Coin(2));
      assert.isNotOk(game.hasWon());
      destination.addCoin(new Coin(3));
      destination.addCoin(new Coin(4));
      assert.isOk(game.hasWon());
    })
  })
});
