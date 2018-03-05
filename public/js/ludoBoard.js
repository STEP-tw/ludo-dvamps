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

const showMovableCoins = function(coins){
  actionOnMovableCoins(coins,"add");
  addListenerTOCoin(coins);
};

const showCoin = function(coin){
  let ele = getElement(`#${coin.color}-${coin.id}`);
  ele.classList.replace('hide','show');
};

const hideCoin = function(coin){
  let ele = getElement(`#${coin.color}-${coin.id}`);
  ele.classList.contains('show')?
    ele.classList.replace('show','hide')
    : ele.classList.add('hide');
};

const placeCoin = (coin)=>{
  if (+coin.position < 0) {
    coin.position = `home${coin.position}`;
    changeCoinPosition(`${coin.color}-${coin.id}`,coin.position,31.5,31.5);
    return;
  }
  changeCoinPosition(`${coin.color}-${coin.id}`,coin.position,20,20);
  return;
};

const decideCoinsToShow = (playerCoinsToShow,coin)=>{
  if (playerCoinsToShow.some(co=>co.position==coin.position)) {
    hideCoin(coin);
    return playerCoinsToShow;
  }
  coin.position >= 0 && playerCoinsToShow.push(coin);
  showCoin(coin);
  placeCoin(coin);
  return playerCoinsToShow;
};

const updateCoinPosition = function(players){
  let overlappedCoins = [];
  players.forEach((player)=>{
    let playerCoinsToShow = player.coins.reduce(decideCoinsToShow,[]);
    overlappedCoins = overlappedCoins.concat(playerCoinsToShow);
  });
  let sortedCoins = overlappedCoins.reduce((sortedCoins,coin)=>{
    sortedCoins[coin.position] ?
      sortedCoins[coin.position].push(`${coin.color}-${coin.id}`)
      : sortedCoins[coin.position] = [`${coin.color}-${coin.id}`];
    return sortedCoins;
  },{});
  arrOverlappingCoins(sortedCoins);
};

let moveCoin = function(event) {
  let coinToMove = event.target.id.split('-')[1];
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
  }, `coinId=${coinToMove}`);
};

const addListenerTOCoin = function(coins) {
  coins.forEach((coin) => {
    setClickListener(`#${coin.color}-${coin.id}`, moveCoin);
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

const arrOverlappingCoins = function(sortedCoins){
  Object.keys(sortedCoins).forEach((cellPos)=>{
    let marginsFor = {1:[20,20],2:[11,11,28,28],
      3:[11,11,20,28,28,11],4:[11,11,11,28,28,11,28,28]};
    let coins = sortedCoins[cellPos];
    let marginForCoin = marginsFor[coins.length];
    coins.forEach((coin,index)=>{
      margins = marginForCoin.slice(index*2,index*2+2);
      changeCoinPosition(coin,cellPos,margins[0],margins[1]);
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

const requestRollDice = function(event) {
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
    let killedCoin = getCoin(log.killedCoinColor,'&#x2639;');
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

/*eslint-disable*/
let gameStatusReqInterval;
let logStatusReqInterval;
const load = function() {
  showPlayers();
  setGameAndUser('#userName','#nameOfGame');
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
};

const changeCoinPosition = (coinId,cellId,marginForX,marginForY) => {
  let coin = document.getElementById(coinId);
  let cell = document.getElementById(cellId);
  coin.setAttribute('cx',cell.x.animVal.value + marginForX);
  coin.setAttribute('cy',cell.y.animVal.value + marginForY);
};

window.onload = load;
