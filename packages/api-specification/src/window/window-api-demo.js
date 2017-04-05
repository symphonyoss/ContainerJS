var newWindowButton = document.getElementById('new-window-test');
var eventLogList = document.getElementById('event-log');

const appReady = ssf.app.ready();

let win;

appReady.then(() => {
  newWindowButton.onclick = function() {
    var url = document.getElementById('url').value;
    var windowName = document.getElementById('name').value;
    var isAlwaysOnTop = document.getElementById('alwaysOnTop').checked;
    var isChild = document.getElementById('child').checked;
    var isCentered = document.getElementById('center').checked;
    var hasFrame = document.getElementById('frame').checked;
    var height = parseInt(document.getElementById('height').value, 10);
    var isMaximizable = document.getElementById('maximizable').checked;
    var isMinimizable = document.getElementById('minimizable').checked;
    var isResizable = document.getElementById('resizable').checked;
    var isShown = document.getElementById('show').checked;
    var isSkippingTaskbar = document.getElementById('skipTaskbar').checked;
    var width = parseInt(document.getElementById('width').value, 10);
    win = new ssf.Window(url, windowName, {
      alwaysOnTop: isAlwaysOnTop,
      child: isChild,
      center: isCentered,
      frame: hasFrame,
      height,
      maximizable: isMaximizable,
      minimizable: isMinimizable,
      resizable: isResizable,
      show: isShown,
      skipTaskbar: isSkippingTaskbar,
      width
    });

    const addListItem = (text) => {
      const newElem = document.createElement('li');
      newElem.innerText = text;
      newElem.className = 'list-group-item';
      eventLogList.appendChild(newElem);
      eventLogList.scrollTop = eventLogList.scrollHeight;
    };

    win.addListener('hide', () => {
      addListItem('hide');
    });

    win.addListener('show', () => {
      addListItem('show');
    });

    win.addListener('blur', () => {
      addListItem('blur');
    });

    win.addListener('focus', () => {
      addListItem('focus');
    });

    win.addListener('close', () => {
      addListItem('close');
    });
  };

  var closeWindow = document.getElementById('close-window');

  closeWindow.onclick = () => {
    win.close();
    win.removeAllListeners();
    win = null;
  };

  var hideWindow = document.getElementById('hide-window');

  hideWindow.onclick = () => {
    win.hide();
  };

  var showWindow = document.getElementById('show-window');

  showWindow.onclick = () => {
    win.show();
  };

  var focusWindow = document.getElementById('focus-window');

  focusWindow.onclick = () => {
    win.focus();
  };

  var blurWindow = document.getElementById('blur-window');

  blurWindow.onclick = () => {
    win.blur();
  };
});
