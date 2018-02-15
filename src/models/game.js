class Game {
  constructor(name) {
    this.name = name;
    this.players = [];
    this.status={};
    this.numberOfPlayers = 4;
  }
  addPlayer(name){
    this.players.push({name:name});
  }
  getStatus(){
    return this.status;
  }
  hasEnoughPlayers(){
    return this.numberOfPlayers <= this.players.length;
  }
  neededPlayers(){
    return this.numberOfPlayers - this.players.length;
  }
  getDetails(){
    return {
      name:this.name,
      remain:this.neededPlayers(),
      createdBy:this.players[0].name,
    };
  }
}
module.exports = Game;
