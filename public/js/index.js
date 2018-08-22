/* Config */
var conf = config
var descriptiveCommands = conf.extended_command_list
var commands = conf.command_list

/* User-specific information */
var id = -1
var name = ""
var avatarNum = Math.floor(Math.random() * 8) + 1
var users = []
var muted = []

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
        try {
          window[descriptiveCommands[commands.indexOf(parameters[0])].function](descriptiveCommands, parameters.slice(1))
        } catch (err) {
          $('#messages').append($('<li></li>').attr('class', 'error').text('Invalid Command'))
        }
      }else {
        $('#messages').append($('<li></li>').attr('class', 'error').text('Invalid Command'))
      }

      /* Keep scroll bar at bottom */
      var box = document.getElementById('messages')
      box.scrollTop = box.scrollHeight

    }else if(! /^\s+$/.test(incomingMessage) && incomingMessage.length > 0) {
      /* Regular Message */
      socket.emit('message', { message: incomingMessage, userId: id, userName: name, imageId: avatarNum })
    }

    $('#content').val('')
    return false
  })

  socket.on('nameChange', function(data) {
    users[data.id].name = data.name
  })

  socket.on('message', function(data) {

    if(!muted.includes(data.id)) {

      if(data.type == 'notification') {

        $('#messages').append($('<li></li>').attr('class', 'notification row justify-content-center').text(data.payload))

      }else if(data.type == 'emphasis') {

        $('#messages').append($('<li></li>').attr('class', 'emphasized row justify-content-center').text('[' + data.name + '] - ' + data.payload))

      }else if(data.type == 'message') {

        if(id === data.id) {

          $('#messages').append($('<li></li>')
            .attr('class', 'row ml-2')
            .css('width', '50%')
            .append($('<div></div>')
              .attr('class', 'msg-container')
              .append($('<div></div>')
                .attr('class', 'avatar mr-2')
                .append($('<img></img>')
                  .attr('src', 'assets/avatars/avatar-'+avatarNum+'.png')
                  .attr('width', '75')
                  .attr('height', '75')
                  .attr('align', 'left')
                  .attr('alt', 'user avatar')
                )
              )
              .append($('<div></div>')
                .attr('class', 'msg-text')
                .css('word-break', 'break-all')
                .append($('<h6></h6>')
                  .text('Me')
                )
                .append($('<p></p>')
                  .text(data.payload)
                )
              )
            )
          )

        }else {

          $('#messages').append($('<li></li>')
            .attr('class', 'row mr-1')
            .css('float', 'right')
            .css('width', '100%')
            .append($('<div></div>')
              .attr('class', 'msg-container row justify-content-end')
              .append($('<div></div>')
                .attr('class', 'msg-text text-right')
                .css('word-break', 'break-all')
                .css('width', '50%')
                .append($('<h6></h6>')
                  .text(data.name)
                )
                .append($('<p></p>')
                  .text(data.payload)
                )
              )
              .append($('<div></div>')
                .attr('class', 'avatar ml-2')
                .append($('<img></img>')
                  .attr('src', 'assets/avatars/avatar-'+data.avatarId+'.png')
                  .attr('width', '75')
                  .attr('height', '75')
                  .attr('align', 'right')
                  .attr('alt', 'user avatar')
                )
              )
            )
          )

        }

      }

      /* Keep scroll bar at bottom */
      var box = document.getElementById('messages')
      box.scrollTop = box.scrollHeight

    }
  })
})
