var express = require('express');
var router = express.Router();
var dashboard = express.Router();
var app = express();
var nunjucks = require('nunjucks');
var colors = require('colors');
var events = require('events').EventEmitter;
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;

var activate = false;
var counter = 0;

nunjucks.configure('views', {
  autoescape: true,
  express: app
});

passport.use(new BasicStrategy(function(u, p, done) {
  return done(null, u === process.env.USERNAME && p === process.env.PASSWORD ? true : false);
}));

app.set('port', process.env.PORT || 3000);
app.use(express.static('public'));
app.use(passport.initialize());
app.use('/', router);
app.use('/dashboard', dashboard);

router.get('/', function(req, res) {
  res.render('index.html', {
    activate: activate,
  });
});

router.get('/barometer', function(req, res) {
  if (! activate) return res.redirect('/');
  res.render('barometer.html');
});

dashboard.get('/', passport.authenticate('basic', { session: false }), function(req, res) {
  res.render('dashboard.html', {
    activate: activate,
    counter: counter,
  });
});

dashboard.get('/activate', passport.authenticate('basic', { session: false }), function(req, res) {
  server.emit('activate');
  res.redirect('/dashboard');
});

dashboard.get('/deactivate', passport.authenticate('basic', { session: false }), function(req, res) {
  server.emit('deactivate');
  res.redirect('/dashboard');
});

dashboard.get('/exit', passport.authenticate('basic', { session: false }), function(req, res) {
  server.emit('deactivate');
  res.redirect('/');
});

var server = app.listen(app.get('port'), function() {
  console.log('server running http://127.0.0.1:%d', app.get('port'));
});

var io = require('socket.io')(server);

io.on('connection', function(socket) {
  socket.on('okay', function() {
    if (counter > 0) counter--;
    io.sockets.emit('update counter', counter);
  });

  socket.on('notokay', function() {
    counter++;
    io.sockets.emit('update counter', counter);
  });

  socket.on('disconnect', function() {});
});

server.on('activate', function() {
  if (! activate) {
    activate = true;
    io.sockets.emit('activate');
  }
});

server.on('deactivate', function() {
  if (activate) {
    activate = false;
    counter = 0;
    io.sockets.emit('deactivate');
  }
});

