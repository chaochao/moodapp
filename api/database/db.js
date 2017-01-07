var mongoose = require('mongoose');
var dburl = 'mongodb://localhost:27017/moodapp'
var env = process.env.NODE_ENV || 'development'
dburl = env === 'development' ? dburl : process.env.databaseUrl;

mongoose.connect(dburl);
mongoose.Promise = global.Promise;

mongoose.connection.on('connected', function() {
  console.log("Mongodb connected: " + dburl);
});

mongoose.connection.on('disconnected', function() {
  console.log("Mongodb disconnected: " + dburl);
});

mongoose.connection.on('error', function(err) {
  console.log("Mongodb error: " + err);
});

process.on('SIGINT', function() {
  mongoose.connection.close(function() {
    console.log("Mongodb connection shot down. App termination (SIGINT)");
    process.exit(0);
  });
});

process.on('SIGTERM', function() {
  mongoose.connection.close(function() {
    console.log("Mongodb connection shot down. App termination (SIGTERM)");
    process.exit(0);
  });
});

process.once('SIGUSR2', function() {
  mongoose.connection.close(function() {
    console.log("Mongodb connection shot down. App termination (SIGUSR2)");
    process.exit(0);
  });
});

// import models
require('./user.model.js');
require('./mood.model.js');