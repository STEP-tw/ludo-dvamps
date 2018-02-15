const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const rfs = require('rotating-file-stream');
const GamesManager = require(path.resolve('src/models/gamesManager.js'));
const postHandlers = require(path.resolve('src/handlers/postHandlers.js'));
const defaultHandlers = require(path.resolve('src/handlers/defaultHandler.js'));
const app = express();
let logDir = path.resolve('logs/');

let lognameGenerator = function(time, index) {
  if(!time){
    return "file.log";
  }
  let month = (time.getMonth() + 1) + "-" + time.getFullYear();
  let day = time.getDate();
  return day + '-' + month + '-file.log';
}

let accessLogStream = rfs(lognameGenerator, {
  interval: '1d',
  path: logDir
});

app.gamesManager = new GamesManager();
app.use(logger('combined', {stream: accessLogStream}));
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(express.static('public'));
app.post('/createGame',postHandlers.createNewGame);
app.get('/',defaultHandlers.handleSlash);
app.use(cookieParser());
module.exports = app;
