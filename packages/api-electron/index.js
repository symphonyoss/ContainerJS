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
const preloadPath = path.join(__dirname, 'dist', 'ssf-desktop-api.js');

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

    // Need to send to topic and * in case the user has subscribed to the wildcard
    destinationWindow.webContents.send(`${IpcMessages.IPC_SSF_SEND_MESSAGE}-${msg.topic}`, msg.message, senderId);
    destinationWindow.webContents.send(`${IpcMessages.IPC_SSF_SEND_MESSAGE}-*`, msg.message, senderId);
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

const getWindowFromId = (id, cb, errorcb) => {
  const win = BrowserWindow.fromId(id);
  if (win) {
    cb(win);
  } else {
    errorcb('The window does not exist or the window has been closed');
  }
};

const windowToListener = new Map();

ipc.on(IpcMessages.IPC_SSF_WINDOW_SUBSCRIBE_EVENTS, (e, windowId) => {
  if (windowToListener.has(windowId)) {
    if (!windowToListener.get(windowId).includes(e.sender)) {
      pushToMapArray(windowToListener, windowId, e.sender);
    }
  } else {
    windowToListener.set(windowId, [e.sender]);
  }

  getWindowFromId(windowId, (win) => {
    // Override emit to forward all events onto the window so we can handle them there
    const oldEmit = BrowserWindow.prototype.emit;
    win.emit = function() {
      windowToListener.get(windowId).forEach((sender) => {
        if (!win.isDestroyed()) {
          sender.send(IpcMessages.IPC_SSF_WINDOW_EVENT, win.id, ...arguments);
        }
      });
      oldEmit.apply(win, arguments);
    };
  });
});

const pushToMapArray = (map, key, newValue) => {
  const temp = map.get(key);
  temp.push(newValue);
  map.set(key, temp);
};

module.exports.app = {
  ready
};
