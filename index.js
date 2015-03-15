var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
// var logger = require('./logger');

function getSocketIds(sockets) {
  var ids = [];
  sockets.forEach(function (socket, index) {
    ids.push(socket.id);
  })
  return ids;
}
function limitText(text, maxLength) {
  maxLength = maxLength || 50;
  if (text.length < maxLength) {
    return text;
  } else {
    var chunk = Math.floor((maxLength - 3) / 2);
    return text.slice(0, chunk) + '...' + text.slice(-chunk);
  }
}
function getKeys(obj) {
  var keys = [];
  for (var key in obj) {
    keys.push(key);
  }
  return keys;
}

app.set('view engine', 'jade');
app.use('/static', express.static('static'))


var textGlobal = '';

app.get('/', function (req, res) {
  res.send('index');
});

var nsps = {};

app.get(/^.*$/, function (req, res) {
  var context = {};
  try {
    context['text'] = nsps[req.path].text;
  } catch(TypeError) {
    context['text'] = '';
  }
  res.render('index', context);
  setTimeout(function () {
    console.log("received GET at %s\n\trendered: %s\n\tcontext: %s",
                req.path, 'index.jade', JSON.stringify(context));
  }, 0);

  nsps[req.path] = io.of(req.path).on('connection', function (socket) {
    // log connection
    setTimeout(function () {
      console.log("event: %s\n\tsocket.id: %s\n\tnsp: %s\n\tnsp.sockets: %s",
                  'connection', socket.id, socket.nsp.name,
                  getSocketIds(socket.nsp.sockets).join(', '));
    }, 0);

    // emit 'connect' event so other sockets know
    socket.broadcast.emit('connect', socket.id);

    socket.on('disconnect', function () {
      setTimeout(function () {
        console.log("event: %s\n\tsocket.id: %s\n\tnsp: %s\n\tnsp.sockets: %s",
                    'disconnect', socket.id, socket.nsp.name,
                    getSocketIds(socket.nsp.sockets).join(', '));
      }, 0);
      io.of(req.path).emit('disconnect');
    });

    // on 'text change' event
    socket.on('text change', function (text) {
      if (text === nsps[req.path].text)
        return;
      setTimeout(function () {
        console.log("event: %s\n\tfrom: %s\n\tnsp: %s\n\ttext: %s",
                    'text change', socket.id, socket.nsp.name, limitText(text));
      }, 0);
      socket.broadcast.emit('text change', text);
      nsps[req.path].text = text;
    });
  });

  console.log('nsps: %s', getKeys(nsps).join(', '));
});


http.listen(3000, function(){
  console.log('listening on *:3000');
});
