const saveGamedata = function(req){
  let client = req.app.client;
  let gamesManager = req.app.gamesManager;
  client.query(`create table ludo_app (gameData json)`, (err,res)=>{
    if(err) {
      client.query(`update ludo_app set gameData = $1`,[gamesManager]);
    }else{
      client.query(`insert into ludo_app values($1)`,[gamesManager]);
    }
  });
};

module.exports = {
  saveGamedata
};
