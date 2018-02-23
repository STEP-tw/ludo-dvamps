const assert = require('chai').assert
const path = require('path');
const WaitingRoom= require(path.resolve('src/models/waitingRoom.js'));

describe('#waiting room',function(){
  let waitingRoom = {};
  beforeEach(function(){
    waitingRoom = new WaitingRoom('pratikshalya',4);
  })
  describe('getName',function(){
    it('should give its name',function(){
      assert.equal(waitingRoom.getName(),'pratikshalya');
    });
  });
  describe('addGuest',function(){
    it('should add a given guest',function(){
      waitingRoom.addGuest('guest');
      waitingRoom.addGuest('someotherGuest');
      assert.deepEqual(waitingRoom.getGuests(),['guest','someotherGuest']);
    });
  });
  describe('removeGuest',function(){
    it('should remove a guest',function(){
      waitingRoom.addGuest('guest');
      assert.deepEqual(waitingRoom.getGuests(),['guest']);
      waitingRoom.removeGuest('guest');
      assert.deepEqual(waitingRoom.getGuests(),[]);
    });
  });
  describe('isGuest',function(){
    it('should give true if guest is in waiting room',function(){
      waitingRoom.addGuest('guest');
      assert.isOk(waitingRoom.isGuest('guest'));
    });
    it('should give false if guest is not in waiting room',function(){
      waitingRoom.addGuest('guest');
      assert.isNotOk(waitingRoom.isGuest('badMan'));
    });
  });
  describe('hasReachedCapacity',function(){
    it('should remove a guest',function(){
      waitingRoom.addGuest('guest');
      assert.deepEqual(waitingRoom.getGuests(),['guest']);
      waitingRoom.removeGuest('guest');
      assert.deepEqual(waitingRoom.getGuests(),[]);
    });
  });
  describe('hasReachedCapacity',function(){
    it('should give true if number guest in it is equal to its capacity',function(){
      waitingRoom = new WaitingRoom('pratikshalya',2);
      waitingRoom.addGuest('guest');
      waitingRoom.addGuest('anotherGuest');
      assert.isOk(waitingRoom.hasReachedCapacity());
    });
  });
  describe('spaceRemaining',function(){
    it('should give number of guest remaining to reach capacity',function(){
      waitingRoom.addGuest('guest');
      waitingRoom.addGuest('anotherGuest');
      assert.isOk(waitingRoom.getRemainingSpace(),2);
    });
  });
});