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

  socket.on('desktop notification', function() {
    if (Notification.permission !== 'granted'){
      Notification.requestPermission();
    }
    n = new Notification('Confusion barometer', {
      body: 'Utilisateur(s) confus'
    });
  });

})(jQuery);
