var conf = config
var descriptiveCommands = conf.extended_command_list
var commands = conf.command_list

var id = -1
var name = ""
var users = []

var socket = io()

$(function() {

  /* Set height to not encroach on input area */
  $('#messages').css('height', $(document).height() - 80)

  socket.on('id', function(newId) {
    id = newId
    name = id
  })

  socket.on('currentUsers', function(data) {
    users = data
  })

  socket.on('newuser', function(incomingId) {
    $('#messages').append($('<li></li>').attr('class', 'notification').text('User #' + incomingId + ' has arrived'))
    users[incomingId] = { name: incomingId, uid: incomingId }
  })

  socket.on('lostuser', function(exitingId) {
    $('#messages').append($('<li></li>').attr('class', 'notification').text('User #' + exitingId + ' has left'))
    delete users[exitingId]
  })

  $('form').submit( function() {
    var incomingMessage = $('#content').val()

    if(incomingMessage.charAt(0) == '/') {
      /* Command */
      var parameters = incomingMessage.split(' ')
      if(commands.includes(parameters[0])) {
        window[descriptiveCommands[commands.indexOf(parameters[0])].function](descriptiveCommands, parameters.slice(1))
      }
    }else {
      /* Regular Message */
      socket.emit('message', { message: incomingMessage, userId: id, userName: name })
    }

    $('#content').val('')
    return false
  })

  socket.on('nameChange', function(data) {
    users[data.id].name = data.name
  })

  socket.on('message', function(data) {

    if(data.type == 'notification') {

      $('#messages').append($('<li></li>').attr('class', 'notification').text(data.payload))

    }else if(data.type == 'emphasis') {

      $('#messages').append($('<li></li>').attr('class', 'emphasized').text('[' + data.name + '] - ' + data.payload))

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
