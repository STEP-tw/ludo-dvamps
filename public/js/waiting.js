let intervalID;
const exitGame = function () {
  location.href='index.html';
  let player= document.getElementById('userName').innerText;
  let gameName=document.getElementById('gameName').innerText;
  let xhr = new XMLHttpRequest();
  xhr.addEventListener('load',updateGameName);
  xhr.open("DELETE",'/player');
  xhr.send();
};
const goToBoard = function(){
  location.href='board.html';
};
const goToHome = function(){
  location.href='index.html';
};
const updateSeconds = function(){
  let secondBlock=document.getElementById('sec');
  let seconds=+(secondBlock.innerText);
  seconds--;
  secondBlock.innerHTML=seconds;
};

const updatePlayers= function () {
  if(this.responseText=="") {
    goToHome();
    return;
  }
  let players=JSON.parse(this.responseText)["players"];
  if(players==undefined) {
    return;
  }
  players.forEach((player,index)=> {
    document.getElementById(`player${index+1}`).innerHTML=player.name;
  });
  if(players.length==4) {
    let timer=document.getElementById('Timer');
    document.getElementById('message').style.visibility='hidden';
    timer.style.visibility='visible';
    setInterval(updateSeconds,1000);
    setTimeout(goToBoard,3000);
    clearInterval(intervalID);
  }
};
const updateGameName= function(){
  let gameName=this.responseText;
  document.getElementById('gameName').innerText=gameName;
};
const updateUserName= function(){
  let userName=this.responseText;
  document.getElementById('userName').innerText=userName;
};
const setGameName = function(){
  let xhr = new XMLHttpRequest();
  xhr.addEventListener('load',updateGameName);
  xhr.open("GET",'/gameName');
  xhr.send();
};
const setUserName = function(){
  let xhr = new XMLHttpRequest();
  xhr.addEventListener('load',updateUserName);
  xhr.open("GET",'/userName');
  xhr.send();
};
const getStatus = function(){
  let gameName=document.getElementById('gameName').innerText;
  let xhr = new XMLHttpRequest();
  xhr.addEventListener("load", updatePlayers);
  xhr.open("GET",'/getStatus');
  xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
  xhr.send();
};

const begin = function(){
  setGameName();
  setUserName();
  intervalID=setInterval(getStatus,1000);
};
window.onload=begin;
