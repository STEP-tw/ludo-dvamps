const getElement = function(selector) {
  return document.querySelector(selector);
};

const getAllElements = function(selector) {
  return document.querySelectorAll(selector);
};

const setClickListener = function(selector,listener) {
  let element = getElement(selector);
  if(element){
    element.onclick = listener;
  }
};

const removeClickListeners = function(selector){
  let elements = getAllElements(selector);
  if(!elements) {
    return;
  }
  elements.forEach((element)=>{
    element.onclick = "";
  });
};

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

const isEmptyString = function(string) {
  return string.trim() == "";
};

const anyEmptyField = function(fields) {
  return fields.some(isEmptyString);
};

const getFormInput = function(selector) {
  let element = getElement(selector);
  if(element){
    return element.value;
  }
};

const getInput = function(selector) {
  let element = getElement(selector);
  if(element){
    return element.value;
  }
};

const setInnerText = function(selector,text) {
  let element = document.querySelector(selector);
  if(element){
    element.innerText = text;
  }
};
const goToBoard = function() {
  location.href = 'game/board.html';
};
const goToHome = function() {
  location.href = '/index.html';
};

const keyValParse = function(text){
  return text.split(";").reduce((parsedText,keyVal)=>{
    let seperatedKeyVal = keyVal.trim().split('=');
    parsedText[seperatedKeyVal[0]] = seperatedKeyVal[1];
    return parsedText;
  },{});
};

const setGameAndUser = function(playerEle,gameEle) {
  let cookies = keyValParse(decodeURIComponent(document.cookie));
  getElement(playerEle).innerText = cookies.playerName;
  getElement(gameEle).innerText = cookies.gameName;
};
