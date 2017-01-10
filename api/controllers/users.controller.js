var mongoose = require('mongoose');
var User = mongoose.model('User');
var Mood = mongoose.model('Mood');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');

// api/register
module.exports.createOne = function(req, res) {
    if (!req.body.username || !req.body.password) {
      res.status(400).json({
        message: "please provide username and password"
      })
      return;
    }
    var newUser = req.body;
    newUser.name = req.body.username;
    newUser.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    User.create(newUser).then(function(user) {
      console.log(user);
      res.status(201).json({
        success: true,
        user: user // TODO: change to token
      })
    }).catch(function(err) {
      console.log(err);
      res.status(500).json(err);
    })
  }
  // api/users
module.exports.getAll = function(req, res) {
    var limit = parseInt(req.query.limit) || 100;
    var offset = parseInt(req.query.offset) || 0;
    User
      .find()
      .skip(offset)
      .limit(limit)
      .exec(function(err, users) {
        if (err) {
          console.log(err);
          res.status(500).json(err);
        } else {
          res.status(200).json(users);
        }
      });
  }
  // api/users/:userId
module.exports.getOne = function(req, res) {
    var userId = req.params.userId;
    User
      .findById(userId)
      .then(function(user) {
        if (user) {
          res.status(200).json(user);
        } else {
          res.status(404).json({
            message: "no such user"
          });
        }

      })
      .catch(function(err) {
        console.log(err);
        res.status(500).json(err);
      });
  }
  // api/users/:userId
module.exports.deleteOne = function(req, res) {
  var userId = req.params.userId;
  Mood
    .remove({
      "owner.id": userId
    })
    .then(function(result) {
      User
        .findOneAndRemove(userId)
        .then(function(user) {
          console.log(user);
          res.status(200).json(user);
        })
    })
    .catch(function(err) {
      console.log(err);
      res.status(500).json(err);
    });
}

module.exports.login = function(req, res) {
  if (!req.body.username || !req.body.password) {
    res.status(400).json({
      message: "please provide username and password"
    });
    return;
  }
  User
    .findOne({
      username: req.body.username
    })
    .then(function(user) {
      if (user && bcrypt.compareSync(req.body.password, user.password)) {
        token = jwt.sign({username: user.username}, 'this is secret', {expiresIn: 3600 * 24});
        res.status(200).json({
          success: true,
          token: token
        });
      } else {
        res.status(401).json({
          message: "Unauthorized"
        });
      }
    })
    .catch(function(err) {
      console.log(err);
      res.status(500).json(err);
    })
}