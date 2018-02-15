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
  alert("1223");
};

const getAvailableGames = function(){
  const url = '/getAvailableGames';
  createRequest('GET',url,displayGames);
};


window.onload = getAvailableGames;
