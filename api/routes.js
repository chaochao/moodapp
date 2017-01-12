var express = require('express');
var middleware = require('./middleware.js');
var router = express.Router({
  mergeParams: true
});

var userController = require('./controllers/users.controller.js');
var moodsController = require('./controllers/moods.controller.js');
router
  .route('/')
  .get(function(req, res) {
    res.json({
      message: 'this is mood app'
    });
  });

router
  .route('/users')
  .get(middleware.foo, userController.getAll);

router
  .route('/login')
  .post(userController.login);

router
  .route('/register')
  .post(userController.createOne);

router
  .route('/users/:userId')
  .get(userController.getOne)
  .put(function(req, res) {
    res.send("put user id");
  })
  .delete(userController.deleteOne);

router
  .route('/users/:userId/moods')
  .post(moodsController.createOne)
  .get(moodsController.getAll)
  .delete(moodsController.deleteAll);

router
  .route('/users/:userId/moods/:moodId')
  .get(moodsController.getOne)
  .put(moodsController.editOne)
  .delete(moodsController.deleteOne)

module.exports = router;