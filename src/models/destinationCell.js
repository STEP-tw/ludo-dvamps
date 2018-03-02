const Cell = require('./cell.js');

class DestinationCell extends Cell {
  constructor(position) {
    super(position);
  }
  addCoin(coin){
    super.addCoin(coin);
    coin.setPosition(this.position);
    return {reachedDestination:true};
  }
  getNumberOfCoins(){
    return this.coins.length;
  }
}

module.exports = DestinationCell;
