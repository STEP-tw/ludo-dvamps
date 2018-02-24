const assert = require('chai').assert;
const request = require('supertest');
const path = require('path');
const app = require(path.resolve('app.js'));
const GamesManager = require(path.resolve('src/models/gamesManager.js'));
const EventEmitter = require(path.resolve('test/mockEventEmitter.js'));
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

const ColorDistributer = function() {
  this.colors = ['red', 'green', 'blue', 'yellow'];
}
ColorDistributer.prototype = {
  getColor: function() {
    return this.colors.shift();
  },
  addColor:function(color){
    if(this.colors.includes(color)){
      return;
    }
    this.colors.push(color);
  }
}

const initGamesManager = function(playerNames){
  let gamesManager = new GamesManager(ColorDistributer,dice,EventEmitter);
  gamesManager.addGame('ludo');
  playerNames.forEach(function(playerName){
    gamesManager.addPlayerTo('ludo',playerName);
  });
  return gamesManager;
};

describe('#App', () => {
  let gamesManager = {};
  beforeEach(function() {
    gamesManager = new GamesManager(ColorDistributer,dice,EventEmitter);
    app.initialize(gamesManager);
  });
  describe('#GET /', () => {
    //app.initialize(gamesManager);
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
  describe('GET /board.html', () => {
    it('should serve index page', done => {
      request(app)
        .get('/board.html')
        .expect(302)
        .expect('Location','/index.html')
        .end(done);
    });
  });
  describe('GET getAvailableGames', () => {
    it('should give all available games', done => {
      gamesManager = new GamesManager(ColorDistributer,dice)
      app.initialize(gamesManager);
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
        .expect('set-cookie', 'gameName=newGame,playerName=dhana')
        .expect(JSON.stringify({
          gameCreated: true
        }))
        .end(done);
    });
    it('should not create game if game name already exist', (done) => {
      gamesManager.addGame('newGame');
      app.initialize(gamesManager);
      request(app)
        .post('/createGame')
        .send('gameName=newGame&playerName=dhana')
        .expect(200)
        .expect(JSON.stringify({
          gameCreated: false,
          message: 'game name already taken'
        }))
        .expect(doesNotHaveCookies)
        .end(done);
    });
    it('should not create game if player name exceeds 8 characters',(done)=>{
      request(app)
      .post('/createGame')
      .send('gameName=newGame&playerName=dhanalakshmi')
      .expect(400)
      .expect(JSON.stringify({
        gameCreated: false,
        message: 'bad request'
      }))
      .expect(doesNotHaveCookies)
      .end(done);
    });
    it('should not create game if game name exceeds 15 characters',(done)=>{
      request(app)
      .post('/createGame')
      .send('gameName=dhanalakshmi\'sGame&playerName=dhana')
      .expect(400)
      .expect(JSON.stringify({
        gameCreated: false,
        message: 'bad request'
      }))
      .expect(doesNotHaveCookies)
      .end(done);
    });
    it('should simply end the response if request body is not correctly formatted', function(done) {
      request(app)
        .post('/createGame')
        .send('gamme=newGame&plaame=dhana')
        .expect(400)
        .expect(doesNotHaveCookies)
        .end(done);
    });
    it('should redirect to waiting if user has already a game', function(done) {
      let gamesManager = new GamesManager(ColorDistributer,dice,EventEmitter);
      gamesManager.addGame('newGame');
      gamesManager.addPlayerTo('newGame', 'lala');
      app.initialize(gamesManager);
      request(app)
        .post('/createGame')
        .set('Cookie', ['gameName=newGame', 'playerName=lala'])
        .send('gameName=bad&playerName=dhana')
        .expect(200)
        .expect(/gameCreated/)
        .expect(/true/)
        .end(done);
    });
    it('should response with error message if gamename or playername is empty',(done)=>{
      request(app)
        .post('/createGame')
        .send('gameName=   &playerName=  ')
        .expect(400)
        .expect(JSON.stringify({status:false,message:'empty field'}))
        .end(done);
    });
  });
  describe('GET /gameName', () => {
    it('should send gameName', (done) => {
      request(app)
        .get('/gameName')
        .set('Cookie', 'gameName=ludo')
        .expect(200)
        .end(done);
    });
  });
  describe('GET /userName', () => {
    it('should send userName', (done) => {
      request(app)
        .get('/userName')
        .set('Cookie', 'playerName=player')
        .expect("player")
        .expect(200)
        .end(done);
    });
  });
  describe('DELETE /player', () => {
    it('should delete Player and game if all the players left', (done) => {
      let gamesManager = initGamesManager(['player']);
      app.initialize(gamesManager);
      request(app)
        .delete('/player')
        .set('Cookie', ['playerName=player;', 'gameName=ludo;'])
        .expect(200)
        .expect('set-cookie', `playerName=; Expires=${new Date(1).toUTCString()},gameName=; Expires=${new Date(1).toUTCString()}`)
        .end(done);
    });
    it('should delete Player if a player lefts', (done) => {
      let gamesManager = initGamesManager(['player1','player2','player3']);
      app.initialize(gamesManager);
      request(app)
        .delete('/player')
        .set('Cookie', ['playerName=player1;', 'gameName=ludo;'])
        .expect(200)
        .expect('set-cookie', `playerName=; Expires=${new Date(1).toUTCString()}`)
        .end(done);
    });
  });
  describe('get /getStatus', () => {
    it('should send gameStatus', (done) => {
      let gamesManager = initGamesManager(['salman','lala','lali','lalu']);
      app.initialize(gamesManager);
      request(app)
        .get('/getStatus')
        .set('Cookie', 'gameName=ludo')
        .expect(200)
        .end(done);
    });
    it('should send empty response', (done) => {
      gamesManager.addGame('ludo');
      app.initialize(gamesManager);
      request(app)
        .get('/getStatus')
        .expect("")
        .expect(400)
        .end(done);
    });
  });
  describe('POST /joinGame', () => {
    beforeEach(function() {
      let gamesManager=initGamesManager(['player1','player2','player3']);
      app.initialize(gamesManager);
    })
    it('should return joiningStatus as true if new player is joining', done => {
      request(app)
        .post('/joinGame')
        .send('gameName=ludo&playerName=player4')
        .expect(/status/)
        .expect(/true/)
        .end(done)
    });
    it('should return joining Status as false if the form is incomplete', done => {
      request(app)
        .post('/joinGame')
        .send('gameName=ludo')
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
        .send('gameName=ludo&playerName=player1')
        .expect(200)
        .expect('{"status":false}')
        .expect(doesNotHaveCookies)
        .end(done)
    });
    it('should return status false along with message "player name is lengthy"',(done)=>{
      request(app)
        .post('/joinGame')
        .send('gameName=ludo&playerName=lalalalalala')
        .expect(400)
        .expect(`{"status":false,"message":"player name is lengthy"}`)
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
  describe('GET /game/board.html', () => {
    beforeEach(function(){
      let gamesManager=initGamesManager(['player1','player2','player3','player4']);
      app.initialize(gamesManager);
    })
    it('should response with bad request if game does not exists', (done) => {
      request(app)
        .get('/game/board.html')
        .set('Cookie',['gameName=cludo','playerName=player1'])
        .expect(302)
        .expect('Location','/index.html')
        .end(done)
    });
    it('should response with bad request if player is not registered', (done) => {
      request(app)
        .get('/game/board.html')
        .set('Cookie',['gameName=ludo','playerName=unknown'])
        .expect(400)
        .end(done)
    });
  });
  describe('#GET /index.html', () => {
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
  describe('#GET /joining.html', () => {
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
  describe('get /game/gameStatus', () => {
    beforeEach(function(done) {
      let gamesManager = initGamesManager(['lala','kaka','kaki','kaku']);
      gamesManager.getGame('ludo').rollDice();
      app.initialize(gamesManager);
      done();
    });
    it('should give game status', (done) => {
      request(app)
        .get('/game/gameStatus')
        .set('Cookie',['gameName=ludo','playerName=lala'])
        .expect(200)
        .expect(/lala/)
        .expect(/red/)
        .end(done);
    });
    it('should redirect index', (done) => {
      request(app)
        .get('/game/gameStatus')
        .expect('Location','/index.html')
        .end(done);
    });
    it('should redirect to landing page if game not exists', function(done) {
      request(app)
        .get('/game/gameStatus')
        .set('Cookie',['gameName=badGame','playerName=badPlayer'])
        .expect(302)
        .expect('Location','/index.html')
        .end(done);
    });
  });
  describe('#GET /game/logs', () => {
    it('should give game activity log', (done) => {
      let gamesManager = initGamesManager(['lala','kaka','ram','shyam']);
      gamesManager.getGame('ludo').rollDice();
      app.initialize(gamesManager);
      request(app)
        .get('/game/logs')
        .set('Cookie', ['gameName=ludo', 'playerName=lala'])
        .expect(200)
        .expect(/&#9859;/)
        .expect(/lala/)
        .end(done);
    });
  });
  describe('#POST /game/moveCoin', () => {
    it('should return move coin status if valid player gives valid coin Id', done => {
      let dice = {
        roll:()=>6
      }
      gamesManager = new GamesManager(ColorDistributer,dice,EventEmitter)
      let game = gamesManager.addGame('newGame');
      game.addPlayer('lala');
      game.addPlayer('kaka');
      game.addPlayer('ram');
      game.addPlayer('shyam');
      game.rollDice();
      app.initialize(gamesManager);
      request(app)
        .post('/game/moveCoin')
        .set('Cookie',['gameName=newGame','playerName=lala'])
        .send('coinId=1')
        .expect(200)
        .expect(/"status":true/)
        .expect(/players/)
        .end(done)
    });
    it('should return move coin status as false if valid player gives invalid coin Id', done => {
      let moves = [6,4];
      let dice = {
        roll:()=>{
          return moves.shift();
        }
      }
      gamesManager = new GamesManager(ColorDistributer,dice,EventEmitter)
      let game = gamesManager.addGame('newGame');
      game.addPlayer('lala');
      game.addPlayer('kaka');
      game.addPlayer('ram');
      game.addPlayer('shyam');
      game.rollDice();
      game.moveCoin(1);
      game.rollDice();
      app.initialize(gamesManager);
      request(app)
        .post('/game/moveCoin')
        .set('Cookie',['gameName=newGame','playerName=lala'])
        .send('coinId=2')
        .expect(200)
        .expect(/"status":false/)
        .expect(/"message":"Coin/)
        .end(done)
    });
    it('should return status false and message as not your turn if invalid '+
    ' player gives invalid coin Id', done => {
      let dice = {
        roll:()=>6
      }
      gamesManager = new GamesManager(ColorDistributer,dice,EventEmitter)
      let game = gamesManager.addGame('newGame');
      game.addPlayer('lala');
      game.addPlayer('kaka');
      game.addPlayer('ram');
      game.addPlayer('shyam');
      game.rollDice();
      app.initialize(gamesManager);
      request(app)
        .post('/game/moveCoin')
        .set('Cookie',['gameName=newGame','playerName=kaka'])
        .send('coinId=6')
        .expect(400)
        .expect(/"status":false/)
        .expect(/"message":"Not/)
        .end(done)
    });
  });
});
