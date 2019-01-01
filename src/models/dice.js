class Dice {
  constructor(randomFunc) {
    this.min = 1;
    this.max = 6;
    this.random = randomFunc;
  }
  roll(){
    return Math.floor(this.random() * this.max) + this.min;
  }
}

module.exports = Dice;
