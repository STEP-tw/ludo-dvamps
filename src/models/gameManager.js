const Game = require('./game.js');
class GameHandler {
  constructor() {
    this.runningGames={'D-VAMPS':new Game()};
  }
  getGame(gameName){
    return this.runningGames[gameName];
  }
}
module.exports=GameHandler;
