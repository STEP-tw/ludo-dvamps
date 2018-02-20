const lib = require('../lib/utility.js');

const serveAvailableGames = function(req, res) {
  let availableGames = req.app.gamesManager.getAvailableGames();
  res.send(availableGames);
};

const serveGameName = (req, res) => res.send(req.cookies.gameName);
const serveUserName = (req, res) => res.send(req.cookies.playerName);

const serveGameStatus = (req, res) => {
  let gameName = req.cookies.gameName;
  let game = req.app.gamesManager.getGame(gameName);
  if (game == undefined) {
    res.end();
    return;
  }
  res.json(game.getStatus());
};

const getBoardStatus = function(req, res) {
  let game = req.game;
  res.json(game.getBoardStatus());
};


const rollDice = function(req,res,next){
  let game = req.app.gamesManager.getGame(req.cookies.gameName);
  let currentPlayerName = game.getCurrentPlayerName();
  let requestedPlayer = req.cookies.playerName;
  if(currentPlayerName != requestedPlayer){
    res.end();
    return;
  }
  let move = game.rollDice();
  res.send(lib.toS(move));
};

const getDiceStatus = function(req,res){
  let game = req.app.gamesManager.getGame(req.cookies.gameName);
  let lastMove = game.currPlayerLastMove;
  res.send(lib.toS(lastMove));
};


module.exports = {
  serveAvailableGames,
  serveGameName,
  serveUserName,
  serveGameStatus,
  getBoardStatus,
  rollDice,
  getDiceStatus
};
