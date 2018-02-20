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

const getGameStatus = function(req,res){
  let game = req.game;
  res.json(game.getGameStatus());
  res.end();
};

const rollDice = function(req,res,next){
  let game = req.app.gamesManager.getGame(req.cookies.gameName);
  let requestedPlayer = req.cookies.playerName;
  if(game.getCurrentPlayerName() != requestedPlayer){
    res.status(400);
    res.end();
    return;
  }
  let move = game.rollDice();
  res.json(move);
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
