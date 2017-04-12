'use strict';
const {
  app,
  BrowserWindow,
  ipcMain: ipc
} = require('electron');
const path = require('path');
const {
  IpcModifiers,
  IPC_SSF_BLUR_WINDOW,
  IPC_SSF_CAPTURE_SCREEN_SNIPPET,
  IPC_SSF_CLOSE_WINDOW,
  IPC_SSF_FOCUS_WINDOW,
  IPC_SSF_GET_WINDOW_ID,
  IPC_SSF_HIDE_WINDOW,
  IPC_SSF_NEW_WINDOW,
  IPC_SSF_NOTIFICATION,
  IPC_SSF_SCREEN_SNIPPET_CAPTURED,
  IPC_SSF_SEND_MESSAGE,
  IPC_SSF_SHOW_WINDOW,
  IPC_SSF_WINDOW_EVENT,
  IPC_SSF_WINDOW_SUBSCRIBE_EVENTS
} = require('./src/common/constants');

let win;
const windows = [];
const preloadPath = path.join(__dirname, 'dist', 'ssf-desktop-api.js');

module.exports = (appJson) => {
  const eNotify = require('electron-notify');

  ipc.on(IPC_SSF_NOTIFICATION, (e, msg) => {
    if (!msg.options) {
      msg.options = {};
    }

    eNotify.notify({
      title: msg.title,
      text: msg.options.body
    });
  });

  ipc.on(IPC_SSF_NEW_WINDOW, (e, msg) => {
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

    e.returnValue = {
      id: newWindow.id
    };

    windows.push(newWindow);
  });

  ipc.on(IPC_SSF_CAPTURE_SCREEN_SNIPPET, (e) => {
    e.sender.capturePage((image) => {
      const dataUri = 'data:image/png;base64,' + image.toPng().toString('base64');
      e.sender.send(IPC_SSF_SCREEN_SNIPPET_CAPTURED, dataUri);
    });
  });

  ipc.on(IPC_SSF_SEND_MESSAGE, (e, msg) => {
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
    destinationWindow.webContents.send(`${IPC_SSF_SEND_MESSAGE}-${msg.topic}`, msg.message, senderId);
    destinationWindow.webContents.send(`${IPC_SSF_SEND_MESSAGE}-*`, msg.message, senderId);
  });

  createInitialHiddenWindow(appJson);
};

const createInitialHiddenWindow = (appJson) => {
  // Create an invisible window to run the load script
  win = new BrowserWindow({
    width: 800,
    height: 600,
    show: true,
    webPreferences: {
      sandbox: false,
      preload: preloadPath
    }
  });

  // and load the page used for the hidden window
  win.loadURL('http://localhost:5000/index.html');

  // Emitted when the window is closed.
  win.on('closed', () => {
    win = null;
  });
};

const ready = (cb) => {
  app.on('ready', cb);
};

const sendSuccess = (sender, event, nonce) => {
  sender.send(`${event}${IpcModifiers.SUCCESS}-${nonce}`);
};

const sendFailure = (sender, event, nonce, message) => {
  sender.send(`${event}${IpcModifiers.ERROR}-${nonce}`, message);
};

ipc.on(IPC_SSF_GET_WINDOW_ID, (e) => {
  e.returnValue = BrowserWindow.fromWebContents(e.sender).id;
});

ipc.on(IPC_SSF_CLOSE_WINDOW, (e, id, nonce) => {
  const messageInfo = [e.sender, IPC_SSF_CLOSE_WINDOW, nonce];
  callWindowFunction(id, messageInfo, win => win.close());
});

ipc.on(IPC_SSF_SHOW_WINDOW, (e, id, nonce) => {
  const messageInfo = [e.sender, IPC_SSF_SHOW_WINDOW, nonce];
  callWindowFunction(id, messageInfo, win => win.show());
});

ipc.on(IPC_SSF_HIDE_WINDOW, (e, id, nonce) => {
  const messageInfo = [e.sender, IPC_SSF_HIDE_WINDOW, nonce];
  callWindowFunction(id, messageInfo, win => win.hide());
});

ipc.on(IPC_SSF_FOCUS_WINDOW, (e, id, nonce) => {
  const messageInfo = [e.sender, IPC_SSF_FOCUS_WINDOW, nonce];
  callWindowFunction(id, messageInfo, win => win.focus());
});

ipc.on(IPC_SSF_BLUR_WINDOW, (e, id, nonce) => {
  const messageInfo = [e.sender, IPC_SSF_BLUR_WINDOW, nonce];
  callWindowFunction(id, messageInfo, win => win.blur());
});

const callWindowFunction = (id, messageInfo, windowFunction) => {
  getWindowFromId(id, (win) => {
    windowFunction(win);
    sendSuccess(...messageInfo);
  }, (error) => {
    sendFailure(...messageInfo, error);
  });
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

ipc.on(IPC_SSF_WINDOW_SUBSCRIBE_EVENTS, (e, windowId) => {
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
          sender.send(IPC_SSF_WINDOW_EVENT, win.id, ...arguments);
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
