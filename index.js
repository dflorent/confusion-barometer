var express = require('express');
var app = express();

app.set('port', process.env.PORT || 3000);

app.get('/', function(req, res) {
  res.send('hi');
});

app.listen(app.get('port'), function() {
  console.log(process.env.PORT);
  console.log('server running http://127.0.0.1:%d', app.get('port'));
});
