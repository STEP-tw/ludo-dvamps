class Turn {
  constructor(players){
    this.playerIds = players;
    this.currentPlayerIndex = 0;
  }
  rollDice(dice){
    return dice.roll();
  }
  get currentPlayer(){
    return this.playerIds[this.currentPlayerIndex];
  }
}

module.exports = Turn;
