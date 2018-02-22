class Cell {
  constructor(position) {
    this.position = position;
    this.coins = [];
  }
  addCoin(coin){
    this.coins.push(coin);
  }
}

module.exports = Cell;
