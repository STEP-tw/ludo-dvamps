class WaitingRoom {
  constructor(name,capacity){
    this.name = name;
    this.capacity = capacity;
    this.guests = [];
  }

  getName(){
    return this.name;
  }

  addGuest(guest) {
    this.guests.push(guest);
    return guest;
  }

  isGuest(guest) {
    return this.guests.includes(guest);
  }

  removeGuest(guest) {
    let guestIndex = this.guests.indexOf(guest);
    this.guests.splice(guestIndex,1);
  }

  getGuests(){
    return this.guests;
  }

  hasReachedCapacity(){
    return this.guests.length == this.capacity;
  }

  getRemainingSpace(){
    return this.capacity - this.guests.length;
  }
}

module.exports = WaitingRoom;
