const ipc = require('electron').ipcRenderer;
import ipcConstants from '../common/ipcConstants';

window.Notification = function(title, options) {
  ipc.send(ipcConstants.IPC_SSF_NOTIFICATION, {
    title,
    options
  });
};
