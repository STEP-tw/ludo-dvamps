const removePlayer=(req,res)=>{
  let gameName=req.cookies.gameName;
  let player= req.cookies.playerName;
  let game = req.app.gamesManager.getGame(gameName);
  game.removePlayer(player);
  res.clearCookie('playerName',{path:''});
  res.end();
};
module.exports={
  removePlayer
};
