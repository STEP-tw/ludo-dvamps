class Coin {
  constructor(id) {
    this.id = id;
    this.position = "home";
  }
  getPosition(){
    return this.position;
  }
}

module.exports = Coin;
