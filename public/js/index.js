var id = -1

$(function() {
  var socket = io()

  socket.on('id', function(newId) {
    id = newId
  })

  socket.on('newuser', function(incomingId) {
    $('#messages').append($('<li></li>').attr('class', 'notification').text('User #' + incomingId + ' has arrived'))
  })

  socket.on('lostuser', function(exitingId) {
    $('#messages').append($('<li></li>').attr('class', 'notification').text('User #' + exitingId + ' has left'))
  })

  $('form').submit( function() {
    socket.emit('message', { message: $('#content').val(), incomingId: id })
    $('#content').val('')
    return false
  })

  socket.on('message', function(data) {
    if(id === data.incomingId) {
      $('#messages').append($('<li></li>').attr('class', 'self-msg').text(data.message))
    }else {
      $('#messages').append($('<li></li>').attr('class', 'other-msg').text(data.incomingId + ": " + data.message))
    }
  })
})
