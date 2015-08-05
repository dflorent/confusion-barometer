var express = require('express');
var app = express();
var nunjucks = require('nunjucks');

app.set('port', process.env.PORT || 3000);

nunjucks.configure('views', {
  autoescape: true,
  express: app
});

app.get('/', function(req, res) {
  res.render('index.html');
});

var server = app.listen(app.get('port'), function() {
  console.log('server running http://127.0.0.1:%d', app.get('port'));
});

var io = require('socket.io')(server);

io.on('connection', function(socket) {
  socket.emit('foo');
});
