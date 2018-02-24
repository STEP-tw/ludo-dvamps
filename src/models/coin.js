let EventEmitter = require('events');
class Coin extends EventEmitter{
  constructor(id,homePosition) {
    super();
    this.id = id;
    this.position = homePosition;
    this.homePosition = homePosition;
    this.color;
  }
  getPosition(){
    return this.position;
  }
  getStatus(){
    return {id:this.id,position:this.position,color:this.color};
  }
  setColor(color) {
    this.color = color;
  }
  setPosition(pos){
    this.position = pos;
  }
  die(){
    this.emit('died',{id:this.id,color:this.color});
  }
}

module.exports = Coin;
