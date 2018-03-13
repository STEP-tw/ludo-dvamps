/*eslint-disable*/
let highlightedCell = "";
const showPlayers = function() {
  sendAjaxRequest('GET', '/game/playerDetails', function() {
    if (!this.responseText) {
      return;
    }
    let colors = ['red', 'yellow', 'green', 'blue'];
    let status = JSON.parse(this.responseText);
    colors = colors.slice(0,status.players.length);
    colors.forEach((color) => {
      let player = status.players.find((player) => {
        return player.color == color;
      });
      let playerName = document.querySelector(`#${color}player`);
      playerName.value = player.name;
    });
  });
};
const showMovableCoins = function(coins){
  actionOnMovableCoins(coins,"add");
  addListenerTOCoin(coins);
};
const showCoin = function(coin){
  let ele = getElement(`#${coin.color}-${coin.id}`);
  ele.classList.replace('hide','show');
  let textElement = getElement(`#${coin.color}-${coin.id}-text`);
  textElement.classList.replace('hide','show');
};

const isDestinationCell = function(cellID){
  return [116,155,129,142].includes(+cellID);
};

const highlightSingleCell = function(cellID){
  let ele = document.getElementById(cellID);
  ele.classList.add('highlight');
};

const dehighlightSingleCell = function(cellID){
  let ele = document.getElementById(`${cellID}`);
  ele.classList.remove('highlight');
};

const highlightDestinationCells = function(cellId){
  let highlightedCells = document.getElementsByClassName(`${cellId}`);
  for (let i = 0; i < highlightedCells.length; i++) {
    highlightedCells[i].classList.add('highlight');
  }
};

const dehighlightDestinationCells = function(cellId){
  let highlightedCells = document.getElementsByClassName(`${cellId}`);
  for (let i = 0; i < highlightedCells.length; i++) {
    highlightedCells[i].classList.remove('highlight');
  }
};

const isHighlighted = function(cellID){
  if(!document.getElementById(cellID)){
    return;
  }
  return document.getElementById(cellID).classList.contains('highlight');
};
const hideCoin = function(coin){
  let ele = getElement(`#${coin.color}-${coin.id}`);
  ele.classList.contains('show')?
    ele.classList.replace('show','hide')
    : ele.classList.add('hide');
  let text = getElement(`#${coin.color}-${coin.id}-text`);
  text.classList.contains('show')?
    text.classList.replace('show','hide')
    : text.classList.add('hide');

};
const placeCoin = (coin)=>{
  let coinId = `${coin.color}-${coin.id}`;
  if (+coin.position < 0) {
    coin.position = `home${coin.position}`;
    setCountOnCoin([coinId],{[coinId]:""});
    changeCoinPosition(coinId,coin.position,31.5,31.5);
    return;
  }
  changeCoinPosition(coinId,coin.position,20,20);
  return;
};
const decideCoinsToShow = (playerCoinsToShow,coin)=>{
  let oldCoin = playerCoinsToShow.find(co=>co.position==coin.position);
  if (oldCoin) {
    hideCoin(coin);
    oldCoin.belowCoins += 1;
    return playerCoinsToShow;
  }
  coin.belowCoins = 1;
  coin.position >= 0 && playerCoinsToShow.push(coin);
  showCoin(coin);
  placeCoin(coin);
  return playerCoinsToShow;
};
const arrBelowCoinsCount = function(coins){
  let countsOfbelowCoins = {};
  coins.forEach((coin)=>{
    countsOfbelowCoins[`${coin.color}-${coin.id}`] = coin.belowCoins;
  });
  return countsOfbelowCoins;
};
const makeSortedCoin = function(coins) {
  let sortedCoins = coins.reduce((sortedCoins,coin)=>{
    sortedCoins[coin.position] ?
      sortedCoins[coin.position].push(`${coin.color}-${coin.id}`)
      : sortedCoins[coin.position] = [ `${coin.color}-${coin.id}`];
    return sortedCoins;
  },{});
  return sortedCoins;
};
const setCountOnCoin = function(coinIds,coinsCounts){
  coinIds.forEach((coinId)=>{
    let text = coinsCounts[coinId];
    let textEle = getElement(`#${coinId}-text`);
    textEle.textContent = "";
    text>1 ? textEle.textContent = text : textEle.textContent = "";
  });
};
const updateCoinPosition = function(players){
  let overlappedCoins = [];
  players.forEach((player)=>{
    let playerCoinsToShow = player.coins.reduce(decideCoinsToShow,[]);
    overlappedCoins = overlappedCoins.concat(playerCoinsToShow);
  });
  let sortedCoins = makeSortedCoin(overlappedCoins);
  let belowCoinsCount = arrBelowCoinsCount(overlappedCoins);
  arrOverlappingCoins(sortedCoins);
  setCountOnCoin(Object.values(sortedCoins),belowCoinsCount);
};
let moveCoin = function(coinToMove) { //don't change it to const
  let coinID=coinToMove.replace('-coin','');
  sendAjaxRequest('POST', '/game/moveCoin', function() {
    let status = JSON.parse(this.responseText);
    if (status.won) {
      endGame();
      let playerName = status.currentPlayerName;
      getElement('.message').innerText = `${playerName} has won`;
    }
    updateCoinPosition(status.players);
    status.players.forEach((player)=>{
      actionOnMovableCoins(player.coins,"remove");
    });
  }, `coinId=${coinID}`);
};

