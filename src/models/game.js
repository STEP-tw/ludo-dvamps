class Game {
  constructor(name) {
    this.name = name;
    this.players = [];
    this.status={};
    this.numberOfPlayers = 4;
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

  doesPlayerExist(playerName){
    return this.players.some((player)=>player.name == playerName);
  }

  addPlayer(playerName) {
    if (!this.doesPlayerExist(playerName)) {
      this.players.push({name:`${playerName}`});
      return true;
    }
    return false;
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
