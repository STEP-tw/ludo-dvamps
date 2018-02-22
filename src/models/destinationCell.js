const Cell = require('./cell.js');

class DestinationCell extends Cell {
  constructor() {
    super();
  }
  getNumberOfCoins(){
    return this.coins.length;
  }
}

module.exports = DestinationCell;
