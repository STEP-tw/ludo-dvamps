class ActivityLog {
  constructor() {
    this.logs = [];
  }
  registerTurn(playerName){
    let statement = `${playerName}'s turn.`;
    this.logs.push(statement);
  }
  registerMove(playerName,move){
    let statement = `${playerName} got ${move}.`;
    this.logs.push(statement);
  }
  getLogs(){
    return this.logs;
  }
}

module.exports = ActivityLog;
