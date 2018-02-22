const assert = require('chai').assert;
const path = require('path');
let DestinationCell = require(path.resolve('src/models/destinationCell.js'));
describe('DestinationCell', () => {
  describe('#getNumberOfCoins', () => {
    it('should return ', () => {
      let destinationCell = new DestinationCell();
      let coin = {
        id: 1
      };
      destinationCell.addCoin(coin);
      assert.equal(destinationCell.getNumberOfCoins(),1);
    });
  });
});
