class ColorDistributer {
  constructor() {
    this.colors = ['red','blue','green','yellow'];
  }
  getColor() {
    let colorIndex = Math.floor(Math.random() * this.colors.length);
    let color = this.colors.splice(colorIndex,1);
    return color.pop();
  }
  addColor(color){
    if(this.colors.includes(color)){
      return;
    }
    this.colors.push(color);
  }
}
module.exports = ColorDistributer;
