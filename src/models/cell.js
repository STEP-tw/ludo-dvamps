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
  getPosition(){
    return this.position;
  }
  canPlace(coin){
    return true;
  }
}

module.exports = Cell;
