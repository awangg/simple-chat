var id = -1

$(function() {
  var socket = io()
  $('#messages').css('height', $(document).height() - 80)

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
    var incomingMessage = $('#content').val()
    if(incomingMessage.charAt(0) == '/') {
      /* Command */
      var parameters = incomingMessage.split(' ')
      if(parameters[0] == '/setName') {
        var old = id
        id = parameters[1]
        socket.emit('command', { payload: 'User ' + old + ' has changed their name to ' + id })
      }else {
        $('#messages').append($('<li></li>').attr('class', 'error').text('Invalid Command'))
      }
    }else {
      /* Regular Message */
      socket.emit('message', { message: incomingMessage, incomingId: id })
    }

    $('#content').val('')
    return false
  })

  socket.on('message', function(data) {
    if(data.type == 'notification') {
      if(id === data.id) {

      }
      $('#messages').append($('<li></li>').attr('class', 'notification').text(data.payload))
    }else if(data.type == 'message') {
      if(id === data.id) {
        $('#messages').append($('<li></li>').attr('class', 'self-msg').text('me: ' + data.payload))
      }else {
        $('#messages').append($('<li></li>').attr('class', 'other-msg').text(data.id + ': ' + data.payload))
      }
    }
    var box = document.getElementById('messages')
    box.scrollTop = box.scrollHeight
  })
})
