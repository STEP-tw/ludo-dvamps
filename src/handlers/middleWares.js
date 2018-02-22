const checkCookie = function(req,res,next) {
  let gameName = req.cookies.gameName;
  let playerName = req.cookies.playerName;
  if(!gameName || !playerName){
    res.redirect('/index.html');
    return;
  }
  next();
};
const isEmptyString = function(string) {
  return string == '';
};

const verifyReqBody = function(req,res,next) {
  let bodyFieldValues = Object.values(req.body);
  if(bodyFieldValues.some(isEmptyString)){
    res.statusCode = 400;
    res.json({status:false,message:'empty field'});
    return;
  }
  next();
};

const trimRequestBody = function(req,res,next) {
  let bodyField = Object.keys(req.body);
  bodyField.forEach(function(field){
    req.body[field] = req.body[field].trim();
  });
  next();
};

const isPlayerValid = function(req){
  let game = req.app.gamesManager.getGame(req.cookies.gameName);
  return game && game.doesPlayerExist(req.cookies.playerName);
};

const restrictValidPlayer = function(req,res,next){
  let restrictedUrls = ['/','/index.html','/joining.html'];
  if (isPlayerValid(req) && restrictedUrls.includes(req.url)){
    res.redirect('/waiting.html');
    return;
  }
  next();
};

const redirectToHome = function(res) {
  res.redirect('/index.html');
};

const loadGame = function(req,res,next) {
  let gameName = req.cookies.gameName;
  let game = req.app.gamesManager.getGame(gameName);
  if(!game){
    return redirectToHome(res);
  }
  req.game = game;
  next();
};

const verifyPlayer =function(req,res,next) {
  let game = req.app.gamesManager.getGame(req.cookies.gameName);
  let playerName = req.cookies.playerName;
  if(!game.doesPlayerExist(playerName)){
    return redirectToHome(res);
  }
  next();
};

const checkCharacterLimit = function(req,res,next) {
  let gameName = req.body.gameName;
  let playerName = req.body.playerName;
  if(gameName.length>15 || playerName.length>8){
    res.statusCode = 400 ;
    res.json({gameCreated:false,message:'bad request'});
    return;
  }
  next();
};

module.exports = {
  checkCookie,
  loadGame,
  restrictValidPlayer,
  verifyPlayer,
  trimRequestBody,
  verifyReqBody,
  checkCharacterLimit
};
