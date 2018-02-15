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

const displayGames = function(games){
  console.log(games);
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
