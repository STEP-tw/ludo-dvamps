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

describe('#App', () => {
  beforeEach(function(){
    app.initialize(new GamesManager());
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
    it('should set gameName and playerName in cookie', (done) => {
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
  });
});
