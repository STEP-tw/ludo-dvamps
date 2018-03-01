const Cell = require('./cell.js');

class UnsafeCell extends Cell {
  constructor(position) {
    super(position);
  }
  addCoin(coin){
    let status = {killedOppCoin:false};
    coin.setPosition(this.getPosition());
    this.coins.push(coin);
    if (this.coins.length > 1) {
      let oldCoin = this.coins.shift();
      status.killedOppCoin = true;
      status.diedCoin = oldCoin.getStatus();
    }
    return status;
  }
  canPlace(coin){
    return !this.coins.some(prevCoin=>prevCoin.getColor()==coin.getColor());
  }
}

module.exports = UnsafeCell;
