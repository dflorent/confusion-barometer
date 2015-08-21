(function($) {

  var socket = io.connect();
  var $start = $('#start');
  var $counter = $('#counter');
  var $okay = $('#okay');
  var $notokay = $('#notokay');

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
    if ($counter) $counter.html('0');
    if (window.location.pathname === '/barometer') {
      window.location.href = '/';
    }
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

  socket.on('update counter', function(data) {
    if ($counter) $counter.html(data);
  });

})(jQuery);
