const showPlayers = function() {
  sendAjaxRequest('GET', '/waitingStatus', function() {
    if (!this.responseText) {
      return;
    }
    let colors = ['red', 'green', 'yellow', 'blue'];
    let status = JSON.parse(this.responseText);
    colors.forEach((color) => {
      let player = status.players.find((player) => {
        return player.color == color;
      });
      let playerName = document.querySelector(`#${color}player`);
      playerName.value = player.name;
    });
  });
};
const updateCoinPosition = function(players){
  players.forEach((player)=>{
    player.coins.forEach((coin)=>{
      if (+coin.position < 0) {
        coin.position = `home${coin.position}`;
        changeCoinPosition(`${coin.color}-${coin.id}`,coin.position,31.5);
        return;
      }
      changeCoinPosition(`${coin.color}-${coin.id}`,coin.position,17.35);
    });
  });
  arrOverlappingCoins();
};

let moveCoin = function(event) {
  let coinToMove = event.target.id.split('-')[1];
  sendAjaxRequest('POST', '/game/moveCoin', function() {
    let status = JSON.parse(this.responseText);
    updateCoinPosition(status.players);
    status.players.forEach((player)=>{
      hideMovableCoins(player.coins);
    });
  }, `coinId=${coinToMove}`);
};

const addListenerTOCoin = function(coins) {
  coins.forEach((coin) => {
    setClickListener(`#${coin.color}-${coin.id}`, moveCoin);
  });
};

const hideMovableCoins = function(coins) {
  coins.forEach((coin) => {
    let coinInBoard = document.querySelector(`#${coin.color}-${coin.id}`);
    coinInBoard.classList.remove('focus');
  });
};

const coinsId = [
  'red-1','red-2','red-3','red-4',
  'green-5','green-6','green-7','green-8',
  'yellow-9','yellow-10','yellow-11','yellow-12',
  'blue-13','blue-14','blue-15','blue-16'
];

const hasSameCoords = function(coin1,coin2){
  let coin1XCoord = coin1.cx.animVal.value;
  let coin1YCoord = coin1.cy.animVal.value;
  let coin2XCoord = coin2.cx.animVal.value;
  let coin2YCoord = coin2.cy.animVal.value;
  return coin1XCoord==coin2XCoord&&coin1YCoord==coin2YCoord;
};

const hasDiffColor = function(currentCoin,nextCoin){
  let currentCoinColor = currentCoin.id.split('-')[0];
  let nextCoinColor = nextCoin.id.split('-')[0];
  return currentCoinColor != nextCoinColor;
};

const isOverlapped = function(currCoin,nextCoin) {
  return hasSameCoords(currCoin,nextCoin)&&hasDiffColor(currCoin,nextCoin);
};

const arrOverlappingCoins = function(){
  for(let count=0;count<coinsId.length-1;count++){
    let currentCoin = document.getElementById(coinsId[count]);
    for(let index=count+1;index<coinsId.length;index++){
      let nextCoin = document.getElementById(coinsId[index]);
      if(isOverlapped(currentCoin,nextCoin)){
        currentCoin.setAttribute('cx',currentCoin.cx.animVal.value-6);//14
        currentCoin.setAttribute('cy',currentCoin.cy.animVal.value-6);//8
        nextCoin.setAttribute('cx',nextCoin.cx.animVal.value+12);//8
        nextCoin.setAttribute('cy',nextCoin.cy.animVal.value+12);//4
      }
    }
  }
};

const showMovableCoins = function(coins) {
  coins.forEach((coin) => {
    let coinInBoard = document.querySelector(`#${coin.color}-${coin.id}`);
    coinInBoard.classList.add('focus');
  });
};

const showPopup = function(message) {
  let popup = document.querySelector('.popup');
  popup.style.display = 'block';
  let messageHolder = document.querySelector('.popup-content p');
  messageHolder.innerText = message;
  setTimeout(() => {
    popup.style.display = 'none';
  }, 1000);
};

const showDice = function(event,move) {
  let margin = (move - 1) * -50;
  getElement(`#${event.target.id}`).style.marginTop = `${margin}px`;
};

const isSamePlayer = function(currentPlayer){
  let cookiePlayer = decodeURIComponent(document.cookie);
  return keyValParse(cookiePlayer).playerName == currentPlayer;
};

const animateDice = function(event) {
  let faces = [1,2,3,4,5,6];
  let randomIndex = Math.floor(Math.random()*6);
  let randomFace = faces[randomIndex];
  showDice(event,randomFace);
};

