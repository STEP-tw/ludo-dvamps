let intervalID, blinkID, removeBlinkID;
const exitGame = function() {
  sendAjaxRequest('DELETE', '/player');
  goToHome();
};

const clearBlink = function() {
  getElement('#message').classList.remove("blink");
};
const blinkText = function() {
  getElement('#message').classList.add("blink");
};

const updateSeconds = function() {
  let secondBlock = getElement('#sec');
  let seconds = +(secondBlock.innerText);
  seconds--;
  secondBlock.innerHTML = seconds;
};

const showColor = function(color) {
  let overlay = getElement(".overlay");
  let colorHolder = getElement('#color');
  colorHolder.style.backgroundColor = color;
  overlay.classList.replace('hide','show');
};

const removeIntervals = function() {
  clearInterval(intervalID);
  clearInterval(blinkID);
  clearInterval(removeBlinkID);
};

const displayPlayerNames = function(players) {
  for(let count=0;count<players.length;count++){
    getElement(`#player${count+1}`).innerText = players[count];
  }
};

const startTimer = function() {
  let timer = getElement('#Timer');
  timer.style.visibility = 'visible';
  setInterval(updateSeconds, 1000);
  setTimeout(goToBoard, 3000);
};

const showPlayerSpaces = function(capacity){
  let displaySec = getElement('.container');
  let label = '';
  for (let count=0;count<capacity;count++){
    label+=`<label class="playerNames" id="player${count+1}"></label>`;
  }
  displaySec.innerHTML = label;
};

const getGameDetails = function(color,players){
  showPlayerSpaces(players.length);
  displayPlayerNames(players);
  removeIntervals();
  getElement('#message').style.visibility = 'hidden';
  showColor(color);
  startTimer();
};

const updatePlayers = function() {
  if (this.responseText == "") {
    goToHome();
    return;
  }
  let roomDetails = JSON.parse(this.responseText);
  if(roomDetails.gameStarted){
    getGameDetails(roomDetails.yourColor,roomDetails.players);
    return;
  }
  let players = roomDetails.guests;
  if (!players) {
    return;
  }
  showPlayerSpaces(roomDetails.capacity);
  displayPlayerNames(players);
  if (players.length < roomDetails.capacity) {
    return;
  }
};

const updateGameName = function() {
  let cookies = keyValParse(document.cookie);
  getElement('#gameName').innerText = decodeURIComponent(cookies.gameName);
};

const getStatus = function() {
  sendAjaxRequest('GET', '/waitingStatus', updatePlayers);
};

const begin = function() {
  updateGameName();
  getStatus();
  intervalID = setInterval(getStatus, 1000);
  blinkID = setInterval(blinkText, 500);
  removeBlinkID = setInterval(clearBlink, 1000);
};

window.onload = begin;
