let diceStatusRequest;
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

const showMovableCoins = function(coins) {
  coins.forEach((coin) => {
    let coinInBoard = document.querySelector(`#${coin.color}${coin.id}`);
    coinInBoard.classList.add('focus');
  });
};

const showMove = function(){
  let moveStatus = JSON.parse(this.responseText);
  if(!moveStatus.move) {
    return;
  }
  let margin = (+moveStatus.move - 1) * -50;
  getElement('#dice').style.marginTop = `${margin}px`;
  showMovableCoins(moveStatus.coins);
};

const requestRollDice = function(){
  sendAjaxRequest('GET',"/game/rollDice",showMove);
};

const setClickListeners = function() {
  setClickListener('div[class="diceHolder"]',requestRollDice);
};

const changeBgColor = function(color){
  let board = document.querySelector('.mainContainer');
  board.className = `mainContainer ${color}`;
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
  });
};

const load = function() {
  showPlayers();
  setClickListeners();
  setUserName();
  sendAjaxRequest('GET','/images/board.svg',function(){
    let main = document.querySelector('.board');
    main.innerHTML = this.responseText;
  });
  setInterval(getGameStatus,2000);
};

const moveCoin = (coinId,cellId) => {
  let coin = document.getElementById(coinId);
  let cell = document.getElementById(cellId);
  coin.setAttribute('cx',cell.x.animVal.value + 17.375);
  coin.setAttribute('cy',cell.y.animVal.value + 17.375);
};

window.onload = load;
