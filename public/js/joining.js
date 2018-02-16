const createRequest = function(method,url,action,data){
  let req = new XMLHttpRequest();
  req.onreadystatechange = function(){
    if (this.readyState == 4 && this.status == 200) {
      let response = JSON.parse(this.responseText);
      action(response);
    }
  };
  req.open(method,url);
  req.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
  req.send(data || '');
};

const createElement = function(element,innerText,className){
  let ele = document.createElement(element);
  ele.innerText = innerText || '';
  ele.className = className;
  return ele;
};

const appendChilds = function(node,...childs){
  childs.forEach((child)=>{
    node.appendChild(child);
  });
};

const getElement = function(selector) {
  return document.querySelector(selector);
};

const showGameData = function(game){
  let table = document.querySelector('table');
  let tr = createElement('tr');
  let gameName = createElement('td',game.name);
  let createdBy = createElement('td',game.createdBy);
  let playersToJoin = createElement('td',game.remain);
  let button = createElement('button','Join','join');
  let td = createElement('td');
  appendChilds(td,button);
  appendChilds(tr,gameName,createdBy,playersToJoin,td);
  appendChilds(table,tr);
};

const getGameName = function(event){
  let clickedButton = event.target;
  let gameInfo = clickedButton.parentElement.parentElement;
  let gameName = gameInfo.firstChild.innerText;
  return gameName;
};

const showErrorMessage = function(message){
  let messageBox = getElement('span[id=errorMessage]');
  messageBox.innerText = message;
  messageBox.className = 'show';
};

const actionOnJoin = function(joiningStatus){
  if (joiningStatus.status) {
    window.location = '/waiting.html';
    return;
  }
  showErrorMessage('* Name already Exists');
};

let joinGame = function(event){
  let gameName = getGameName(event);
  let playerName = getElement('input[name=playerName]').value;
  if (!playerName) {
    showErrorMessage('* Player Name required');
    return;
  }
  let query = `gameName=${gameName}&playerName=${playerName}`;
  createRequest('POST','/joinGame',actionOnJoin,query);
};

const displayGamesToJoin = function(games){
  games.forEach(showGameData);
  let joiningButtons = document.querySelectorAll('button[class=join]');
  joiningButtons.forEach(button=>{
    button.onclick = joinGame;
  });
};


const getAvailableGames = function(){
  const url = '/getAvailableGames';
  createRequest('GET',url,displayGamesToJoin);
};

const goToHome = function(){
  window.location = "/index.html";
};

const setClickListener = function(selector,listener) {
  let element = getElement(selector);
  if(element){
    element.onclick = listener;
  }
};

const onLoad = function(){
  getAvailableGames();
  setClickListener('button[name=back]',goToHome);
};

window.onload = onLoad;
