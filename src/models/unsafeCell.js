const Cell = require('./cell.js');

class UnsafeCell extends Cell {
  constructor(position) {
    super();
  }
  removeCoin(coinId){
    let coinIndex = this.coins.findIndex(coin=>coin.id == coinId);
    return this.coins.splice(coinIndex,1).pop();
  }
}

module.exports = UnsafeCell;
