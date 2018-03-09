class Cell {
  constructor(position) {
    this.position = position;
    this.coins = [];
  }

  getCoins(){
    return this.coins.map((coin)=>{
      return coin.getId();
    });
  }

  get noOfCoins(){
    return this.coins.length;
  }

  hasCoinOfSameColor(coin) {
    return this.coins.some(prevCoin=>prevCoin.getColor()==coin.getColor());
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

  canPassOver(isPaired){
    return true;
  }

  isUnsafe(){
    return false;
  }
}

module.exports = Cell;
