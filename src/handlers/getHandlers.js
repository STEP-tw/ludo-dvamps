const serveAvailableGames = function(req,res){
  let availableGames = req.app.gamesManager.getAvailableGames();
  res.send(availableGames);
};

module.exports = {
  serveAvailableGames
};
