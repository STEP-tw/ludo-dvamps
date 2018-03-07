class PairedCoins {
  constructor() {
    this.pairs = [];
  }
  addPair(coinIds,position){
    let pair = {
      position,
      coinIds
    };
    this.pairs.push(pair);
  }
  isCoinPaired(coinId){
    return this.pairs.some((paired)=>{
      return paired.coinIds.includes(coinId);
    });
  }
  getPairs(){
    return this.pairs;
  }
  getPairOf(coinId){
    return this.pairs.find(pair=>pair.coinIds.includes(coinId));
  }
}

module.exports = PairedCoins;
