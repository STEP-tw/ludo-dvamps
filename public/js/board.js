const showPlayers = function(){
  sendAjaxRequest('GET','/getStatus',function(){
    if(!this.responseText){
      return;
    }
    let colors = ['red','green','yellow','blue'];
    let status = JSON.parse(this.responseText);
    colors.forEach((color)=>{
      let player = status.players.find((player)=>{
        return player.color==color;
      });
      let playerName = document.querySelector(`#${color}player`);
      playerName.value = player.name;
    });
  });
};

const hideMovableCoins = function(coins) {
  coins.forEach((coin) => {
    let coinInBoard = document.querySelector(`#${coin.color}${coin.id}`);
    coinInBoard.classList.remove('focus');
  });
};

const showMovableCoins = function(coins) {
  coins.forEach((coin) => {
    let coinInBoard = document.querySelector(`#${coin.color}${coin.id}`);
    coinInBoard.classList.add('focus');
  });
};

const showPopup = function(message){
  let popup = document.querySelector('.popup');
  popup.style.display = 'block';
  let messageHolder = document.querySelector('.popup-content p');
  messageHolder.innerText = message;
  setTimeout(()=>{
    popup.style.display = 'none';
  },1000);
};

const showDice = function(move){
  let margin = (move - 1) * -50;
  getElement('#dice').style.marginTop = `${margin}px`;
};

const showMove = function(){
  let moveStatus = JSON.parse(this.responseText);
  if(!moveStatus.move) {
    moveStatus.message && showPopup(moveStatus.message);
    return;
  }
  showDice(+moveStatus.move);
  showMovableCoins(moveStatus.coins);
};

const requestRollDice = function(){
  sendAjaxRequest('GET',"/game/rollDice",showMove);
};

const setClickListeners = function() {
  setClickListener('div[class="diceHolder"]',requestRollDice);
};

const changeBgColor = function(color){
  let player = document.querySelector(`#${color}player`);
  player.style.backgroundColor = `${color}`;
  player.focus();
};

const getCurrPlayerColor = function(gameStatus){
  let currentPlayer = gameStatus.currentPlayerName;
  let players = gameStatus.players;
  return players.find(player=>player.name==currentPlayer).color;
};

const getGameStatus = function(){
  sendAjaxRequest('GET','/game/gameStatus',function(){
    if(!this.responseText){
      return;
    }
    let gameStatus = JSON.parse(this.responseText);
    let currentPlayerColor = getCurrPlayerColor(gameStatus);
    changeBgColor(currentPlayerColor);
    showDice(gameStatus.move);
  });
};

const showLogs = function(logs){
  let logStatements = logs.map((log)=>{
    return `<li><span>${log.time}</span>${log.statement}</li>`;
  }).join('');
  let activityLog = getElement('#logStatements');
  activityLog.innerHTML = `<ul>${logStatements}</ul>`;
};

const getLogs = function(){
  sendAjaxRequest('GET','/game/logs',function(){
    let logs = JSON.parse(this.responseText);
    showLogs(logs);
  },null);
};

const load = function() {
  showPlayers();
  setClickListeners();
  setUserName();
  sendAjaxRequest('GET','/images/board.svg',function(){
    let main = document.querySelector('.board');
    main.innerHTML = this.responseText;
  });
  setInterval(getGameStatus,1000);
  setInterval(getLogs,1000);
};

const moveCoin = (coinId,cellId) => {
  let coin = document.getElementById(coinId);
  let cell = document.getElementById(cellId);
  coin.setAttribute('cx',cell.x.animVal.value + 17.375);
  coin.setAttribute('cy',cell.y.animVal.value + 17.375);
};

window.onload = load;
