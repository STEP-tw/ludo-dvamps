const http = require('http');
const app = require('./app.js');
const Dice = require('./src/models/dice.js');
const path = require('path');
const GamesManager = require(path.resolve('src/models/gamesManager.js'));
const ColorDistributer = require('./src/models/colorDistributer.js');

const PORT = process.env.PORT || 8000;
const timeStamp = ()=>new Date();

app.initialize(new GamesManager(ColorDistributer,
  new Dice(Math.random),timeStamp)
);

const server = http.createServer(app);
server.listen(PORT);
console.log(`server listening at ${PORT}`);
