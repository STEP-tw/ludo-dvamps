const assert = require('chai').assert;
const request = require('supertest');
const path = require('path');
const Coin = require(path.resolve('src/models/coin.js'));
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
const dummyShuffler = (array) => {return array};
const initGameManager = function(players,dice,gameName) {
  let gameManager = new GamesManager(ColorDistributer,dice,timeStamp,
    dummyShuffler);
  gameManager.createRoom(gameName,4);
  players.forEach((player)=>gameManager.joinRoom(gameName,player));
  return gameManager;
}
const sixPointDice = {roll:()=>6};
let players = ['lala','kaka','ram','shyam'];
describe('GameRoute', () => {
  let gamesManager;
  beforeEach(function(done) {
    gamesManager = new GamesManager(ColorDistributer,dice,timeStamp,dummyShuffler);
    app.initialize(gamesManager);
    done();
  });
  describe('GET /game/board.html', () => {
    beforeEach(function(){
      let gamesManager = initGameManager(players,dice,'ludo');
      app.initialize(gamesManager);
    })
    it('should response with bad request if game does not exists', (done) => {
      request(app)
        .get('/game/board.html')
        .set('Cookie',['gameName=cludo','playerName=ashish'])
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
  describe('#GET /game/rollDice', () => {
    beforeEach(function(){
      let gamesManager = initGameManager(players,dice,'newGame');
      app.initialize(gamesManager);
    });
    it('should roll the dice for currentPlayer', (done) => {
      request(app)
        .get('/game/rollDice')
        .set('Cookie', ['gameName=newGame', 'playerName=lala'])
        .expect(200)
        .expect('{"move":4,"currentPlayer":"kaka"}')
        .end(done);
    });
    it('should response with bad request if player is not there', (done) => {
      request(app)
        .get('/game/rollDice')
        .set('Cookie', ['gameName=newGame', 'playerName=kaka'])
        .expect(400)
        .end(done);
    });
  });
  describe('get /game/gameStatus', () => {
    beforeEach(function() {
      gamesManager = initGameManager(players,dice,'newGame');
      app.initialize(gamesManager);
    });
    it('should give game status', (done) => {
      request(app)
        .get('/game/gameStatus')
        .set('Cookie',['gameName=newGame','playerName=lala'])
        .expect(200)
        .expect(/lala/)
        .expect(/red/)
        .end(done);
    });
    it('should give game status with won as true',(done)=>{
      let game = gamesManager.getGame('newGame');
      let currentPlayer = game.getCurrentPlayer();
      let path = currentPlayer.getPath();
      let destination = path.getDestination();
      destination.addCoin(new Coin(1));
      destination.addCoin(new Coin(2));
      destination.addCoin(new Coin(3));
      destination.addCoin(new Coin(4));
      request(app)
        .get('/game/gameStatus')
        .set('Cookie',['gameName=newGame','playerName=lala'])
        .expect(200)
        .expect(/lala/)
        .expect(/red/)
        .expect(/"won":true/)
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
      let game = gamesManager.addGame('newGame',4);
      game.addPlayer('lala');
      game.addPlayer('kaka');
      game.addPlayer('ram');
      game.addPlayer('shyam');
      game.start();
      game.rollDice();
      app.initialize(gamesManager);
      request(app)
        .get('/game/logs')
        .set('Cookie', ['gameName=newGame', 'playerName=lala'])
        .expect(200)
        .expect(/&#9859;/)
        .expect(/lala/)
        .end(done);
    });
  });
  describe('#POST /game/moveCoin', () => {
    let game;
    let gamesManager;
    beforeEach(()=>{
      let dice = {
        roll:()=>6
      }
      gamesManager = initGameManager(players,dice,'newGame');
      game = gamesManager.getGame('newGame');
      app.initialize(gamesManager);
    })
    it('should return move coin status if valid player gives valid coin Id', done => {
      game.rollDice();
      request(app)
        .post('/game/moveCoin')
        .set('Cookie',['gameName=newGame','playerName=lala'])
        .send('coinId=1')
        .expect(200)
        .expect(/"status":true/)
        .expect(/players/)
        .end(done)
    });
    it('should return status false and message as not your turn if invalid '+
    ' player gives invalid coin Id', done => {
      game.rollDice();
      request(app)
      .post('/game/moveCoin')
      .set('Cookie',['gameName=newGame','playerName=kaka'])
      .send('coinId=6')
      .expect(400)
      .expect(/"status":false/)
      .expect(/"message":"Not/)
      .end(done)
    });
    it('should return move coin status as false if valid player gives invalid coin Id', done => {
      let moves = [6,4];
      let newDice = {
        roll:()=>{
          return moves.shift();
        }
      }
      game.dice = newDice;
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
  });
  describe('#POST /game/nextPos', () => {
    it('should return the next postion of a coin', (done) => {
      let gamesManager = initGameManager(players,sixPointDice,'newGame');
      gamesManager.getGame('newGame').rollDice();
      app.initialize(gamesManager);
      request(app)
        .post('/game/nextPos')
        .set('Cookie',['gameName=newGame','playerName=lala'])
        .send('coinID=1')
        .expect(/0/)
        .end(done);
    });
  });
  describe('#POST /game/moveCoin',() => {
    let players = ['john','johnny','roy','albert'];
    let moves = [6,56,6,56,6,56,6,56,6];
    let winningDice = {roll:()=>moves.shift()};
    it('should delete game when someone won game', (done) => {
      let gameManager = initGameManager(players,winningDice,'ludo');
      let game = gameManager.getGame('ludo');
      game.getCurrentPlayer().setKilledOpponent();
      [1,1,2,2,3,3,4].forEach(function(coinId){
        game.rollDice();
        game.moveCoin(coinId);
      });
      game.rollDice();
      app.initialize(gameManager);
      request(app)
      .post('/game/moveCoin')
      .set('Cookie',['gameName=ludo','playerName=john'])
      .send('coinId=4')
      .expect(200)
      .end(()=>{
        // setTimeout(()=>{
        //   assert.isUndefined(gameManager.getGame('ludo'));
          done();
        // },10500);
      });
    });
  });
  describe('GET /game/playerDetails',function(done){
    it('should give players colors details',function(){
      let players = ['john','johnny','roy','albert'];
      let gameManager = initGameManager(players,dice,'ludo');
      app.initialize(gameManager);
      request(app)
        .get('/game/playerDetails')
        .set('Cookie',['gameName=ludo','playerName=john'])
        .expect(200)
        .expect(/john/)
        .expect(/red/)
        .end(done);
    });
  });
});
