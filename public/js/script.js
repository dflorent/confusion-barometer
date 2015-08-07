(function($) {

  var socket = io.connect();
  var $start = $('#start');

  $start.click(function(e) {
    e.preventDefault();
    socket.emit('join');
    window.location.href = $(this).attr('href');
  });

  socket.on('activate', function() {
    if ($start) $start.removeClass('disabled');
  });

  socket.on('deactivate', function() {
    if ($start) $start.addClass('disabled');
    if (window.location.pathname === '/barometer') {
      window.location.href = '/';
    }
  });

})(jQuery);
