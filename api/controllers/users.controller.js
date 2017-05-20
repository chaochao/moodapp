var mongoose = require('mongoose');
var User = mongoose.model('User');
var Mood = mongoose.model('Mood');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');

// api/register
module.exports.createOne = function(req, res) {
    if (!req.body.username || !req.body.password) {
      res.status(400).json({
        message: 'please provide username and password'
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
      .populate('moods')
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
      .populate('moods')
      .then(function(user) {
        if (user) {
          res.status(200).json(user);
        } else {
          res.status(404).json({
            message: 'no such user'
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
  //TODO: remove from others follower list.
  var userId = req.params.userId;
  Mood
    .remove({
      'owner.id': userId
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
// api/users/:userId
module.exports.editOne = function(req, res){
  var userId = req.params.userId;
  //some validation
  if(req.body.gender && req.body.gender !== 'male' && req.body.gender !== 'female') {
    res.status(400).json({message:'gender should be male or female'})
    return;
  }
  if(req.body.description && req.body.description.length >100){
    res.status(400).json({message:'too long'})
    return;
  }
  User
  .findByIdAndUpdate(userId, req.body, {new: true}, function(err,user){
    if(err){
      console.log(err);
      res.status(500).json(err);
    } else {
      res.status(200).json(user);
    }
  });

}

module.exports.login = function(req, res) {
  if (!req.body.username || !req.body.password) {
    res.status(400).json({
      message: 'please provide username and password'
    });
    return;
  }
  User
    .findOne({
      username: req.body.username
    })
    .then(function(user) {
      if (user && bcrypt.compareSync(req.body.password, user.password)) {
        token = jwt.sign({username: user.username, id: user._id}, 'this is secret', {expiresIn: 3600 * 24});
        res.status(200).json({
          success: true,
          token: token
        });
      } else {
        res.status(401).json({
          message: 'Unauthorized'
        });
      }
    })
    .catch(function(err) {
      console.log(err);
      res.status(500).json(err);
    })
}
//api/users/:userId/followers
module.exports.getAllFollowers = function(req,res){
  var userId = req.params.userId;
  User
  .findById(userId)
  .populate('followers')
  .select('followers')
  .then(function(user){
  res.status(200).json(user.followers);
  })
  .catch(function(err){
  console.log(err);
  res.status(500).json(err);
  });
}

module.exports.removeAllFollowers = function(req, res) {
  // ONLY use internally! develop use only.
  var userId = req.params.userId;
  User
  .findByIdAndUpdate(userId, {followers: []}, {new: true}, function(err, user){
    if(err){
      console.log(err);
      res.status(500).json(err);
    } else {
      res.status(200).json(user);
    }
  });
}


//api/users/:userId/follows
module.exports.getAllFollows = function(req, res) {
  var userId = req.params.userId;
  User
  .findById(userId)
  .populate('follows')
  .select('follows')
  .then(function(user){
    if(user){
      res.status(200).json(user.follows);
    } else {
      res.status(404).json({success: false, message: "no such user."});
    }
  })
  .catch(function(err){
    console.log(err);
    res.status(500).json(err);
  });
}

module.exports.follows = function(req, res) {
  var userId = req.params.userId;
  var followsId = req.body.follows;
  if(userId === followsId) {
    res.status(400).json({success: false, message: "can not follow oneself."});
    return;
  }
  User
  .findById(userId)
  .then(function(user){
    if(user.follows.indexOf(followsId) === -1){
      user.follows.push(followsId);
      user.save(function(follower){
        User
        .findById(followsId)
        .then(function(followee){
          if(followee.followers.indexOf(userId) === -1){
            followee.followers.push(userId);
            followee.save(function(followee){
              res.status(201).json({
                success:true,
                followerId: userId,
                followsId:followsId,
                message:"save for both follower and followee"});
            });
          } else {
            res.status(400).json({success: false, message: "already in followers list."});
            return;
          }
        });
      });
    } else {
      res.status(400).json({success: false, message: "already in follows list."});
      return;
    }
  })
  .catch(function(err){
    console.log(err);
    res.status(500).json(err);
  });
}

// api/users/:userId/follows/:followsId
module.exports.unfollows = function(req, res) {
  var userId = req.params.userId;
  var unfollowsId = req.params.followsId;
  User
  .findById(userId)
  .then(function(user){
    var unfollowsIndex = user.follows.indexOf(unfollowsId);
    if(unfollowsIndex !== -1) {
      user.follows.splice(unfollowsIndex,1);
      user.save(function(follower){
        User
        .findById(unfollowsId)
        .then(function(followee){
          var followerIndex = followee.followers.indexOf(userId);
          if( followerIndex !== -1){
            followee.followers.splice(followerIndex, 1);
            followee.save(function(followee){
              res.status(200).json({
                success:true,
                followerId: userId,
                followsId: unfollowsId,
                message:"remove for both follower and followee"
              });
            });
          } else {
            res.status(400).json({success: false, message: "follower not in followers list."});
            return;
          }
        });
      });
    } else {
      res.status(400).json({success: false, message: "followee not in follows list."});
      return;
    }
  })
  .catch(function(err){
    console.log(err);
    res.status(500).json(err);
  });
}
module.exports.unfollowsAll = function(req, res) {
  // development use only
  var userId = req.params.userId;
  User
  .findByIdAndUpdate(userId, {follows: []}, {new: true}, function(err, user){
     if(err){
      console.log(err);
      res.status(500).json(err);
    } else {
      res.status(200).json(user);
    }
  });
}
