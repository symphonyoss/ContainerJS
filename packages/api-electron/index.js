const {
  BrowserWindow,
  ipcMain: ipc
} = require('electron');

const windows = [];

module.exports = () => {
  const eNotify = require('electron-notify');

  ipc.on('ssf-notification', (e, msg) => {
    if (!msg.options) {
      msg.options = {};
    }

    eNotify.notify({
      title: msg.title,
      text: msg.options.body
    });
  });

  ipc.on('ssf-new-window', (e, msg) => {
    let options = null;
    const features = msg.features.split(',');
    if (features.includes('child=yes')) {
      options = { parent: BrowserWindow.fromWebContents(e.sender) };
    }

    const newWindow = new BrowserWindow(options);
    newWindow.loadURL(msg.url);
    windows.push(newWindow);
    newWindow.on('close', () => {
      const index = windows.indexOf(newWindow);
      if (index >= 0) {
        windows.splice(index, 1);
      }
    });
    e.returnValue = newWindow;
  });
};
