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
  // let playerName = getElement('#userName').innerText;
  // let player = players.find((player) => player.name == playerName);
  colorHolder.style.backgroundColor = color;
  overlay.classList.replace('hide','show');
  // overlay.classList.add('show');
};

const removeIntervals = function() {
  clearInterval(intervalID);
  clearInterval(blinkID);
  clearInterval(removeBlinkID);
};

const displayPlayerNames = function(players) {
  players.forEach((player, index) => {
    if (getElement(`#player${index+2}`)) {
      getElement(`#player${index+2}`).value = "";
    }
    getElement(`#player${index+1}`).value = player;
  });
};

const startTimer = function() {
  let timer = getElement('#Timer');
  timer.style.visibility = 'visible';
  setInterval(updateSeconds, 1000);
  setTimeout(goToBoard, 3000);
};

const getGameDetails = function(color,players){
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
  setGameAndUser('#userName','#gameName');
  getStatus();
  intervalID = setInterval(getStatus, 1000);
  blinkID = setInterval(blinkText, 500);
  removeBlinkID = setInterval(clearBlink, 1000);
};

window.onload = begin;
