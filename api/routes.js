var express = require('express');
var router = express.Router({
  mergeParams: true
});

router
  .route('/')
  .get(function(req, res){
    res.json({message: 'this is mood app'});
  });

router
  .route('/users')
  .get(function(req, res){
    res.json({message: 'this is mood users get'});
  });

router
  .route('/login')
  .post(function(req, res){
    res.json({message: 'this is mood login'});
  });

router
  .route('/register')
  .post(function(req, res){
    res.json({message: 'this is mood register'});
  });

router
  .route('/users/:userId')
  .get(function(req, res){
    res.json({message: 'this is get one user'});
  })
  .put(function(req, res){
    res.send("put user id");
  })
  .delete(function(req, res){
    res. soned("delete user");
  });

router
  .route('/users/:userId/moods')
  .post(function(req, res){
    res.json({message: 'this is post modds'});
  })
  .get(function(req, res){
    res.json({message: 'this is get modds'});
  })
  .delete(function(req, res){
    res.json({message: 'this is delete modds'});
  })
  ;

  router
    .route('/users/:userId/moods/:moodId')
    .get(function(req, res){
      res.send("this is get one mood")
    })
    .put(function(req, res){
      res.send("this is put one mood")
    })
    .delete(function(req, res){
      res.send("this is delete one mood")
    })


  module.exports = router;