const Cell = require('./cell.js');

class DestinationCell extends Cell {
  constructor(position) {
    super(position);
  }
  addCoin(coin){
    super.addCoin(coin);
    return {reachedDestination:true};
  }
  getNumberOfCoins(){
    return this.coins.length;
  }
}

module.exports = DestinationCell;
