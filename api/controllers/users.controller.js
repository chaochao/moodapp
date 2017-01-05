var mongoose = require('mongoose');
var User = mongoose.model('User');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');

module.exports.createOne = function(req, res) {
  if(!req.body.username || !req.body.password){
    res.status(400).json({
      message: "please provide username and password"
    })
    return;
  }
  var newUser = req.body;
  newUser.name = req.body.username;
  newUser.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
  User.create(newUser).then(function(user){
    console.log(user);
    res.status(201).json({
      success: true,
      user: user // TODO: change to token
    })
  }).catch(function(err){
    console.log(err);
    res.status(500).json(err);
  })
}

