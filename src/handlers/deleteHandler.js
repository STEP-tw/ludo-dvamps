const removePlayer=(req,res)=>{
  let gameName=req.cookies.gameName;
  let player= req.cookies.playerName;
  let game = req.app.gamesManager.getGame(gameName);
  game.removePlayer(player);
  res.clearCookie('playerName',{path:''});
  let totalPlayers=game.getNoOfPlayers();
  if(totalPlayers==0){
    req.app.gamesManager.removeGame(gameName);
    res.clearCookie('gameName',{path:''});
  }
  res.end();
};
module.exports={
  removePlayer
};
