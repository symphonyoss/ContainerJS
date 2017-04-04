var newWindowButton = document.getElementById('new-window-test');
var eventLogList = document.getElementById('event-log');

const appReady = ssf.app.ready();

let win;

appReady.then(() => {
  newWindowButton.onclick = function() {
    var url = document.getElementById('url').value;
    var windowName = document.getElementById('name').value;
    var isChild = document.getElementById('child').checked;
    var hasFrame = document.getElementById('frame').checked;
    win = new ssf.Window(url, windowName, {
      child: isChild,
      frame: hasFrame
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
