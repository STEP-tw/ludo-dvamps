class Dice {
  constructor(random) {
    this.min = 1;
    this.max = 6;
    this.random = random;
  }
  roll(){
    return Math.floor(this.random() * this.max) + this.min;
  }
}

module.exports = Dice;
