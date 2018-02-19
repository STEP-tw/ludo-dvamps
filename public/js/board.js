
const showMove = function(){
  if(!this.responseText){
    return;
  }
  let move = +this.responseText;
  let margin = (move - 1) * -50;
  console.log(move);
  getElement('#dice').style.marginTop = `${margin}px`;
}

const requestRollDice = function(){
  sendAjaxRequest('GET',"/rollDice",showMove)
}

const setClickListeners = function() {
  setClickListener('div[class="diceHolder"]',requestRollDice);
};

window.onload = setClickListeners;
