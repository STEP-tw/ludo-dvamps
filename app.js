const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');

app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(express.static('public'));
app.use(cookieParser());
module.exports = app;
