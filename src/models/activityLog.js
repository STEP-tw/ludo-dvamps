const timeStamp = () => new Date().toLocaleTimeString();

class ActivityLog {
  constructor() {
    this.logs = [];
  }
  registerTurn(playerName,playerColor){
    let statement = `${playerName}'s turn`;
    this.logs.push({
      time:timeStamp(),
      statement:statement,
      pColor:playerColor
    });

  }
  setLog(statement,playerColor,killedCoinColor){
    this.logs.push({
      time:timeStamp(),
      statement:statement,
      color:killedCoinColor || playerColor,
      pColor:playerColor
    });
  }
  registerMove(playerName,playerColor,move){
    let dices = ['&#9856;','&#9857;','&#9858;','&#9859;','&#9860;','&#9861;'];
    let statement = `${playerName} got`;
    this.logs.push({
      time:timeStamp(),
      statement:statement,
      move:dices[move-1],
      pColor:playerColor
    });
  }
  registerCoinMoved(playerName,coinColor){
    this.setLog(`${playerName} moved`,coinColor);
  }
  registerKilledCoin(playerName,playerColor,killedCoinColor){
    this.setLog(`${playerName} killed`,playerColor,killedCoinColor);
  }
  getLogs(){
    return this.logs;
  }
}

module.exports = ActivityLog;
