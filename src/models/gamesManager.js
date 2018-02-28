const Game = require('./game.js');

class GamesManager {
  constructor(ColorDistributor,dice) {
    this.ColorDistributor = ColorDistributor;
    this.allRunningGames = {};
    this.dice = dice;
  }
  getAvailableGames() {
    let allGames = Object.values(this.allRunningGames);
    let availableGames = allGames.filter(game => !game.hasEnoughPlayers());
    return availableGames.map(game => game.getDetails());
  }
  addGame(gameName) {
    let game = new Game(gameName, this.ColorDistributor, this.dice);
    this.allRunningGames[gameName] = game;
    return game;
  }
  getGame(gameName) {
    return this.allRunningGames[gameName];
  }
  addPlayerTo(gameName, player) {
    return this.allRunningGames[gameName].addPlayer(player);
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
