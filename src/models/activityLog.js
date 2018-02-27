class ActivityLog {
  constructor() {
    this.logs = [];
  }
  registerTurn(playerName,playerColor){
    let time = new Date().toLocaleTimeString();
    let statement = `${playerName}'s turn`;
    this.logs.push({
      time:time,
      statement:statement,
      pColor:playerColor
    });
  }
  registerMove(playerName,playerColor,move){
    let time = new Date().toLocaleTimeString();
    let dices = ['&#9856;','&#9857;','&#9858;','&#9859;','&#9860;','&#9861;'];
    let statement = `${playerName} got`;
    this.logs.push({
      time:time,
      statement:statement,
      move:dices[move-1],
      pColor:playerColor
    });
  }
  registerCoinMoved(playerName,coinColor){
    let time = new Date().toLocaleTimeString();
    let statement = `${playerName} moved `;
    this.logs.push({
      time:time,
      statement:statement,
      color:coinColor,
      pColor:coinColor
    });
  }
  registerKilledCoin(playerName,playerColor,killedCoinColor){
    let time = new Date().toLocaleTimeString();
    let statement = `${playerName} killed`;
    this.logs.push({
      time:time,
      statement:statement,
      color:killedCoinColor,
      pColor:playerColor
    });
  }
  getLogs(){
    return this.logs;
  }
}

module.exports = ActivityLog;
