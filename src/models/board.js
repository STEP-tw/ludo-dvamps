const path = require('path');
const Cell = require(path.resolve('src/models/cell.js'));
const UnsafeCell = require(path.resolve('src/models/unsafeCell.js'));
const DestinationCell = require(path.resolve('src/models/destinationCell.js'));

class Board {
  constructor(numOfPlayers) {
    this.numOfPlayers = numOfPlayers;
    this.homesCellsPerPlayer = 4;
    this.cellsPerPlayer = 13;
    this.finalPathStart = 111;
  }
  generateCommonRoute() {
    let numOfCells = this.numOfPlayers * this.cellsPerPlayer;
    return Array(numOfCells).fill(0).map((cell, index) => {
      if (index % this.cellsPerPlayer == 0 || index%this.cellsPerPlayer == 8) {
        return new Cell(index);
      }
      return new UnsafeCell(index);
    });
  } 
  generateHomeCells() {
    let numOfHomeCells = this.numOfPlayers * this.homesCellsPerPlayer;
    return Array(numOfHomeCells).fill(0).map((cell, index) => {
      return new Cell((index + 1) * (-1));
    });
  }
  generateFinalPaths() {
    return Array(this.numOfPlayers).fill(0).reduce((allPaths,ele,playerNum) =>{
      let playerSquenceLoc = (playerNum + 1) % this.numOfPlayers;
      allPaths[playerSquenceLoc] = Array(5).fill(0).map((ele,cellNum) =>{
        let pos = (playerNum*this.cellsPerPlayer) +this.finalPathStart+cellNum;
        return new Cell(pos);
      });
      return allPaths;
    }, {});
  }
  generateDestinations() {
    let firstDestinationPos = this.finalPathStart + 5;
    let destinationCells = {};
    for (let counter = 0; counter < this.numOfPlayers; counter++) {
      let playerSquenceLoc = (counter + 1) % this.numOfPlayers;
      let cell = new DestinationCell(firstDestinationPos + (counter * 13));
      destinationCells[playerSquenceLoc] = cell;
    }
    return destinationCells;
  }
  generate() {
    this.commonRoute = this.generateCommonRoute();
    this.homeCells = this.generateHomeCells();
    this.finalPaths = this.generateFinalPaths();
    this.destinations = this.generateDestinations();
  }
  getCommonPathFor(playerPos) {
    let commonPath = [];
    let numOfCells = this.numOfPlayers * this.cellsPerPlayer - 1;
    for (let counter = 0; counter < numOfCells; counter++) {
      let cellPos = ((playerPos*13)+counter)% this.commonRoute.length;
      let element = this.commonRoute[cellPos];
      commonPath.push(element);
    }
    return commonPath;
  }
  getPathFor(player) {
    let path = [];
    let homeCells = this.homeCells.slice(player*4, (player*4) + 4);
    let commonPath = this.getCommonPathFor(player);
    let finalPath = this.finalPaths[player];
    let destination = this.destinations[player];
    return path.concat(homeCells,commonPath,finalPath,destination);
  }
}

module.exports = Board;
