const assert = require('chai').assert;
const request = require('supertest');
const path = require('path');
const app = require(path.resolve('app.js'));
const GamesManager = require(path.resolve('src/models/gamesManager.js'));

let doesNotHaveCookies = (res)=>{
  const keys = Object.keys(res.headers);
  let key = keys.find(currentKey=>currentKey.match(/set-cookie/i));
  if(key){
    throw new Error(`Didnot expect Set-Cookie in header of ${keys}`);
  }
};

const ColorDistributer = function() {
  this.colors = ['red','green','blue','yellow'];
}
ColorDistributer.prototype = {
  getColor:function() {
    return this.colors.shift();
  }
}
describe('#App', () => {
  beforeEach(function(){
    app.initialize(new GamesManager(new ColorDistributer()));
  });
  describe('GET /', () => {
    it('should serve index page', done => {
      request(app)
        .get('/')
        .expect(200)
        .expect(/createGame/)
        .expect(/joinGame/)
        .end(done);
    });
  });
  describe('GET getAvailableGames', () => {
    it('should give all available games', done => {
      request(app)
        .get('/getAvailableGames')
        .expect(200)
        .expect('[]')
        .end(done);
    });
  });
  describe('POST /createGame', () => {
    it('should set gameName and playerName in cookie', (done) => {
      request(app)
        .post('/createGame')
        .send('gameName=newGame&playerName=dhana')
        .expect(200)
        .expect('set-cookie','gameName=newGame,playerName=dhana')
        .expect(JSON.stringify({gameCreated:true}))
        .end(done);
    });
    it('should not create game', (done) => {
      let gamesManager = new GamesManager();
      gamesManager.addGame('newGame');
      app.initialize(gamesManager);
      request(app)
        .post('/createGame')
        .send('gameName=newGame&playerName=dhana')
        .expect(200)
        .expect(JSON.stringify(
          {
            gameCreated:false,
            message:'game name already taken'
          }))
        .expect(doesNotHaveCookies)
        .end(done);
    });
    it('should simply end the response if request body is not correctly formatted',function(done){
      request(app)
        .post('/createGame')
        .send('gamme=newGame&plaame=dhana')
        .expect(200)
        .expect(doesNotHaveCookies)
        .end(done);
    });
  });
  describe('GET /gameName', () => {
    it('should send gameName', (done) => {
      request(app)
        .get('/gameName')
        .set('Cookie','gameName=ludo')
        .expect(200)
        .end(done);
    });
  });
  describe('GET /userName', () => {
    it('should send userName', (done) => {
      request(app)
        .get('/userName')
        .set('Cookie','playerName=player')
        .expect("player")
        .expect(200)
        .end(done);
    });
  });
  describe('DELETE /player', () => {
    it('should delete Player and game if all the players left', (done) => {
      let gamesManager = new GamesManager(new ColorDistributer());
      gamesManager.addGame('ludo');
      let game= gamesManager.getGame('ludo');
      game.addPlayer('player');
      app.initialize(gamesManager);
      request(app)
        .delete('/player')
        .set('Cookie',['playerName=player;','gameName=ludo;'])
        .expect(200)
        .expect('set-cookie',`playerName=; Expires=${new Date(1).toUTCString()},gameName=; Expires=${new Date(1).toUTCString()}`)
        .end(done);
    });
    it('should delete Player if a player lefts', (done) => {
      let gamesManager = new GamesManager(new ColorDistributer());
      gamesManager.addGame('ludo');
      let game= gamesManager.getGame('ludo');
      game.addPlayer('player1');
      game.addPlayer('player2');
      game.addPlayer('player3');
      app.initialize(gamesManager);
      request(app)
        .delete('/player')
        .set('Cookie',['playerName=player;','gameName=ludo;'])
        .expect(200)
        .expect('set-cookie',`playerName=; Expires=${new Date(1).toUTCString()}`)
        .end(done);
    });
  });
  describe('get /getStatus', () => {
    it('should send gameStatus', (done) => {
      let gamesManager = new GamesManager();
      gamesManager.addGame('ludo');
      app.initialize(gamesManager);
      request(app)
        .get('/getStatus')
        .set('Cookie','gameName=ludo')
        .expect(200)
        .end(done);
    });
    it('should send empty response', (done) => {
      let gamesManager = new GamesManager();
      gamesManager.addGame('ludo');
      app.initialize(gamesManager);
      request(app)
        .get('/getStatus')
        .expect("")
        .expect(200)
        .end(done);
    });
    
  });
});
