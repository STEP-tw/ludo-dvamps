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
  return string.trim()=='';
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

const checkGame = function(req,res,next) {
  if((req.url=='/board.html') && !(req.game)) {
    redirectToHome(res);
    return;
  }
  next();
};

const verifyPlayer =function(req,res,next) {
  let game = req.app.gamesManager.getGame(req.cookies.gameName);
  let playerName = req.cookies.playerName;
  if(!game.doesPlayerExist(playerName)){
    res.statusCode = 400;
    res.json({status:false,message:'invalid cookie'});
    res.end();
    return;
  }
  next();
};

const checkCharacterLimit = function(req,res,next) {
  let gameName = req.body.gameName;
  let playerName = req.body.playerName;
  if(gameName.length>15 || playerName.length>8){
    res.statusCode = 400 ;
    res.json({status:false,message:'bad request'});
    res.end();
    return;
  }
  next();
};

const checkCurrentPlayer= function(req,res,next){
  let currentPlayer = req.game.getCurrentPlayer().name;
  if (currentPlayer != req.cookies.playerName) {
    res.status(400);
    res.send({status:false,message:'Not your turn!'});
    return;
  }
  next();
};

const checkIsGamePresent = function(req,res,next){
  let gameName = req.cookies.gameName;
  if (!req.app.gamesManager.doesGameExists(gameName)) {
    res.statusCode = 400;
    res.send('');
    return;
  }
  next();
};

const logger = function(req,res,next){
  console.log(`${req.method} ${req.url}`);
  next();
};

const isValidReqBodyFormat = function(paramsKeys,req) {
  let reqParams = Object.keys(req.body);
  return paramsKeys.every(function(key){
    return reqParams.includes(key) && req.body[key];
  });
};

const verifyCreateGameReq = function(req,res,next) {//should be rename
  if(!isValidReqBodyFormat(['gameName','playerName'],req)){
    res.statusCode = 400 ;
    res.json({status:false,message:'bad request'});
    res.end();
    return;
  }
  next();
};

const hasCreatedGame = function(req){
  let game = req.app.gamesManager.getGame(req.cookies.gameName);
  return game && game.doesPlayerExist(req.cookies.playerName);
};

const blockIfUserHasGame = function(req,res,next){
  if(hasCreatedGame(req)) {
    res.json({status:true});
    res.end();
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

const doesGameExists = function(req,res,next){
  let game = req.app.gamesManager.getGame(req.body.gameName);
  if(!game){
    res.statusCode = 400;
    res.json({status:false,message:"game dosen\'t exist"});
    return;
  }
  next();
};
module.exports = {
  checkCookie,
  loadGame,
  restrictValidPlayer,
  verifyPlayer,
  verifyReqBody,
  checkCharacterLimit,
  checkCurrentPlayer,
  checkIsGamePresent,
  checkGame,
  logger,
  verifyCreateGameReq,
  blockIfUserHasGame,
  trimRequestBody,
  doesGameExists
};
