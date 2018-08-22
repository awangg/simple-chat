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
    $('#messages').append($('<li></li>').attr('class', 'notification return').text('User #' + incomingId + ' has arrived'))
    users[incomingId] = { name: incomingId, uid: incomingId }
    moveToBottom()
  })

  socket.on('lostuser', function(data) {
    $('#messages').append($('<li></li>').attr('class', 'notification return').text('User ' + data.name + ' (#' + data.id + ') has left'))
    delete users[data.id]
    moveToBottom()
  })

  $('form').submit( function() {
    var incomingMessage = $('#content').val()

    if(incomingMessage.charAt(0) == '/') {
      /* Command */
      var parameters = incomingMessage.split(' ')
      if(commands.includes(parameters[0].toLowerCase())) {
        try {
          window[descriptiveCommands[commands.indexOf(parameters[0].toLowerCase())].function](descriptiveCommands, parameters.slice(1))
        } catch (err) {
          $('#messages').append($('<li></li>').attr('class', 'error return').text('Invalid Command'))
        }
      }else {
        $('#messages').append($('<li></li>').attr('class', 'error return').text('Invalid Command'))
      }

      $('#messages').append($('<hr>'))
      moveToBottom()

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

        $('#messages').append($('<li></li>').attr('class', 'notification return').text(data.payload))

      }else if(data.type == 'emphasis') {

        $('#messages').append($('<li></li>').attr('class', 'emphasized return').text('[' + data.name + '] - ' + data.payload))

      }else if(data.type == 'message') {

        if(id === data.id) {

          $('#messages').append($('<li></li>')
            .attr('class', 'row ml-1 mt-1')
            .css('width', '50%')
            .append($('<div></div>')
              .attr('class', 'msg-container')
              .append($('<div></div>')
                .attr('class', 'avatar mr-2')
                .append($('<img></img>')
                  .attr('src', 'assets/avatars/avatar-'+avatarNum+'.png')
                  .attr('width', '50')
                  .attr('height', '50')
                  .attr('align', 'left')
                  .attr('alt', 'user avatar')
                )
              )
              .append($('<div></div>')
                .attr('class', 'msg-text')
                .css('word-break', 'break-all')
                .append($('<h6></h6>')
                  .text(data.name + ' (me)')
                )
                .append($('<p></p>')
                  .text(data.payload)
                )
              )
            )
          )

        }else {

          $('#messages').append($('<li></li>')
            .attr('class', 'row pr-1 mt-2')
            .css('float', 'right')
            .css('background-color', '#efefef')
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
                  .attr('width', '50')
                  .attr('height', '50')
                  .attr('align', 'right')
                  .attr('alt', 'user avatar')
                )
              )
            )
          )

        }

      }

      moveToBottom()

    }
  })

  socket.on('success', function(data) {
    $('#messages').append($('<li></li>').attr('class', 'return').css('font-size', '24px').css('font-weight', 'bold').text(data.payload))
    moveToBottom()
  })
})

function moveToBottom() {
  var box = document.getElementById('messages')
  box.scrollTop = box.scrollHeight
}
