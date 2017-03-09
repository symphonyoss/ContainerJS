ipc = require('electron').ipcRenderer;

Notification = function (title, options) {
  ipc.send('ssf-notification', {
		title,
		options
	});
};
