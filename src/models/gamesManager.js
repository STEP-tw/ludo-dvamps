const Game = require('./game.js');

class GamesManager {
  constructor(colorDistributor) {
    this.colorDistributor = colorDistributor;
    this.allRunningGames = {};
  }
  getAvailableGames(){
    let allGames = Object.values(this.allRunningGames);
    let availableGames = allGames.filter(game=>!game.hasEnoughPlayers());
    return availableGames.map(game=>game.getDetails());
  }
  addGame(gameName) {
    let game = new Game(gameName,this.colorDistributor);
    this.allRunningGames[gameName] = game;
    return game;
  }
  getGame(gameName){
    return this.allRunningGames[gameName];
  }
  addPlayerTo(gameName,player){
    this.allRunningGames[gameName].addPlayer(player);
  }
  doesGameExists(gameName) {
    return gameName in this.allRunningGames;
  }
}

module.exports = GamesManager;
