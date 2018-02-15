const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const rfs = require('rotating-file-stream');
const defaultHandlers = require(path.resolve('src/handlers/defaultHandler.js'));
const getHandlers = require(path.resolve('src/handlers/getHandlers.js'));
const GamesManager = require(path.resolve('src/models/gamesManager.js'));
const app = express();


const gamesManager = new GamesManager();

let logDir = path.resolve('logs/');

let accessLogStream = rfs('access.log', {
  interval: '1d',
  path: logDir
});

const serveAvailGames = getHandlers.serveAvailableGames.bind(0,gamesManager);

app.use(logger('combined', {stream: accessLogStream}));
app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.get('/',defaultHandlers.handleSlash);
app.get('/getAvailableGames',serveAvailGames);

app.use(express.static('public'));

module.exports = app;
