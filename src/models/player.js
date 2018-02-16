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
}
module.exports = Player;
