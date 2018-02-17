const http = require('http');
const app = require('./app.js');
const path = require('path');
const fs = require('fs');
const GamesManager = require(path.resolve('src/models/gamesManager.js'));
const PORT = 8000;
const ColorDistributer = function() {
  this.colors = ['red','green','blue','yellow'];
};
ColorDistributer.prototype = {
  getColor:function() {
    return this.colors.shift();
  }
};
app.initialize(new GamesManager(new ColorDistributer()),fs);
const server = http.createServer(app);
server.listen(PORT);
console.log(`server listening at ${PORT}`);