const highlightNextPosition = function(responseText,coinToMove){
  if(!responseText){
    return;
  }
  let highlightCells = highlightSingleCell;
  let dehighlightCells = dehighlightSingleCell;
  let nextPos = +responseText;
  isDestinationCell(nextPos) && (highlightCells = highlightDestinationCells);
  isDestinationCell(highlightedCell) && (dehighlightCells = dehighlightDestinationCells);
  if(isHighlighted(nextPos)){
    dehighlightCells(nextPos);
    moveCoin(coinToMove);
    removeClickListeners('g');
    return;
  }
  if(highlightedCell || highlightedCell == '0'){
    dehighlightCells(highlightedCell);
  }
  highlightCells(nextPos);
  highlightedCell = nextPos;
}

const getNextPos = function(event){
  let coinToMove=event.target.id.split('-')[1];
  sendAjaxRequest('POST','/game/nextPos',function(){
    highlightNextPosition(this.responseText,coinToMove);
  },`coinID=${coinToMove}`);
};
const addListenerTOCoin = function(coins) {
  coins.forEach((coin) => {
    setClickListener(`#${coin.color}-coin-${coin.id}`, getNextPos);
  });
};
const actionOnMovableCoins = function(coins,action) {
  coins.forEach((coin) => {
    let coinInBoard = document.querySelector(`#${coin.color}-${coin.id}`);
    coinInBoard.classList[action]('focus');
  });
};
const coinsId = [
  'red-1','red-2','red-3','red-4',
  'green-5','green-6','green-7','green-8',
  'yellow-9','yellow-10','yellow-11','yellow-12',
  'blue-13','blue-14','blue-15','blue-16'
];
const arrOverlappingCoins = function(sortedCoins) {
  Object.keys(sortedCoins).forEach((cellPos) => {
    let marginsFor = {
      1: [20, 20],
      2: [11, 11, 28, 28],
      3: [11, 11, 20, 28, 28, 11],
      4: [11, 11, 11, 28, 28, 11, 28, 28]
    };
    let coins = sortedCoins[cellPos];
    let marginForCoin = marginsFor[coins.length];
    coins.forEach((coin, index) => {
      margins = marginForCoin.slice(index * 2, index * 2 + 2);
      changeCoinPosition(coin, cellPos, margins[0], margins[1]);
    });
  });
};

const showDice = function(event,move) {
  let margin = (move - 1) * -50;
  getElement(`#${event.target.id}`).style.marginTop = `${margin}px`;
};
const isCurrentPlayer = function(currentPlayer){
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
    showDice(event,+moveStatus.move);
  },1000);
};

