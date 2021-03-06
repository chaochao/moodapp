require('./api/database/db.js');
var express = require("express");
var app = express();
var path = require('path');
var routes = require('./api/routes.js');
var bodyParser = require('body-parser');
app.set('port',process.env.PORT || 3000);

app.use(bodyParser.urlencoded({extended: false}));

app.use(function(req, res, next) {
  console.log(req.method, req.url);
  next();
})

app.use(express.static(path.join(__dirname, 'public')));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));
app.use('/api', routes);

app.listen(app.get('port'), process.env.IP, function(){
  console.log('app on port', app.get('port'));
})