const assert = require('chai').assert;
const Dice = require('../../src/models/Dice.js');
const random = () => 0.45;

describe('#Dice', () => {
  let dice;
  beforeEach(()=>{
    dice = new Dice(random);
  })
  it('should return a number', () => {
    let move = dice.roll();
    assert.equal(move,3);
  });
});
