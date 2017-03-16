/* globals createImageBitmap */
const ipc = require('electron').ipcRenderer;
const html2canvas = require('html2canvas');

if (!window.ssf) {
  window.ssf = {};
}

window.Notification = function(title, options) {
  ipc.send('ssf-notification', {
    title,
    options
  });
};

window.ssf.window = function(url, name, features) {
  // Need to sendSync so we can return the window object, matching the HTML5 API
  return ipc.sendSync('ssf-new-window', {
    url,
    name,
    features
  });
};

class ScreenSnippet {
  capture() {
    return html2canvas(document.body)
      .then((canvas) => createImageBitmap(canvas));
  }
}

window.ssf.ScreenSnippet = ScreenSnippet;
