function getDateTimeStr() {
  var d = new Date();
  return d.getMonth() + '-' + d.getDate() + '-' + d.getFullYear() + ' ' +
         d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds() + ',' +
         d.getMilliseconds();
}
function _log(message, level) {
  // level could be log, info, error, or warn
  level = level || 'log';
  console[level](getDateTimeStr() + '\t' + level.toUpperCase() + '\t' +
                 message);
}
function LOG(message) {_log(message, 'log');}
function INFO(message) {_log(message, 'info');}
function ERROR(message) {_log(message, 'error');}
function WARN(message) {_log(message, 'warn');}


var textarea = document.getElementById('textarea');
var socket = io();
function textChange() {
  // emit the textChange to all connected users
  socket.emit('text change', textarea.value);
  INFO('emit text change');
}
socket.on('text change', function (text) {
  textarea.value = text;
  INFO('received text change');
});

