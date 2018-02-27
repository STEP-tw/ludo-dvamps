const removePlayer=(req,res)=>{
  delPlayerFromGame(req,res);
  clearCookies(res);
  res.end();
};

const delPlayerFromGame = function(req,res){
  let gameName=req.cookies.gameName;
  let player= req.cookies.playerName;
  let game = req.app.gamesManager.getGame(gameName);
  game.removePlayer(player);
  let totalPlayers=game.getNoOfPlayers();
  if(!totalPlayers){
    req.app.gamesManager.removeGame(gameName);
  }
};

const clearCookies = function(res) {
  res.clearCookie('playerName',{path:''});
  res.clearCookie('gameName',{path:''});
  return;
};

// have to move these function from here to some suitable file.
module.exports={
  removePlayer,
  delPlayerFromGame,
  clearCookies
};
