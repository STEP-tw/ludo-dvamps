const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

const GamesManager = require(path.resolve('src/models/gamesManager.js'));
const getHandlers = require(path.resolve('src/handlers/getHandlers.js'));
const postHandlers = require(path.resolve('src/handlers/postHandlers.js'));
const deleteHandler = require(path.resolve('src/handlers/deleteHandler.js'));
const lib = require(path.resolve('src/handlers/middleWares.js'));

const app = express();
/*eslint-disable*/
const ludo = express.Router();
/*eslint-enable*/

app.initialize = function(gamesManager,fs) {
  app.gamesManager = gamesManager;
  app.fs = fs;
};

//app.use(lib.logger);
app.use(express.urlencoded({
  extended: false
}));
app.use(express.json());
app.use(cookieParser());
app.use(lib.checkGame);
app.use(lib.trimRequestBody);
//app.use(lib.logger);
app.use(lib.restrictValidPlayer);
app.use(express.static('public'));
app.use('/game',ludo);
app.get('/getAvailableGames', getHandlers.serveAvailableGames);
app.get('/gameName', getHandlers.serveGameName);
app.get('/userName', getHandlers.serveUserName);
app.get('/getStatus',lib.checkIsGamePresent,getHandlers.serveGameStatus);
app.post('/createGame',lib.verifyReqBody,postHandlers.verifyCreateGameReq,
  lib.checkCharacterLimit,postHandlers.blockIfUserHasGame,
  postHandlers.createNewGame);
app.get('/debug',function(req,res,next){
  debugger;
  res.end();
});
app.post('/joinGame',lib.verifyReqBody,postHandlers.joinPlayerToGame);
app.delete('/player', deleteHandler.removePlayer);
ludo.use(lib.checkCookie);
ludo.use(lib.loadGame);
ludo.use(lib.verifyPlayer);
ludo.use(express.static('public'));
ludo.use(express.static('templates'));
ludo.get('/gameStatus',getHandlers.getGameStatus);
ludo.get('/logs',getHandlers.getLogs);
ludo.get('/rollDice',lib.checkCurrentPlayer,getHandlers.rollDice);
ludo.post('/moveCoin',lib.checkCurrentPlayer,postHandlers.moveCoin);

module.exports = app;
