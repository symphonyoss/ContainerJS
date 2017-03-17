/* globals html2canvas */
const ipc = require('electron').ipcRenderer;

if (!window.ssf) {
  window.ssf = {};
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
    return html2canvas(document.body)
      .then((canvas) => canvas.toDataURL());
  }
}

window.ssf.ScreenSnippet = ScreenSnippet;
