const serveAvailableGames = function(req, res) {
  let availableGames = req.app.gamesManager.getAvailableGames();
  res.send(availableGames);
};

const serveWaitingStatus = (req, res) => {
  let gameName = req.cookies.gameName;
  let game = req.app.gamesManager.getGame(gameName);
  res.json(game.getStatus());
};

const getGameStatus = function(req,res){
  let game = req.game;
  let gameStatus = game.getGameStatus();
  res.json(gameStatus);
};

const getLogs = function(req,res){
  let game = req.game;
  res.json(game.getLogs());
  res.end();
};

const rollDice = function(req, res) {
  let game = req.game;
  let diceRollStatus = game.rollDice();
  res.json(diceRollStatus);
  res.end();
};

module.exports = {
  serveAvailableGames,
  serveWaitingStatus,
  getGameStatus,
  rollDice,
  getLogs
};
