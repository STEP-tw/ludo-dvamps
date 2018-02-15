const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const defaultHandlers = require("./src/handlers/defaultHandler.js");

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
