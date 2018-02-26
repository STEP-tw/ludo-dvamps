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

const showColor = function(players) {
  let overlay = getElement(".overlay");
  let colorHolder = getElement('#color');
  let playerName = getElement('#userName').innerText;
  let player = players.find((player) => player.name == playerName);
  colorHolder.style.backgroundColor = player.color;
  overlay.classList.remove('hide');
  overlay.classList.add('show');
};

const removeIntervals = function() {
  clearInterval(intervalID);
  clearInterval(blinkID);
  clearInterval(removeBlinkID);
};

const displayPlayerNames = function(players) {
  players.forEach((player, index) => {
    if (getElement(`#player${index+2}`) != undefined) {
      getElement(`#player${index+2}`).value = "";
    }
    getElement(`#player${index+1}`).value = player.name;
  });
};

const startTimer = function() {
  let timer = getElement('#Timer');
  timer.style.visibility = 'visible';
  setInterval(updateSeconds, 1000);
  setTimeout(goToBoard, 3000);
};

const updatePlayers = function() {
  if (this.responseText == "") {
    goToHome();
    return;
  }
  let players = JSON.parse(this.responseText).players;
  if (players == undefined) {
    return;
  }
  displayPlayerNames(players);
  if (players.length < 4) {
    return;
  }
  getElement('#message').style.visibility = 'hidden';
  showColor(players);
  startTimer();
  removeIntervals();
};

const updateGameName = function() {
  let cookies = keyValParse(document.cookie);
  getElement('#gameName').innerText = cookies.gameName;
};

const getStatus = function() {
  sendAjaxRequest('GET', '/waitingStatus', updatePlayers);
};

const begin = function() {
  updateGameName();
  updateUserName();
  getStatus();
  intervalID = setInterval(getStatus, 1000);
  blinkID = setInterval(blinkText, 500);
  removeBlinkID = setInterval(clearBlink, 1000);
};

window.onload = begin;
