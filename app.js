const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const path = require('path');
const rfs = require('rotating-file-stream');

let logDir = path.resolve('logs/');

let accessLogStream = rfs('access.log', {
  interval: '1d',
  path: logDir
});

app.use(morgan('combined', {stream: accessLogStream}));
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(express.static('public'));

module.exports = app;
