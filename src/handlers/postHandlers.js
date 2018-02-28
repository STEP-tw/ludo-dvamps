const path = require('path');
const lib = require(path.resolve('src/handlers/middleWares.js'));
const resWithGameJoined = function(res,gameName,playerName) {
  res.cookie('gameName',gameName,{path:''});
  res.cookie('playerName',playerName,{path:''});
  res.json({status:true});
  res.end();
};

const resGameAlreadyExists = function(res) {
  res.json({status:false,message:'game name already taken'});
  res.end();
};

const createNewGame = function(req,res) {
  let gamesManager = req.app.gamesManager;
  let gameName = req.body.gameName;
  let playerName = req.body.playerName;
  if(gamesManager.doesGameExists(gameName)){
    return resGameAlreadyExists(res);
  }
  let game = gamesManager.addGame(gameName);
  game.addPlayer(playerName);
  resWithGameJoined(res,gameName,playerName);
};

const joinPlayerToGame = function(req,res){
  let gamesManager = req.app.gamesManager;
  let gameName = req.body.gameName.trim();
  let playerName = req.body.playerName.trim();
  let joiningStatus = gamesManager.addPlayerTo(gameName,playerName);
  if (joiningStatus) {
    resWithGameJoined(res,gameName,playerName);
    return;
  }
  res.json({status:joiningStatus});
  res.end();
};

const checkCanMoveCoin = function(req,res,next) {
  let game = req.game;
  if(!game.isMovableCoin(req.body.coinId)){
    res.json({status:false,message:`Coin can't be moved`});
    return;
  }
  next();
};

const moveCoin = function(req,res){
  let coinToMove = req.body.coinId;
  req.game.moveCoin(coinToMove);
  let status = req.game.getGameStatus();
  if (req.game.hasWon()) {
    status.won = true;
    let finishedGameName = req.game.getName();
    req.app.gamesManager.finishGame(finishedGameName,10);
  }
  status.status = true;
  res.json(status);
};

let joinGameRoute = [
  lib.verifyCreateGameReq,
  lib.verifyReqBody,
  lib.checkCharacterLimit,
  lib.doesGameExists,
  joinPlayerToGame,
];
module.exports = {
  createNewGame:[lib.verifyReqBody,lib.checkCharacterLimit,createNewGame],
  joinPlayerToGame:joinGameRoute,
  moveCoin:[checkCanMoveCoin,moveCoin]
};
