class ActivityLog {
  constructor(timeStamp) {
    this.logs = [];
    this.timeStamp = timeStamp;
  }
  registerTurn(playerName,playerColor){
    let statement = `${playerName}'s turn`;
    this.logs.push({
      time:this.timeStamp(),
      statement:statement,
      pColor:playerColor
    });
  }
  setLog(statement,playerColor,coinColor,killedCoinColor){
    this.logs.push({
      time:this.timeStamp(),
      statement:statement,
      color:coinColor,
      pColor:playerColor,
      killedCoinColor:killedCoinColor
    });
  }
  registerMove(playerName,playerColor,move){
    let dices = ['&#9856;','&#9857;','&#9858;','&#9859;','&#9860;','&#9861;'];
    let statement = `${playerName} got`;
    this.logs.push({
      time:this.timeStamp(),
      statement:statement,
      move:dices[move-1],
      pColor:playerColor
    });
  }
  registerCoinMoved(playerName,coinColor){
    this.setLog(`${playerName} moved`,coinColor,coinColor);
  }
  registerKilledCoin(playerName,playerColor,killedCoinColor){
    this.setLog(`${playerName} killed`,playerColor,undefined,killedCoinColor);
  }
  getLogs(){
    return this.logs;
  }
}

module.exports = ActivityLog;
