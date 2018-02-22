const assert = require('chai').assert;
const path = require('path');
let DestinationCell = require(path.resolve('src/models/destinationCell.js'));

describe('DestinationCell', () => {
  describe('#getNumberOfCoins', () => {
    it('should return number of coins in that cell', () => {
      let destinationCell = new DestinationCell(1);
      let coin = {
        id: 1
      };
      destinationCell.addCoin(coin);
      assert.equal(destinationCell.getNumberOfCoins(),1);
      destinationCell.addCoin(coin);
      assert.equal(destinationCell.getNumberOfCoins(),2);
    });
  });
});
