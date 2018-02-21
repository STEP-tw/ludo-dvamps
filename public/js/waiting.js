let intervalID;
const exitGame = function() {
  sendAjaxRequest('DELETE','/player');
  goToHome();
};

const updateSeconds = function() {
  let secondBlock = getElement('#sec');
  let seconds = +(secondBlock.innerText);
  seconds--;
  secondBlock.innerHTML = seconds;
};

const showColor = function(players){
  let overlay = getElement(".overlay");
  let colorHolder = getElement('#color');
  let playerName = getElement('#userName').innerText;
  let player = players.find((player)=>player.name == playerName);
  colorHolder.style.backgroundColor = player.color;
  overlay.classList.remove('hide');
  overlay.classList.add('show');
};

const showPlayerName = function(players){
  players.forEach((player, index) => {
    if(index>3) {
      return;
    }
    if(getElement(`#player${index+2}`)!=undefined){
      getElement(`#player${index+2}`).value ="";
    }
    getElement(`#player${index+1}`).value = player.name;
  });
};

const takePlayerToBoard = function(players){
  let timer = getElement('#Timer');
  setInterval(updateSeconds, 1000);
  showColor(players);
  hideElement('#message');
  setTimeout(goToBoard, 3000);
  clearInterval(intervalID);
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
  showPlayerName(players);
  if (players.length == 4) {
    takePlayerToBoard(players);
  }
};

const updateGameName = function() {
  let gameName = this.responseText;
  getElement('#gameName').innerText = gameName;
};

const setGameName = function() {
  sendAjaxRequest('GET','/gameName',updateGameName);
};

const getStatus = function() {
  sendAjaxRequest('GET','/getStatus',updatePlayers);
};

const begin = function() {
  setGameName();
  setUserName();
  getStatus();
  intervalID = setInterval(getStatus, 1000);
};

window.onload = begin;
