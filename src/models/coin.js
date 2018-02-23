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

  setColor(color) {
    this.color = color;
  }
  setPosition(pos){
    this.position = pos;
  }
}

module.exports = Coin;
