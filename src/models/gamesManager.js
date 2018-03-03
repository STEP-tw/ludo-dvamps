const Game = require('./game.js');

class GamesManager {
  constructor(ColorDistributor,dice,timeStamp) {
    this.ColorDistributor = ColorDistributor;
    this.allRunningGames = {};
    this.dice = dice;
    this.timeStamp = timeStamp;
  }
  getAvailableGames() {
    let allGames = Object.values(this.allRunningGames);
    let availableGames = allGames.filter(game => !game.hasEnoughPlayers());
    return availableGames.map(game => game.getDetails());
  }
  addGame(gameName) {
    let game = new Game(gameName, this.ColorDistributor,
      this.dice,this.timeStamp);
    this.allRunningGames[gameName] = game;
    return game;
  }
  getGame(gameName) {
    return this.allRunningGames[gameName];
  }
  addPlayerTo(gameName, player) {
    let game = this.allRunningGames[gameName];
    let isAdded = game.addPlayer(player);
    if(game.hasEnoughPlayers()){
      game.start();
    }
    return isAdded ;
  }
  doesGameExists(gameName) {
    return gameName in this.allRunningGames;
  }
  removeGame(gameName) {
    delete this.allRunningGames[gameName];
  }
  finishGame(gameName,timeToDelete){
    let game = this.getGame(gameName);
    game.finish();
    setTimeout(()=>this.removeGame(gameName),timeToDelete*1000);
  }
}

module.exports = GamesManager;
