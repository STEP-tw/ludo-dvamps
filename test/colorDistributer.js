ColorDistributer = function() {
  this.colors = ['red', 'green', 'blue', 'yellow'];
}
ColorDistributer.prototype = {
  getColor: function() {
    return this.colors.shift();
  },
  addColor:function(color){
    if(this.colors.includes(color)){
      return;
    }
    this.colors.push(color);
  }
};

module.exports = ColorDistributer;
