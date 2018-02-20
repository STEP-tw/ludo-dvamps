class Path {
  constructor() {
    this.cells = [];
  }
  getPath() {
    return this.cells;
  }
  addCell(cell) {
    this.cells.push(cell);
  }
  getNextMove(coin,move){
    let currentCell = coin.getPosition();
    let nextMovableCell = this.cells[this.cells.indexOf(currentCell)+move];
    if (!nextMovableCell || currentCell<0) {
      return currentCell;
    }
    return nextMovableCell;
  }
  isMovePossible(coin,move) {
    return coin.getPosition() != this.getNextMove(coin,move);
  }
}

module.exports = Path;