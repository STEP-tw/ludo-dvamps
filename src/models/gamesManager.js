const Game = require('./game.js');

class GamesManager {
  constructor(ColorDistributor,dice) {
    this.colorDistributor = ColorDistributor;
    this.allRunningGames = {};
    this.dice = dice;
  }
  getAvailableGames() {
    let allGames = Object.values(this.allRunningGames);
    let availableGames = allGames.filter(game => !game.hasEnoughPlayers());
    return availableGames.map(game => game.getDetails());
  }
  addGame(gameName) {
    let game = new Game(gameName, this.colorDistributor, this.dice);
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
}

module.exports = GamesManager;
