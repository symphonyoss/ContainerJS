const ipc = require('electron').ipcMain;

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
};
