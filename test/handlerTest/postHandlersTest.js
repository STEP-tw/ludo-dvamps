const assert = require('chai').assert;
const path = require('path');
const postHandler = require(path.resolve('src/handlers/postHandlers.js'));
const Response = require('../customResponse.js');
const GamesManager = require(path.resolve('src/models/gamesManager.js'));
const Game = require(path.resolve('src/models/game.js'));

describe('postHandlers', () => {
  describe('#createNewGame', () => {
    let req;
    let res;
    beforeEach(function(){
      req = {app:{},body:{}};
      req.app.gamesManager = new GamesManager();
      req.body.gameName = 'newGame';
      req.body.playerName = 'dhana';
      res = new Response();
    });
    it('should create a game', () => {
      postHandler.createNewGame(req,res);
      let expected = new Game('newGame').addPlayer('dhana');
      assert.deepEqual(req.app.gamesManager.games['gameName'],expected);
    });
    it('should set game name and player name in cookie',function(){
      postHandler.createNewGame(req,res);
      assert.deepEqual(res.cookies['gameName'],'newGame');
      assert.deepEqual(res.cookies['playerName'],'dhana');
    });
  });

});
