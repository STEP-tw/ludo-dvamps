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
    let statement = `${playerName} got ${move}.`;
    this.logs.push({
      time:time,
      statement:statement
    });
  }
  getLogs(){
    return this.logs;
  }
}

module.exports = ActivityLog;
