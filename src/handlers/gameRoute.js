const express = require('express');
const path = require('path');
const getHandlers = require(path.resolve('src/handlers/getHandlers.js'));
const postHandlers = require(path.resolve('src/handlers/postHandlers.js'));
const deleteHandler = require(path.resolve('src/handlers/deleteHandler.js'));
const lib = require(path.resolve('src/handlers/middleWares.js'));

/*eslint-disable*/
const ludo = express.Router();
/*eslint-enable*/

ludo.use(lib.checkCookie);
ludo.use(lib.loadGame);
ludo.use(lib.verifyPlayer);

ludo.use(express.static('public'));
ludo.get('/playerDetails',getHandlers.getPlayerDetails);
ludo.get('/gameStatus',getHandlers.getGameStatus);
ludo.get('/logs',getHandlers.getLogs);
ludo.get('/rollDice',lib.checkCurrentPlayer,getHandlers.rollDice);
ludo.post('/nextPos',lib.checkCurrentPlayer,getHandlers.getNextPos);
ludo.post('/moveCoin',lib.checkCurrentPlayer,postHandlers.moveCoin);

module.exports = ludo;
