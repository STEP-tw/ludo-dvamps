const http = require('http');
const app = require('./app.js');
const Dice = require('./src/models/dice.js');
const path = require('path');
const {Client} = require('pg');
const GamesManager = require(path.resolve('src/models/gamesManager.js'));
const SessionManager = require(path.resolve('src/models/sessionManager.js'));
const ColorDistributer = require(path.resolve('src/models/colorDistributer.js'));
const randomiser = require(path.resolve('src/models/randomiser.js'));

const version_name = process.env.APP_VERSION;

const idGenerator = function(){
  return new Date().getTime();
};

const PORT = process.env.PORT || 8000;
const connectionString = 'postgres://localhost:5432/ludo';
const timeStamp = ()=>new Date();

const client = new Client(connectionString);
client.connect();

app.initialize(new GamesManager(
  ColorDistributer,new Dice(randomiser(version_name)),timeStamp),
new SessionManager(idGenerator),client);
const server = http.createServer(app);
server.listen(PORT);
console.log(`server listening at ${PORT}`);
console.log(`=========== Running ${version_name} version ===========`);
