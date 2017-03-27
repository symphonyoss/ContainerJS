var newWindowButton = document.getElementById('new-window-test');

const appReady = ssf.app.ready();

let win;

newWindowButton.onclick = function() {
  var url = document.getElementById('url').value;
  var windowName = document.getElementById('name').value;
  var isChild = document.getElementById('child').checked;
  appReady.then(() => {
    win = new ssf.Window(url, windowName, {
      child: isChild
    });
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
