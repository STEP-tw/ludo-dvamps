let intervalID;
const getElem= id => document.getElementById(`${id}`);
const exitGame = function() {
  sendAjaxRequest('DELETE','/player');
  goToHome();
};
const updateSeconds = function() {
  let secondBlock = getElem('sec');
  let seconds = +(secondBlock.innerText);
  seconds--;
  secondBlock.innerHTML = seconds;
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
  players.forEach((player, index) => {
    if(index>3) {
      return;
    }
    if(getElem(`player${index+2}`)!=undefined){
      getElem(`player${index+2}`).value ="";
    }
    getElem(`player${index+1}`).value = player.name;
  });
  if (players.length == 4) {
    let timer = getElem('Timer');
    getElem('message').style.visibility = 'hidden';
    timer.style.visibility = 'visible';
    setInterval(updateSeconds, 1000);
    setTimeout(goToBoard, 3000);
    clearInterval(intervalID);
  }
};
const updateGameName = function() {
  let gameName = this.responseText;
  getElem('gameName').innerText = gameName;
};
const updateUserName = function() {
  let userName = this.responseText;
  getElem('userName').innerText = userName;
};
const setGameName = function() {
  sendAjaxRequest('GET','/gameName',updateGameName);
};
const setUserName = function() {
  sendAjaxRequest('GET','/userName',updateUserName);
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
