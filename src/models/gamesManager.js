const path = require('path');
const WaitingRoom = require(path.resolve('src/models/waitingRoom.js'));
const Game = require(path.resolve('src/models/game.js'));

const shufflePlayers = function(allPlayers) {
  let shuffledPlayers = [];
  while(allPlayers.length!=0){
    let playerIndex = Math.floor(Math.random()*allPlayers.length);
    shuffledPlayers.push(allPlayers[playerIndex]);
    allPlayers.splice(playerIndex,1);
  }
  return shuffledPlayers;
};

class GamesManager {
  constructor(ColorDistributor,dice,timeStamp) {
    this.ColorDistributor = ColorDistributor;
    this.allRunningGames = {};
    this.rooms = {};
    this.dice = dice;
    this.timeStamp = timeStamp;
  }
  canJoinRoom(gameName,playerName) {
    let room = this.getRoom(gameName);
    return !room.isGuest(playerName);
  }
  getAvailableRooms() {
    let allRooms = Object.values(this.rooms);
    return allRooms.map(room => room.getDetails());
  }
  createRoom(roomName,capacity) {
    let room = new WaitingRoom(roomName,capacity);
    this.rooms[roomName] = room;
    return room;
  }
  joinRoom(roomName,guestName) {
    let room = this.rooms[roomName];
    room.addGuest(guestName);
    if(room.isFull()){
      let game = this.addGame(roomName,room.getCapacity());
      let players = shufflePlayers(room.getGuests());
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
  addGame(gameName,capacity) {
    let game = new Game(gameName, this.ColorDistributor,
      this.dice,this.timeStamp,capacity);
    this.allRunningGames[gameName] = game;
    return game;
  }
  canCreateGame(gameName) {
    return !this.doesGameExists(gameName) && !this.doesRoomExists(gameName);
  }
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
