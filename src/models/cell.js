class Cell {
  constructor(position) {
    this.position = position;
    this.coins = [];
  }

  getNumberOfCoinsOf(color) {
    return this.coins.filter(coin=>coin.getColor()==color).length;
  }

  addCoin(coin){
    let status={killedOppCoin:false};
    coin.setPosition(this.position);
    this.coins.push(coin);
    this.coins.forEach(coin=>{
      let color = coin.getColor();
      status[color]=this.getNumberOfCoinsOf(color);
    });
    return status;
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
