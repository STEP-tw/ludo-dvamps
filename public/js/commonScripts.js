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
