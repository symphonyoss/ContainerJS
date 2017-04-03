const ipc = require('electron').ipcRenderer;
import constants from '../common/constants';

window.Notification = function(title, options) {
  ipc.send(constants.ipc.SSF_NOTIFICATION, {
    title,
    options
  });
};
