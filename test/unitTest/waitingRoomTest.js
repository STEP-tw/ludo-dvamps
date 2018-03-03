const assert = require('chai').assert;
const path = require('path');
const WaitingRoom = require(path.resolve('src/models/waitingRoom.js'));

describe('WaitingRoom', () => {
  let room;
  beforeEach(()=> room = new WaitingRoom('ludo',4));
  describe('#getName', () => {
    it('should return name of the waiting room', () => {
      assert.equal(room.getName(),'ludo');
    });
  });
  describe('#getGuests', () => {
    it('should return number of guests in it', () => {
      assert.deepEqual(room.getGuests(),[]);
    });
  });
  describe('#addGuest', () => {
    it('should add a guest in it', () => {
      room.addGuest('guest1');
      assert.include(room.getGuests(),'guest1');
    });
  });
  describe('#removeGuest', () => {
    it('should remove a guest from it', () => {
      room.addGuest('guest1');
      assert.include(room.getGuests(),'guest1');
      room.removeGuest('guest1');
      assert.notInclude(room.getGuests(),'guest1');
    });
  });
  describe('#isGuest', () => {
    it('should tell wheather a given person is guest of room or not', () => {
      assert.isNotOk(room.isGuest('badMan'));
      room.addGuest('badMan');
      assert.isOk(room.isGuest('badMan'));
    });
  });
});
