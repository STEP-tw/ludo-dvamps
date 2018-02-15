let postHandlers = {};
const isValidReqBodyFormat = function(paramsKeys,req) {
  let reqParams = Object.keys(req.body);
  return paramsKeys.every(function(key){
    return reqParams.includes(key);
  })
}
const createNewGame = function(req,res) {
  if(!isValidReqBodyFormat(['gameName','playerName'],req)) res.end();
  let gamesManager = req.app.gamesManager;
  let gameName = req.body.gameName;
  if(gamesManager.doesGameExists(gameName)){
    res.json({gameCreated:false,message:'game name already taken'});
    res.end();
    return;
  }
  let playerName = req.body.playerName;
  let game = gamesManager.addGame(gameName);
  game.addPlayer(playerName);
  res.cookie('gameName',gameName,{path:''});
  res.cookie('playerName',playerName,{path:''});
  res.json({gameCreated:true});
  res.end();
};

postHandlers.createNewGame = createNewGame;

module.exports = postHandlers;
