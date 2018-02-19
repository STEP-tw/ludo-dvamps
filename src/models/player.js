const Coin = require('./coin.js');
class Player {
  constructor(name,color,coins) {
    this.name = name;
    this.color = color;
    this.coins = coins;
  }
  getName() {
    return this.name;
  }
  getColor() {
    return this.color;
  }
  getStatus(){
    let coinsPositions = this.coins.map(coin => coin.getPosition());
    return {
      name:this.name,
      color:this.color,
      coins: coinsPositions
    };
  }
}
module.exports = Player;
