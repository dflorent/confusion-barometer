(function($) {

  var socket = io.connect();
  var $counter = $('#counter');
  
  socket.on('deactivate', function() {
    if ($counter) $counter.html('0');
  });

  socket.on('update counter', function(data) {
    var $title = $('title');
    var title = data >= 1 ? '(' + data + ') Confusion barometer' : 'Confusion barometer';
    if ($counter) $counter.html(data);
    $title.html(title);
  });

})(jQuery);
