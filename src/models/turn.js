class Turn {
  constructor(players) {
    this.players = players;
    this.currentPlayer = players[0];
    this.playerChances = 1;
    this.currentPlayerMoves = [];
  }
  rollDice(dice){
    return dice.roll();
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

  hasThreeMoves(){
    return this.currentPlayerMoves.length >= 3;
  }

  has3ConsecutiveSixes(){
    return this.hasThreeMoves() &&
      this.currentPlayerMoves.slice(-3).every((move)=> move == 6);
  }

  decrementChances(){
    return --this.playerChances;
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
    return this.currentPlayer;
  }

  updateTurn(){
    let currentPlayerIndex = this.players.indexOf(this.currentPlayer);
    this.currentPlayer = this.players[++currentPlayerIndex % 4];
    this.playerChances = 1;
    this.currentPlayerMoves = [];
    return this.currentPlayer;
  }

  increamentChances(){
    return ++this.playerChances;
  }
}

module.exports = Turn;
