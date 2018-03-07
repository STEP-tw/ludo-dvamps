class WaitingRoom {
  constructor(name,capacity) {
    this.name = name;
    this.capacity = capacity;
    this.guests = [];
  }
  getCapacity(){
    return this.capacity;
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
    let indexOfGuest = this.guests.indexOf(guestToRemove);
    this.guests.splice(indexOfGuest,1);
  }
  isGuest(name){
    return this.guests.includes(name);
  }
  isFull(){
    return this.guests.length == this.capacity;
  }
  isEmpty(){
    return this.guests.length==0;
  }
  availableSpace(){
    return this.capacity - this.guests.length;
  }
  getDetails(){
    return {
      name: this.name,
      remain: this.availableSpace(),
      createdBy: this.guests[0],
      capacity:this.capacity
    };
  }
  getStatus(){
    return this;
  }
}

module.exports = WaitingRoom;
