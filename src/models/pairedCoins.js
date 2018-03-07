class PairedCoins {
  constructor() {
    this.pairs = [];
  }
  addPair(coinIds,position){
    if(coinIds.some((coin)=>this.isCoinPaired(coin)) || coinIds.length!=2){
      return false;
    }
    let pair = {
      position,
      coinIds
    };
    this.pairs.push(pair);
    return true;
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
