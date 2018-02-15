const serveAvailableGames = function(manager,req,res){
  let availableGames = manager.getAvailableGames();
  res.send(availableGames);
};

module.exports = {
  serveAvailableGames
};
