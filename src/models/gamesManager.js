const path = require('path');
const WaitingRoom = require(path.resolve('src/models/waitingRoom.js'));
const Game = require(path.resolve('src/models/game.js'));

class GamesManager {
  constructor(ColorDistributor,dice,timeStamp) {
    this.ColorDistributor = ColorDistributor;
    this.allRunningGames = {};
    this.rooms = {};
    this.dice = dice;
    this.timeStamp = timeStamp;
  }
  getAvailableGames() {
    let allGames = Object.values(this.allRunningGames);
    let availableGames = allGames.filter(game => !game.hasEnoughPlayers());
    return availableGames.map(game => game.getDetails());
  }
  addGame(gameName) {
    let game = new Game(gameName, this.ColorDistributor,
      this.dice,this.timeStamp);
    this.allRunningGames[gameName] = game;
    return game;
  }
  //room concept
  createRoom(roomName,capacity) {
    let room = new WaitingRoom(roomName,capacity);
    this.rooms[roomName] = room;
    return room;
  }

  joinRoom(roomName,guestName) {
    let room = this.rooms[roomName];
    room.addGuest(guestName);
    if(room.isFull()){
      let game = this.addGame(roomName);
      let players = room.getGuests();
      players.forEach((playerName)=>game.addPlayer(playerName));
      game.start();
      this.allRunningGames[roomName]=game;
      delete this.rooms[roomName];
    }
  }
  getRoom(roomName) {
    return this.rooms[roomName];
  }
  doesRoomExists(roomName) {
    return roomName in this.rooms;
  }
  leaveRoom(roomName,playerName) {
    let room = this.getRoom(roomName);
    room.removeGuest(playerName);
    if(room.isEmpty()){
      delete this.rooms[roomName];
    }
  }
  canCreateGame(gameName) {
    return !this.doesGameExists(gameName) && !this.doesRoomExists(gameName);
  }
  canJoinRoom(gameName,playerName) {
    let room = this.getRoom(gameName);
    return !room.isGuest(playerName);
  }
  //room concept
  getGame(gameName) {
    return this.allRunningGames[gameName];
  }
  addPlayerTo(gameName, player) {
    let game = this.allRunningGames[gameName];
    let isAdded = game.addPlayer(player);
    if(game.hasEnoughPlayers()){
      game.start();
    }
    return isAdded ;
  }
  doesGameExists(gameName) {
    return gameName in this.allRunningGames;
  }
  removeGame(gameName) {
    delete this.allRunningGames[gameName];
  }
  finishGame(gameName,timeToDelete){
    let game = this.getGame(gameName);
    game.finish();
    setTimeout(()=>this.removeGame(gameName),timeToDelete*1000);
  }
}

module.exports = GamesManager;
