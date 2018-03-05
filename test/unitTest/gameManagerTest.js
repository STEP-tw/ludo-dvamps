const assert = require('chai').assert;
const path = require('path');
const GameManager = require(path.resolve('src/models/gamesManager.js'));
const Game = require(path.resolve('src/models/game.js'));
const ColorDistributor = require(path.resolve('test/colorDistributer.js'));
const Room = require(path.resolve('src/models/waitingRoom.js'));
const dice = function(){
  return 4;
}

const timeStamp = () => 1234;

describe('GameManager', () => {
  let gameManager;
  let room;
  let game;
  beforeEach(() => {
    gameManager = new GameManager(ColorDistributer,dice,timeStamp);
    room = gameManager.createRoom('ludo',3);
    game = gameManager.addGame('newGame',4);
  });
  describe('#canJoinRoom', () => {
    it('should return true if there are no player with same name', () => {
      assert.isOk(gameManager.canJoinRoom('ludo','tony'));
    });
    it('should return false if there is already a player with same name', () => {
      room.addGuest('thor');
      assert.isNotOk(gameManager.canJoinRoom('ludo','thor'));
    });
  });
  describe('#getAvailableRooms', () => {
    it(`should give empty list if all Rooms have maximum players`, () => {
      gameManager.joinRoom('ludo', 'john');
      gameManager.joinRoom('ludo', 'sandy');
      gameManager.joinRoom('ludo', 'alex');
      assert.deepEqual(gameManager.getAvailableRooms(), []);
    });
    it(`should give all games which don't have maximum players`, () => {
      gameManager.joinRoom('ludo', 'john');
      gameManager.joinRoom('ludo', 'sandy');
      let expectation = [{
        name:'ludo',
        remain:1,
        createdBy: 'john'
      }];
      assert.deepEqual(gameManager.getAvailableRooms(), expectation);
    });
  });
  describe('#addGame', () => {
    it('should create a new game with given name and store it', () => {
      let expected = new Game('newGame',ColorDistributor,dice,timeStamp,4);
      assert.deepEqual(game,expected);
      assert.instanceOf(game,Game);
    });
  });
  describe('#addPlayerTo', () => {
    it('should add player to given specific game', () => {
      gameManager.addPlayerTo('newGame', 'john');
      let expectedGame = new Game('newGame',ColorDistributor,dice,timeStamp,4);
      expectedGame.addPlayer('john');
      assert.deepEqual(gameManager.getGame('newGame'),expectedGame);
    });
  });
  describe('#doesGameExists', () => {
    it('should return true if game of given name exists ', () => {
      assert.isOk(gameManager.doesGameExists('newGame'));
    });
    it('should return false if game of given name does not exists ', () => {
      assert.isNotOk(gameManager.doesGameExists('badGame'));
    });
  });
  describe('#getGame', () => {
    it('should return Game', () => {
      let expected = new Game('newGame', ColorDistributor, dice,timeStamp,4);
      assert.deepEqual(gameManager.getGame('newGame'),expected);
      assert.isUndefined(gameManager.getGame('badGame'));
    });
  });
  describe('#finishGame', () => {
    it('should finish game and should delete game in 10 seconds', done => {
      let timeToDelete = 1;
      gameManager.addPlayerTo('newGame', 'john');
      gameManager.addPlayerTo('newGame', 'sandy');
      gameManager.addPlayerTo('newGame', 'mandy');
      gameManager.addPlayerTo('newGame', 'alex');
      gameManager.finishGame('newGame',timeToDelete);
      setTimeout(()=>{
        assert.isUndefined(gameManager.getGame('newGame'));
        done();
      },1500);
    });
  });
});

describe('#Legends', () => {
  let gameManager,room;
  beforeEach(() => {
    gameManager = new GameManager(ColorDistributer,dice,timeStamp,4);
    room = gameManager.createRoom('ludo',4);
  });
  describe('#createRoom', () => {
    it('should create a room of given name', () => {
      assert.property(gameManager.rooms,'ludo');
    });
  });
  describe('#canCreateGame', () => {
    it('should give false if a room is already created with that name', () => {
      assert.isNotOk(gameManager.canCreateGame('ludo'));
    });
    it('should give true if no room has been created with that name', () => {
      assert.isOk(gameManager.canCreateGame('cludo'));
    });
  });
  describe('#joinRoom', () => {
    it('should add a player in the specified room', () => {
      gameManager.joinRoom('ludo','johnny');
      assert.include(room.getGuests(),'johnny');
    });
    it('should create game when a room reached its capacity', () =>{
      assert.isUndefined(gameManager.getGame('ludo'));
      ['john','johnny','ghamand','kachwa'].forEach(function(player){
        gameManager.joinRoom('ludo',player);
      });
      assert.isDefined(gameManager.getGame('ludo'));
      assert.instanceOf(gameManager.getGame('ludo'),Game);
      assert.isNotOk(gameManager.doesRoomExists('ludo'));
    });
  });
});
