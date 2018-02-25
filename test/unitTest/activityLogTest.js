const assert = require('chai').assert;
const path = require('path');
const ActivityLog = require(path.resolve('src/models/activityLog.js'));

describe('ActivityLog', () => {
  let activityLog;
  beforeEach(()=>{
    activityLog = new ActivityLog();
  })
  describe('#registerTurn', () => {
    it('should register player turn', () => {
      activityLog.registerTurn('kaka');
      let logs = activityLog.getLogs();
      assert.match(JSON.stringify(logs[0]),/kaka/);
    });
  });
  describe('#registerMove', () => {
    it('should register move of the player', () => {
      activityLog.registerMove('kaka','red',5);
      let logs = activityLog.getLogs();
      assert.match(JSON.stringify(logs[0]),/kaka/);
      assert.match(JSON.stringify(logs[0]),/&#9860;/);
      assert.match(JSON.stringify(logs[0]),/red/);
    });
  });
  describe('#registerCoinMove', () => {
    it('should register move of the player', () => {
      activityLog.registerMove('player','red',5);
      let logs = activityLog.getLogs();
      assert.match(JSON.stringify(logs[0]),/player/);
      assert.match(JSON.stringify(logs[0]),/&#9860;/);
      assert.match(JSON.stringify(logs[0]),/red/);
    });
  });
  describe('#registerCoinMoved', () => {
    it('should register coin of the player with color', () => {
      activityLog.registerCoinMoved('player','red');
      let logs = activityLog.getLogs();
      assert.match(JSON.stringify(logs[0]),/player/);
      assert.match(JSON.stringify(logs[0]),/red/);
    });
  });
});
