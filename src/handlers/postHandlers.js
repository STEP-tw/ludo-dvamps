let postHandlers = {};
const createNewGame = function(req,res) {
  let gamesManager = req.app.gamesManager;
  let gameName = req.body.gameName;
  let playerName = req.body.playerName;
  let game = gamesManager.addGame(gameName);
  game.addPlayer(playerName);
  res.cookie('gameName',gameName);
  res.cookie('playerName',playerName);
  res.end();
};

postHandlers.createNewGame = createNewGame;

module.exports = postHandlers;
