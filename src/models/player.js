const Coin = require('./coin.js');
const Path = require('./path.js');

class Player {
  constructor(name, color, coins, path) {
    this.name = name;
    this.color = color;
    this.coins = coins;
    this.path = path;
    this.hasKilledOpp = false;
  }
  getName() {
    return this.name;
  }
  getCoin(id) {
    return this.coins.find(coin => coin.id == id);
  }
  getColor() {
    return this.color;
  }
  getCoins() {
    return this.coins;
  }
  
  getStatus() {
    let coinsPositions = this.coins.map(coin => coin.getStatus());
    return {
      name: this.name,
      color: this.color,
      coins: coinsPositions
    };
  }
  getPath() {
    return this.path;
  }
  getMovableCoins(move) {
    let hasKilledOpp = this.hasKilledOpp;
    return this.coins.filter(coin => {
      return this.path.isMovePossible(coin, move, hasKilledOpp);
    });
  }
  hasMovableCoins(move) {
    return this.getMovableCoins(move).length > 0;
  }
  assignPath(path) {
    this.path.add(path);
  }
  moveCoin(coinId, move) {
    let coin = this.coins.find(coin => coin.id == coinId);
    let status = this.path.moveCoin(coin, move, this.hasKilledOpp);
    return status;
  }
  moveCoinToHome(coinDetail) {
    let coin = this.coins.find((coin) => coin.id == coinDetail.id);
    this.path.putAtHome(coin);
  }
  getNoOfCoinsInDest() {
    let path = this.getPath();
    return path.getCoinsInDest();
  }
  setKilledOpponent() {
    this.hasKilledOpp = true;
  }
  getNextPos(coinId,move){
    let coin = this.coins.find(coin=>coin.id==coinId);
    let status = this.path.getNextMove(coin,move,this.hasKilledOpp);
    return status.position;
  }
}
module.exports = Player;
