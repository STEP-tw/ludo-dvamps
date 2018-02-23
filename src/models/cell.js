class Cell {
  constructor(position) {
    this.position = position;
    this.coins = [];
  }
  addCoin(coin){
    coin.setPosition(this.position);
    this.coins.push(coin);
  }
}

module.exports = Cell;
