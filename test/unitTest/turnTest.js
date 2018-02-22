const assert = require('chai').assert
const path = require('path');
const Turn= require(path.resolve('src/models/turn.js'));

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

  describe('#shouldChangeTurn', () => {
    it('should return true if player chances are zero and move [1]', () => {
      turn.currentPlayerMoves = [1];
      turn.playerChances = 0;
      assert.isOk(turn.shouldChangeTurn());
    });
    it('should return false if player have chance and moves are [1]', () => {
      turn.currentPlayerMoves = [1];
      turn.playerChances = 1;
      assert.isNotOk(turn.shouldChangeTurn());
    });
    it(`should return false if player have chance and move is [6]`, () => {
      turn.currentPlayerMoves = [6];
      assert.isNotOk(turn.shouldChangeTurn());
    });
    it(`should return false if player have chance and moves are [6,2]`, () => {
      turn.currentPlayerMoves = [6,2];
      turn.playerChances = 1;
      assert.isNotOk(turn.shouldChangeTurn());
    });
    it(`should return true if player don't have chance and moves are [6,1]`, () => {
      turn.currentPlayerMoves = [6,1];
      turn.playerChances = 0;
      assert.isOk(turn.shouldChangeTurn());
    });
    it(`should return false if player have chance and moves are [6,6]`, () => {
      turn.currentPlayerMoves = [6,6];
      turn.playerChances = 1;
      assert.isNotOk(turn.shouldChangeTurn());
    });
    it(`should return true if player don't have chance and moves are [6,6,1]`, () => {
      turn.currentPlayerMoves = [6,6,1];
      turn.playerChances = 0;
      assert.isOk(turn.shouldChangeTurn());
    });
    it(`should return false if player have chance and moves are [6,6,1]`, () => {
      turn.currentPlayerMoves = [6,6,1];
      turn.playerChances = 1;
      assert.isNotOk(turn.shouldChangeTurn());
    });
    it(`should return true if player have chance and moves are [6,6,6]`, () => {
      turn.currentPlayerMoves = [6,6,6];
      turn.playerChances = 1;
      assert.isOk(turn.shouldChangeTurn());
    });
    it(`should return true if player don't have chance and moves are [6,6,6]`, () => {
      turn.currentPlayerMoves = [6,6,6];
      turn.playerChances = 0;
      assert.isOk(turn.shouldChangeTurn());
    });
    it(`should return false if player have chance and moves are [6,6]`, () => {
      turn.currentPlayerMoves = [6,6];
      turn.playerChances = 1;
      assert.isNotOk(turn.shouldChangeTurn());
    });
    it(`should return false if player have chance and moves are [2,6]`, () => {
      turn.currentPlayerMoves = [2,6];
      turn.playerChances = 1;
      assert.isNotOk(turn.shouldChangeTurn());
    });
    it(`should return true if player don't have chance and moves are [2,6,6,2]`, () => {
      turn.currentPlayerMoves = [2,6,6,2];
      turn.playerChances = 0;
      assert.isOk(turn.shouldChangeTurn());
    });
    it(`should return false if player have chance and moves are [2,6,6,2]`, () => {
      turn.currentPlayerMoves = [2,6,6,2];
      turn.playerChances = 1;
      assert.isNotOk(turn.shouldChangeTurn());
    });
    it(`should return false if player have chance and moves are [2,2]`, () => {
      turn.currentPlayerMoves = [2,2];
      turn.playerChances = 1;
      assert.isNotOk(turn.shouldChangeTurn());
    });
    it(`should return true if player don't have chance and moves are [2,2]`, () => {
      turn.currentPlayerMoves = [2,2];
      turn.playerChances = 0;
      assert.isOk(turn.shouldChangeTurn());
    });
  });

  describe('#decideTurn', () => {
    it('should return green if player chances are zero and move [1]', () => {
      turn.currentPlayerMoves = [1];
      turn.playerChances = 0;
      assert.equal(turn.decideTurn(),'green');
      assert.equal(turn.currentPlayerChances,1);
      assert.deepEqual(turn.currentPlayerMoves,[]);
    });
    it('should return red if player have chance and moves are [1]', () => {
      turn.currentPlayerMoves = [1];
      turn.playerChances = 1;
      assert.equal(turn.decideTurn(),'red');
      assert.equal(turn.currentPlayerChances,1);
    });
    it(`should return red if player have chance and move is [6]`, () => {
      turn.currentPlayerMoves = [6];
      assert.equal(turn.decideTurn(),'red');
      assert.equal(turn.currentPlayerChances,2);
    });
    it(`should return red if player have chance and moves are [6,2]`, () => {
      turn.currentPlayerMoves = [6,2];
      turn.playerChances = 1;
      assert.equal(turn.decideTurn(),'red');
      assert.equal(turn.currentPlayerChances,1);
    });
    it(`should return green if player don't have chance and moves are [6,1]`, () => {
      turn.currentPlayerMoves = [6,1];
      turn.playerChances = 0;
      assert.equal(turn.decideTurn(),'green');
      assert.equal(turn.currentPlayerChances,1);
      assert.deepEqual(turn.currentPlayerMoves,[]);
    });
    it(`should return red if player have chance and moves are [6,6]`, () => {
      turn.currentPlayerMoves = [6,6];
      turn.playerChances = 1;
      assert.equal(turn.decideTurn(),'red');
      assert.equal(turn.currentPlayerChances,2);
    });
    it(`should return green if player don't have chance and moves are [6,6,1]`, () => {
      turn.currentPlayerMoves = [6,6,1];
      turn.playerChances = 0;
      assert.equal(turn.decideTurn(),'green');
      assert.equal(turn.currentPlayerChances,1);
      assert.deepEqual(turn.currentPlayerMoves,[]);
    });
    it(`should return red if player have chance and moves are [6,6,1]`, () => {
      turn.currentPlayerMoves = [6,6,1];
      turn.playerChances = 1;
      assert.equal(turn.decideTurn(),'red');
      assert.equal(turn.currentPlayerChances,1);
    });
    it(`should return green if player have chance and moves are [6,6,6]`, () => {
      turn.currentPlayerMoves = [6,6,6];
      turn.playerChances = 1;
      assert.equal(turn.decideTurn(),'green');
      assert.equal(turn.currentPlayerChances,1);
      assert.deepEqual(turn.currentPlayerMoves,[]);
    });
    it(`should return green if player don't have chance and moves are [6,6,6]`, () => {
      turn.currentPlayerMoves = [6,6,6];
      turn.playerChances = 0;
      assert.equal(turn.decideTurn(),'green');
      assert.equal(turn.currentPlayerChances,1);
      assert.deepEqual(turn.currentPlayerMoves,[]);
    });
    it(`should return red if player have chance and moves are [6,6]`, () => {
      turn.currentPlayerMoves = [6,6];
      turn.playerChances = 1;
      assert.equal(turn.decideTurn(),'red');
      assert.equal(turn.currentPlayerChances,2);
    });
    it(`should return red if player have chance and moves are [2,6]`, () => {
      turn.currentPlayerMoves = [2,6];
      turn.playerChances = 1;
      assert.equal(turn.decideTurn(),'red');
      assert.equal(turn.currentPlayerChances,2);
    });
    it(`should return green if player don't have chance and moves are [2,6,6,2]`, () => {
      turn.currentPlayerMoves = [2,6,6,2];
      turn.playerChances = 0;
      assert.equal(turn.decideTurn(),'green');
      assert.equal(turn.currentPlayerChances,1);
      assert.deepEqual(turn.currentPlayerMoves,[]);
    });
    it(`should return red if player have chance and moves are [2,6,6,2]`, () => {
      turn.currentPlayerMoves = [2,6,6,2];
      turn.playerChances = 1;
      assert.equal(turn.decideTurn(),'red');
      assert.equal(turn.currentPlayerChances,1);
    });
    it(`should return red if player have chance and moves are [2,2]`, () => {
      turn.currentPlayerMoves = [2,2];
      turn.playerChances = 1;
      assert.equal(turn.decideTurn(),'red');
      assert.equal(turn.currentPlayerChances,1);
    });
    it(`should return green if player don't have chance and moves are [2,2]`, () => {
      turn.currentPlayerMoves = [2,2];
      turn.playerChances = 0;
      assert.equal(turn.decideTurn(),'green');
      assert.equal(turn.currentPlayerChances,1);
      assert.deepEqual(turn.currentPlayerMoves,[]);
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
