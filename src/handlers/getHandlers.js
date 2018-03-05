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
  res.json(diceRollStatus);
};

const getNextPos = function(req,res){
  let coinID = req.body.coinID;
  let game = req.game;
  res.json(game.getNextPos(coinID));
};

const getPlayerDetails = function(req,res) {
  let game = req.game;
  res.json(game.getStatus());
};

module.exports = {
  serveAvailableGames,
  serveWaitingStatus,
  getGameStatus,
  rollDice,
  getLogs,
  getNextPos
  getPlayerDetails
};
