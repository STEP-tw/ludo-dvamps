const removePlayer=(req,res)=>{
  let gameName=req.cookies.gameName;
  let player= req.cookies.playerName;
  let game = req.app.gamesManager.getGame(gameName);
  game.removePlayer(player);
};
module.exports={
  removePlayer
};
