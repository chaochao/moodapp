var mongoose = require('mongoose');
var User = mongoose.model('User');
var Mood = mongoose.model('Mood');
var moment = require('moment');
var GTE =''
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
module.exports.getAll = function(req, res){
  var userId = req.params.userId;
  var start = req.query.start || '2017-01-01';
  var future = moment().add(2, 'days').format('YYYY-MM-DD');
  var end = req.query.end || future;
  Mood
  .where('owner.id', userId)
  .where('created_at').lte(end)
  .where('created_at').gte(start)
  .then(function(moods){
    res.status(200).json(moods);
  })
  .catch(function(err){
    console.log(err);
    res.status(500).json(err);
  });
  
}
// api/:userId/moods/:moodId
module.exports.getOne = function(req, res){
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
// api/:userId/moods/:moodId
module.exports.deleteOne = function(req, res){
  var moodId = req.params.moodId;
  var userId = req.params.userId;
  
  User.update({moods:{$in:[moodId]}}, {$pull: {'moods': moodId}}, {multi: true})
  .exec(function(result){
    Mood
    .findOneAndRemove({_id:moodId})
    .then(function(mood){
      res.status(200).json(mood); // HTTP CODE maybe 204
    })
  })
  .catch(function(err){
    console.log(err);
    res.status(500).json(err);
  });
}
// api/:userId/moods/:moodId
module.exports.editOne = function(req, res){
  var moodId = req.params.moodId;

  if(!req.body.level || parseInt(req.body.level) > 10
    || parseInt(req.body.level) < 0 ){
    res.status(400).json({message:"please provide correct mood level (0~10)"});
  } else {
    Mood
    .findByIdAndUpdate(moodId, req.body, {new: true}, function(err, mood){
      if(err){
        console.log(err);
        res.status(500).json(err);
      } else {
        res.status(200).json(mood);
      }
    });
  }
}


