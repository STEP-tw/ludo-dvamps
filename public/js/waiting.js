let intervalID;
const getElem= id => document.getElementById(`${id}`);
const exitGame = function() {
  location.href = 'index.html';
  let player = getElem('userName').innerText;
  let gameName = getElem('gameName').innerText;
  let xhr = new XMLHttpRequest();
  xhr.addEventListener('load', updateGameName);
  xhr.open("DELETE", '/player');
  xhr.send();
  location.reload();
};
const goToBoard = function() {
  location.href = 'board.html';
};
const goToHome = function() {
  location.href = 'index.html';
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
  let xhr = new XMLHttpRequest();
  xhr.addEventListener('load', updateGameName);
  xhr.open("GET", '/gameName');
  xhr.send();
};
const setUserName = function() {
  let xhr = new XMLHttpRequest();
  xhr.addEventListener('load', updateUserName);
  xhr.open("GET", '/userName');
  xhr.send();
};
const getStatus = function() {
  let gameName = getElem('gameName').innerText;
  let xhr = new XMLHttpRequest();
  xhr.addEventListener("load", updatePlayers);
  xhr.open("GET", '/getStatus');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.send();
};

const begin = function() {
  setGameName();
  setUserName();
  getStatus();
  intervalID = setInterval(getStatus, 1000);
};
window.onload = begin;
