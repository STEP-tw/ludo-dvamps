const assert = require('chai').assert;
const path = require('path');
const PairedCoins = require(path.resolve('src/models/pairedCoins.js'));

let pairedCoins;
describe('#PairedCoins', () => {
  beforeEach(() => {
    pairedCoins = new PairedCoins();
  })
  describe('#addPair', () => {
    it('shouldn\'t add a pair if there are more than 2 coins', () => {
      assert.isNotOk(pairedCoins.addPair([4,5,6],40));
    });
    it('shouldn\'t add a pair if there are less than 2 coins', () => {
      assert.isNotOk(pairedCoins.addPair([4],40));
    });
    it('shouldn\'t add a pair if there are less than 2 coins', () => {
      assert.isNotOk(pairedCoins.addPair([4],40));
    });
    it('should add a pair', () => {
      assert.isOk(pairedCoins.addPair([1, 2], 13));
    });
  });
  describe('#isCoinPaired', () => {
    beforeEach(() => {
      pairedCoins = new PairedCoins();
      pairedCoins.addPair([1, 2], 13);
    })
    it('should return true if given coin pair exist', () => {
      assert.isOk(pairedCoins.isCoinPaired(1));
    });
    it('should return false if given coin pair is not exist', () => {
      assert.isNotOk(pairedCoins.isCoinPaired(7));
    });
  });
  describe('#getPairs', () => {
    beforeEach(() => {
      pairedCoins = new PairedCoins();
      pairedCoins.addPair([1, 2], 13);
    })
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
  describe('#getPairOf', () => {
    beforeEach(() => {
      pairedCoins = new PairedCoins();
      pairedCoins.addPair([1, 2], 13);
    })
    it('should return the pair of coins', () => {
      let expected = {
        position: 13,
        coinIds: [1, 2]
      };
      assert.deepEqual(pairedCoins.getPairOf(2),expected)
    });
  });
  describe('#removePair', () => {
    beforeEach(() => {
      pairedCoins = new PairedCoins();
      pairedCoins.addPair([1, 2], 13);
      pairedCoins.addPair([3, 4], 14);
    })
    it('should remove the pair of given coin if pair is present ', () => {
      let expected = {
        position: 13,
        coinIds: [1, 2]
      };
      assert.deepInclude(pairedCoins.getPairs(),expected);
      pairedCoins.removePair(1);
      assert.notDeepInclude(pairedCoins.getPairs(),expected);
    });
    it('should not remove any pair if there is no pair of given coin ', () => {
      let expected = [
        {position: 13, coinIds: [1, 2]},
        {position: 14, coinIds: [3, 4]},
      ]
      assert.deepEqual(pairedCoins.getPairs(),expected);
      pairedCoins.removePair(5);
      assert.deepEqual(pairedCoins.getPairs(),expected);
    });
  });
});
