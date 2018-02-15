class Game {
  constructor(name) {
    this.name = name;
    this.players = [];
  }
  addPlayer(name){
    this.players.push({name:name});
  }
}

module.exports = Game;
