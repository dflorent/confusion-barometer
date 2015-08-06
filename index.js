var path = require('path');
var fs = require('fs');
var express = require('express');
var router = express.Router();
var dashboard = express.Router();
var app = express();
var url = require('url');
var nunjucks = require('nunjucks');
var colors = require('colors');
var events = require('events').EventEmitter;
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;

var activate = false;
var students = [];

nunjucks.configure('views', {
  autoescape: true,
  express: app
});

readCredentials(function(username, password) {
  passport.use(new BasicStrategy(function(u, p, done) {
    return done(null, u === username && p === password ? true : false);
  }));
});

app.set('port', process.env.PORT || 3000);
app.use(express.static('public'));
app.use(passport.initialize());
app.use('/', router);
app.use('/dashboard', dashboard);

router.get('/', function(req, res) {
  res.render('index.html', {
    activate: activate,
    connected: students.length
  });
});

dashboard.get('/', passport.authenticate('basic', { session: false }), function(req, res) {
  res.end('<a href="/dashboard/activate">Activer</a>');
});

dashboard.get('/activate', passport.authenticate('basic', { session: false }), function(req, res) {
  server.emit('activate');
  res.redirect('/dashboard');
});

var server = app.listen(app.get('port'), function() {
  console.log('server running http://127.0.0.1:%d', app.get('port'));
});

var io = require('socket.io')(server);

io.on('connection', function(socket) {
  students.push(socket.id);
  io.sockets.emit('add student', students);
  
  socket.on('disconnect', function() {
    students.splice(socket.id, 1);
    io.sockets.emit('remove student', students);
  });

});

server.on('activate', function() {
  activate = true;
  io.sockets.emit('activate');
});

function readCredentials(cb) {
  fs.readFile(path.join(__dirname, 'credentials.json'), function(err, json) {
    if (err) console.log(colors.red('error credentials'));
    var creds = JSON.parse(json || '{}');
    cb(creds.username, creds.password);
  });
}
