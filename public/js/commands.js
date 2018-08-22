var conf = config;
var descriptiveCommands = conf.extended_command_list
var commands = conf.command_list

function help(json, parameter) {
  /* Empty parameter */
  descriptiveCommands.forEach( function(object) {
    $('#messages').append($('<li></li>').attr('class', 'notification').text('[' + object.security + '] ' + object.command + ' - ' + object.description))
  })
}

function list(json, parameter) {
  /* Empty parameter */
  Object.keys(users).forEach( function(id) {
    if(users[id].uid === this.id) {
      $('#messages').append($('<li></li>').attr('class', 'notification').text('[' + users[id].uid + '] ' + users[id].name + ' (me)'))
    }else {
      $('#messages').append($('<li></li>').attr('class', 'notification').text('[' + users[id].uid + '] ' + users[id].name))
    }
  })
}

function setName(json, parameter) {
  /* Parameter is the new name */
  var completeString = ""
  parameter.forEach( function(chunk) {
    completeString += chunk + ' '
  })
  var oldName = name
  name = completeString.trim()
  socket.emit('changeName', { id: id, name: name, payload: 'User ' + oldName + ' changed their name to ' + name })
}

function emphasize(json, parameter) {
  /* Parameter is the specified message */
  var completeString = ""
  parameter.forEach( function(chunk) {
    completeString += chunk + ' '
  })
  var payloadString = completeString.trim()
  socket.emit('emphasizeMessage', { name: name, payload: payloadString })
}

function id(json, parameter) {

}
