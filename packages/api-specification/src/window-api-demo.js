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
var hideWindow = document.getElementById('hide-window');
var showWindow = document.getElementById('show-window');

closeWindow.onclick = function() {
  win.close();
};

hideWindow.onclick = function() {
  win.hide();
};

showWindow.onclick = function() {
  win.show();
};
