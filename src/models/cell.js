class Cell {
  constructor(position) {
    this.position = position;
    this.coins = [];
  }
  addCoin(coin){
    coin.setPosition(this.position);
    this.coins.push(coin);
  }
  getPosition(){
    return this.position;
  }
}

module.exports = Cell;
