const ipc = require('electron').ipcRenderer;
import MessageService from './message-service';
import {
  IpcModifiers,
  IpcMessages
} from '../common/constants';

let currentWindow = null;

const generateNonce = () => {
  return Math.floor((Math.random() * 1000000));
};

class Window {
  constructor(...args) {
    this.children = [];
    if (args.length === 0) {
      this.innerWindow = {
        id: window.ssf.Window.getCurrentWindowId()
      };
    } else {
      const [url, name, features] = args;

      this.innerWindow = ipc.sendSync(IpcMessages.IPC_SSF_NEW_WINDOW, {
        url,
        name,
        features
      });

      const currentWin = Window.getCurrentWindow();

      currentWin.children.push(this);
    }

    ipc.send(IpcMessages.IPC_SSF_WINDOW_SUBSCRIBE_EVENTS, this.innerWindow.id);
    this.eventListeners = new Map();

    ipc.on(IpcMessages.IPC_SSF_WINDOW_EVENT, (windowId, e) => {
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

  blur() {
    return this.sendWindowAction(IpcMessages.IPC_SSF_BLUR_WINDOW);
  }

  close() {
    return this.sendWindowAction(IpcMessages.IPC_SSF_CLOSE_WINDOW);
  }

  flashFrame(flag) {
    return this.sendWindowAction(IpcMessages.IPC_SSF_FLASH_FRAME, flag);
  }

  focus() {
    return this.sendWindowAction(IpcMessages.IPC_SSF_FOCUS_WINDOW);
  }

  getBounds() {
    return this.sendWindowAction(IpcMessages.IPC_SSF_GET_WINDOW_BOUNDS);
  }

  getMaximumSize() {
    return this.sendWindowAction(IpcMessages.IPC_SSF_GET_WINDOW_MAXIMUM_SIZE);
  }

  getMinimumSize() {
    return this.sendWindowAction(IpcMessages.IPC_SSF_GET_WINDOW_MINIMUM_SIZE);
  }

  getParentWindow() {
    return this.sendWindowAction(IpcMessages.IPC_SSF_GET_WINDOW_PARENT);
  }

  getPosition() {
    return this.sendWindowAction(IpcMessages.IPC_SSF_GET_WINDOW_POSITION);
  }

  getSize() {
    return this.sendWindowAction(IpcMessages.IPC_SSF_GET_WINDOW_SIZE);
  }

  getTitle() {
    return this.sendWindowAction(IpcMessages.IPC_SSF_GET_WINDOW_TITLE);
  }

  hasShadow() {
    return this.sendWindowAction(IpcMessages.IPC_SSF_WINDOW_HAS_SHADOW);
  }

  hide() {
    return this.sendWindowAction(IpcMessages.IPC_SSF_HIDE_WINDOW);
  }

  isAlwaysOnTop() {
    return this.sendWindowAction(IpcMessages.IPC_SSF_IS_WINDOW_ALWAYS_ON_TOP);
  }

  isMaximizable() {
    return this.sendWindowAction(IpcMessages.IPC_SSF_IS_WINDOW_MAXIMIZABLE);
  }

  isMaximized() {
    return this.sendWindowAction(IpcMessages.IPC_SSF_IS_WINDOW_MAXIMIZED);
  }

  isMinimizable() {
    return this.sendWindowAction(IpcMessages.IPC_SSF_IS_WINDOW_MINIMIZABLE);
  }

  isMinimized() {
    return this.sendWindowAction(IpcMessages.IPC_SSF_IS_WINDOW_MINIMIZED);
  }

  isResizable() {
    return this.sendWindowAction(IpcMessages.IPC_SSF_IS_WINDOW_RESIZABLE);
  }

  loadURL(url) {
    return this.sendWindowAction(IpcMessages.IPC_SSF_LOAD_URL, url);
  }

  maximize() {
    return this.sendWindowAction(IpcMessages.IPC_SSF_MAXIMIZE_WINDOW);
  }

  minimize() {
    return this.sendWindowAction(IpcMessages.IPC_SSF_MINIMIZE_WINDOW);
  }

  reload() {
    return this.sendWindowAction(IpcMessages.IPC_SSF_RELOAD_WINDOW);
  }

  restore() {
    return this.sendWindowAction(IpcMessages.IPC_SSF_RESTORE_WINDOW);
  }

  setAlwaysOnTop(alwaysOnTop) {
    return this.sendWindowAction(IpcMessages.IPC_SSF_SET_WINDOW_ALWAYS_ON_TOP, alwaysOnTop);
  }

  setBounds(bounds) {
    return this.sendWindowAction(IpcMessages.IPC_SSF_SET_WINDOW_BOUNDS, bounds);
  }

  setIcon(icon) {
    return this.sendWindowAction(IpcMessages.IPC_SSF_SET_WINDOW_ICON, icon);
  }

  setMaximizable(maximizable) {
    return this.sendWindowAction(IpcMessages.IPC_SSF_SET_WINDOW_MAXIMIZABLE, maximizable);
  }

  setMaximumSize(width, height) {
    return this.sendWindowAction(IpcMessages.IPC_SSF_SET_WINDOW_MAXIMUM_SIZE, width, height);
  }

  setMinimizable(minimizable) {
    return this.sendWindowAction(IpcMessages.IPC_SSF_SET_WINDOW_MINIMIZABLE, minimizable);
  }

  setMinimumSize(width, height) {
    return this.sendWindowAction(IpcMessages.IPC_SSF_SET_WINDOW_MINIMUM_SIZE, width, height);
  }

  setPosition(x, y) {
    return this.sendWindowAction(IpcMessages.IPC_SSF_SET_WINDOW_POSITION, x, y);
  }

  setResizable(resizable) {
    return this.sendWindowAction(IpcMessages.IPC_SSF_SET_WINDOW_RESIZABLE, resizable);
  }

  setSize(width, height) {
    return this.sendWindowAction(IpcMessages.IPC_SSF_SET_WINDOW_SIZE, width, height);
  }

  setSkipTaskbar(skipTaskbar) {
    return this.sendWindowAction(IpcMessages.IPC_SSF_SET_WINDOW_SKIP_TASKBAR, skipTaskbar);
  }

  show() {
    return this.sendWindowAction(IpcMessages.IPC_SSF_SHOW_WINDOW);
  }

  unmaximize() {
    return this.sendWindowAction(IpcMessages.IPC_SSF_UNMAXIMIZE_WINDOW);
  }

  sendWindowAction(action, ...args) {
    return new Promise((resolve, reject) => {
      const nonce = generateNonce();
      const successEvent = `${action}${IpcModifiers.SUCCESS}-${nonce}`;
      const errorEvent = `${action}${IpcModifiers.ERROR}-${nonce}`;

      ipc.send(action, this.innerWindow.id, nonce, args);
      ipc.once(successEvent, (response) => {
        ipc.removeListener(errorEvent, reject);
        resolve(response);
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

  getChildWindows() {
    return this.children;
  }

  static getCurrentWindowId() {
    return ipc.sendSync(IpcMessages.IPC_SSF_GET_WINDOW_ID);
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
