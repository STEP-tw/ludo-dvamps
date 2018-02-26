class Turn {
  constructor(players) {
    this.players = players;
    this.presentPlayer = players[0];
    this.playerChances = 1;
    this.currentPlayerMoves = [];
    this.movedCoin = true;
  }

  get currentPlayer(){
    return this.presentPlayer;
  }

  get currentPlayerChances(){
    return this.playerChances;
  }

  get lastMove(){
    return this.currentPlayerMoves.slice(-1).pop();
  }

  increamentChances(){
    return ++this.playerChances;
  }

  decrementChances(){
    return --this.playerChances;
  }

  hasThreeMoves(){
    return this.currentPlayerMoves.length >= 3;
  }

  markAsNotMovedCoin(){
    this.movedCoin = false;
  }

  rollDice(dice){
    if(this.currentPlayerChances && this.movedCoin){
      let move = dice.roll();
      this.currentPlayerMoves.push(move);
      this.decrementChances();
      this.markAsNotMovedCoin();
      return move;
    }
  }

  has3ConsecutiveSixes(){
    return this.hasThreeMoves() &&
      this.currentPlayerMoves.slice(-3).every((move)=> move == 6);
  }

  decideTurnOnChance(){
    if(this.currentPlayerChances){
      return this.currentPlayer;
    }
    return this.updateTurn();
  }

  hasMovedCoin(){
    return this.movedCoin;
  }

  markAsMovedCoin(){
    this.movedCoin = true;
  }

  decideTurnAsPerMove(haveMovablecoins){
    if (this.lastMove == 6) {
      this.increamentChances();
    }
    if (this.has3ConsecutiveSixes() || !haveMovablecoins) {
      return this.updateTurn();
    }
    return this.currentPlayer;
  }

  updateTurn(){
    let currPlayerIndex = this.players.indexOf(this.currentPlayer);
    this.presentPlayer = this.players[++currPlayerIndex % this.players.length];
    this.playerChances = 1;
    this.currentPlayerMoves = [];
    this.markAsMovedCoin();
    return this.currentPlayer;
  }

  listenDiedEvent(eventEmitter){
    eventEmitter.on('died',this.increamentChances.bind(this));
  }
}

module.exports = Turn;
