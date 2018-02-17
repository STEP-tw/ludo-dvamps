const createRequest = function(method, url, action, data) {
  let req = new XMLHttpRequest();
  req.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      let response = JSON.parse(this.responseText);
      action(response);
    }
  };
  req.open(method, url);
  req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  req.send(data || '');
};

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

const getElement = function(selector) {
  return document.querySelector(selector);
};

const createTrWithData = function(tag, ...args) {
  let tr = createElement('tr');
  args.forEach((arg) => appendChilds(tr, createElement(tag, arg)));
  return tr;
};

const showGameData = function(table, game) {
  let tr = createTrWithData('td', game.name, game.createdBy, game.remain);
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

const actionOnJoin = function(joiningStatus) {
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
  createRequest('POST', '/joinGame', actionOnJoin, query);
};

const displayGamesToJoin = function(games) {
  let shownGames = document.querySelector('table');
  let updatedGames = createElement('table');
  let heading = createTrWithData('th', 'Game Name', 'Created By',
    'Player yet to join', 'Join Game');
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
  createRequest('GET', url, displayGamesToJoin);
};

const goToHome = function() {
  window.location = "/index.html";
};

const setClickListener = function(selector, listener) {
  let element = getElement(selector);
  if (element) {
    element.onclick = listener;
  }
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
