const ipc = require('electron').ipcRenderer;
import constants from '../common/constants';

let currentWindow = null;

class Window {
  constructor(...args) {
    if (args.length === 0) {
      this.innerWindow = {
        id: window.ssf.Window.getCurrentWindowId()
      };
    } else {
      const [url, name, features] = args;

      this.innerWindow = ipc.sendSync(constants.ipc.SSF_NEW_WINDOW, {
        url,
        name,
        features
      });
    }

    ipc.send(constants.ipc.SSF_WINDOW_SUBSCRIBE_EVENTS, this.innerWindow.id);
    this.eventListeners = new Map();

    ipc.on(constants.ipc.SSF_WINDOW_EVENT, (windowId, e) => {
      // Need to check if the event is for this window in case the
      // current native window has subscribed to more than 1 window's events
      if (windowId === this.innerWindow.id && this.eventListeners.has(e)) {
        this.eventListeners.get(e).forEach((listener) => listener());
      }
    });
  }

  close() {
    this.sendWindowAction(constants.ipc.SSF_CLOSE_WINDOW);
  }

  show() {
    this.sendWindowAction(constants.ipc.SSF_SHOW_WINDOW);
  }

  hide() {
    this.sendWindowAction(constants.ipc.SSF_HIDE_WINDOW);
  }

  focus() {
    this.sendWindowAction(constants.ipc.SSF_FOCUS_WINDOW);
  }

  blur() {
    this.sendWindowAction(constants.ipc.SSF_BLUR_WINDOW);
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
      let listeners = this.eventListeners.get(event);
      listeners = listeners.splice(listeners.indexOf(listener), 1);
      this.eventListeners.set(event, listeners);
    }
  }

  removeAllListeners() {
    this.eventListeners.clear();
  }

  static getCurrentWindowId() {
    return ipc.sendSync(constants.ipc.SSF_GET_WINDOW_ID);
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
