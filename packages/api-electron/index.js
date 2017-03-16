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
    let options = {};
    const featureObject = parseFeaturesString(msg.features);
    if (featureObject.child) {
      options.parent = BrowserWindow.fromWebContents(e.sender);
    }

    const newWindow = new BrowserWindow(options);
    newWindow.loadURL(msg.url);
    newWindow.on('close', () => {
      const index = windows.indexOf(newWindow);
      if (index >= 0) {
        windows.splice(index, 1);
      }
    });

    e.returnValue = newWindow;
    windows.push(newWindow);
  });
};

const parseFeaturesString = (features) => {
  const featureObject = {};

  features.split(/,\s*/).forEach((feature) => {
    let [key, value] = feature.split(/\s*=/);

    // interpret the value as a boolean, if possible
    value = (value === 'yes' || value === '1') ? true : (value === 'no' || value === '0') ? false : value;

    featureObject[key] = value;
  });

  return featureObject;
};
