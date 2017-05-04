const remote = require('electron').remote;
const eNotify = remote.require('electron-notify');

window.Notification = function(title, options) {
  if (!options) {
    options = {};
  }

  eNotify.notify({
    title: title,
    text: options.body
  });
};
