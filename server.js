/* Requires */
var express = require('express')
var app = express()
var server = require('http').Server(app)
var io = require('socket.io').listen(server)
var mongoose = require('mongoose')

/* Config */
app.use(express.static(__dirname + '/public'))
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html')
})

var Schema = mongoose.Schema
mongoose.connect('mongodb://localhost/chat-auth')

/* Listening */
var port = process.env.PORT || 8081
server.listen(port, function() {
  console.log('Listening on ' + port)
})

var users = {}
var authedUsers = []
var globallyMuted = []
var freeze = false

/* Keyphrase Config */
var keySchema = new Schema( {
  phrase: { type: String, trim: true }
})
var Key = mongoose.model('keyphrase', keySchema)

/* Socket */
io.on('connection', function(socket) {
  var id = Math.floor(Math.random() * 1000000000)
  users[id] = {
    name: id,
    uid: id
  }

  socket.emit('id', id)
  socket.emit('currentUsers', users)
  socket.broadcast.emit('newuser', id)

  socket.on('disconnect', function() {
    io.emit('lostuser', { id: id, name: users[id].name })
    if(authedUsers.includes(id)) {
      authedUsers.splice(authedUsers.indexOf(id), 1)
    }
    delete users[id]
  })

  socket.on('message', function(data) {
    if(!globallyMuted.includes(parseInt(data.userId)) && !freeze) {
      io.emit('message', { type: 'message', id: data.userId, name: data.userName, avatarId: data.imageId, payload: data.message })
    }
  })

  socket.on('changeName', function(data) {
    users[data.id].name = data.name.trim()
    io.emit('nameChange', { id: data.id, name: data.name.trim() })
    io.emit('message', { type: 'notification', payload: data.payload })
  })

  socket.on('emphasizeMessage', function(data) {
    io.emit('message', { type: 'emphasis', name: data.name, payload: data.payload })
  })

  socket.on('display', function(data) {
    io.emit('message', { type: 'notification', payload: data.payload })
  })

  socket.on('authAttempt', function(data) {
    Key.findOne( { phrase: data.passphrase }, function(err, key) {
      if(err) {
        throw err
      }
      if(key === null) {
        io.emit('failedAuth')
      }else {
        if(key.phrase === data.passphrase) {
          authedUsers.push(data.id)
          io.emit('successAuth')
        }
      }
    })
  })

  socket.on('globalMute', function(data) {
    if(authedUsers.includes(data.actorId)) {
      globallyMuted.push(parseInt(data.victimId))
      io.emit('success', { payload: '#' + data.victimId + ' was muted' })
    }else {
      io.emit('failedAuth', { payload: 'You are not authorized to use this command '})
    }
  })

  socket.on('freezeThread', function(data) {
    if(authedUsers.includes(data.actorId)) {
      freeze = true
      io.emit('success', { payload: 'Thread frozen' })
    }else {
      io.emit('failedAuth', { payload: 'You are not authorized to use this command '})
    }
  })

  socket.on('unfreezeThread', function(data) {
    if(authedUsers.includes(data.actorId)) {
      freeze = false
      io.emit('success', { payload: 'Thread unfrozen' })
    }else {
      io.emit('failedAuth', { payload: 'You are not authorized to use this command '})
    }
  })
})
