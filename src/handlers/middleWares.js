const resForBadRequest = function(res,message){
  res.statusCode = 400;
  res.json({status:false,message:message});
  res.end();
  return;
};

const checkCookie = function(req,res,next) {
  let gameName = req.cookies.gameName;
  let playerName = req.cookies.playerName;
  if(gameName && playerName){
    next();
    return;
  }
  res.redirect('/index.html');
  return;
};

const isEmptyString = function(string) {
  return string.trim()=='';
};

const verifyReqBody = function(req,res,next) {
  let bodyFieldValues = Object.values(req.body);
  if(bodyFieldValues.some(isEmptyString)){
    res.status(400);
    res.json({status:false,message:'empty field'});
    return;
  }
  next();
};

const isPlayerInRoom = function(req){
  let room = req.app.gamesManager.getRoom(req.cookies.gameName);
  return room && room.isGuest(req.cookies.playerName);
};

const isPlayerInGame = function(req){
  let game = req.app.gamesManager.getGame(req.cookies.gameName);
  return game && game.doesPlayerExist(req.cookies.playerName);
};

const isPlayerValid = function(req){
  return isPlayerInRoom(req) || isPlayerInGame(req);
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

const isOneOf = function(currUrl){
  let urllist = ['/board.html','/game/index.html'];
  return urllist.find((url)=>url==currUrl);
};

const checkGame = function(req,res,next) {
  if(isOneOf(req.url) && !(req.game)) {
    redirectToHome(res);
    return;
  }
  next();
};

const verifyPlayer =function(req,res,next) {
  let game = req.app.gamesManager.getGame(req.cookies.gameName);
  let playerName = req.cookies.playerName;
  if(!game.doesPlayerExist(playerName)){
    resForBadRequest(res,"invalid cookies");
    return;
  }
  next();
};


const checkCharacterLimit = function(req,res,next) {
  let gameName = req.body.gameName;
  let playerName = req.body.playerName;
  if(gameName.length>15 || playerName.length>8){
    resForBadRequest(res,"bad request");
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

const checkIsRoomPresent = function(req,res,next){
  let roomName = req.cookies.gameName;
  if (!req.app.gamesManager.doesRoomExists(roomName)) {
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
  if(!isValidReqBodyFormat(['gameName','playerName','noOfPlayers'],req)){
    resForBadRequest(res,"bad request");
    return;
  }
  next();
};

const verifyJoinGameReq = function(req,res,next) {
  if(!isValidReqBodyFormat(['gameName','playerName'],req)){
    resForBadRequest(res,"bad request");
    return;
  }
  next();
};

const blockIfUserHasGame = function(req,res,next){
  if(isPlayerValid(req)) {
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

const checkRoomExists = function(req,res,next) {
  let gamesManager = req.app.gamesManager;
  let gameName = req.body.gameName;
  if(!gamesManager.doesRoomExists(gameName)) {
    res.statusCode = 400;
    res.json({status:false,message:"game dosen\'t exist"});
    return;
  }
  next();
};


const verifyIsGuest = function(req,res,next) {
  let game = req.cookies.gameName;
  let player = req.cookies.playerName;
  let gamesManager = req.app.gamesManager;
  let room = gamesManager.getRoom(game);
  if(!room || !room.isGuest(player)){
    res.statusCode = 400;
    res.json({status:false,message:"bad request "});
    return;
  }
  next();
};

const checkGameStarted = function(req,res,next) {
  let gameName = req.cookies.gameName;
  let playerName = req.cookies.playerName;
  let game = req.app.gamesManager.getGame(gameName);
  if(game && game.getPlayer(playerName)) {
    let color = game.getPlayer(playerName).getColor();
    let playersName = game.getStatus().players.map((player)=> {
      return player.name;
    });
    res.json({gameStarted:true,yourColor:color,players:playersName});
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
  checkIsRoomPresent,
  checkGame,
  logger,
  verifyCreateGameReq,
  blockIfUserHasGame,
  trimRequestBody,
  verifyJoinGameReq,
  checkRoomExists,
  verifyIsGuest,
  checkGameStarted
};
