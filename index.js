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

// template engine
nunjucks.configure('views', {
  autoescape: true,
  express: app
});

// basic auth
passport.use(new BasicStrategy(function(u, p, done) {
  return done(null, u === process.env.USERNAME && p === process.env.PASSWORD ? true : false);
}));

// config
app.set('port', process.env.PORT || 3000);
app.use(express.static('public'));
app.use(passport.initialize());
app.use('/', router);
app.use('/dashboard', dashboard);

/**
 * Routes
 */

// GET '/'
router.get('/', function(req, res) {
  return res.render('index.html', {
    activate: activate,
  });
});

// GET '/barometer'
router.get('/barometer', function(req, res) {
  if (! activate) return res.redirect('/');
  return res.render('barometer.html');
});

// GET '/dashboard'
dashboard.get('/', passport.authenticate('basic', { session: false }), function(req, res) {
  return res.render('dashboard.html', {
    activate: activate,
    counter: counter,
  });
});

// GET '/dashboard/activate'
dashboard.get('/activate', passport.authenticate('basic', { session: false }), function(req, res) {
  server.emit('activate');
  return res.redirect('/dashboard');
});

// GET '/dashboard/deactivate'
dashboard.get('/deactivate', passport.authenticate('basic', { session: false }), function(req, res) {
  server.emit('deactivate');
  return res.redirect('/dashboard');
});

// GET '/dashboard/exit'
dashboard.get('/exit', passport.authenticate('basic', { session: false }), function(req, res) {
  server.emit('deactivate');
  return res.redirect('/');
});

/**
 * Server
 */
var server = app.listen(app.get('port'), function() {
  console.log('server running http://127.0.0.1:%d', app.get('port'));
});

/**
 * Socket.io
 */

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
});

/**
 * Events
 */

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

