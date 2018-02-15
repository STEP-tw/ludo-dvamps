const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const rfs = require('rotating-file-stream');
const defaultHandlers = require(path.resolve('src/handlers/defaultHandler.js'));
const app = express();

let logDir = path.resolve('logs/');

let accessLogStream = rfs('access.log', {
  interval: '1d',
  path: logDir
});

app.use(logger('combined', {stream: accessLogStream}));
app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.get('/',defaultHandlers.handleSlash);

app.use(express.static('public'));

module.exports = app;
