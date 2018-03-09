const Cell = require('./cell.js');

class UnsafeCell extends Cell {
  constructor(position) {
    super(position);
  }

  hasCoins() {
    return this.coins.length>0;
  }

  addCoin(coin){
    let status = {killedOppCoin:false};
    coin.setPosition(this.getPosition());
    if(this.hasCoins() && !super.hasCoinOfSameColor(coin)){
      let oldCoin = this.coins.shift();
      status.killedOppCoin = true;
      status.diedCoin = oldCoin.getStatus();
    }
    this.coins.push(coin);
    return status;
  }

  canPlace(coin,isPaired){
    if(isPaired && super.hasCoinOfSameColor(coin)){
      return false;
    }
    return isPaired || this.noOfCoins<2;
  }

  canPassOver(isPaired){
    return isPaired || this.noOfCoins<2;
  }

  isUnsafe(){
    return true;
  }
}

module.exports = UnsafeCell;
