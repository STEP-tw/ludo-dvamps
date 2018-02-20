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

const getGameStatus = function(req,res){
  let game = req.game;
  res.json(game.getGameStatus());
  res.end();
};


const rollDice = function(req, res, next) {
  let game = req.game;
  let currentPlayerName = game.getCurrentPlayerName();
  let requestedPlayer = req.cookies.playerName;
  if (currentPlayerName != requestedPlayer) {
    res.status(400);
    res.end();
    return;
  }
  let move = game.rollDice();
  res.json(move);
  next();
};

const getDiceStatus = function(req, res) {
  let game = req.game;
  let lastMove = game.currPlayerLastMove;
  res.json(lastMove);
  res.end();
};

module.exports = {
  serveAvailableGames,
  serveGameName,
  serveUserName,
  serveGameStatus,
  getGameStatus,
  getDiceStatus,
  rollDice
};
