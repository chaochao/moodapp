module.exports = {
  foo: function(req, res, next){
    console.log("bar");
    next();
  }
}