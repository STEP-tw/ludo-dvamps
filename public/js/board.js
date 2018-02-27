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
};

const moveCoin = function(event) {
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

const arrOverlappingCoins = function(){
  for(let count=0;count<coinsId.length-1;count++){
    let currentCoin = document.getElementById(coinsId[count]);
    for(let index=count+1;index<coinsId.length;index++){
      let nextCoin = document.getElementById(coinsId[index]);
      if(hasSameCoords(currentCoin,nextCoin)){
        currentCoin.setAttribute('cx',currentCoin.cx.animVal.value-8);//14
        currentCoin.setAttribute('cy',currentCoin.cy.animVal.value-8);//8
        nextCoin.setAttribute('cx',nextCoin.cx.animVal.value+6);//8
        nextCoin.setAttribute('cy',nextCoin.cy.animVal.value+7);//4
      }
    }
  }
};

const showMovableCoins = function(coins) {
  coins.forEach((coin) => {
    let coinInBoard = document.querySelector(`#${coin.color}-${coin.id}`);
    coinInBoard.classList.add('focus');
  });
  arrOverlappingCoins();
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

const showDice = function(move) {
  let margin = (move - 1) * -50;
  getElement('#dice').style.marginTop = `${margin}px`;
};

const showMove = function() {
  let moveStatus = JSON.parse(this.responseText);
  if (!moveStatus.move) {
    moveStatus.message && showPopup(moveStatus.message);
    return;
  }
  showDice(+moveStatus.move);
  if(moveStatus.coins){
    showMovableCoins(moveStatus.coins);
    addListenerTOCoin(moveStatus.coins);
  }
};

const requestRollDice = function() {
  sendAjaxRequest('GET', "/game/rollDice", showMove);
};

const setClickListeners = function() {
  setClickListener('div[class="diceHolder"]', requestRollDice);
};

const changeBgColor = function(color) {
  let player = document.querySelector(`#${color}player`);
  player.style.backgroundColor = `${color}`;
  player.focus();
};

const getCurrPlayerColor = function(gameStatus) {
  let currentPlayer = gameStatus.currentPlayerName;
  let players = gameStatus.players;
  return players.find(player => player.name == currentPlayer).color;
};

const hideDice = function() {
  let dice = getElement('.dice');
  dice.style.display = "none";
};

const getGameStatus = function() {
  sendAjaxRequest('GET', '/game/gameStatus', function() {
    if(!this.responseText) {
      return;
    }
    let gameStatus = JSON.parse(this.responseText);
    let currentPlayerColor = getCurrPlayerColor(gameStatus);
    updateCoinPosition(gameStatus.players);
    if(gameStatus.won){
      let winningMsg = gameStatus.currentPlayerName;
      getElement('.message').innerText = `${winningMsg} has won`;
    }
    changeBgColor(currentPlayerColor);
    showDice(gameStatus.move);
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
  }).join('');
  return logStatements;
};

const showLogs = function(logs) {
  let logStatements = getLogStatements(logs);
  let activityLog = getElement('#logStatements');
  activityLog.innerHTML = `<ul>${logStatements}</ul>`;
};

const getLogs = function() {
  sendAjaxRequest('GET', '/game/logs', function() {
    let logs = JSON.parse(this.responseText);
    showLogs(logs);
  }, null);
};
let foo;
const load = function() {
  showPlayers();
  setClickListeners();
  updateUserName();
  sendAjaxRequest('GET', '/images/board.svg', function() {
    let main = document.querySelector('.board');
    main.innerHTML = this.responseText;
  });
  setInterval(getGameStatus, 1000);
  foo = setInterval(getLogs, 2000);
};

const changeCoinPosition = (coinId,cellId,margin) => {
  let coin = document.getElementById(coinId);
  let cell = document.getElementById(cellId);
  coin.setAttribute('cx',cell.x.animVal.value + margin);
  coin.setAttribute('cy',cell.y.animVal.value + margin);
};

window.onload = load;
