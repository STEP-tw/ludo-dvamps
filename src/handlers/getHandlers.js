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

const isCurrentPlayer = function(req,currentPlayerName){
  let requestedPlayer = req.cookies.playerName;
  return currentPlayerName == requestedPlayer;
};

const rollDice = function(req, res) {
  let game = req.game;
  let currentPlayer = game.getCurrentPlayer();
  let currentPlayerName = currentPlayer.getName();
  if(!isCurrentPlayer(req,currentPlayerName)){
    res.statusCode = 400;
    res.send({move:false,message:'Not your turn!'});
    return;
  }
  let diceRollStatus = game.rollDice();
  res.json(diceRollStatus);
  res.end();
};

module.exports = {
  serveAvailableGames,
  serveGameName,
  serveUserName,
  serveGameStatus,
  getGameStatus,
  rollDice
};
