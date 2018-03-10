const Player = require('./player.js');
const Coin = require('./coin.js');
const Turn = require('./turn.js');
const Cell = require('./cell.js');
const Path = require('./path.js');
const ActivityLog = require('./activityLog.js');
const Board = require('./board.js');

const generateCoins = function() {
  let homeId = -1;
  let coins = [];
  for(let count=0;count<16;count++,homeId--){
    let coinId = count+1;
    coins.push(new Coin(coinId,homeId));
  }
  return coins;
};


class Game {
  constructor(name,ColorDistributor,dice,timeStamp,capacity) {
    this.name = name;
    this.players = [];
    this.status = {};
    this.numberOfPlayers = capacity;
    this.colorDistributor = new ColorDistributor();
    this.dice = dice;
    this.activityLog = new ActivityLog(timeStamp);
    this.board = new Board();
    this.board.generate();
    this.coins = generateCoins(this.numberOfPlayers);
    this.colors = ['red','green','yellow','blue'];
  }
  getCoins(color){
    let colors = this.colors;
    let coinIndex = colors.indexOf(color);
    let coins = this.coins.slice(coinIndex*4,(coinIndex+1)*4);
    return coins.map(function(coin){
      coin.setColor(color);
      return coin;
    });
  }
  getName(){
    return this.name;
  }
  getCurrentPlayer(){
    let turn = this.turn;
    return this.players.find((player)=>{
      return player.name == turn.currentPlayer;
    });
  }
  getStatus() {
    return this.status;
  }
  doesPlayerExist(playerName) {
    return this.players.some((player) => player.name == playerName);
  }
  createPlayer(playerName){
    let playerColor = this.colorDistributor.getColor();
    let coins = this.getCoins(playerColor);
    let playerColorIndex = this.colors.indexOf(playerColor);
    let path = new Path(coins.length,this.board.getPathFor(playerColorIndex));
    return new Player(playerName,playerColor,coins,path);
  }
  start(){
    let players = this.arrangePlayers();
    this.turn =new Turn(players);
    let color = this.colors;
    this.activityLog.registerTurn(this.turn.currentPlayer,'red');
  }
  addPlayer(playerName) {
    this.players.push(this.createPlayer(playerName));
    this.setStatus();
    return true;
  }
  getPlayer(playerName) {
    return this.players.find(player => player.name == playerName);
  }
  getGameStatus(){
    let gameStatus = this.getStatus();
    gameStatus.currentPlayerName = this.turn.currentPlayer;
    if(this.turn.lastMove && !(this.turn.hasMovedCoin())){
      gameStatus.movableCoins = this.getMovableCoinsOf(this.turn.lastMove);
    }else{
      gameStatus.movableCoins = undefined;
    }
    gameStatus.won = this.hasWon();
    return gameStatus;
  }
  setStatus() {
    this.status.players = this.players.map(player => player.getStatus());
  }

  setLogForTurn() {
    let currentPlayer = this.getCurrentPlayer();
    this.activityLog.registerTurn(currentPlayer.name,currentPlayer.color);
    return currentPlayer;
  }

  decidePlayerPer(move) {
    let currentPlayer = this.getCurrentPlayer();
    this.activityLog.registerMove(currentPlayer.name,currentPlayer.color,move);
    if (this.turn.shouldChange(currentPlayer.hasMovableCoins(move))){
      currentPlayer = this.setLogForTurn();
    }
    return currentPlayer;
  }
  getInfoPer(move){
    let currentPlayer = this.decidePlayerPer(move);
    return {
      move:move,
      currentPlayer:currentPlayer.getName()
    };
  }
  rollDice(){
    let turn = this.turn;
    if(!turn.hasMovedCoin()) {
      return {message:"first move your coin"};
    }
    let move = turn.rollDice(this.dice);
    return this.getInfoPer(move);
  }
  arrangePlayers(){
    let players = this.players;
    let arrangedPlayers=[];
    let colors = this.colors;
    colors.forEach(function(color){
      let playerWithColor=players.find((player)=>player.getColor()==color);
      if(playerWithColor){
        arrangedPlayers.push(playerWithColor.getName());
      }
    });
    return arrangedPlayers;
  }
  
  getMovableCoinsOf(move){
    let currentPlayer = this.getCurrentPlayer();
    return currentPlayer.getMovableCoins(move);
  }
  getLogs(){
    return this.activityLog.getLogs();
  }
  isMovableCoin(coinId){
    let move = this.turn.lastMove;
    let currentPlayer = this.getCurrentPlayer();
    let movablecoins = currentPlayer.getMovableCoins(move);
    return movablecoins.some((coin=>coin.id==coinId));
  }

  actOnKillCoin(player,moveStatus){
    player.setKilledOpponent();
    this.turn.increamentChances();
    let oppPlayer = this.players.find((player) =>
      player.getColor()==moveStatus.diedCoin.color);
    oppPlayer.moveCoinToHome(moveStatus.diedCoin);
    this.activityLog.registerKilledCoin(player.name,
      player.color,oppPlayer.color);
  }

  actAfterMoveCoin(player,status){
    if(status.killedOppCoin){
      this.actOnKillCoin(player,status);
    }
    if(status.reachedDestination){
      this.turn.increamentChances();
    }
    this.setStatus();
    this.turn.decideTurnOnChance();
    this.setLogForTurn();
    this.turn.markAsMovedCoin();
  }

  moveCoin(coinId){
    let currentPlayer = this.getCurrentPlayer();
    let move = this.turn.lastMove;
    if(this.turn.hasMovedCoin()){
      return false;
    }
    let status = currentPlayer.moveCoin(coinId,move);
    this.activityLog.registerCoinMoved(currentPlayer.getName(),
      currentPlayer.getColor());
    this.actAfterMoveCoin(currentPlayer,status);
    return true;
  }
  getNextPos(coinId){
    let move = this.turn.lastMove;
    return this.getCurrentPlayer().getNextPos(coinId,move);
  }
  hasWon() {
    let currentPlayer = this.getCurrentPlayer();
    return currentPlayer.getNoOfCoinsInDest()==4;
  }
  finish(){
    this.turn.endGame();
  }
}

module.exports = Game;
