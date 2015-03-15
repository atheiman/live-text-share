var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
// var logger = require('./logger');


app.set('view engine', 'jade');
app.use('/static', express.static('static'))


var textGlobal = '';


app.get('/', function (req, res) {
  var context = {text: textGlobal};
  res.render('index', context);
  console.log("rendered: '%s'", 'index.jade');
});


io.on('connection', function(socket){
  // connection
  console.log("event: '%s', socket.id: '%s', socket.nsp.name: '%s'",
              'connection', socket.id, socket.nsp.name);
  socket.broadcast.emit('user connected');

  // disconnect
  socket.on('disconnect', function(){
    console.log("event: '%s', socket.id: '%s'", 'disconnect', socket.id);
    // socket.broadcast.emit('disconnect', socket.id);
  });

  // text change
  socket.on('text change', function(text){
    console.log("event: '%s'", 'text change');
    textGlobal = text;
    socket.broadcast.emit('text change', text);
  });
});


http.listen(3000, function(){
  console.log('listening on *:3000');
});
