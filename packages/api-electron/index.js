'use strict';
const {
  app,
  BrowserWindow,
  ipcMain: ipc
} = require('electron');
const path = require('path');
const { IpcMessages } = require('./src/common/constants');

let win;
const windows = [];
const preloadPath = path.join(__dirname, 'dist', 'containerjs-api.js');

module.exports = (appJson) => {
  ipc.on(IpcMessages.IPC_SSF_NEW_WINDOW, (e, msg) => {
    const options = Object.assign(
      {},
      msg.features,
      {
        webPreferences: {
          sandbox: true,
          preload: preloadPath
        }
      }
    );

    if (msg.features && msg.features.child) {
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

    e.returnValue = newWindow.id;

    windows.push(newWindow);
  });

  ipc.on(IpcMessages.IPC_SSF_SEND_MESSAGE, (e, msg) => {
    const windowId = parseInt(msg.windowId, 10);

    if (isNaN(windowId)) {
      return;
    }

    const destinationWindow = BrowserWindow.fromId(windowId);

    if (!destinationWindow) {
      return;
    }

    const senderId = e.sender.id;

    destinationWindow.webContents.send(`${IpcMessages.IPC_SSF_SEND_MESSAGE}-${msg.topic}`, msg.message, senderId);
  });

  createInitialHiddenWindow(appJson);
};

const createInitialHiddenWindow = (appJson) => {
  // Create an invisible window to run the load script
  win = new BrowserWindow({
    width: 800,
    height: 600,
    show: appJson.startup_app.autoShow,
    webPreferences: {
      sandbox: true,
      preload: preloadPath
    }
  });

  // and load the page used for the hidden window
  win.loadURL(appJson.startup_app.url);

  // Emitted when the window is closed.
  win.on('closed', () => {
    win = null;
  });
};

const ready = (cb) => {
  app.on('ready', cb);
};

module.exports.app = {
  ready
};
