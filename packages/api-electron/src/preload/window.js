const ipc = require('electron').ipcRenderer;

let currentWindow = null;

class Window {
  constructor(...args) {
    if (args.length === 0) {
      this.innerWindow = {
        id: window.ssf.Window.getCurrentWindowId()
      };
    } else {
      const [url, name, features] = args;

      this.innerWindow = ipc.sendSync('ssf-new-window', {
        url,
        name,
        features
      });
    }

    ipc.send('ssf-window-subscribe-events', this.innerWindow.id);
    this.eventListeners = new Map();

    ipc.on('ssf-window-event', (windowId, e) => {
      // Need to check if the event is for this window in case the
      // current native window has subscribed to more than 1 window's events
      if (windowId === this.innerWindow.id && this.eventListeners.has(e)) {
        this.eventListeners.get(e).forEach((listener) => listener());
      }
    });
  }

  close() {
    this.sendWindowAction('ssf-close-window');
  }

  show() {
    this.sendWindowAction('ssf-show-window');
  }

  hide() {
    this.sendWindowAction('ssf-hide-window');
  }

  focus() {
    this.sendWindowAction('ssf-focus-window');
  }

  blur() {
    this.sendWindowAction('ssf-blur-window');
  }

  sendWindowAction(action) {
    ipc.send(action, this.innerWindow.id);
  }

  addListener(event, listener) {
    if (this.eventListeners.has(event)) {
      const listeners = this.eventListeners.get(event);
      listeners.push(listener);
      this.eventListeners.set(event, listeners);
    } else {
      this.eventListeners.set(event, [listener]);
    }
  }

  removeListener(event, listener) {
    if (this.eventListeners.has(event)) {
      const listeners = this.eventListeners.get(event);
      listeners.splice(listeners.indexOf(listener), 1);
      this.eventListeners.set(event, listeners);
    }
  }

  removeAllListeners() {
    this.eventListeners.clear();
  }

  static getCurrentWindowId() {
    return ipc.sendSync('ssf-get-window-id');
  }

  static getCurrentWindow() {
    if (currentWindow) {
      return currentWindow;
    }

    currentWindow = new Window();
    return currentWindow;
  }
}

export default Window;
