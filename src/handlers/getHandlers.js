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
    res.statusCode = 400;
    res.send('');
    return;
  }
  res.json(game.getStatus());
};

const getBoardStatus = function(req, res) {
  let game = req.game;
  res.json(game.getBoardStatus());
};

const verifyCurrentPlayer = function(currentPlayerName){
  let requestedPlayer = req.cookies.playerName;
  if (currentPlayerName != requestedPlayer) {
    res.status(400);
    res.end();
    return;
  }
};

const rollDice = function(req, res, next) {
  let game = req.game;
  let currentPlayer = game.getCurrentPlayer();
  let currentPlayerName = currentPlayer.getName();
  verifyCurrentPlayer(currentPlayerName);
  let move = game.rollDice();
  let path = currentPlayer.getPath();
  let coins = currentPlayer.getCoins();
  let movableCoins = playerCoins.filter(function(coin) {
    return path.isMovePossible(coin,move);
  });
  res.json({move:move,coins:movableCoins});
  next();
};

const getDiceStatus = function(req, res) {
  let game = req.game;
  let isvalidPlayer = game.doesPlayerExist(req.cookies.playerName);
  if (!isvalidPlayer) {
    res.statusCode = 400;
    res.send('');
    return;
  }
  let lastMove = game.currPlayerLastMove;
  res.json(move);
  res.end();
};

module.exports = {
  serveAvailableGames,
  serveGameName,
  serveUserName,
  serveGameStatus,
  getBoardStatus,
  getDiceStatus,
  rollDice
};
