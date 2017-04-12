const ipc = require('electron').ipcRenderer;
import { IpcMessages } from '../common/constants';

window.Notification = function(title, options) {
  ipc.send(IpcMessages.IPC_SSF_NOTIFICATION, {
    title,
    options
  });
};
