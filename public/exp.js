const sendAjaxRequest = function(method,url,callBack,reqBody){
  let ajax = new XMLHttpRequest();
  ajax.onload=callBack;
  ajax.open(method,url);
  if(reqBody){
    ajax.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
    return ajax.send(reqBody);
  }
  ajax.send();
};

const load = function() {
  sendAjaxRequest('GET','/exp.svg',function(){
    let main = document.querySelector('.board');
    console.log(this.responseText);
    main.innerHTML = this.responseText;
  });
};

const getElement = function(selector) {
  return document.querySelector(selector);
};
const moveCoin = function(coinId,cellId) {
  let coin = document.getElementById(coinId);
  let cell = document.getElementById(cellId);
  coin.setAttribute('cx',cell.x.animVal.value + 17.375);
  coin.setAttribute('cy',cell.y.animVal.value + 17.375);
};


window.onload = load;
