const showCreateForm = function() {
  let allElements = getAllElements('.hidden');
  allElements.forEach(element=>element.classList.remove('hidden'));
  let createButton = getElement('input[name="createFormOption"]').remove();
};

const handleServerResponse = function(serverResponse) {
  if(serverResponse.status){
    window.location.href = '/waiting.html';
    return;
  }
  setInnerText('.message',`* ${serverResponse.message}`);
};

const createGame = function() {
  let gameName = getFormInput('input[name="gameName"]');
  let playerName = getFormInput('input[name="playerName"]');
  let noOfPlayers = getElement('select.dropbtn').value;
  if(anyEmptyField([gameName,playerName])){
    setInnerText('.message','* Fields should not be empty');
    return;
  }
  gameName = encodeURIComponent(gameName);
  playerName = encodeURIComponent(playerName);
  /*eslint-disable*/
  let requestBody = `gameName=${gameName}&playerName=${playerName}&noOfPlayers=${noOfPlayers}`;
  /*eslint-enable*/
  return sendAjaxRequest('POST','/createGame',function(){
    handleServerResponse(JSON.parse(this.responseText));
  },requestBody);
};

const goToJoin = function(){
  window.location = "/joining.html";
};


const setClickListeners = function() {
  setClickListener('input[name="createFormOption"]',showCreateForm);
  setClickListener('input[name="createGame"]',createGame);
  setClickListener('input[name="joinGame"]',goToJoin);
};
window.onload = setClickListeners;
