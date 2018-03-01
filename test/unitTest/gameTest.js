const assert = require('chai').assert;
const path = require('path');
const Player = require(path.resolve('src/models/player.js'));
const Game = require(path.resolve('src/models/game.js'));
const Turn = require(path.resolve('src/models/turn.js'));
const Coin = require(path.resolve('src/models/coin.js'));
const ColorDistributer = require(path.resolve('test/colorDistributer.js'));
const fourPointDice = {
  roll:()=> 4
};
const sixPointDice ={
  roll:()=> 6
};

let players = ['lala','kaka','lali','lalu'];

const initGame = function(players,dice,gameName) {
  let game = new Game(gameName||'ludo',ColorDistributer,dice);
  players.forEach((player)=> game.addPlayer(player));
  return game;
}

describe('#Game', () => {
  let game;
  beforeEach(() => {
    game = new Game('newGame', ColorDistributer, fourPointDice);
  });
  describe('#getname', () => {
    it('should return name of game', () => {
      assert.equal(game.getName(),'newGame');
    });
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
      let game = initGame(players,fourPointDice);
      assert.property(game, 'turn');
      assert.instanceOf(game.turn, Turn);
    });
  });
  describe('#getPlayer', () => {
    it('should give the player with given player name', () => {
      game.addPlayer('lala');
      let player = game.getPlayer('lala');
      assert.propertyVal(player, 'name', 'lala');
      assert.propertyVal(player, 'color', 'red');
      assert.property(player, 'coins');
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
      let game = initGame(players,fourPointDice,'newGame');
      assert.isOk(game.hasEnoughPlayers());
    });
  });
  describe('#neededPlayers()', () => {
    it(`should give number of needed players to start the game`, () => {
      game.addPlayer('ram');
      assert.equal(game.neededPlayers(), 3);
      ['lala','shyam','kaka'].forEach((name)=>game.addPlayer(name));
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
      game = initGame(['salman','lala','lali','lalu'],fourPointDice);
      game.start();
    });
    it('should return a dice roll status with no movable coins and change turn ', () => {
      let rollStatus = game.rollDice();
      assert.equal(rollStatus.move, 4);
      assert.notPropertyVal(rollStatus, 'coins');
      assert.equal(game.getCurrentPlayer().getName(), 'lala');
    });
    it(`should return a dice roll status with movable coins and don't change turn`, () => {
      game.dice = sixPointDice;
      let rollStatus = game.rollDice();
      assert.equal(rollStatus.move, 6);
      assert.property(rollStatus, 'coins');
      assert.lengthOf(rollStatus.coins, 4);
      assert.equal(game.getCurrentPlayer().getName(), 'salman')
    });
    it('should return dice status with move undefined if there are no player chances ', () => {
      game.turn.playerChances = 0;
      assert.equal(game.getCurrentPlayer().getName(), 'salman')
      let rollStatus = game.rollDice();
      assert.isUndefined(rollStatus.move);
      assert.notPropertyVal(rollStatus, 'coins');
      assert.equal(game.getCurrentPlayer().getName(), 'lala')
    });
    it('should register move in activity log', () => {
      game.rollDice();
      let logs = game.getLogs();
      assert.match(JSON.stringify(logs[0]), /salman/);
    });
    it('should give first move coin message',function(){
      game.dice = sixPointDice;
      game.rollDice();
      game.dice = fourPointDice;
      let message = game.rollDice();
      assert.deepEqual(message,{message:"first move your coin"});
    })
  });
  describe('#getCurrentPlayer', () => {
    it('should return the current player name', () => {
      game = initGame(['salman','lala','lali','lalu'],fourPointDice);
      game.start();
      assert.propertyVal(game.getCurrentPlayer(),'name','salman');
      assert.propertyVal(game.getCurrentPlayer(),'color','red');
    });
  });
  describe('#arrangePlayers', () => {
    it('should arrange Players in required sequence', () => {
      game = initGame(['lala','kaka','ram','shyam'],fourPointDice);
      let expection = ['lala', 'kaka', 'shyam', 'ram'];
      assert.deepEqual(expection, game.arrangePlayers());
    });
  });
  describe('#start', () => {
    it('should arrangePlayers in order and initiat turn object ', () => {
      let game = initGame(players,fourPointDice);
      assert.property(game, 'turn');
      assert.propertyVal(game.getCurrentPlayer(), 'name', 'lala');
    });
  });
  describe('#getGameStatus', () => {
    it('should give game status', () => {
      let game = initGame(players,fourPointDice,'newGame');
      let gameStatus = game.getGameStatus();
      assert.equal(gameStatus.currentPlayerName, 'lala');
      assert.lengthOf(gameStatus.players, 4);
    });
  });
  describe('#moveCoin', () => {
    it('should move coin of specific id if coin is valid of current player ' +
      ' with specific moves, update game status, return true and should not change turn', () => {
        let game = initGame(players,sixPointDice);
        game.rollDice();
        let currPlayer = game.getCurrentPlayer();
        assert.isOk(game.moveCoin(1));
        assert.equal(currPlayer.getCoin(1).position, 0);
        assert.equal(game.getCurrentPlayer().name, 'lala');
        game.rollDice();
        assert.isOk(game.moveCoin(1));
        assert.equal(currPlayer.getCoin(1).position, 6);
        assert.equal(game.getCurrentPlayer().name, 'lala');
      });
    it('should not move coin more than once for a single dice roll', () => {
      let game = initGame(players,sixPointDice);
      game.rollDice();
      assert.isOk(game.moveCoin(1));
      assert.isNotOk(game.moveCoin(1));
    });
    it('should get one more chance to roll the dice if coin moves to destination ', () => {
      let game = initGame(players,fourPointDice);
      let currPlayer = game.getCurrentPlayer();
      let coin = currPlayer.getCoin(1);
      coin.setPosition(151);
      let playerChance = game.turn.currentPlayerChances;
      game.rollDice();
      game.moveCoin(1);
      assert.equal(game.turn.currentPlayerChances,playerChance);
    });
  });
  describe('#hasWon', () => {
    it('should return true if player has 4 coins in destination cell', () => {
      let game = initGame(players,fourPointDice);
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
  describe('killing of coin',function(){
    it('opp player coin should die when current player coin reach same unsafe cell in which opp coin is present',function(){
      let biasDice = {moves:[6,1,6,40],roll:()=>biasDice.moves.shift()}
      game = initGame(['salman','lala','lali','lalu'],biasDice);
      game.rollDice();
      game.moveCoin(1);
      game.rollDice();
      game.moveCoin(1);
      game.rollDice();
      game.moveCoin(5);
      game.rollDice();
      game.moveCoin(5)
      assert.equal(game.players[0].coins[0].getPosition(),-1);
      assert.equal(game.getCurrentPlayer().getName(),'lala');
    });
  });
  describe('#finish', () => {
    it('should finish game with no current player and no chances to play', () => {
      let biasDice = {moves:[6,1,6],roll:()=>biasDice.moves.shift()}
      game = initGame(['salman','lala','lali','lalu'],biasDice);
      game.finish();
      assert.equal(game.turn.currentPlayerChances,0);
      assert.deepEqual(game.turn.players,[]);
      assert.isNotOk(game.turn.hasMovedCoin());
    });
  });
});
