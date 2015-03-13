function App() {
  this.debug = function (msg) {
    var hostnames = ['localhost', 'github.com', '127.0.0.1'];
    if (hostnames.indexOf(location.hostname) !== -1)
      console.log(msg);
  };

  this.textarea = function () {return document.getElementById('textarea');};

  this.getDateTimeStr = function () {
    var d = new Date();
    return d.getMonth() + '-' + d.getDate() + '-' + d.getFullYear() + ' ' +
           d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds() + ',' +
           d.getMilliseconds();
  }

  this.getDiffPos = function (oldText, newText) {
    if (oldText === newText) {
      return;
    }
    for (var pos = 0; pos < oldText.length; pos++) {
      if (oldText[pos] !== newText[pos]) {
        return pos;
      }
    }
  };

  this.textChange = function () {
    // emit the textChange to all connected users
    socket.emit('text change', app.textarea().value);
    app.debug('emit text change: ' + app.textarea().value);
  }

  this.updateTextarea = function (text) {
    // do nothing if received text is textarea value
    if (app.textarea().value === text)
      return;

    app.debug('received text change: ' + app.textarea().value);
    var pos = app.getDiffPos(app.textarea().value, text),
        selectChange = 0,
        selectStart = app.textarea().selectionStart,
        selectEnd = app.textarea().selectionEnd;

    if (pos < app.textarea().selectionStart) {
      app.debug('selectionStart is after pos of change');
      selectChange += text.length - app.textarea().length;
    }

    // update the value
    app.textarea().value = text;

    // set the selection change
    app.textarea().selectionStart = selectStart + selectChange;
    app.textarea().selectionEnd = selectEnd + selectChange;
  };
}
