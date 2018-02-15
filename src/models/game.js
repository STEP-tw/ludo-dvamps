class Game {
  constructor() {
    this.players = [];
    this.status={};
  }
  addPlayer(name){
    this.players.push({name:name});
  }
  getStatus(){
    return this.status;
  }
}
module.exports = Game;
