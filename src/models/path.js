class Path {
  constructor() {
    this.cells = [];
  }
  add(path){
    this.cells = path;
  }
  getPath() {
    return this.cells;
  }
  addCell(cell) {
    this.cells.push(cell);
  }
  getNextMove(coin,move){
    let currentCell = coin.getPosition();
    let curretPos = this.cells.indexOf(currentCell);
    let nextMovableCell = this.cells[curretPos+move];
    if (!nextMovableCell) {
      return currentCell;
    }
    if(currentCell<0 && move!=6){
      return currentCell;
    }
    return nextMovableCell;
  }
  isMovePossible(coin,move) {
    return coin.getPosition() != this.getNextMove(coin,move);
  }
}

module.exports = Path;
