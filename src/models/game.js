class Game {
  constructor(name) {
    this.players=[];
    this.status={};
    this.name = name;
  }

  getStatus(){
    return this.status;
  }

  addPlayer(playerName) {
    this.players.push(playerName);
  }
}
module.exports = Game;
