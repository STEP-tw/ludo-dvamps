const Coin = require('./coin.js');
const Path = require('./path.js');

class Player {
  constructor(name,color,coins,path) {
    this.name = name;
    this.color = color;
    this.coins = coins;
    this.path = path;
  }
  getName() {
    return this.name;
  }
  getColor() {
    return this.color;
  }
  getCoins(){
    return this.coins;
  }
  getStatus(){
    let coinsPositions = this.coins.map(coin => coin.getPosition());
    return {
      name:this.name,
      color:this.color,
      coins: coinsPositions
    };
  }
  getPath(){
    return this.path;
  }
}
module.exports = Player;
