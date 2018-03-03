const removePlayer=(req,res)=>{
  delPlayerFromRoom(req,res);
  clearCookies(res);
  res.end();
};

const delPlayerFromRoom = function(req,res){
  let gamesManager = req.app.gamesManager;
  let gameName=req.cookies.gameName;
  let playerName= req.cookies.playerName;
  gamesManager.leaveRoom(gameName,playerName);
};

const clearCookies = function(res) {
  res.clearCookie('playerName',{path:''});
  res.clearCookie('gameName',{path:''});
  return;
};

// have to move these function from here to some suitable file.
module.exports={
  removePlayer,
  delPlayerFromRoom,
  clearCookies
};
