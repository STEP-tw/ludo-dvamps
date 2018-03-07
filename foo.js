const Dice = require('./src/models/dice.js');
const path = require('path');
const GamesManager = require(path.resolve('src/models/gamesManager.js'));
const ColorDistributer = require('./src/models/colorDistributer.js');
const timeStamp = ()=>new Date();
let gameMananger = new GamesManager(ColorDistributer,
  new Dice(Math.random),timeStamp);
module.exports = gameMananger;