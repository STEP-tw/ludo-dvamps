let diceStatusRequest;
const showPlayers = function(){
  sendAjaxRequest('GET','/getStatus',function(){
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

const showMove = function(){
  if(!this.responseText) return;
  let move = +this.responseText;
  let margin = (move - 1) * -50;
  getElement('#dice').style.marginTop = `${margin}px`;
};

const requestRollDice = function(){
  sendAjaxRequest('GET',"/game/rollDice",showMove);
};

const setClickListeners = function() {
  setClickListener('div[class="diceHolder"]',requestRollDice);
};

const getDiceStatus = function() {
  sendAjaxRequest('GET',"/game/diceStatus",showMove);
};

const load = function() {
  showPlayers();
  setClickListeners();
  sendAjaxRequest('GET','/images/board.svg',function(){
    let main = document.querySelector('.board');
    main.innerHTML = this.responseText;
  });
  diceStatusRequest = setInterval(getDiceStatus,1000);
};

const moveCoin = (coinId,cellId) => {
  let coin = document.getElementById(coinId);
  let cell = document.getElementById(cellId);
  coin.setAttribute('cx',cell.x.animVal.value + 17.375);
  coin.setAttribute('cy',cell.y.animVal.value + 17.375);
};

window.onload = load;
