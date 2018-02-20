class ColorDistributer {
  constructor() {
    this.colors = ['red','green','blue','yellow'];
  }
  getColor() {
    let colorIndex = Math.floor(Math.random() * this.colors.length);
    let color = this.colors.splice(colorIndex,1);
    if(color.length == 0){
      this.colors = ['red','green','blue','yellow'];
    }
    return color;
  }
  addColor(color){
    if(this.colors.includes(color)){
      return;
    }
    this.colors.push(color);
  }
}
module.exports = ColorDistributer;
