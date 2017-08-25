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

module.exports = (appJson, useSymphony, showDeveloperMenu) => {
  const preloadFile = useSymphony ? 'containerjs-api-symphony.js' : 'containerjs-api.js';
  const preloadPath = path.join(__dirname, 'build', 'dist', preloadFile);

  if (!showDeveloperMenu) {
    app.on('browser-window-created', function(e, window) {
      window.setMenu(null);
    });
  }

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
    const senderId = e.sender.id;
    const sendToWindow = win => {
      // Don't send to self
      if (win.id !== senderId) {
        win.webContents.send(`${IpcMessages.IPC_SSF_SEND_MESSAGE}-${msg.topic}`, msg.message, senderId);
      }
    };

    if (msg.windowId === '*') {
      BrowserWindow.getAllWindows().forEach(sendToWindow);
    } else {
      const windowId = parseInt(msg.windowId, 10);
      if (isNaN(windowId)) {
        return;
      }

      const destinationWindow = BrowserWindow.fromId(windowId);
      if (!destinationWindow) {
        return;
      }

      sendToWindow(destinationWindow);
    }
  });

  createInitialHiddenWindow(appJson, preloadPath);
};

const createInitialHiddenWindow = (appJson, preloadPath) => {
  // Create an invisible window to run the load script
  win = new BrowserWindow({
    width: 800,
    height: 600,
    show: appJson.autoShow,
    webPreferences: {
      sandbox: true,
      preload: preloadPath
    }
  });

  // and load the page used for the hidden window
  win.loadURL(appJson.url);

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
