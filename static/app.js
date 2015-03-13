function App() {
  this.textarea = document.getElementById('textarea');

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
    socket.emit('text change', app.textarea.value);
    console.log('emit text change: ' + app.textarea.value);
  }

  this.updateTextarea = function (text) {
    console.log('received text change: ' + app.textarea.value);
    var pos = app.getDiffPos(app.textarea.value, text),
        selectChange = 0,
        selectStart = app.textarea.selectionStart,
        selectEnd = app.textarea.selectionEnd;

    if (app.textarea.selectionStart > pos) {
      selectChange += text.length - app.textarea.length;
    }
    // update the value
    app.textarea.value = text;

    // set the selection change
    app.textarea.selectionStart = selectStart + selectChange;
    app.textarea.selectionEnd = selectEnd + selectChange;
  };
}
