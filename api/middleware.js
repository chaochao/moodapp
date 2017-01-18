var jwt = require('jsonwebtoken');

module.exports = {
  isOwner: function(req, res, next){
    var token = req.headers.authorization;
    if(token){
      // need to have a better secret
      jwt.verify(token, 'this is secret', function(err, decodedUser){
        if(err){
          res.status(401).json({success: false, message:' Unauthorized'});
        } else {
          if (req.params.userId === decodedUser.id){
            req.loggedInUser = decodedUser;
            next();
          } else {
            res.status(401).json({success: false, message:' not the owner'});
          }
        }
      });
    } else {
      res.status(403).json({success: false, message:' no token'})
    }
  }
}