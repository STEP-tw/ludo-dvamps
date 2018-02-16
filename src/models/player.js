const Coin = require('./coin.js');
class Player {
  constructor(name,color) {
    this.name = name;
    this.color = color;
    this.coins = [];
  }
  getName() {
    return this.name;
  }
  getColor() {
    return this.color;
  }
  addCoin(){
    let coinId = this.coins.length+1;
    let coin = new Coin(coinId);
    this.coins.push(coin);
  }
  getStatus(){
    let coinsPositions = this.coins.map(coin => coin.getPosition());
    return {
      player:{
        name:this.name,
        color:this.color,
        coins: coinsPositions,
      }
    };
  }
}
module.exports = Player;
