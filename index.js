var express = require('express');
var app = express();

app.set('port', process.env.port || 3000);

app.get('/', function(req, res) {
  res.send('hi');
});

app.listen(app.get('port'));
