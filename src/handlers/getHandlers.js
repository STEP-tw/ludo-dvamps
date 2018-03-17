const path = require('path');
const dbQuery = require(path.resolve('src/handlers/dbHandler.js'));

const serveAvailableGames = function(req, res) {
  let availableGames = req.app.gamesManager.getAvailableRooms();
  res.send(availableGames);
};

const serveWaitingStatus = (req, res) => {
  let roomName = req.cookies.gameName;
  let room = req.app.gamesManager.getRoom(roomName);
  res.json(room.getStatus());
};

const getGameStatus = function(req,res){
  let game = req.game;
  let gameStatus = game.getGameStatus();
  res.json(gameStatus);
};

const getLogs = function(req,res){
  let game = req.game;
  res.json(game.getLogs());
};

const rollDice = function(req, res) {
  let game = req.game;
  let diceRollStatus = game.rollDice();
  dbQuery.saveGamedata(req);
  res.json(diceRollStatus);
};

const getNextPos = function(req,res){
  let coinID = req.body.coinID;
  let game = req.game;
  res.json(game.getNextPos(coinID));
};

const getPlayerDetails = function(req,res) {
  let game = req.game;
  let status = game.getStatus();
  res.json(status);
};

const renderBoardPage = function(req,res) {
  let playerName = req.app.sessionManager.getPlayerBy(req.cookies.sessionId);
  let gameName = req.cookies.gameName;
  res.render('board',{title:'ludo',gameName:gameName,playerName:playerName});
};

const renderWaitingPage = function(req,res) {
  let playerName = req.app.sessionManager.getPlayerBy(req.cookies.sessionId);
  let gameName = req.cookies.gameName;
  res.render('waiting',
    {title:'Waiting For Opponents To Join',
      gameName:gameName,
      userName:playerName});
};


module.exports = {
  serveAvailableGames,
  serveWaitingStatus,
  getGameStatus,
  rollDice,
  getLogs,
  getNextPos,
  getPlayerDetails,
  renderBoardPage,
  renderWaitingPage
};
