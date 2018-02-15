class Game {
  constructor() {
    this.players=[];
    this.status={players:this.players};
  }
  getStatus(){
    return this.status;
  }
}
module.exports = Game;
