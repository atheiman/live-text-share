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
    args[0] = [Logger.prototype._getDateStr(),
               level.toUpperCase(),
               args[0]].join('\t');
    console.log.apply(this, args);
  }

  this.log = function () {
    this._asyncLog(Array.prototype.slice.call(arguments), 'log');
  };
  this.info = function () {
    var logFunc = this._log;
    var args = Array.prototype.slice.call(arguments);
    setTimeout(function () { logFunc.apply(this, [args, 'info']); }, 0);
  };
  this.error = function () {
    Logger.prototype._asyncLog(Array.prototype.slice.call(arguments), 'error');
  };
  this.warn = function () {
    var args = Array.prototype.slice.call(arguments);
    setTimeout(function () {
      Logger.prototype._log(args, 'warn');
    }, 0);
  };
}

Logger.prototype = new Logger();
Logger.constructor = Logger;

// module.exports = {
//   LOG: function (msg) {_asyncLog(msg, 'log');},
//   INFO: function (msg) {_asyncLog(msg, 'info');},
//   ERROR: function (msg) {_asyncLog(msg, 'error');},
//   WARN: function (msg) {_asyncLog(msg, 'warn');}
// }

var logger = new Logger();

logger.log('this is a basic log');
logger.log('logs %s', 'use this._asyncLog');
logger.info('infos use', 'setTimeout and this._log');
logger.error('errors %s', 'use prototype._asyncLog');
logger.warn('warnings use', 'setTimeout and prototype._log');
