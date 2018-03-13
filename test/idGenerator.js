const getIdGen = function(){
  let index = 0;
  return function(){
    let ids = ['1234','1235','1236','1237'];
    let id = ids[index];
    index = index+1;
    return id;
  }
}

module.exports = getIdGen;
