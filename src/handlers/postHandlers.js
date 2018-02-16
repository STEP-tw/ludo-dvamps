const isValidReqBodyFormat = function(paramsKeys,req) {
  let reqParams = Object.keys(req.body);
  return paramsKeys.every(function(key){
    return reqParams.includes(key);
  });
};

const verifyCreateGameReq = function(req,res,next) {
  if(!isValidReqBodyFormat(['gameName','playerName'],req)){
    res.json({gameCreated:false,message:'game name already taken'});
    res.end();
    return;
  }
  next();
};

const resWithGameCreated = function(res,gameName,playerName) {
  res.cookie('gameName',gameName,{path:''});
  res.cookie('playerName',playerName,{path:''});
  res.json({gameCreated:true});
  res.end();
};

const resGameAlreadyExists = function(res) {
  res.json({gameCreated:false,message:'game name already taken'});
  res.end();
};

const createNewGame = function(req,res) {
  let gamesManager = req.app.gamesManager;
  let gameName = req.body.gameName;
  if(gamesManager.doesGameExists(gameName)){
    return resGameAlreadyExists(res);
  }
  let playerName = req.body.playerName;
  let game = gamesManager.addGame(gameName);
  game.addPlayer(playerName);
  resWithGameCreated(res,gameName,playerName);
};

const joinPlayerToGame = function(req,res){
  if(!isValidReqBodyFormat(['gameName','playerName'],req)){
    res.send({status:false});
    return;
  }
  let gameName = req.body.gameName;
  let playerName = req.body.playerName;
  let joiningStatus = req.app.gamesManager.addPlayerTo(gameName,playerName);
  res.cookie('gameName',gameName,{path:''});
  res.cookie('playerName',playerName,{path:''});
  res.json({status:joiningStatus});
  res.end();
};

module.exports = {
  createNewGame,
  joinPlayerToGame,
  verifyCreateGameReq
};
