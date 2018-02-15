const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const path = require('path');
const rfs = require('rotating-file-stream');
const GamesManager = require(path.resolve('src/models/gamesManager.js'));
const postHandlers = require(path.resolve('src/handlers/postHandlers.js'));
let logDir = path.resolve('logs/');

let accessLogStream = rfs('access.log', {
  interval: '1d',
  path: logDir
});


app.gamesManager = new GamesManager();
app.use(logger('combined', {stream: accessLogStream}));
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(express.static('public'));
app.post('/createGame',postHandlers.createNewGame);

module.exports = app;
