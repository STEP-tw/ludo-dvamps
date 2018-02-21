const getElement = function(selector) {
  return document.querySelector(selector);
};

const hideElement = function(selector){
  let element = getElement(selector);
  if(!element){
    return;
  }
  element.classList.add('hide');
};

const showHiddenElement = function(selector){
  let element = getElement(selector);
  if(!element){
    return;
  }
  element.classList.remove('hide');
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

const updateUserName = function() {
  let userName = this.responseText;
  getElement('#userName').innerText = userName;
};

const setUserName = function() {
  sendAjaxRequest('GET','/userName',updateUserName);
};
