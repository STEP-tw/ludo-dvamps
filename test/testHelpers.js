const initCoin = function(id,homePos,color){
  let coin = new Coin(id,homePos);
  coin.setColor(color);
  return coin;
};

module.exports = {
  initCoin
};