class ColorDistributer {
  constructor() {
    this.colors = ['red','yellow','green','blue'];
  }
  getColor() {
    return this.colors.shift();
  }
  addColor(color){
    if(this.colors.includes(color)){
      return;
    }
    this.colors.push(color);
  }
}
module.exports = ColorDistributer;
