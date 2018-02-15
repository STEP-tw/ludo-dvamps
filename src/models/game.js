class Game {
  constructor(name) {
    this.name = name;
    this.players = [];
  }

  addPlayer(playerName) {
    this.players.push(playerName);
  }
}

module.exports = Game;
