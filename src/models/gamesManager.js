const Game = require('./game.js');

class GamesManager {
  constructor() {
    this.allRunningGames={};
  }
  getAvailableGames(){
    let allGames = Object.values(this.allRunningGames);
    return allGames.filter(game=>game.players.length < 4);
  }
  addGame(gameName){
    this.allRunningGames[gameName] = new Game(gameName);
  }
  addPlayerTo(gameName,player){
    this.allRunningGames[gameName].addPlayer(player);
  }
}

module.exports = GamesManager;
