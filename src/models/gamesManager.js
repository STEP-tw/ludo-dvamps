const Game = require('./game.js');

class GamesManager {
  constructor() {
    this.allRunningGames={};
  }
  getAvailableGames(){
    let allGames = Object.values(this.allRunningGames);
    return allGames.filter(game=>game.players.length < 4);
  }
  addGame(gameName) {
    let game = new Game();
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