let requestRollDice = function(event) { //don't change this function to const
  sendAjaxRequest('GET', "/game/rollDice", function(){
    let response = this.responseText;
    showMove(response,event);
  });
};
const changeBgColor = function(color) {
  let player = document.querySelector(`#${color}player`);
  player.focus();
};
const getCurrPlayerColor = function(players,currentPlayer) {
  return players.find(player => player.name == currentPlayer).color;
};
const coverDice = function(color) {
  let dice = getElement(`.${color}Sec .dice .diceHolder`);
  dice.classList.replace('show','hide');
};
const uncoverDice = function(color) {
  let dice = getElement(`.${color}Sec .dice .diceHolder`);
  dice.onclick = requestRollDice;
  dice.classList.replace('hide','show');
};
const changeCurrPlayerDice = function(player,color) {
  let allColors = ["red","yellow","green","blue"];
  allColors.splice(allColors.indexOf(color),1);
  allColors.forEach((pcolor)=>{
    setTimeout(()=>{
      if (isCurrentPlayer(player)){
        uncoverDice(color);
        return;
      }
      coverDice(pcolor);
    },1500);
  });
};
const setWinningMsg = function(player){
  getElement('.message').innerText = `${player} has won`;
  endGame();
};
const setCurrPlayer = function(players,currentPlayer){
  let currentPlayerColor = getCurrPlayerColor(players,currentPlayer);
  changeCurrPlayerDice(currentPlayer,currentPlayerColor);
  updateCoinPosition(players);
  changeBgColor(currentPlayerColor);
};
const getGameStatus = function() {
  sendAjaxRequest('GET', '/game/gameStatus', function() {
    if(!this.responseText){
      return;
    }
    let gameStat = JSON.parse(this.responseText);
    let players = gameStat.players;
    let currentPlayer = gameStat.currentPlayerName;
    if(gameStat.won) {
      setWinningMsg(currentPlayer);
    }
    if(gameStat.movableCoins && isCurrentPlayer(gameStat.currentPlayerName)){
      showMovableCoins(gameStat.movableCoins);
    }
    setCurrPlayer(players,currentPlayer);
  });
};
const getCoin = function(color,unicode){
  let coin = color &&`<span class="${color} coin">${unicode}</span>`|| '';
  return coin.replace(/\'/g,'');
};
const getPlayer = function(color){
  return color && `<span class="fa ${color}">&#xf2be;</span>` || '';
};
const toLocalTime = function(time) {
  let timeZone = moment.tz.guess();
  let tm = moment(time);
  return tm.tz(timeZone).format('hh:mm:ss a');
};
const getLogStatements =function(logs) {
  let logStatements = logs.map((log) => {
    let convTime = toLocalTime(log.time);
    let playerColor = getPlayer(log.pColor);
    let move = log.move && `<label class ="redDice">${log.move}</label>` || '';
    let time = `<label class="time">${convTime}</label>`;
    let coinColor = getCoin(log.color,'&#x25C9;');
    let killedCoin = getCoin(log.killedCoinColor,'&#x29bb;');
    let statement = `<span class="log">${log.statement}</span>`;
    return `<p class="logItems">${time}${playerColor}
    ${statement}${move}${coinColor}${killedCoin}</p>`;
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
let gameStatusReqInterval;
let logStatusReqInterval;

const load = function() {
  showPlayers();
  setGameAndUser('#userName','#nameOfGame');
  sendAjaxRequest('GET', '/images/board.svg', function() {
    if(!this.responseText){
      return;
    }
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
};
const changeCoinPosition = (coinId,cellId,marginForX,marginForY) => {
  let coin = document.getElementById(coinId);
  let cell = document.getElementById(cellId);
  let text = document.querySelector(`#${coinId}-text`);
  let xCoOrd=cell.x.animVal.value + marginForX;
  let yCoOrd=cell.y.animVal.value + marginForY;
  coin.setAttribute('cx',xCoOrd);
  coin.setAttribute('cy',yCoOrd);
  text.setAttribute('x',xCoOrd);
  text.setAttribute('y',yCoOrd);
};
window.onload = load;
/*eslint-enable*/
