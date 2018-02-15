class Game {
  constructor() {
    this.players=[{name:'Manish'},{name:'salman'},{name:'pallabi'},{name:'PK'}];
    this.status={players:this.players};
  }
  getStatus(){
    return this.status;
  }
}
module.exports = Game;
