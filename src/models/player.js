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
  getCoin(id){
    return this.coins.find(coin=>coin.id==id);
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
  hasMovableCoins(move){
    return this.coins.some(coin=>{
      return this.path.isMovePossible(coin,move);
    });
  }
  getMovableCoins(move){
    return this.coins.filter(coin=>{
      return this.path.isMovePossible(coin,move);
    });
  }
  assignPath(path){
    this.path.add(path);
  }
  moveCoin(coinId,move){
    let coin = this.coins.find(coin=>coin.id==coinId);
    let nextCoin = this.path.moveCoin(coin,move);
    coin.setPosition(nextCoin);
  }
  getNoOfCoinsInDest(){
    let path = this.getPath();
    return path.getCoinsInDest();
  }
}
module.exports = Player;
