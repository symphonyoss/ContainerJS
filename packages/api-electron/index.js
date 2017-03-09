const ipc = require('electron').ipcMain;

module.exports = () => {
  const eNotify = require('electron-notify')

  ipc.on('ssf-notification', (e, msg) => {
    eNotify.notify({ title: msg.title })
  })
}
