const http = require('http');
const app = require('./app.js');
const path = require('path');
const GamesManager = require(path.resolve('src/models/gamesManager.js'));
const PORT = 8000;
app.initialize(new GamesManager());
const server = http.createServer(app);
server.listen(PORT);
console.log(`server listening at ${PORT}`);