const showMove = function(response,event) {
  let moveStatus = JSON.parse(response);
  if (!moveStatus.move) {
    return;
  }
  let animator = setInterval(function(){
    animateDice(event);
  },100);
  setTimeout(function(){
    clearInterval(animator);
    // showDice(event,+moveStatus.move);
    if(moveStatus.coins && isSamePlayer(moveStatus.currentPlayer)){
      showMovableCoins(moveStatus.coins);
      addListenerTOCoin(moveStatus.coins);
    }
    showDice(event,+moveStatus.move);
  },2000);
};

let requestRollDice = function(event) {
  sendAjaxRequest('GET', "/game/rollDice", function(){
    let response = this.responseText;
    showMove(response,event);
  });
};

const changeBgColor = function(color) {
  let player = document.querySelector(`#${color}player`);
  player.focus();
};

const getCurrPlayerColor = function(gameStatus) {
  let currentPlayer = gameStatus.currentPlayerName;
  let players = gameStatus.players;
  return players.find(player => player.name == currentPlayer).color;
};

const coverDice = function(color) {
  let dice = getElement(`.${color}Sec .dice`);
  dice.classList.replace('show','hide');
};

const uncoverDice = function(color) {
  let dice = getElement(`.${color}Sec .dice`);
  dice.onclick = requestRollDice;
  dice.classList.replace('hide','show');
};

const changeDiceBg = function(color){
  let dice = getElement(`.${color}Sec .dice`);
};

const getGameStatus = function() {
  sendAjaxRequest('GET', '/game/gameStatus', function() {
    if(!this.responseText) {
      return;
    }
    let gameStatus = JSON.parse(this.responseText);
    let currentPlayerName = gameStatus.currentPlayerName;
    let currentPlayerColor = getCurrPlayerColor(gameStatus);
    if (isSamePlayer(currentPlayerName)){
      uncoverDice(currentPlayerColor);
    }else{
      let allColors = ["red","yellow","green","blue"];
      allColors.forEach((color)=>{
        setTimeout(()=>coverDice(color),1000);
      });
    }
    updateCoinPosition(gameStatus.players);
    if(gameStatus.won){
      let playerName = gameStatus.currentPlayerName;
      getElement('.message').innerText = `${playerName} has won`;
      endGame();
    }
    changeDiceBg();
    changeBgColor(currentPlayerColor);
  });
};

const getCoin = function(color){
  return color &&`<span class="${color} coin">&#x25C9;</span>` || '';
};

const getPlayer = function(color){
  return color && `<span class="fa ${color}">&#xf2be;</span>` || '';
};

const getLogStatements =function(logs) {
  let logStatements = logs.map((log) => {
    let playerColor = getPlayer(log.pColor);
    let move = log.move && `<label class ="redDice">${log.move}</label>` || '';
    let coinColor = getCoin(log.color);
    let time = `<label class="time">${log.time}</label>`;
    let statement = `<span class="log">${log.statement}</span>`;
    return `<p class="logItems">${time}${playerColor}
    ${statement}${move}${coinColor} </p>`;
  }).reverse().join('');
  return logStatements;
};

const showLogs = function(logs) {
  let activityLog = getElement('#logStatements');
  let newLogCount = logs.length - activityLog.childElementCount;
  if (newLogCount) {
    let newLogs = logs.slice(newLogCount*(-1));
    let logStatements = getLogStatements(newLogs);
    activityLog.innerHTML = logStatements+activityLog.innerHTML;
  }
};

const getLogs = function() {
  sendAjaxRequest('GET', '/game/logs', function() {
    let logs = JSON.parse(this.responseText);
    showLogs(logs);
  }, null);
};

/*eslint-disable*/
//have to give a sorter name to variable and enable eslint.
let gameStatusReqInterval;
let logStatusReqInterval;
const load = function() {
  showPlayers();
  updateUserName();
  sendAjaxRequest('GET', '/images/board.svg', function() {
    let main = document.querySelector('.board');
    main.innerHTML = this.responseText;
  });
  gameStatusReqInterval=setInterval(getGameStatus, 1000);
  logStatusReqInterval=setInterval(getLogs, 2000);
};
const endGame = function() {
  clearInterval(gameStatusReqInterval);
  clearInterval(logStatusReqInterval);
  moveCoin=null;
  requestRollDice = null;
  sendAjaxRequest('DELETE', '/player');
};

const changeCoinPosition = (coinId,cellId,margin) => {
  let coin = document.getElementById(coinId);
  let cell = document.getElementById(cellId);
  coin.setAttribute('cx',cell.x.animVal.value + margin);
  coin.setAttribute('cy',cell.y.animVal.value + margin);
};

window.onload = load;
