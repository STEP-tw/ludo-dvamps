const assert = require('chai').assert;
const path = require('path');
const SessionManager = require(path.resolve('src/models/sessionManager.js'));

const idGenerator = function(){
  let Ids =  ['1234','1235','1236','1237'];
  return Ids.shift();
}

describe('SessionManager', () => {
  let sessionManager = {};
  beforeEach(function(){
    sessionManager = new SessionManager(idGenerator);
  })
  describe('#createSession', () => {
    it('should add session', () => {
      let sessionId = sessionManager.createSession('Dhanu');
      assert.equal(sessionId,'1234');
      assert.deepEqual(sessionManager.sessions,{[sessionId]:'Dhanu'});
    });
  });
  describe('#deleteSession', () => {
    it('should delete session from sessionManager ', () => {
      let sessionId = sessionManager.createSession('Manish');
      sessionManager.deleteSession(sessionId);
      assert.isUndefined(sessionManager.getPlayerBy(sessionId));
    });
  });
});
