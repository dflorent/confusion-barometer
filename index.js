var express = require('express');
var app = express();
var url = require('url');
var nunjucks = require('nunjucks');
var redis = require('redis').createClient();
var colors = require('colors');
var events = require('events').EventEmitter;

if (app.get('env') === 'production') {
    var redisURL = url.parse(process.env.REDIS_URL);
    var redis = require('redis').createClient(redisURL.port, redisURL.hostname);
    redis.auth(redisURL.auth.split(":")[1]);
}

// var USERS_KEY = 'confusion-barometer:users';

app.set('port', process.env.PORT || 3000);

nunjucks.configure('views', {
  autoescape: true,
  express: app
});

app.get('/', function(req, res) {
  res.render('index.html');
});

app.get('/admin', function(req, res) {
  res.end('<a href="/admin/init-barometer">Init barometer</a>');
});

app.get('/admin/init-barometer', function(req, res) {
  server.emit('init-barometer');
  res.redirect('/admin');
});

var server = app.listen(app.get('port'), function() {
  console.log('server running http://127.0.0.1:%d', app.get('port'));
});

var io = require('socket.io')(server);

io.on('connection', function(socket) {
  console.log(colors.yellow('connection with socket id %s'), socket.id);
  // redis.sadd(USERS_KEY, socket.id);

  socket.emit('foo');
  
  socket.on('disconnect', function() {
    console.log(colors.yellow('disconnection socket id %s'), socket.id);
    // redis.srem(USERS_KEY, socket.id);
  });

});

server.on('init-barometer', function() {
  console.log('init-barometer');
});
