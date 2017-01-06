var mongoose = require('mongoose');
var User = mongoose.model('User');
var Mood = mongoose.model('Mood');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');

// api/register
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

// api/users
module.exports.getAll = function(req, res){
  var limit = parseInt(req.query.limit) || 100;
  var offset = parseInt(req.query.offset) || 0;
  User
  .find()
  .skip(offset)
  .limit(limit)
  .exec(function(err,users){
    if(err){
      console.log(err);
      res.status(500).json(err);
    } else {
      res.status(200).json(users);
    }
  });
}
// api/users/:userId
module.exports.getOne = function(req, res){
  var userId = req.params.userId;
  User
  .findById(userId)
  .then(function(user){
    res.status(200).json(user);
  })
  .catch(function(err){
    console.log(err);
    res.status(500).json(err);
  });
}

module.exports.delete = function(req, res){
  var userId = req.params.userId;
  Mood
  .remove({"owner.id": userId})
  .then(function(result){
    User
    .findOneAndRemove(userId)
    .then(function(user){
      console.log(user);
      res.status(200).json(user);
    })
  })
  .catch(function(err){
    console.log(err);
    res.status(500).json(err);
  });
}
