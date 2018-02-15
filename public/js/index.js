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

const getInput = function(selector) {
  let element = getElement(selector);
  if(element){
    return element.value;
  }
};

const showCreateForm = function() {
  let allElements = getAllElements('.hidden');
  allElements.forEach(element=>element.classList.remove('hidden'));
  let createButton = getElement('button[name="createFormOption"]').remove();
};

const handleServerResponse = function(serverResponse) {
  if(serverResponse.gameCreated){
    window.location.href = '/waiting.html';
    return;
  }
  console.log(serverResponse);
};

const createGame = function() {
  let gameName = getInput('input[name="gameName"]');
  let playerName = getInput('input[name="playerName"]');
  if(anyEmptyField([gameName,playerName])){
    return;
  }
  let requestBody = `gameName=${gameName}&playerName=${playerName}`;
  return sendAjaxRequest('POST','/createGame',function(){
    handleServerResponse(JSON.parse(this.responseText));
  },requestBody);
};

const goToJoin = function(){
  window.location = "/joining.html";
};

const setClickListeners = function() {
  setClickListener('button[name="createFormOption"]',showCreateForm);
  setClickListener('button[name="createGame"]',createGame);
  setClickListener('button[name="joinGame"]',goToJoin);
};
window.onload = setClickListeners;
