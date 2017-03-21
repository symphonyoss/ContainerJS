const ipc = require('electron').ipcRenderer;

if (!window.ssf) {
  window.ssf = {};
}

if (!window.ssf.app) {
  window.ssf.app = {};
}

window.Notification = function(title, options) {
  ipc.send('ssf-notification', {
    title,
    options
  });
};

class Window {
  constructor(url, name, features) {
    return ipc.sendSync('ssf-new-window', {
      url,
      name,
      features
    });
  }

  static getCurrentWindowId() {
    return ipc.sendSync('get-window-id');
  }
}

window.ssf.Window = Window;

class ScreenSnippet {
  capture() {
    return new Promise((resolve) => {
      ipc.once('ssf-screen-snippet-captured', (imageDataUri) => {
        resolve(imageDataUri);
      });
      ipc.send('ssf-capture-screen-snippet');
    });
  }
}

window.ssf.ScreenSnippet = ScreenSnippet;

window.ssf.app.ready = () => Promise.resolve();

class MessageService {
  static send(windowId, topic, message) {
    const fromId = window.ssf.Window.getCurrentWindowId();
    ipc.send('message-service', {
      windowId,
      topic,
      message,
      fromId
    });
  }

  static subscribe(windowId, topic, listener) {
    ipc.on(`message-service-${topic}`, listener);
  }
}

window.ssf.MessageService = MessageService;
