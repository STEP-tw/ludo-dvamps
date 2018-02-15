class Game {
  constructor() {
    this.players = [];
    this.status={};
  }
  getStatus(){
    return this.status;
  }
  addPlayer(playerName) {
    this.players.push({name:`${playerName}`});
  }
  getPlayer(playerName){
    let player = this.players.find( player => player.name == playerName);
    let playerIndex=this.players.indexOf(player);
    return this.players[playerIndex];
  }
  removePlayer(playerName){
    let player = this.players.find(player => player.name == playerName);
    let playerIndex=this.players.indexOf(player);
    this.players.splice(playerIndex,1);
  }
}
module.exports = Game;
