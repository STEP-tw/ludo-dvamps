const checkCookie = function(req,res,next) {
  let gameName = req.cookies.gameName;
  let playerName = req.cookies.playerName;
  if(!gameName || !playerName){
    res.redirect('/index');
    return;
  }
  next();
};

const isPlayerValid = function(req){
  let game = req.app.gamesManager.getGame(req.cookies.gameName);
  return game && game.doesPlayerExist(req.cookies.playerName);
}

const redirectJoinedPlayerToGame = function(req,res,next){
  if (isPlayerValid(req) && ['/','/index.html','/joining.html'].includes(req.url)){
    res.redirect('/waiting.html');
    return;
  }
  next();
}

const resWithBadReq = function(res,message) {
  res.statusCode = 400;
  res.send(message||'');
};

const loadGame = function(req,res,next) {
  let gameName = req.cookies.gameName;
  let game = req.app.gamesManager.getGame(gameName);
  if(!game){
    return resWithBadReq(res);
  }
  req.game = game;
  next();
};

const verifyGameAndPlayer =function(req,res,next) {
  let game = req.game;
  let playerName = req.cookies.playerName;
  if(!game||!game.getPlayer(playerName)) {
    return resWithBadReq(res);
  }
  next();
};

module.exports = {
  checkCookie,
  loadGame,
  verifyGameAndPlayer,
  redirectJoinedPlayerToGame
};
