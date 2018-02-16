

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
  setInnerText('.message',serverResponse.message);
};

const createGame = function() {
  let gameName = getFormInput('input[name="gameName"]');
  let playerName = getFormInput('input[name="playerName"]');
  if(anyEmptyField([gameName,playerName])){
    setInnerText('.message','Fields should not be empty');
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
