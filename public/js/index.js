(function($) {

  var socket = io.connect();
  var $start = $('#start');

  socket.on('activate', function() {
    if ($start) $start.removeClass('disabled');
  });

  socket.on('deactivate', function() {
    if ($start) $start.addClass('disabled');
  });

})(jQuery);
