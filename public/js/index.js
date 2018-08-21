var id = -1
var name = ""

$(function() {
  var socket = io()
  /* Set height to not encroach on input area */
  $('#messages').css('height', $(document).height() - 80)

  socket.on('id', function(newId) {
    id = newId
    name = id
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
    }else {
      /* Regular Message */
      socket.emit('message', { message: incomingMessage, userId: id, userName: name })
    }

    $('#content').val('')
    return false
  })

  socket.on('message', function(data) {

    if(data.type == 'notification') {

      $('#messages').append($('<li></li>').attr('class', 'notification').text(data.payload))

    }else if(data.type == 'message') {

      if(id === data.id) {
        $('#messages').append($('<li></li>').attr('class', 'self-msg').text('me: ' + data.payload))
      }else {
        $('#messages').append($('<li></li>').attr('class', 'other-msg').text(data.name + ': ' + data.payload))
      }

    }

    /* Makes sure the box stays on the bottom */
    var box = document.getElementById('messages')
    box.scrollTop = box.scrollHeight
  })
})
