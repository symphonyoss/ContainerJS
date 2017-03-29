var newWindowButton = document.getElementById('new-window-test');
var eventLogList = document.getElementById('event-log');

const appReady = ssf.app.ready();

let win;

appReady.then(() => {
  newWindowButton.onclick = function() {
    var url = document.getElementById('url').value;
    var windowName = document.getElementById('name').value;
    var isChild = document.getElementById('child').checked;
    win = new ssf.Window(url, windowName, {
      child: isChild
    });

    win.addListener('hide', () => {
      const newElem = document.createElement('li');
      newElem.innerText = 'hide';
      newElem.className = 'list-group-item';
      eventLogList.appendChild(newElem);
      eventLogList.scrollTop = eventLogList.scrollHeight;
    });

    win.addListener('show', () => {
      const newElem = document.createElement('li');
      newElem.innerText = 'show';
      newElem.className = 'list-group-item';
      eventLogList.appendChild(newElem);
      eventLogList.scrollTop = eventLogList.scrollHeight;
    });

    win.addListener('blur', () => {
      const newElem = document.createElement('li');
      newElem.innerText = 'blur';
      newElem.className = 'list-group-item';
      eventLogList.appendChild(newElem);
      eventLogList.scrollTop = eventLogList.scrollHeight;
    });

    win.addListener('focus', () => {
      const newElem = document.createElement('li');
      newElem.innerText = 'focus';
      newElem.className = 'list-group-item';
      eventLogList.appendChild(newElem);
      eventLogList.scrollTop = eventLogList.scrollHeight;
    });

    win.addListener('close', () => {
      const newElem = document.createElement('li');
      newElem.innerText = 'close';
      newElem.className = 'list-group-item';
      eventLogList.appendChild(newElem);
      eventLogList.scrollTop = eventLogList.scrollHeight;
    });
  };

  var closeWindow = document.getElementById('close-window');

  closeWindow.onclick = () => {
    win.close();
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
