const createElement = function(element, innerText, className) {
  let ele = document.createElement(element);
  ele.innerText = innerText || '';
  ele.className = className;
  return ele;
};

const appendChilds = function(node, ...childs) {
  childs.forEach((child) => {
    node.appendChild(child);
  });
};

const createTrWithData = function(tag, ...args) {
  let tr = createElement('tr');
  args.forEach((arg) => appendChilds(tr, createElement(tag, arg)));
  return tr;
};

const showGameData = function(table, game) {
  let tr = createTrWithData('td', game.name, game.createdBy, game.capacity,
    game.remain);
  let button = createElement('button', 'Join', 'join');
  let buttonData = createElement('td');
  appendChilds(buttonData, button);
  appendChilds(tr, buttonData);

  appendChilds(table, tr);
};

const getGameName = function(event) {
  let clickedButton = event.target;
  let gameInfo = clickedButton.parentElement.parentElement;
  let gameName = gameInfo.firstChild.innerText;
  return gameName;
};

const showErrorMessage = function(message) {
  let messageBox = getElement('span[id=errorMessage]');
  messageBox.innerText = message;
  messageBox.className = 'show';
};

const actionOnJoin = function() {
  if(!this.responseText){
    return;
  }
  let joiningStatus = JSON.parse(this.responseText);
  if (joiningStatus.status) {
    window.location = '/waiting.html';
    return;
  }
  showErrorMessage('* Name already Exists');
};

const joinGame = function(event) {
  let gameName = encodeURIComponent(getGameName(event));
  let playerName = getElement('input[name=playerName]').value;
  playerName = encodeURIComponent(playerName);
  if (!playerName) {
    showErrorMessage('* Player Name required');
    return;
  }
  let query = `gameName=${gameName}&playerName=${playerName}`;
  sendAjaxRequest('POST', '/joinGame', actionOnJoin, query);
};

const displayGamesToJoin = function() {
  if(!this.responseText){
    return;
  }
  let games = JSON.parse(this.responseText);
  let shownGames = document.querySelector('table');
  let updatedGames = createElement('table');
  let heading = createTrWithData('th', 'Game Name', 'Created By',
    'Max players', 'Player yet to join', 'Join Game');
  updatedGames.appendChild(heading);
  games.forEach(showGameData.bind(0, updatedGames));
  shownGames.replaceWith(updatedGames);
  let joiningButtons = document.querySelectorAll('button[class=join]');
  joiningButtons.forEach(button => {
    button.onclick = joinGame;
  });
};

const getAvailableGames = function() {
  const url = '/getAvailableGames';
  sendAjaxRequest('GET', url, displayGamesToJoin);
};

const updateAvailableGames = function() {
  setInterval(getAvailableGames, 2000);
};

const onLoad = function() {
  getAvailableGames();
  setClickListener('button[name=back]', goToHome);
  updateAvailableGames();
};

window.onload = onLoad;
