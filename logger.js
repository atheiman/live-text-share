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
module.exports = {
  LOG: function (message) {_log(message, 'log');},
  INFO: function (message) {_log(message, 'info');},
  ERROR: function (message) {_log(message, 'error');},
  WARN: function (message) {_log(message, 'warn');}
}
