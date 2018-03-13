const http = require('http');
const app = require('./app.js');
const Dice = require('./src/models/dice.js');
const path = require('path');
const {Client} = require('pg');
const GamesManager = require(path.resolve('src/models/gamesManager.js'));
const SessionManager = require(path.resolve('src/models/sessionManager.js'));
const ColorDistributer = require('./src/models/colorDistributer.js');

const PORT = process.env.PORT || 8000;
const connectionString = 'postgres://localhost:5432/debarc';
const timeStamp = ()=>new Date();

const client = new Client(connectionString);
client.connect();

app.initialize(new GamesManager(
  ColorDistributer,new Dice(Math.random),timeStamp),new SessionManager(),client
);

const server = http.createServer(app);
server.listen(PORT);
console.log(`server listening at ${PORT}`);
