(function($) {

  var socket = io.connect();
  var $okay = $('#okay');
  var $notokay = $('#notokay');
 
  socket.on('deactivate', function() {
    window.location.href = '/';
  });

  $okay.on('click', function(e) {
    e.preventDefault();
    if (! $(this).hasClass('active')) {
      socket.emit('okay');
    }
  });

  $notokay.on('click', function(e) {
    e.preventDefault();
    if (! $(this).hasClass('active')) {
      socket.emit('notokay');
    }
  });

  // when user leave the app, decrease the counter
  $(window).on('unload', function() {
    socket.emit('okay'); 
  });

})(jQuery);
