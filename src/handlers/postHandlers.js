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
    // res.cookie('gameName',gameName,{path:''});
    // res.cookie('playerName',playerName,{path:''});
    return;
  }
  res.json({status:joiningStatus});
  res.end();
};

const moveCoin = function(req,res){
  let coinToMove = req.body.coinId;
  if (req.game.moveCoin(coinToMove)) {
    let status = req.game.getStatus();
    status.status = true;
    res.send(status);
    return;
  }
  res.send({status:false,message:`Coin can't be moved`});
};

module.exports = {
  createNewGame,
  joinPlayerToGame,
  moveCoin
};
