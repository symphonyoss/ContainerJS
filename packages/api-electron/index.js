'use strict';
const {
  app,
  BrowserWindow,
  ipcMain: ipc
} = require('electron');
const path = require('path');

let win;
const windows = [];

module.exports = (url) => {
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
    const options = {
      webPreferences: {
        sandbox: true,
        preload: path.join(__dirname, 'preload.js')
      }
    };
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

  ipc.on('ssf-capture-screen-snippet', (e) => {
    e.sender.capturePage((image) => {
      const dataUri = 'data:image/png;base64,' + image.toPng().toString('base64');
      e.sender.send('ssf-screen-snippet-captured', dataUri);
    });
  });

  createInitialHiddenWindow(url);
};

const createInitialHiddenWindow = (url) => {
  // Create an invisible window to run the load script
  win = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    webPreferences: {
      sandbox: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // and load the page used for the hidden window
  win.loadURL(url);

  // Emitted when the window is closed.
  win.on('closed', () => {
    win = null;
  });
};

const parseFeaturesString = (features) => {
  const featureObject = {};

  features.split(',').forEach((feature) => {
    let [key, value] = feature.split('=');

    // interpret the value as a boolean, if possible
    if (value === 'yes' || value === '1') {
      value = true;
    } else if (value === 'no' || value === '0') {
      value = false;
    }

    featureObject[key] = value;
  });

  return featureObject;
};

const ready = (cb) => {
  app.on('ready', cb);
};

module.exports.app = {
  ready
};
