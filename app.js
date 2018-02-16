const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const rfs = require('rotating-file-stream');
const GamesManager = require(path.resolve('src/models/gamesManager.js'));
const getHandlers = require(path.resolve('src/handlers/getHandlers.js'));
const postHandlers = require(path.resolve('src/handlers/postHandlers.js'));
const deleteHandler = require(path.resolve('src/handlers/deleteHandler.js'));
const defaultHandlers = require(path.resolve('src/handlers/defaultHandler.js'));
const app = express();
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
app.initialize = function(gamesManager) {
  app.gamesManager = gamesManager;
};
app.use(logger('combined', {
  stream: accessLogStream
}));
app.use(express.urlencoded({
  extended: false
}));
app.use(express.json());

app.get('/', defaultHandlers.handleSlash);
app.get('/getAvailableGames', getHandlers.serveAvailableGames);

app.use(express.static('public'));
app.use(cookieParser());
app.post('/createGame', postHandlers.verifyCreateGameReq,
  postHandlers.createNewGame);
app.get('/gameName', getHandlers.serveGameName);
app.get('/userName', getHandlers.serveUserName);
app.delete('/player', deleteHandler.removePlayer);
app.get('/getStatus', getHandlers.serveGameStatus);
//app.get('/boardStatus',postHandlers.serveBoardStatus);
module.exports = app;
