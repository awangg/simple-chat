/* Requires */
var express = require('express')
var app = express()
var server = require('http').Server(app)
var io = require('socket.io').listen(server)

/* Config */
app.use(express.static(__dirname + '/public'))
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html')
})

/* Listening */
var port = process.env.PORT || 80
server.listen(port, function() {
  console.log('Listening on ' + port)
})

var users = {}

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
    io.emit('lostuser', id)
    delete users[id]
  })

  socket.on('message', function(data) {
    io.emit('message', { type: 'message', id: data.userId, name: data.userName, avatarId: data.imageId, payload: data.message })
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
})
