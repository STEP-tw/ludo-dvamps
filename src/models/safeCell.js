const Cell = require('./cell.js');

class SafeCell extends Cell {
  constructor(position) {
    super(position);
  }
  removeCoin(coinId){
    let coinIndex = this.coins.findIndex(coin=>coin.id == coinId);
    return this.coins.splice(coinIndex,1).pop();
  }
}

module.exports = SafeCell;
