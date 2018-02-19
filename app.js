const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const rfs = require('rotating-file-stream');

const GamesManager = require(path.resolve('src/models/gamesManager.js'));
const getHandlers = require(path.resolve('src/handlers/getHandlers.js'));
const postHandlers = require(path.resolve('src/handlers/postHandlers.js'));
const deleteHandler = require(path.resolve('src/handlers/deleteHandler.js'));
const lib = require(path.resolve('src/handlers/middleWares.js'));

const app = express();
/*eslint-disable*/
const ludo = express.Router();
/*eslint-enable*/
let logDir = path.resolve('logs/');

let lognameGenerator = function() {
  let time = new Date();
  let month = (time.getMonth() + 1) + "-" + time.getFullYear();
  let day = time.getDate();
  return day + '-' + month + '-file.log';
};

let accessLogStream = rfs(lognameGenerator, {
  interval: '1d',
  path: logDir
});

app.initialize = function(gamesManager,fs) {
  app.gamesManager = gamesManager;
  app.fs = fs;
};

app.use(logger('combined', {
  stream: accessLogStream
}));
app.use(express.urlencoded({
  extended: false
}));
app.use(express.json());
app.use(cookieParser());
app.use(lib.restrictValidPlayer);
app.use(express.static('public'));
app.use('/game',ludo);

app.get('/getAvailableGames', getHandlers.serveAvailableGames);
app.get('/gameName', getHandlers.serveGameName);
app.get('/userName', getHandlers.serveUserName);
app.get('/getStatus', getHandlers.serveGameStatus);
app.get('/rollDice',getHandlers.rollDice);
app.get('/diceStatus',getHandlers.getDiceStatus);

app.post('/createGame', postHandlers.verifyCreateGameReq,
  postHandlers.blockIfUserHasGame,postHandlers.createNewGame);
app.post('/joinGame',postHandlers.joinPlayerToGame);

app.delete('/player', deleteHandler.removePlayer);

ludo.use(lib.checkCookie);
ludo.use(lib.loadGame);
ludo.get('/boardStatus',getHandlers.getBoardStatus);
ludo.get('/board',lib.verifyGameAndPlayer,getHandlers.getBoard);

module.exports = app;
