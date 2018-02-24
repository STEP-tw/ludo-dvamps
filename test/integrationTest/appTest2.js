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
describe('#AppTest2', () => {
  let gamesManager = {};
  beforeEach(function(done) {
    gamesManager = new GamesManager(ColorDistributer,dice,EventEmitter);
    app.initialize(gamesManager);
    done();
  });
  describe('#GET /game/rollDice', () => {
    beforeEach(function() {
      let gamesManager=initGamesManager(['lala','kaka','ram','shyam']);
      gamesManager.getGame('ludo').start();
      app.initialize(gamesManager);
    })
    it('should roll the dice for currentPlayer', (done) => {
      request(app)
      .get('/game/rollDice')
      .set('Cookie', ['gameName=ludo', 'playerName=lala'])
      .expect(200)
      .expect('{"move":4}')
      .end(done);
    });
    it('should response with bad request if player is not there', () => {
      request(app)
      .get('/game/rollDice')
      .set('Cookie', ['gameName=ludo', 'playerName=kaka'])
      .expect(400)
      .end();
    });
  });

});
