const handleSlash = function(req,res,next){
  req.url = "index.html";
  next();
};

module.exports= {
  handleSlash,
};
