const SafeCell = require('./safeCell.js');
const UnsafeCell = require('./unsafeCell.js');

class Board {
  constructor() {
    this.homesCellsPerPlayer = 4;
    this.cellsPerPlayer = 13;
    this.finalPathStart = 111;
  }
  generateCommonRoute(numberOfPlayers){
    let numOfCells = numberOfPlayers * this.cellsPerPlayer;
    return Array(numOfCells).fill(0).map((cell,index)=>{
      if(index % this.cellsPerPlayer == 0 || index % this.cellsPerPlayer == 8){
        return new SafeCell(index);
      }
      return new UnsafeCell(index);
    });
  } 
  generateHomeCells(numberOfPlayers){
    let numOfHomeCells = numberOfPlayers*this.homesCellsPerPlayer;
    return Array(numOfHomeCells).fill(0).map((cell,index)=>{
      return new SafeCell((index+1)*(-1));
    });
  }

  generateFinalPaths(numOfPlayers){
    return Array(numOfPlayers).fill(0).reduce((allFinalPaths,ele,playerNum)=>{
      allFinalPaths[playerNum] = Array(5).fill(0).map((ele,cellNum)=>{
        let pos = (playerNum*this.cellsPerPlayer)+this.finalPathStart+cellNum;
        return new SafeCell(pos);
      });
      return allFinalPaths;
    },{});
  }
  generate(numberOfPlayers){
    this.commonRoute = this.generateCommonRoute(numberOfPlayers);
    this.homeCells = this.generateHomeCells(numberOfPlayers);
    this.finalPaths = this.generateFinalPaths(numberOfPlayers);
  }
}

module.exports = Board;
