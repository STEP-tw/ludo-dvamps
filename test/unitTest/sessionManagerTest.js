const assert = require('chai').assert;
const path = require('path');
const SessionManager = require(path.resolve('src/models/sessionManager.js'));

describe('SessionManager', () => {
  let sessionManager = {};
  beforeEach(function(){
    sessionManager = new SessionManager();
  })
  describe('#createSession', () => {
    it('should add session', () => {
      let sessionId = sessionManager.createSession('Dhanu');
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
