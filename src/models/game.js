const Player = require('./player.js');
class Game {
  constructor(name, colorDistributor) {
    this.name = name;
    this.players = [];
    this.status = {};
    this.numberOfPlayers = 4;
    this.colorDistributor = colorDistributor;
  }
  getStatus() {
    return this.status;
  }
  hasEnoughPlayers() {
    return this.numberOfPlayers <= this.players.length;
  }
  neededPlayers() {
    return this.numberOfPlayers - this.players.length;
  }
  getDetails() {
    return {
      name: this.name,
      remain: this.neededPlayers(),
      createdBy: this.players[0].name,
    };
  }
  doesPlayerExist(playerName) {
    return this.players.some((player) => player.name == playerName);
  }
  addPlayer(playerName) {
    if (!this.doesPlayerExist(playerName)) {
      let playerColor = this.colorDistributor.getColor();
      let player = new Player(playerName, playerColor);
      this.players.push(player);
      this.setStatus();
      return true;
    }
    return false;
  }
  getPlayer(playerName) {
    let player = this.players.find(player => player.name == playerName);
    let playerIndex = this.players.indexOf(player);
    return this.players[playerIndex];
  }
  removePlayer(playerName) {
    let player = this.players.find(player => player.name == playerName);
    let playerIndex = this.players.indexOf(player);
    this.players.splice(playerIndex, 1);
    this.setStatus();
  }
  getBoardStatus() {
    return this.players.reduce(function(boardStatus, player) {
      boardStatus[player.getColor()] = player.getName();
      return boardStatus;
    }, {});
  }
  getNoOfPlayers() {
    return this.players.length;
  }
  setStatus() {
    this.status.players = this.players.map(player => player.getStatus());
  }
}
module.exports = Game;
