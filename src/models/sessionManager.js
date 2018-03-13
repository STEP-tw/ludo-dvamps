class SessionManager {
  constructor(idGenerator) {
    this.sessions = {};
    this.idGenerator = idGenerator;
  }
  createSession(playerName){
    let sessionId = this.idGenerator();
    this.sessions[sessionId] = playerName;
    return sessionId;
  }
  deleteSession(sessionId){
    delete this.sessions[sessionId];
  }

  getPlayerBy(sessionId){
    return this.sessions[sessionId];
  }
}
module.exports = SessionManager;
