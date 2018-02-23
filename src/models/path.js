class Path {
  constructor(numberOfHomes) {
    this.cells = [];
    this.numberOfHomes = numberOfHomes;
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
  getCell(cellPos){
    return this.cells.find(cell=>cell.position == cellPos);
  }
  isPositionHome(pos){
    return pos < 0;
  }
  isAbleToStart(pos,move){
    return this.isPositionHome(pos) && move==6;
  }
  isNotMovable(currentCell,move,nextMovableCell){
    let notMovableFromHome = this.isPositionHome(currentCell) && move < 6;
    return notMovableFromHome || !nextMovableCell;
  }
  getNextMove(coin,move){
    let currentCell = coin.getPosition();
    let currentPos = this.cells.findIndex(cell=>cell.position == currentCell);
    let nextMovableCell = this.cells[currentPos+move];
    if(this.isAbleToStart(currentCell,move)){
      return this.cells[this.numberOfHomes];
    }
    if (this.isNotMovable(currentCell,move,nextMovableCell)) {
      return this.cells[currentPos];
    }
    return nextMovableCell;
  }
  isMovePossible(coin,move) {
    let cellHoldingCoin = this.getCell(coin.getPosition());
    return cellHoldingCoin.position != this.getNextMove(coin,move).position;
  }
  moveCoin(coin,move){
    let currentCell = this.getCell(coin.position);
    let nextCell = this.getNextMove(coin,move);
    currentCell.removeCoin(coin) && nextCell.addCoin(coin);
    return nextCell.position;
  }
}

module.exports = Path;
