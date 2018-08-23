var conf = config;
var descriptiveCommands = conf.extended_command_list
var commands = conf.command_list

var adminAuth = false

/* Command Functions */

function help(json, parameter) {
  /* Empty parameter */
  descriptiveCommands.forEach( function(object) {
    if(object.security) $('#messages').append($('<li></li>').attr('class', 'return').text(object.command + ' - ' + object.description))
  })
}

function afk(json, parameter) {
  socket.emit('afkNotify', { id: id, name: name } )
}

function list(json, parameter) {
  /* Empty parameter */
  Object.keys(users).forEach( function(id) {
    if(users[id].uid === this.id) {
      $('#messages').append($('<li></li>').attr('class', 'return').text('[' + users[id].uid + '] ' + users[id].name + ' (me)'))
    }else {
      $('#messages').append($('<li></li>').attr('class', 'return').text('[' + users[id].uid + '] ' + users[id].name))
    }
  })
}

function setName(json, parameter) {
  /* Parameter is the new name */
  var oldName = name
  name = buildString(parameter)
  socket.emit('changeName', { id: id, name: name, payload: 'User ' + oldName + ' changed their name to ' + name })
}

function emphasize(json, parameter) {
  /* Parameter is the specified message */
  var payloadString = buildString(parameter)
  socket.emit('emphasizeMessage', { id: id, name: name, payload: payloadString })
}

function getId(json, parameter) {
  var checkString = buildString(parameter)
  Object.keys(users).forEach( function(id) {
    if(users[id].name == checkString) {
      $('#messages').append($('<li></li>').attr('class', 'return').text('User \"' + checkString + '\" has ID #' + id))
    }
  })
}

function getName(json, parameter) {
  Object.keys(users).forEach( function(id) {
    if(id == parameter) {
      $('#messages').append($('<li></li>').attr('class', 'return').text('User #' + id + ' is named \"' + users[id].name + '\"'))
    }
  })
}

function mute(json, parameter) {
  muted.push(parseInt(parameter[0]))
  $('#messages').append($('<li></li>').attr('class', 'return').text('You muted user #' + parameter))
}

function unmute(json, parameter) {
  var param = parseInt(parameter)
  if(muted.includes(param)) {
    muted.splice(muted.indexOf(param), 1)
  }
  $('#messages').append($('<li></li>').attr('class', 'return').text('You unmuted user #' + parameter))
}

function auth(json, parameter) {
  socket.emit('authAttempt', { id: id, passphrase: parameter[0] })
}

function gmute(json, parameter) {
  socket.emit('globalMute', { actorId: id, victimId: parameter[0] })
  checkAuth()
}

function gUnmute(json, parameter) {
  socket.emit('globalUnmute', { actorId: id, victimId: parameter[0] })
  checkAuth()
}

function freeze(json, parameter) {
  socket.emit('freezeThread', { actorId: id })
  checkAuth()
}

function unfreeze(json, parameter) {
  socket.emit('unfreezeThread', { actorId: id })
  checkAuth()
}

function informDown(json, parameter) {
  socket.emit('informDown', { actorId: id, minutes: parameter[0] } )
  checkAuth()
}

/* Helper Functions */
function buildString(arr) {
  var completeString = ""
  arr.forEach( function(chunk) {
    completeString += chunk + ' '
  })
  return completeString.trim()
}

function checkAuth() {
  if(!adminAuth) {
    $('#messages').append($('<li></li>').attr('class', 'error').text('You do not have access to that command'))
  }
}
