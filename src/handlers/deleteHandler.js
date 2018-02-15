const removePlayer=(req,res)=>{
  let gameName=req.body.gameName;
  let player= req.body.playerName;
  let game = req.app.gamesManager.getGame(gameName);
  game.removePlayer(player);
};
module.exports={
  removePlayer
};
