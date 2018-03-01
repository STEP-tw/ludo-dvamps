class Cell {
  constructor(position) {
    this.position = position;
    this.coins = [];
  }
  addCoin(coin){
    coin.setPosition(this.position);
    this.coins.push(coin);
    return {killedOppCoin:false};
  }

  removeCoin(coinId){
    let coinIndex = this.coins.findIndex(coin=>coin.id == coinId);
    return this.coins.splice(coinIndex,1).pop();
  }
  getPosition(){
    return this.position;
  }
  canPlace(coin){
    return true;
  }
}

module.exports = Cell;
