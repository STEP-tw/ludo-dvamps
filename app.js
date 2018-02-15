const express = require('express');
const path = require('path');
const app = express();
const cookieParser = require('cookie-parser');
const defaultHandlers = require(path.resolve('src/handlers/defaultHandler.js'));

const logger = function(req,res,next){
  console.log(req.method,req.url);
  next();
};

app.use(logger);
app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.get('/',defaultHandlers.handleSlash);

app.use(express.static('public'));

module.exports = app;
