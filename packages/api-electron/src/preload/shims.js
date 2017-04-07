const ipc = require('electron').ipcRenderer;
import { IPC_SSF_NOTIFICATION } from '../common/constants';

window.Notification = function(title, options) {
  ipc.send(IPC_SSF_NOTIFICATION, {
    title,
    options
  });
};
