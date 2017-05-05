const {
  ipcRenderer: ipc,
  remote
} = require('electron');
const BrowserWindow = remote.BrowserWindow;
import MessageService from './message-service';
import { IpcMessages } from '../common/constants';

let currentWindow = null;

class Window {
  constructor(options, callback, errorCallback) {
    MessageService.subscribe('*', 'ssf-window-message', (...args) => {
      const event = 'message';
      this.innerWindow.emit(event, ...args);
    });

    if (!options) {
      this.innerWindow = remote.getCurrentWindow();
      if (callback) {
        callback();
      }
      return this;
    }

    this.id = ipc.sendSync(IpcMessages.IPC_SSF_NEW_WINDOW, {
      url: options.url,
      name: options.name,
      features: options
    });
    this.innerWindow = BrowserWindow.fromId(this.id);

    if (callback) {
      callback();
    }
  }

  blur() {
    return this.asPromise(this.innerWindow.blur);
  }

  close() {
    return this.asPromise(this.innerWindow.close);
  }

  flashFrame(flag) {
    return this.asPromise(this.innerWindow.flashFrame, flag);
  }

  focus() {
    return this.asPromise(this.innerWindow.focus);
  }

  getBounds() {
    return this.asPromise(this.innerWindow.getBounds);
  }

  getMaximumSize() {
    return this.asPromise(this.innerWindow.getMaximumSize);
  }

  getMinimumSize() {
    return this.asPromise(this.innerWindow.getMinimumSize);
  }

  getParentWindow() {
    return this.asPromise(this.innerWindow.getParentWindow);
  }

  getPosition() {
    return this.asPromise(this.innerWindow.getPosition);
  }

  getSize() {
    return this.asPromise(this.innerWindow.getSize);
  }

  getTitle() {
    return this.asPromise(this.innerWindow.getTitle);
  }

  hasShadow() {
    return this.asPromise(this.innerWindow.hasShadow);
  }

  hide() {
    return this.asPromise(this.innerWindow.hide);
  }

  isAlwaysOnTop() {
    return this.asPromise(this.innerWindow.isAlwaysOnTop);
  }

  isMaximizable() {
    return this.asPromise(this.innerWindow.isMaximizable);
  }

  isMaximized() {
    return this.asPromise(this.innerWindow.isMaximized);
  }

  isMinimizable() {
    return this.asPromise(this.innerWindow.isMinimizable);
  }

  isMinimized() {
    return this.asPromise(this.innerWindow.isMinimized);
  }

  isResizable() {
    return this.asPromise(this.innerWindow.isResizable);
  }

  loadURL(url) {
    return this.asPromise(this.innerWindow.loadURL, url);
  }

  maximize() {
    return this.asPromise(this.innerWindow.maximize);
  }

  minimize() {
    return this.asPromise(this.innerWindow.minimize);
  }

  reload() {
    return this.asPromise(this.innerWindow.reload);
  }

  restore() {
    return this.asPromise(this.innerWindow.restore);
  }

  setAlwaysOnTop(alwaysOnTop) {
    return this.asPromise(this.innerWindow.setAlwaysOnTop, alwaysOnTop);
  }

  setBounds(bounds) {
    return this.asPromise(this.innerWindow.setBounds, bounds);
  }

  setIcon(icon) {
    return this.asPromise(this.innerWindow.setIcon, icon);
  }

  setMaximizable(maximizable) {
    return this.asPromise(this.innerWindow.setMaximizable, maximizable);
  }

  setMaximumSize(width, height) {
    return this.asPromise(this.innerWindow.setMaximumSize, width, height);
  }

  setMinimizable(minimizable) {
    return this.asPromise(this.innerWindow.setMinimizable, minimizable);
  }

  setMinimumSize(width, height) {
    return this.asPromise(this.innerWindow.setMinimumSize, width, height);
  }

  setPosition(x, y) {
    return this.asPromise(this.innerWindow.setPosition, x, y);
  }

  setResizable(resizable) {
    return this.asPromise(this.innerWindow.setResizable, resizable);
  }

  setSize(width, height) {
    return this.asPromise(this.innerWindow.setSize, width, height);
  }

  setSkipTaskbar(skipTaskbar) {
    return this.asPromise(this.innerWindow.setSkipTaskbar, skipTaskbar);
  }

  show() {
    return this.asPromise(this.innerWindow.show);
  }

  unmaximize() {
    return this.asPromise(this.innerWindow.unmaximize);
  }

  asPromise(windowFunction, ...args) {
    return new Promise((resolve) => {
      resolve(windowFunction(...args));
    });
  }

  addListener(event, listener) {
    this.innerWindow.addListener(event, listener);
  }

  removeListener(event, listener) {
    this.innerWindow.removeListener(event, listener);
  }

  removeAllListeners() {
    this.innerWindow.removeAllListeners();
  }

  postMessage(message) {
    MessageService.send(this.innerWindow.id, 'ssf-window-message', message);
  }

  getChildWindows() {
    return this.innerWindow.getChildWindows();
  }

  static getCurrentWindowId() {
    return remote.getCurrentWindow().id;
  }

  static getCurrentWindow(callback, errorCallback) {
    if (currentWindow) {
      return currentWindow;
    }

    currentWindow = new Window(null, callback, errorCallback);
    return currentWindow;
  }
}

export default Window;
