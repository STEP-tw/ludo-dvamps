const getElement = function(selector) {
  return document.querySelector(selector);
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

const getInput = function(selector) {
  let element = getElement(selector);
  if(element){
    return element.value;
  }
};

const showCreateForm = function() {
  let form = getElement('.hidden');
  form.classList.remove('hidden');
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
