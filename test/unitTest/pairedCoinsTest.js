const assert = require('chai').assert;
const path = require('path');
const PairedCoins = require(path.resolve('src/models/pairedCoins.js'));

let pairedCoins;
describe('#PairedCoins', () => {
  beforeEach(() => {
    pairedCoins = new PairedCoins();
    pairedCoins.addPair([1, 2], 13);
  })
  describe('#addPair', () => {
    it('should add a pair', () => {
      let expected = {
        position: 13,
        coinIds: [1, 2]
      };
      assert.deepEqual(pairedCoins.getPairOf(1), expected);
    });
  });
  describe('#isCoinPaired', () => {
    it('should return true if given coin pair exist', () => {
      assert.isOk(pairedCoins.isCoinPaired(1));
    });
    it('should return false if given coin pair is not exist', () => {
      assert.isNotOk(pairedCoins.isCoinPaired(7));
    });
  });
  describe('#getPair', () => {
    it('should return all pairs', () => {
      pairedCoins.addPair([3, 4], 10);
      let expected = [{
          position: 13,
          coinIds: [1, 2]
        },
        {
          position: 10,
          coinIds: [3, 4]
        }
      ];
      assert.deepEqual(pairedCoins.getPairs(), expected);
    });
  });
});
