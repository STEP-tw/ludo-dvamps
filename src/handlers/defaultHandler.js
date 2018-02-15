const handleSlash = function(req,res,next){
  req.url = "index.html";
  debugger;
  next();
};

module.exports= {
  handleSlash,
};
