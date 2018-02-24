class MockEventEmitter {
  constructor() {
    this.eventListeners = {};
    this.firedEvents = {};
  }
  emit(eventName,message){
    this.firedEvents[eventName]=message;
    let callBack = this.eventListeners[eventName];
    callBack(message);
  }
  isFired(eventName){
    return eventName in this.firedEvents;
  }
  firedMessage(eventName){
    return this.firedEvents[eventName];
  }
  on(eventName,callBack){
    this.eventListeners[eventName] = callBack;
  }
  isRegisteredEvent(eventName){
    return eventName in this.eventListeners;
  }
  getCallBackOf(eventName){
    return this.eventListeners[eventName];
  }
}
module.exports = MockEventEmitter;
