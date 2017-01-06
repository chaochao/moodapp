var mongoose = require('mongoose');
var User = mongoose.model('User');
var Mood = mongoose.model('Mood');
// api/:userId/moods/
module.exports.createOne = function(req, res){
  if(!req.body.level){
    res.status(400).json({
      message: "please provide mood level"
    })
    return;
  }
  var userId = req.params.userId;
  User
  .findById(userId)
  .then(function(user){

    Mood.create(req.body,function(err,mood){
      if(err){
        res.status(500).json(err);
      }else {
        mood.owner.id = user._id;
        mood.owner.username = user.username;
        mood.save();
        user.moods.push(mood);
        user.save(function(err,userUpdated){
          if(err){
            res.status(500).send(err);
          } else {
            res.status(201)
            .json({
              success: true,
              moodId: userUpdated.moods[userUpdated.moods.length-1]
            });
          }
        });

      }
    });
  })
  .catch(function(err){
    console.log(err);
    res.status(500).json(err);
  });
}
// api/:userId/moods/
module.exports.getAllForOne = function(req, res){
  var userId = req.params.userId;
  User
  .findById(userId)
  .populate('moods')
  .select('moods')
  .exec(function(err, user){
    if(err){
      console.log(err);
      res.status(500).json(err);
    } else {
      res.status(200).json(user.moods);
    }
  });
}
// api/:userId/moods/:moodId
module.exports.getOneForOne = function(req, res){
  var moodId = req.params.moodId;
   Mood
  .findById(moodId)
  .then(function(err,mood){
    if(err){
      console.log(err);
      res.status(500).json(err);
    } else {
      res.status(200).json(mood);
    }
  });
}
