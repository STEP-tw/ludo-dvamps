const assert = require('chai').assert;
const request = require('supertest');
const path = require('path');
const app = require(path.resolve('app.js'));
const GamesManager = require(path.resolve('src/models/gamesManager.js'));
const ColorDistributer = require(path.resolve('test/colorDistributer.js'));
let doesNotHaveCookies = (res) => {
  const keys = Object.keys(res.headers);
  let key = keys.find(currentKey => currentKey.match(/set-cookie/i));
  if (key) {
    throw new Error(`Didnot expect Set-Cookie in header of ${keys}`);
  }
};

const dice = {
  roll: function() {
    return 4;
  }
};
const timeStamp = () => 1234;

describe('#App', () => {
  let gamesManager = {};
  beforeEach(function(done) {
    gamesManager = new GamesManager(ColorDistributer,dice,timeStamp);
    app.initialize(gamesManager);
    done();
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
    it('should redirect to waiting page if valid cookies are present', done => {
      gamesManager.addGame('newGame');
      gamesManager.addPlayerTo('newGame', 'lala');
      app.initialize(gamesManager);
      request(app)
        .get('/')
        .set('Cookie', ['gameName=newGame', 'playerName=lala'])
        .expect(302)
        .expect('Location', '/waiting.html')
        .end(done);
    });
    it('should serve index page if invalid cookies are present', done => {
      gamesManager.addGame('newGame');
      gamesManager.addPlayerTo('newGame', 'lala');
      app.initialize(gamesManager);
      request(app)
        .get('/')
        .set('Cookie', ['gameName=badGame', 'playerName=badUser'])
        .expect(200)
        .end(done);
    });
  });
  describe('GET /index.html', () => {
    it('should redirect to waiting page if valid cookies are present', done => {
      gamesManager.addGame('newGame');
      gamesManager.addPlayerTo('newGame', 'lala');
      app.initialize(gamesManager);
      request(app)
      .get('/index.html')
      .set('Cookie', ['gameName=newGame', 'playerName=lala'])
      .expect(302)
      .expect('Location', '/waiting.html')
      .end(done);
    });
    it('should serve index page if invalid cookies are present', done => {
      gamesManager.addGame('newGame');
      gamesManager.addPlayerTo('newGame', 'lala');
      app.initialize(gamesManager);
      request(app)
      .get('/index.html')
      .set('Cookie', ['gameName=badGame', 'playerName=badUser'])
      .expect(200)
      .end(done);
    });
  });
  describe('GET /board.html', () => {
    it('should serve index page', done => {
      request(app)
        .get('/board.html')
        .expect(302)
        .expect('Location','/index.html')
        .end(done);
    });
  });
  describe('GET /joining.html', () => {
    it('should redirect to waiting page if valid cookies are present', done => {
      gamesManager.addGame('newGame');
      gamesManager.addPlayerTo('newGame', 'lala');
      app.initialize(gamesManager);
      request(app)
      .get('/joining.html')
      .set('Cookie', ['gameName=newGame', 'playerName=lala'])
      .expect(302)
      .expect('Location', '/waiting.html')
      .end(done);
    });
    it('should serve joining page if invalid cookies are present', done => {
      gamesManager.addGame('newGame');
      gamesManager.addPlayerTo('newGame', 'lala');
      app.initialize(gamesManager);
      request(app)
      .get('/joining.html')
      .set('Cookie', ['gameName=badGame', 'playerName=badUser'])
      .expect(200)
      .end(done);
    });
  });
  describe('POST /createGame', () => {
    it('should set gameName and playerName in cookie', (done) => {
      request(app)
        .post('/createGame')
        .send('gameName=newGame&playerName=dhana&noOfPlayers=4')
        .expect(200)
        .expect('set-cookie', 'gameName=newGame,playerName=dhana')
        .expect(JSON.stringify({
          status: true
        }))
        .end(done);
    });
    it('should not create game if game name already exist', (done) => {
      gamesManager.addGame('newGame');
      app.initialize(gamesManager);
      request(app)
        .post('/createGame')
        .send('gameName=newGame&playerName=dhana&noOfPlayers=4')
        .expect(200)
        .expect(JSON.stringify({
          status: false,
          message: 'game name already taken'
        }))
        .expect(doesNotHaveCookies)
        .end(done);
    });
    it('should not create game if player name exceeds 8 characters',(done)=>{
      request(app)
      .post('/createGame')
      .send('gameName=newGame&playerName=dhanalakshmi&noOfPlayers=4')
      .expect(400)
      .expect(JSON.stringify({
        status: false,
        message: 'bad request'
      }))
      .expect(doesNotHaveCookies)
      .end(done);
    });
    it('should not create game if game name exceeds 15 characters',(done)=>{
      request(app)
      .post('/createGame')
      .send('gameName=dhanalakshmi\'sGame&playerName=dhana&noOfPlayers=4')
      .expect(400)
      .expect(JSON.stringify({
        status: false,
        message: 'bad request'
      }))
      .expect(doesNotHaveCookies)
      .end(done);
    });
    it('should simply end the response if request body is not correctly formatted', function(done) {
      request(app)
        .post('/createGame')
        .send('gamme=newGame&plaame=dhana&noOfPlayers=4')
        .expect(400)
        .expect(doesNotHaveCookies)
        .end(done);
    });
    it('should redirect to waiting if user has already a game', function(done) {
      let gamesManager = new GamesManager(ColorDistributer,dice,timeStamp);
      gamesManager.addGame('newGame');
      gamesManager.addPlayerTo('newGame', 'lala');
      app.initialize(gamesManager);
      request(app)
        .post('/createGame')
        .set('Cookie', ['gameName=newGame', 'playerName=lala'])
        .send('gameName=bad&playerName=dhana&noOfPlayers=4')
        .expect(200)
        .expect(/status/)
        .expect(/true/)
        .end(done);
    });
    it('should response with error message if gamename or playername or number of players are empty',(done)=>{
      request(app)
        .post('/createGame')
        .send('gameName=   &playerName=rock  &noOfPlayers=')
        .expect(400)
        .expect(JSON.stringify({status:false,message:'empty field'}))
        .end(done);
    });
  });
  describe('POST /joinGame', () => {
    beforeEach(function() {
      app.gamesManager.createRoom('newGame');
      app.gamesManager.joinRoom('newGame', 'lala');
      })
    it('should return joiningStatus as true if new player is joining', done => {
      request(app)
        .post('/joinGame')
        .send('gameName=newGame&playerName=ram')
        .expect(/status/)
        .expect(/true/)
        .end(done)
    });
    it('should return joining Status as false if the form is incomplete', done => {
      request(app)
        .post('/joinGame')
        .send('gameName=newGame')
        .expect(/status/)
        .expect(/false/)
        .end(done)
    });
    it('should return status false for bad request', done => {
      request(app)
        .post('/joinGame')
        .send('gameName=&playerName=')
        .expect(400)
        .expect(/status/)
        .expect(/false/)
        .end(done)
    });
    it('should return status false for join with name which is previously in game', done => {
      request(app)
        .post('/joinGame')
        .send('gameName=newGame&playerName=lala')
        .expect(200)
        .expect('{"status":false}')
        .expect(doesNotHaveCookies)
        .end(done)
    });
    it('should return status false along with message "player name is lengthy"',(done)=>{
      request(app)
        .post('/joinGame')
        .send('gameName=newGame&playerName=lalalalalala')
        .expect(400)
        .expect(`{"status":false,"message":"bad request"}`)
        .expect(doesNotHaveCookies)
        .end(done)
    });
    it('should return status false along with message "game dosen\'t exist"', (done) => {
      request(app)
      .post('/joinGame')
      .send('gameName=helloWorld&playerName=lala')
      .expect(400)
      .expect(`{"status":false,"message":"game dosen\'t exist"}`)
      .expect(doesNotHaveCookies)
      .end(done);
    });
    it('should return status false along with message "empty field"', (done) => {
      request(app)
      .post('/joinGame')
      .send('gameName=    &playerName=   ')
      .expect(400)
      .expect(`{"status":false,"message":"empty field"}`)
      .expect(doesNotHaveCookies)
      .end(done);
    });
  });
  describe('GET /getAvailableGames', () => {
    it('should give all available games', done => {
      gamesManager = new GamesManager(ColorDistributer,dice,timeStamp);
      app.initialize(gamesManager);
      request(app)
        .get('/getAvailableGames')
        .expect(200)
        .expect('[]')
        .end(done);
    });
  });
  describe('DELETE /player', () => {
    it('should delete Player and game if all the players left', (done) => {
      gamesManager.createRoom('ludo',4);
      let room = gamesManager.getRoom('ludo');
      room.addGuest('player');
      app.initialize(gamesManager);
      request(app)
        .delete('/player')
        .set('Cookie', ['playerName=player;', 'gameName=ludo;'])
        .expect(200)
        .expect('set-cookie', `playerName=; Expires=${new Date(1).toUTCString()},gameName=; Expires=${new Date(1).toUTCString()}`)
        .end(done);
    });
    it('should delete Player if a player lefts', (done) => {
      gamesManager.createRoom('ludo',3);
      let room = gamesManager.getRoom('ludo');
      room.addGuest('player1');
      room.addGuest('player2');
      app.initialize(gamesManager);
      request(app)
        .delete('/player')
        .set('Cookie', ['playerName=player1;', 'gameName=ludo;'])
        .expect(200)
        .expect('set-cookie', `playerName=; Expires=${new Date(1).toUTCString()},gameName=; Expires=${new Date(1).toUTCString()}`)
        .end(done);
    });
    it('should give bad request if there is no game', (done) => {
      request(app)
      .delete('/player')
      .set('Cookie', ['playerName=player1;', 'gameName=ludo;'])
      .expect(400)
      .end(done);
    });
    it('should give bad request if room has no player with given name', (done) => {
      gamesManager.createRoom('ludo',3);
      app.initialize(gamesManager);
      request(app)
      .delete('/player')
      .set('Cookie', ['playerName=player1;', 'gameName=ludo;'])
      .expect(400)
      .end(done);
    });
  });
  describe('get /waitingStatus', () => {
    it('should send gameStatus', (done) => {
      gamesManager.addGame('ludo')
      gamesManager.addPlayerTo('ludo','salman');
      gamesManager.addPlayerTo('ludo','lala');
      gamesManager.addPlayerTo('ludo','lali');
      gamesManager.addPlayerTo('ludo','lalu');
      app.initialize(gamesManager);
      request(app)
        .get('/waitingStatus')
        .set('Cookie', 'gameName=ludo')
        .expect(200)
        .end(done);
    });
    it('should send empty response', (done) => {
      gamesManager.addGame('ludo');
      app.initialize(gamesManager);
      request(app)
        .get('/waitingStatus')
        .expect("")
        .expect(400)
        .end(done);
    });
  });
});
