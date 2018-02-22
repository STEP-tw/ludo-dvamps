const Cell = require('./cell.js');

class DestinationCell extends Cell {
  constructor(position) {
    super(position);
  }
  getNumberOfCoins(){
    return this.coins.length;
  }
}

module.exports = DestinationCell;
