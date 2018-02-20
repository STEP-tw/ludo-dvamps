const Player = require('./player.js');
const Coin = require('./coin.js');
const Turn = require('./turn.js');
const Cell = require('./cell.js');
const Path = require('./path.js');

const generateCoins = function() {
  let index = 0;
  let homeId = -1;
  let coins = [];
  for(let count=0;count<16;count++,index++,homeId--){
    let coinId = index%4+1;
    coins.push(new Coin(coinId,homeId));
  }
  return coins;
};

class Game {
  constructor(name, ColorDistributor, dice) {
    this.name = name;
    this.players = [];
    this.status = {};
    this.numberOfPlayers = 4;
    this.colorDistributor = new ColorDistributor();
    this.coins = generateCoins();
    this.dice = dice;
  }
  getCoins(color){
    let coins = this.coins.splice(0,4);
    return coins.map(function(coin){
      coin.setColor(color);
      return coin;
    });
  }
  getCurrentPlayer(){
    let turn = this.turn;
    let currentPlayer = this.players.find((player)=>{
      return player.name == turn.currentPlayer;
    });
    return currentPlayer;
  }
  getStatus() {
    return this.status;
  }
  hasEnoughPlayers() {
    return this.numberOfPlayers <= this.players.length;
  }
  neededPlayers() {
    return this.numberOfPlayers - this.players.length;
  }
  getDetails() {
    return {
      name: this.name,
      remain: this.neededPlayers(),
      createdBy: this.players[0].name,
    };
  }
  doesPlayerExist(playerName) {
    return this.players.some((player) => player.name == playerName);
  }
  givePathToPlayer(playerColor){
    let color = ['red','green','yellow','blue'];
    let path = new Path();
    let startingCell = color.indexOf(playerColor)*13;
    for(let count=0;count<51;count++){
      path.addCell(new Cell(startingCell));
      startingCell++;
      if(startingCell>51) {
        startingCell = 0;
      }
    }
    let specialCell = startingCell + 99;
    for(let count=0;count<6;count++,specialCell++){
      path.addCell(new Cell(specialCell));
    }
    return path;
  }
  createPlayer(playerName){
    let playerColor = this.colorDistributor.getColor();
    let coins = this.getCoins(playerColor);
    let path = this.givePathToPlayer(playerColor);
    return new Player(playerName,playerColor,coins,path);
  }
  addPlayer(playerName) {
    if (!this.doesPlayerExist(playerName) && !this.hasEnoughPlayers()) {
      this.players.push(this.createPlayer(playerName));
      this.setStatus();
      if (this.hasEnoughPlayers()) {
        this.start();
      }
      return true;
    }
    return false;
  }
  getPlayer(playerName) {
    return this.players.find(player => player.name == playerName);
  }
  removePlayer(playerName) {
    let player = this.players.find(player => player.name == playerName);
    let playerIndex = this.players.indexOf(player);
    this.colorDistributor.addColor(player.getColor());
    this.players.splice(playerIndex, 1);
    this.setStatus();
  }
  getGameStatus(){
    let playerStatus = this.getStatus();
    playerStatus.currentPlayerName = this.turn.currentPlayer;
    return playerStatus;
  }
  getNoOfPlayers() {
    return this.players.length;
  }
  setStatus() {
    this.status.players = this.players.map(player => player.getStatus());
  }
  rollDice(){
    return this.turn.rollDice(this.dice);
  }
  get currPlayerLastMove(){
    return this.turn.lastMove;
  }
  arrangePlayers(){
    return this.players.reduce((sequence,player)=>{
      let colorSequence = {red:0,green:1,blue:2,yellow:3};
      sequence[colorSequence[player.color]] = player.name;
      return sequence;
    },[]);
  }
  start(){
    let players = this.arrangePlayers();
    this.turn =new Turn(players);
  }
}

module.exports = Game;
