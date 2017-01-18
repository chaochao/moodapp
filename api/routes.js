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
  .get(userController.getAll);

router
  .route('/login')
  .post(userController.login);

router
  .route('/register')
  .post(userController.createOne);

router
  .route('/users/:userId')
  .get(middleware.isOwner, userController.getOne)
  .put(middleware.isOwner, userController.editOne)
  .delete(middleware.isOwner, userController.deleteOne);

router
  .route('/users/:userId/moods')
  .post(middleware.isOwner, moodsController.createOne)
  .get(middleware.isOwner, moodsController.getAll)
  .delete(middleware.isOwner, moodsController.deleteAll);

router
  .route('/users/:userId/moods/:moodId')
  .get(middleware.isOwner, moodsController.getOne)
  .put(middleware.isOwner, moodsController.editOne)
  .delete(middleware.isOwner, moodsController.deleteOne)

module.exports = router;