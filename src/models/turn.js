class Turn {
  constructor(players) {
    this.players = players;
    this.currentPlayer = players[0];
    this.playerChances = 1;
    this.currentPlayerMoves = [];
  }

  get currentPlayerColor(){
    return this.currentPlayer;
  }

  get currentPlayerChances(){
    return this.playerChances;
  }

  get lastMove(){
    return this.currentPlayerMoves.slice(-1)[0];
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

  rollDice(dice){
    let move = dice.roll();
    this.currentPlayerMoves.push(move);
    return move;
  }

  has3ConsecutiveSixes(){
    return this.hasThreeMoves() &&
      this.currentPlayerMoves.slice(-3).every((move)=> move == 6);
  }

  shouldChangeTurn(){
    if (this.has3ConsecutiveSixes()) {
      return true;
    }
    if( this.lastMove == 6 || this.currentPlayerChances){
      return false;
    }
    return true;
  }

  decideTurn(){
    if (this.shouldChangeTurn()) {
      return this.updateTurn();
    }
    if (this.lastMove == 6) {
      this.increamentChances();
    }
    return this.currentPlayer;
  }

  updateTurn(){
    let currPlayerIndex = this.players.indexOf(this.currentPlayer);
    this.currentPlayer = this.players[++currPlayerIndex % this.players.length];
    this.playerChances = 1;
    this.currentPlayerMoves = [];
    return this.currentPlayer;
  }
  rollDice(dice){
    let move = dice.roll();
    this.currentPlayerMoves.push(move);
    return move;
  }
}

module.exports = Turn;
