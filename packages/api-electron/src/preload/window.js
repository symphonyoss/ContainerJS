const ipc = require('electron').ipcRenderer;
import MessageService from './message-service';
import {
  IpcModifiers,
  IPC_SSF_BLUR_WINDOW,
  IPC_SSF_CLOSE_WINDOW,
  IPC_SSF_FOCUS_WINDOW,
  IPC_SSF_GET_WINDOW_ID,
  IPC_SSF_HIDE_WINDOW,
  IPC_SSF_NEW_WINDOW,
  IPC_SSF_SHOW_WINDOW,
  IPC_SSF_WINDOW_EVENT,
  IPC_SSF_WINDOW_SUBSCRIBE_EVENTS
} from '../common/constants';

let currentWindow = null;

const generateNonce = () => {
  return Math.floor((Math.random() * 1000000));
};

class Window {
  constructor(...args) {
    if (args.length === 0) {
      this.innerWindow = {
        id: window.ssf.Window.getCurrentWindowId()
      };
    } else {
      const [url, name, features] = args;

      this.innerWindow = ipc.sendSync(IPC_SSF_NEW_WINDOW, {
        url,
        name,
        features
      });
    }

    ipc.send(IPC_SSF_WINDOW_SUBSCRIBE_EVENTS, this.innerWindow.id);
    this.eventListeners = new Map();

    ipc.on(IPC_SSF_WINDOW_EVENT, (windowId, e) => {
      // Need to check if the event is for this window in case the
      // current native window has subscribed to more than 1 window's events
      if (windowId === this.innerWindow.id && this.eventListeners.has(e)) {
        this.eventListeners.get(e).forEach((listener) => listener());
      }
    });

    MessageService.subscribe('*', 'ssf-window-message', (...args) => {
      const event = 'message';
      if (this.eventListeners.has(event)) {
        this.eventListeners.get(event).forEach(listener => listener(...args));
      }
    });
  }

  close() {
    return this.sendWindowAction(IPC_SSF_CLOSE_WINDOW);
  }

  show() {
    return this.sendWindowAction(IPC_SSF_SHOW_WINDOW);
  }

  hide() {
    return this.sendWindowAction(IPC_SSF_HIDE_WINDOW);
  }

  focus() {
    return this.sendWindowAction(IPC_SSF_FOCUS_WINDOW);
  }

  blur() {
    return this.sendWindowAction(IPC_SSF_BLUR_WINDOW);
  }

  sendWindowAction(action) {
    return new Promise((resolve, reject) => {
      const nonce = generateNonce();
      const successEvent = `${action}${IpcModifiers.SUCCESS}-${nonce}`;
      const errorEvent = `${action}${IpcModifiers.ERROR}-${nonce}`;

      ipc.send(action, this.innerWindow.id, nonce);
      ipc.once(successEvent, () => {
        ipc.removeListener(errorEvent, reject);
        resolve();
      });
      ipc.once(errorEvent, (error) => {
        ipc.removeListener(successEvent, resolve);
        reject(new Error(error));
      });
    });
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
      const index = listeners.indexOf(listener);
      if (index >= 0) {
        listeners.splice(index, 1);
        this.eventListeners.set(event, listeners);
      }
    }
  }

  removeAllListeners() {
    this.eventListeners.clear();
  }

  postMessage(message) {
    MessageService.send(this.innerWindow.id, 'ssf-window-message', message);
  }

  static getCurrentWindowId() {
    return ipc.sendSync(IPC_SSF_GET_WINDOW_ID);
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
