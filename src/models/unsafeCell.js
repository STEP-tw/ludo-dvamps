const Cell = require('./cell.js');

class UnsafeCell extends Cell {
  constructor(position) {
    super(position);
  }
  removeCoin(coinId){
    let coinIndex = this.coins.findIndex(coin=>coin.id == coinId);
    return this.coins.splice(coinIndex,1).pop();
  }
  addCoin(coin){
    this.coins.push(coin);
    if (this.coins.length > 1) {
      this.coins.shift().die();
    }
  }
}

module.exports = UnsafeCell;
