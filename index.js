var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var logger = require('./logger');


app.set('view engine', 'jade');
app.use('/static', express.static('static'))


var textGlobal = '';


app.get('/', function (req, res) {
  var context = {text: textGlobal};
  res.render('index', context);
  logger.INFO('rendered index.jade with context ' + JSON.stringify(context));
});


io.on('connection', function(socket){
  logger.LOG('a user connected');

  socket.on('disconnect', function(){
    logger.LOG('user disconnected');
  });

  socket.on('text change', function(text){
    textGlobal = text;
    io.emit('text change', text);
    logger.INFO('text changed to: ' + text);
  });
});


http.listen(3000, function(){
  logger.INFO('listening on *:3000');
});
