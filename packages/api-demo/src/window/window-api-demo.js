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
    win = new ssf.Window({
      alwaysOnTop: isAlwaysOnTop,
      child: isChild,
      center: isCentered,
      frame: hasFrame,
      height,
      maximizable: isMaximizable,
      minimizable: isMinimizable,
      name: windowName,
      resizable: isResizable,
      show: isShown,
      skipTaskbar: isSkippingTaskbar,
      width,
      shadow: true,
      url
    }, (win) => {
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

      win.addListener('closed', () => {
        addListItem('closed');
      });
    });
  };

  var closeWindow = document.getElementById('close-window');

  closeWindow.onclick = () => {
    win.close()
    .catch((error) => {
      console.log(error);
    });
  };

  var hideWindow = document.getElementById('hide-window');

  hideWindow.onclick = () => {
    win.hide()
    .catch((error) => {
      console.log(error);
    });
  };

  var showWindow = document.getElementById('show-window');

  showWindow.onclick = () => {
    win.show()
    .catch((error) => {
      console.log(error);
    });
  };

  var focusWindow = document.getElementById('focus-window');

  focusWindow.onclick = () => {
    win.focus()
    .catch((error) => {
      console.log(error);
    });
  };

  var blurWindow = document.getElementById('blur-window');

  blurWindow.onclick = () => {
    win.blur()
    .catch((error) => {
      console.log(error);
    });
  };

  var maximizeWindow = document.getElementById('maximize-window');

  maximizeWindow.onclick = () => {
    win.maximize()
    .catch((error) => {
      console.log(error);
    });
  };

  var unmaximizeWindow = document.getElementById('unmaximize-window');

  unmaximizeWindow.onclick = () => {
    win.unmaximize()
    .catch((error) => {
      console.log(error);
    });
  };

  var minimizeWindow = document.getElementById('minimize-window');

  minimizeWindow.onclick = () => {
    win.minimize()
    .catch((error) => {
      console.log(error);
    });
  };

  var restoreWindow = document.getElementById('restore-window');

  restoreWindow.onclick = () => {
    win.restore()
    .catch((error) => {
      console.log(error);
    });
  };
});
