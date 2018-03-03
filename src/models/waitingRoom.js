class WaitingRoom {
  constructor(name,capacity) {
    this.name = name;
    this.capacity = capacity;
    this.guests = [];
  }
  getName(){
    return this.name;
  }
  getGuests(){
    return this.guests;
  }
  addGuest(guest){
    this.guests.push(guest);
  }
  removeGuest(guestToRemove){
    let indexOfGuest = this.guests.find((guest)=>guest==guestToRemove);
    this.guests.splice(indexOfGuest,1);
  }
  isGuest(name){
    return this.guests.includes(name);
  }
}

module.exports = WaitingRoom;
