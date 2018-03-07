const Cell = require('./cell.js');

class UnsafeCell extends Cell {
  constructor(position) {
    super(position);
  }

  hasCoinOfSameColor(coin) {
    return this.coins.some(prevCoin=>prevCoin.getColor()==coin.getColor());
  }

  hasCoins() {
    return this.coins.length>0;
  }

  addCoin(coin){
    let status = {killedOppCoin:false};
    coin.setPosition(this.getPosition());
    if(this.hasCoins() && !this.hasCoinOfSameColor(coin)){
      let oldCoin = this.coins.shift();
      status.killedOppCoin = true;
      status.diedCoin = oldCoin.getStatus();
    }
    this.coins.push(coin);
    return status;
  }

  canPlace(coin){
    return this.coins.length<2;
  }

  isUnsafe(){
    return true;
  }
}

module.exports = UnsafeCell;
