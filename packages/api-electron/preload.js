const ipc = require('electron').ipcRenderer;

if (!window.ssf) {
  window.ssf = {};
}

if (!window.ssf.app) {
  window.ssf.app = {};
}

window.Notification = function(title, options) {
  ipc.send('ssf-notification', {
    title,
    options
  });
};

class Window {
  constructor(url, name, features) {
    return ipc.sendSync('ssf-new-window', {
      url,
      name,
      features
    });
  }
}

window.ssf.Window = Window;

class ScreenSnippet {
  capture() {
    return new Promise((resolve) => {
      ipc.once('ssf-screen-snippet-captured', (imageDataUri) => {
        resolve(imageDataUri);
      });
      ipc.send('ssf-capture-screen-snippet');
    });
  }
}

window.ssf.ScreenSnippet = ScreenSnippet;

window.ssf.app.ready = () => Promise.resolve();
