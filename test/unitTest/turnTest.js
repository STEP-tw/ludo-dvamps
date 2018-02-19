const Turn = require('../../src/models/turn.js');
const assert = require('chai').assert;

const dice = {
  roll : function(){
    return 4;
  }
};

describe('#Turn', () => {
  let turn;
  beforeEach(()=>{
    turn = new Turn(['red','green','blue','yellow']);
  });
  describe('#currentPlayer', () => {
    it('should return current player color', () => {
      let expected = 'red';
      assert.equal(turn.currentPlayer,'red');
    });
  });
  describe('#rollDice', () => {
    it('should roll the dice', () => {
      let move = turn.rollDice(dice);
      assert.equal(move,4);
    });
  });
});
