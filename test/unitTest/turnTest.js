const assert = require('chai').assert
const path = require('path');
const Turn= require(path.resolve('src/models/turn.js'));
const EventEmitter= require('events');
const dice = {
  roll : function(){
    return 4;
  }
}

describe('#Turn', () => {
  beforeEach(()=>{
    turn = new Turn(['red','green','yellow','blue']);
  })

  describe('#currentPlayer', () => {
    it('should give current Player ', () => {
      assert.equal(turn.currentPlayer,'red');
    });
  });

  describe('#currentPlayerChances', () => {
    it('should give current Player chances', () => {
      assert.equal(turn.currentPlayerChances,1);
    });
  });

  describe('#has3ConsecutiveSixes', () => {
    it('should return true for three consecutive six', () => {
      turn.currentPlayerMoves = [6,6,6];
      assert.isOk(turn.has3ConsecutiveSixes());
    });
    it(`should return true if last three moves are consecutive sixes`, () => {
      turn.currentPlayerMoves = [2,6,6,6];
      assert.isOk(turn.has3ConsecutiveSixes());
    });
    it(`should return false if moves don't have three consecutive sixes`, () => {
      turn.currentPlayerMoves = [6,6,5];
      assert.isNotOk(turn.has3ConsecutiveSixes());
    });
    it('should return false if there are only two sixes', () => {
      turn.currentPlayerMoves = [6,6];
      assert.isNotOk(turn.has3ConsecutiveSixes());
    });
  });

  describe('#lastMove', () => {
    it('should give last move of Player', () => {
      turn.currentPlayerMoves = [6,6,5];
      assert.equal(turn.lastMove,5);
    });
  });

  describe('#increamentChances', () => {
    it('should increament and return chances of current Player', () => {
      assert.equal(turn.increamentChances(),2);
    });
  });

  describe('#decrementChances', () => {
    it('should decrement and return chances of current Player', () => {
      assert.equal(turn.decrementChances(),0);
    });
  });

  describe('#updateTurn', () => {
    it('should update current player', () => {
      turn.currentPlayerMoves = [1,2];
      turn.playerChances = 2;
      assert.equal(turn.updateTurn(),'green');
      assert.deepEqual(turn.currentPlayerMoves,[]);
      assert.equal(turn.currentPlayerChances,1);
    });
  });

  describe('#decideTurnOnChance', () => {
    it('should change turn when there are no chances remaining to current player', () => {
      turn.playerChances = 0
      assert.equal(turn.decideTurnOnChance(),'green');
    });
    it('should not change turn when there are chances remaining to current player', () => {
      turn.playerChances = 1;
      assert.equal(turn.decideTurnOnChance(),'red');
    });
  });

  describe('#decideTurnAsPerMove', () => {
    it('should return current Player if there are movable coin', () => {
      turn.currentPlayerMoves = [1];
      assert.equal(turn.decideTurnAsPerMove(true),'red');
    });
    it('should return next player if there are no movable coin', () => {
      turn.currentPlayerMoves = [1];
      assert.equal(turn.decideTurnAsPerMove(false),'green');
    });
    it('should return same player if last move is 6 and chances should be increament', () => {
      turn.currentPlayerMoves = [6];
      assert.equal(turn.decideTurnAsPerMove(true),'red');
      assert.equal(turn.currentPlayerChances,2);
    });
    it('should return next player if last three consecutive moves are 6', () => {
      turn.currentPlayerMoves = [6,6,6];
      assert.equal(turn.decideTurnAsPerMove(true),'green');
    });
  });
  describe('#rollDice', () => {
    it('should roll the dice if there are chances', () => {
      let move = turn.rollDice(dice);
      assert.equal(move,4);
      assert.equal(turn.lastMove,4);
    });
    it('should not roll dice if no player chances remaining ', () => {
      turn.playerChances = 0;
      let move = turn.rollDice(dice);
      assert.isUndefined(move);
    });
  });
});
