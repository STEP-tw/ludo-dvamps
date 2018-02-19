
const showMove = function(){
  if(!this.responseText){
    return;
  }
  let move = +this.responseText;
  let margin = (move - 1) * -50;
  getElement('#dice').style.marginTop = `${margin}px`;
  alert(move);
}

const requestRollDice = function(){
  sendAjaxRequest('GET',"/rollDice",showMove)
}

const setClickListeners = function() {
  setClickListener('div[class="diceHolder"]',requestRollDice);
};

window.onload = setClickListeners;
