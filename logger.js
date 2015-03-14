function Logger() {
  this._getDateStr = function (date) {
    date = typeof date !== 'undefined' ? date : new Date();
    try {
      return date.getMonth() + '-' + date.getDate() + '-' + date.getFullYear() +
             ' ' + date.getHours() + ':' + date.getMinutes() + ':' +
             date.getSeconds() + ',' + date.getMilliseconds();
    } catch(err) {
      return 'date string error';
    }
  };

  this._asyncLog = function (args, level) {
    // Same as Logger._log, but in an async wrapper
    var func = this._log;
    var args = Array.prototype.slice.call(arguments);
    setTimeout(function () {
      func.apply(this, args);
    }, 0);
  }

  this._log = function (args, level) {
    // Array args is passed to console[level].
    // String level defaults to 'log'.
    // A date string and the level is prepended to the log entry.
    level = typeof level !== 'undefined' ? level : 'log';
    args[0] = logger._getDateStr() + '\t' + level.toUpperCase() + '\t' + args[0];
    console.log(args);
    console.log.apply(this, args);
  }

  this.log = function (msg) {
    var logFunc = this._log;
    var args = Array.prototype.slice.call(arguments);
    setTimeout(function () { logger._log(args, 'log'); }, 0);
  };
  this.info = function (msg) {
    this._asyncLog(Array.prototype.slice.call(arguments), 'info');
  };
  this.error = function (msg) {logger._asyncLog(msg, 'error');};
  this.warn = function (msg) {logger._asyncLog(msg, 'warn');};
}

// module.exports = {
//   LOG: function (msg) {_asyncLog(msg, 'log');},
//   INFO: function (msg) {_asyncLog(msg, 'info');},
//   ERROR: function (msg) {_asyncLog(msg, 'error');},
//   WARN: function (msg) {_asyncLog(msg, 'warn');}
// }

var logger = new Logger();

logger.log('this is a log');
logger.info('this is some %s', 'info');
logger.log('pass in a %s', 'var');
