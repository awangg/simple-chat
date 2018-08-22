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

/* Socket */
io.on('connection', function(socket) {
  var id = Math.floor(Math.random() * 1000000000)
  var name = ""

  socket.emit('id', id)
  socket.broadcast.emit('newuser', id)

  socket.on('disconnect', function() {
    io.emit('lostuser', id)
  })

  socket.on('message', function(data) {
    io.emit('message', { type: 'message', id: data.userId, name: data.userName, payload: data.message })
  })

  socket.on('changeName', function(data) {
    name = data.name
    io.emit('message', { type: 'notification', payload: data.payload })
  })

  socket.on('emphasizeMessage', function(data) {
    io.emit( 'emphasis', { name: data.name, payload: data.payload })
  })
})
