const ipc = require('electron').ipcRenderer;

window.Notification = function(title, options) {
  ipc.send('ssf-notification', {
    title,
    options
  });
};
