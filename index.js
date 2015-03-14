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
  console.log('rendered index.jade with context ' + JSON.stringify(context));
});


io.on('connection', function(socket){
  console.log('a user connected');

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  socket.on('text change', function(text){
    textGlobal = text;
    io.emit('text change', text);
    console.log('text changed to: ' + text);
  });
});


http.listen(3000, function(){
  console.log('listening on *:3000');
});
