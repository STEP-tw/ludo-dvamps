class SessionManager {
  constructor() {
    this.sessions = {};
  }
  createSession(playerName){
    let sessionId = new Date().getTime();
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
