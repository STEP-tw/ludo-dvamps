const http = require('http');
const lib = require('./src/lib/utility.js');
const app = require('./app.js');
const Dice = require('./src/models/dice.js');
const path = require('path');
const fs = require('fs');
const GamesManager = require(path.resolve('src/models/gamesManager.js'));
const PORT = 8000;
const ColorDistributer = function() {
  this.currentIndex=0;
  this.colors = ['red','green','blue','yellow'];
};
ColorDistributer.prototype = {
  getColor:function() {
    this.currentIndex = this.currentIndex%4;
    return this.colors[this.currentIndex++];
  }
};
app.initialize(new GamesManager(ColorDistributer,new Dice(Math.random),fs);
const server = http.createServer(app);
server.listen(PORT);
console.log(`server listening at ${PORT}`);
