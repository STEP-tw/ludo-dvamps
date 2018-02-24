class ActivityLog {
  constructor() {
    this.logs = [];
  }
  registerTurn(playerName){
    let time = new Date().toLocaleTimeString();
    let statement = `${playerName}'s turn.`;
    this.logs.push({
      time:time,
      statement:statement
    });
  }
  registerMove(playerName,move){
    let time = new Date().toLocaleTimeString();
    let dices = ['&#9856;','&#9857;','&#9858;','&#9859;','&#9860;','&#9861;'];
    let statement = `${playerName} got`;
    this.logs.push({
      time:time,
      statement:statement,
      move:dices[move-1]
    });
  }
  registerCoinMoved(playerName,steps){
    let statement = `${playerName} moved its coin by ${steps} steps.`;
    this.logs.push(statement);
  }
  getLogs(){
    return this.logs;
  }
}

module.exports = ActivityLog;
