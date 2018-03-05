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
  isDestinationCell(cell){
    let lastCell = this.cells[this.cells.length-1];
    return lastCell.getPosition() == cell.getPosition();
  }
  isAbleToStart(coin,move){
    return this.isPositionHome(coin.getPosition()) && move==6;
  }
  isNotMovable(coin,move,nextMovableCell){
    let notMovableFromHome = this.isPositionHome(coin.getPosition())&&move != 6;
    let canMove = nextMovableCell && nextMovableCell.canPlace(coin);
    return notMovableFromHome || !canMove;
  }
  getNextMove(coin,move,hasKilledOpp){
    let currCoinPos = coin.getPosition();
    let currentCellPos = this.cells.findIndex(cell=>cell.position==currCoinPos);
    let nextMovableCell = this.cells[currentCellPos+move];
    if(this.isAbleToStart(coin,move)){
      return this.cells[this.numberOfHomes];
    }
    if (this.isNotMovable(coin,move,nextMovableCell)) {
      return this.cells[currentCellPos];
    }
    if(this.isDestinationCell(nextMovableCell)&&!hasKilledOpp) {
      return this.cells[currentCellPos];
    }
    return nextMovableCell;
  }
  isMovePossible(coin,move,hasKilledOpp) {
    let cellHoldingCoin = this.getCell(coin.getPosition());
    let currentPos = cellHoldingCoin.getPosition();
    let nextPos = this.getNextMove(coin,move,hasKilledOpp).getPosition();
    return currentPos!=nextPos;
  }
  moveCoin(coin,move,hasKilledOpp){
    let currentCell = this.getCell(coin.position);
    let nextCell = this.getNextMove(coin,move,hasKilledOpp);
    currentCell.removeCoin(coin);
    let status = nextCell.addCoin(coin);
    return status;
  }
  getDestination(){
    return this.cells[this.cells.length-1];
  }
  getCoinsInDest(){
    let destinationCell = this.getDestination();
    return destinationCell.getNumberOfCoins();
  }
  putAtHome(coin){
    let homePosition = coin.homePosition;
    let homeCell = this.cells.find((cell)=> cell.getPosition()==homePosition);
    homeCell.addCoin(coin);
  }
}

module.exports = Path;
