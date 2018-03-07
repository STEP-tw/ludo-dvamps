class Coin {
  constructor(id,homePosition) {
    this.id = id;
    this.position = homePosition;
    this.homePosition = homePosition;
    this.color;
  }
  getPosition(){
    return this.position;
  }
  getId(){
    return this.id;
  }
  getStatus(){//name should be changed to getDetail.
    return {id:this.id,position:this.position,color:this.color};
  }
  getColor(){
    return this.color;
  }
  setColor(color) {
    this.color = color;
  }
  setPosition(pos){
    this.position = pos;
  }
}

module.exports = Coin;
