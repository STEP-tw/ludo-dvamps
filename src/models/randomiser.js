module.exports = function(version_name){
  let selectables = [ 1, 1, 5, 5, 5];
  if (version_name != 'dev') {
    return Math.random;
  }
  return ()=>{
    let condition = Math.floor(Math.random() * selectables.length);
    return selectables[condition] / 6;
  };
};
