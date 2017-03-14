const ipc = require('electron').ipcMain;
const { BrowserWindow } = require('electron');

let windows = [];

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
    const newWin = new BrowserWindow();
    newWin.loadURL(msg.url);
    windows.push(newWin);
    e.returnValue = newWin;
  });
};
