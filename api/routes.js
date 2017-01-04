var express = require('express');
var router = express.Router({
  mergeParams: true
});

router
  .route('/')
  .get(function(req, res){
    res.json({message: 'this is mood app'});
  });

  module.exports = router;