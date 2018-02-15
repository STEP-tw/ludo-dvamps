const createRequest = function(method,url,action,data){
  let req = new XMLHttpRequest();
  req.onreadystatechange = function(){
    if (this.readyState == 4 && this.status == 200) {
      let response = JSON.parse(this.responseText);
      action(response);
    }
  };
  req.open(method,url);
  req.send(data);
};

const createElement = function(element,innerText,className){
  let ele = document.createElement(element);
  ele.innerText = innerText || '';
  ele.class = className;
  return ele;
};

const appendChilds = function(node,...childs){
  childs.forEach((child)=>{
    node.appendChild(child);
  });
};


const displayGames = function(games){
  let table = document.querySelector('table');
  games.forEach(game=>{
    let tr = createElement('tr');
    let gameName = createElement('td',game.name);
    let createdBy = createElement('td',game.createdBy);
    let playersToJoin = createElement('td',game.remain);
    let button = createElement('button','Join','join');
    let td = createElement('td');
    appendChilds(td,button);
    appendChilds(tr,gameName,createdBy,playersToJoin,td);
    appendChilds(table,tr);
  });
};

const getAvailableGames = function(){
  const url = '/getAvailableGames';
  createRequest('GET',url,displayGames);
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

const getElement = function(selector) {
  return document.querySelector(selector);
};

const onLoad = function(){
  getAvailableGames();
  setClickListener('button[name=back]',goToHome);
};


window.onload = onLoad;
