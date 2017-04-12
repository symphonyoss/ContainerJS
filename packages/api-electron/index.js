'use strict';
const {
  app,
  BrowserWindow,
  ipcMain: ipc
} = require('electron');
const path = require('path');
const {
  IpcModifiers,
  IpcMessages
} = require('./src/common/constants');

let win;
const windows = [];
const preloadPath = path.join(__dirname, 'dist', 'ssf-desktop-api.js');

module.exports = (appJson) => {
  const eNotify = require('electron-notify');

  ipc.on(IpcMessages.IPC_SSF_NOTIFICATION, (e, msg) => {
    if (!msg.options) {
      msg.options = {};
    }

    eNotify.notify({
      title: msg.title,
      text: msg.options.body
    });
  });

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

    e.returnValue = {
      id: newWindow.id
    };

    windows.push(newWindow);
  });

  ipc.on(IpcMessages.IPC_SSF_CAPTURE_SCREEN_SNIPPET, (e) => {
    e.sender.capturePage((image) => {
      const dataUri = 'data:image/png;base64,' + image.toPng().toString('base64');
      e.sender.send(IpcMessages.IPC_SSF_SCREEN_SNIPPET_CAPTURED, dataUri);
    });
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

const sendSuccess = (sender, event, nonce, message) => {
  sender.send(`${event}${IpcModifiers.SUCCESS}-${nonce}`, message);
};

const sendFailure = (sender, event, nonce, message) => {
  sender.send(`${event}${IpcModifiers.ERROR}-${nonce}`, message);
};

ipc.on(IpcMessages.IPC_SSF_BLUR_WINDOW, (e, id, nonce) => {
  const messageInfo = [e.sender, IpcMessages.IPC_SSF_BLUR_WINDOW, nonce];
  callWindowFunction(id, messageInfo, win => win.blur());
});

ipc.on(IpcMessages.IPC_SSF_CLOSE_WINDOW, (e, id, nonce) => {
  const messageInfo = [e.sender, IpcMessages.IPC_SSF_CLOSE_WINDOW, nonce];
  callWindowFunction(id, messageInfo, win => win.close());
});

ipc.on(IpcMessages.IPC_SSF_FLASH_FRAME, (e, id, nonce, args) => {
  const messageInfo = [e.sender, IpcMessages.IPC_SSF_FLASH_FRAME, nonce];
  const [flag] = args;
  callWindowFunction(id, messageInfo, win => win.flashFrame(flag));
});

ipc.on(IpcMessages.IPC_SSF_FOCUS_WINDOW, (e, id, nonce) => {
  const messageInfo = [e.sender, IpcMessages.IPC_SSF_FOCUS_WINDOW, nonce];
  callWindowFunction(id, messageInfo, win => win.focus());
});

ipc.on(IpcMessages.IPC_SSF_GET_WINDOW_BOUNDS, (e, id, nonce) => {
  const messageInfo = [e.sender, IpcMessages.IPC_SSF_GET_WINDOW_BOUNDS, nonce];
  callWindowFunction(id, messageInfo, win => win.getBounds());
});

ipc.on(IpcMessages.IPC_SSF_GET_WINDOW_ID, (e) => {
  e.returnValue = BrowserWindow.fromWebContents(e.sender).id;
});

ipc.on(IpcMessages.IPC_SSF_GET_WINDOW_MAXIMUM_SIZE, (e, id, nonce) => {
  const messageInfo = [e.sender, IpcMessages.IPC_SSF_GET_WINDOW_MAXIMUM_SIZE, nonce];
  callWindowFunction(id, messageInfo, win => win.getMaximumSize());
});

ipc.on(IpcMessages.IPC_SSF_GET_WINDOW_MINIMUM_SIZE, (e, id, nonce) => {
  const messageInfo = [e.sender, IpcMessages.IPC_SSF_GET_WINDOW_MINIMUM_SIZE, nonce];
  callWindowFunction(id, messageInfo, win => win.getMinimumSize());
});

ipc.on(IpcMessages.IPC_SSF_GET_WINDOW_PARENT, (e, id, nonce) => {
  const messageInfo = [e.sender, IpcMessages.IPC_SSF_GET_WINDOW_PARENT, nonce];
  callWindowFunction(id, messageInfo, win => win.getParentWindow());
});

ipc.on(IpcMessages.IPC_SSF_GET_WINDOW_POSITION, (e, id, nonce) => {
  const messageInfo = [e.sender, IpcMessages.IPC_SSF_GET_WINDOW_POSITION, nonce];
  callWindowFunction(id, messageInfo, win => win.getPosition());
});

ipc.on(IpcMessages.IPC_SSF_GET_WINDOW_SIZE, (e, id, nonce) => {
  const messageInfo = [e.sender, IpcMessages.IPC_SSF_GET_WINDOW_SIZE, nonce];
  callWindowFunction(id, messageInfo, win => win.getSize());
});

ipc.on(IpcMessages.IPC_SSF_GET_WINDOW_TITLE, (e, id, nonce) => {
  const messageInfo = [e.sender, IpcMessages.IPC_SSF_GET_WINDOW_TITLE, nonce];
  callWindowFunction(id, messageInfo, win => win.getTitle());
});

ipc.on(IpcMessages.IPC_SSF_WINDOW_HAS_SHADOW, (e, id, nonce, args) => {
  const messageInfo = [e.sender, IpcMessages.IPC_SSF_WINDOW_HAS_SHADOW, nonce];
  callWindowFunction(id, messageInfo, win => win.hasShadow());
});

ipc.on(IpcMessages.IPC_SSF_HIDE_WINDOW, (e, id, nonce) => {
  const messageInfo = [e.sender, IpcMessages.IPC_SSF_HIDE_WINDOW, nonce];
  callWindowFunction(id, messageInfo, win => win.hide());
});

ipc.on(IpcMessages.IPC_SSF_IS_WINDOW_ALWAYS_ON_TOP, (e, id, nonce) => {
  const messageInfo = [e.sender, IpcMessages.IPC_SSF_IS_WINDOW_ALWAYS_ON_TOP, nonce];
  callWindowFunction(id, messageInfo, win => win.isAlwaysOnTop());
});

ipc.on(IpcMessages.IPC_SSF_IS_WINDOW_MAXIMIZABLE, (e, id, nonce) => {
  const messageInfo = [e.sender, IpcMessages.IPC_SSF_IS_WINDOW_MAXIMIZABLE, nonce];
  callWindowFunction(id, messageInfo, win => win.isMaximizable());
});

ipc.on(IpcMessages.IPC_SSF_IS_WINDOW_MAXIMIZED, (e, id, nonce) => {
  const messageInfo = [e.sender, IpcMessages.IPC_SSF_IS_WINDOW_MAXIMIZED, nonce];
  callWindowFunction(id, messageInfo, win => win.isMaximized());
});

ipc.on(IpcMessages.IPC_SSF_IS_WINDOW_MINIMIZABLE, (e, id, nonce) => {
  const messageInfo = [e.sender, IpcMessages.IPC_SSF_IS_WINDOW_MINIMIZABLE, nonce];
  callWindowFunction(id, messageInfo, win => win.isMinimizable());
});

ipc.on(IpcMessages.IPC_SSF_IS_WINDOW_MINIMIZED, (e, id, nonce) => {
  const messageInfo = [e.sender, IpcMessages.IPC_SSF_IS_WINDOW_MINIMIZED, nonce];
  callWindowFunction(id, messageInfo, win => win.isMinimized());
});

ipc.on(IpcMessages.IPC_SSF_IS_WINDOW_RESIZABLE, (e, id, nonce) => {
  const messageInfo = [e.sender, IpcMessages.IPC_SSF_IS_WINDOW_RESIZABLE, nonce];
  callWindowFunction(id, messageInfo, win => win.isResizable());
});

ipc.on(IpcMessages.IPC_SSF_LOAD_URL, (e, id, nonce, args) => {
  const messageInfo = [e.sender, IpcMessages.IPC_SSF_LOAD_URL, nonce];
  const [url] = args;
  callWindowFunction(id, messageInfo, win => win.loadURL(url));
});

ipc.on(IpcMessages.IPC_SSF_RELOAD_WINDOW, (e, id, nonce) => {
  const messageInfo = [e.sender, IpcMessages.IPC_SSF_RELOAD_WINDOW, nonce];
  callWindowFunction(id, messageInfo, win => win.reload());
});

ipc.on(IpcMessages.IPC_SSF_RESTORE_WINDOW, (e, id, nonce) => {
  const messageInfo = [e.sender, IpcMessages.IPC_SSF_RESTORE_WINDOW, nonce];
  callWindowFunction(id, messageInfo, win => win.restore());
});

ipc.on(IpcMessages.IPC_SSF_SET_WINDOW_ALWAYS_ON_TOP, (e, id, nonce, args) => {
  const messageInfo = [e.sender, IpcMessages.IPC_SSF_SET_WINDOW_ALWAYS_ON_TOP, nonce];
  const [alwaysOnTop] = args;
  callWindowFunction(id, messageInfo, win => win.setAlwaysOnTop(alwaysOnTop));
});

ipc.on(IpcMessages.IPC_SSF_SET_WINDOW_BOUNDS, (e, id, nonce, args) => {
  const messageInfo = [e.sender, IpcMessages.IPC_SSF_SET_WINDOW_BOUNDS, nonce];
  const [bounds] = args;
  callWindowFunction(id, messageInfo, win => win.setBounds(bounds));
});

ipc.on(IpcMessages.IPC_SSF_SET_WINDOW_ICON, (e, id, nonce, args) => {
  const messageInfo = [e.sender, IpcMessages.IPC_SSF_SET_WINDOW_BOUNDS, nonce];
  const [icon] = args;
  callWindowFunction(id, messageInfo, win => win.setIcon(icon));
});

ipc.on(IpcMessages.IPC_SSF_SET_WINDOW_MAXIMIZABLE, (e, id, nonce, args) => {
  const messageInfo = [e.sender, IpcMessages.IPC_SSF_SET_WINDOW_MAXIMIZABLE, nonce];
  const [maximizable] = args;
  callWindowFunction(id, messageInfo, win => win.setMaximizable(maximizable));
});

ipc.on(IpcMessages.IPC_SSF_SET_WINDOW_MAXIMUM_SIZE, (e, id, nonce, args) => {
  const messageInfo = [e.sender, IpcMessages.IPC_SSF_SET_WINDOW_MAXIMUM_SIZE, nonce];
  const [width, height] = args;
  callWindowFunction(id, messageInfo, win => win.setMaximumSize(width, height));
});

ipc.on(IpcMessages.IPC_SSF_SET_WINDOW_MINIMIZABLE, (e, id, nonce, args) => {
  const messageInfo = [e.sender, IpcMessages.IPC_SSF_SET_WINDOW_MINIMIZABLE, nonce];
  const [minimizable] = args;
  callWindowFunction(id, messageInfo, win => win.setMinimizable(minimizable));
});

ipc.on(IpcMessages.IPC_SSF_SET_WINDOW_MINIMUM_SIZE, (e, id, nonce, args) => {
  const messageInfo = [e.sender, IpcMessages.IPC_SSF_SET_WINDOW_MINIMUM_SIZE, nonce];
  const [width, height] = args;
  callWindowFunction(id, messageInfo, win => win.setMinimumSize(width, height));
});

ipc.on(IpcMessages.IPC_SSF_SET_WINDOW_POSITION, (e, id, nonce, args) => {
  const messageInfo = [e.sender, IpcMessages.IPC_SSF_SET_WINDOW_POSITION, nonce];
  const [x, y] = args;
  callWindowFunction(id, messageInfo, win => win.setPosition(x, y));
});

ipc.on(IpcMessages.IPC_SSF_SET_WINDOW_RESIZABLE, (e, id, nonce, args) => {
  const messageInfo = [e.sender, IpcMessages.IPC_SSF_SET_WINDOW_RESIZABLE, nonce];
  const [resizable] = args;
  callWindowFunction(id, messageInfo, win => win.setResizable(resizable));
});

ipc.on(IpcMessages.IPC_SSF_SET_WINDOW_SIZE, (e, id, nonce, args) => {
  const messageInfo = [e.sender, IpcMessages.IPC_SSF_SET_WINDOW_SIZE, nonce];
  const [width, height] = args;
  callWindowFunction(id, messageInfo, win => win.setSize(width, height));
});

ipc.on(IpcMessages.IPC_SSF_SET_WINDOW_SKIP_TASKBAR, (e, id, nonce, args) => {
  const messageInfo = [e.sender, IpcMessages.IPC_SSF_SET_WINDOW_SKIP_TASKBAR, nonce];
  const [skipTaskbar] = args;
  callWindowFunction(id, messageInfo, win => win.setSkipTaskbar(skipTaskbar));
});

ipc.on(IpcMessages.IPC_SSF_SHOW_WINDOW, (e, id, nonce) => {
  const messageInfo = [e.sender, IpcMessages.IPC_SSF_SHOW_WINDOW, nonce];
  callWindowFunction(id, messageInfo, win => win.show());
});

ipc.on(IpcMessages.IPC_SSF_MAXIMIZE_WINDOW, (e, id, nonce) => {
  const messageInfo = [e.sender, IpcMessages.IPC_SSF_MAXIMIZE_WINDOW, nonce];
  callWindowFunction(id, messageInfo, win => win.maximize());
});

ipc.on(IpcMessages.IPC_SSF_MINIMIZE_WINDOW, (e, id, nonce) => {
  const messageInfo = [e.sender, IpcMessages.IPC_SSF_MINIMIZE_WINDOW, nonce];
  callWindowFunction(id, messageInfo, win => win.minimize());
});

ipc.on(IpcMessages.IPC_SSF_UNMAXIMIZE_WINDOW, (e, id, nonce) => {
  const messageInfo = [e.sender, IpcMessages.IPC_SSF_UNMAXIMIZE_WINDOW, nonce];
  callWindowFunction(id, messageInfo, win => win.unmaximize());
});

const callWindowFunction = (id, messageInfo, windowFunction) => {
  getWindowFromId(id, (win) => {
    const returnValue = windowFunction(win);
    sendSuccess(...messageInfo, returnValue);
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
