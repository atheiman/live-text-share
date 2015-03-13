var socket = io();
var app = new App();

socket.on('text change', app.updateTextarea);
