var conf = config;
var descriptiveCommands = conf.extended_command_list
var commands = conf.command_list

function help(json, parameter) {
  descriptiveCommands.forEach( function(object) {
    $('#messages').append($('<li></li>').attr('class', 'notification').text('[' + object.security + '] ' + object.command + ' - ' + object.description))
  })
}

function setName(json, parameter) {
  var completeString = ""
  parameter.forEach( function(chunk) {
    completeString += chunk + ' '
  })
  var oldName = name
  name = completeString.trim()
  socket.emit('command', { payload: 'User ' + oldName + ' changed their name to ' + name })
}

function emphasize(json, parameter) {
  var completeString = ""
  parameter.forEach( function(chunk) {
    completeString += chunk + ' '
  })
  var payloadString = completeString.trim()
  socket.emit('command', { type: 'emphasis', name: name, payload: payloadString })
}
