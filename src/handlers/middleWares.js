const checkCookie = function(req,res,next) {
  let gameName = req.cookies.gameName;
  let playerName = req.cookies.playerName;
  if(!gameName || !playerName){
    res.redirect('/index');
    return;
  }
  next();
};

const resWithBadRequest = function(res,message) {
  res.statusCode = 400;
  res.send(message||'');
};

const loadGame = function(req,res,next) {
  let gameName = req.cookies.gameName;
  let game = req.app.gamesManager.getGame(gameName);
  if(!game){
    return resWithBadRequest(res);
  }
  req.game = game;
  next();
};

module.exports = {
  checkCookie,
  loadGame
};
