const {
  ipcRenderer: ipc,
  remote
} = require('electron');
const { BrowserWindow, nativeImage } = remote;
const request = remote.require('request');
import MessageService from './message-service';
import { IpcMessages } from '../common/constants';

let currentWindow = null;

class Window implements ssf.Window {
  innerWindow: Electron.BrowserWindow;
  id: string;

  constructor(options: ssf.WindowOptions, callback, errorCallback) {
    MessageService.subscribe('*', 'ssf-window-message', (...args) => {
      const event = 'message';
      this.innerWindow.emit(event, ...args);
    });

    if (!options) {
      this.innerWindow = remote.getCurrentWindow();
      this.id = String(this.innerWindow.id);
      if (callback) {
        callback(this);
      }
      return this;
    }

    const features = Object.assign({}, options, { title: options.name });

    this.id = ipc.sendSync(IpcMessages.IPC_SSF_NEW_WINDOW, {
      url: features.url,
      name: features.name,
      features
    });
    this.innerWindow = BrowserWindow.fromId(parseInt(this.id));

    if (callback) {
      callback(this);
    }
  }

  blur() {
    return this.asPromise<void>(this.innerWindow.blur);
  }

  close() {
    return this.asPromise<void>(this.innerWindow.close);
  }

  flashFrame(flag) {
    return this.asPromise<void>(this.innerWindow.flashFrame, flag);
  }

  focus() {
    return this.asPromise<void>(this.innerWindow.focus);
  }

  getBounds() {
    return this.asPromise<ssf.Rectangle>(this.innerWindow.getBounds);
  }

  getId() {
    return this.id;
  }

  getMaximumSize() {
    return this.asPromise<ReadonlyArray<number>>(this.innerWindow.getMaximumSize);
  }

  getMinimumSize() {
    return this.asPromise<ReadonlyArray<number>>(this.innerWindow.getMinimumSize);
  }

  getParentWindow() {
    return this.asPromise<Electron.BrowserWindow>(this.innerWindow.getParentWindow).then((win) => {
      if (win) {
        const parentWin = new Window(null, null, null);
        parentWin.innerWindow = win;
        parentWin.id = String(win.id);
        return parentWin;
      }
      return null;
    });
  }

  getPosition() {
    return this.asPromise<ReadonlyArray<number>>(this.innerWindow.getPosition);
  }

  getSize() {
    return this.asPromise<ReadonlyArray<number>>(this.innerWindow.getSize);
  }

  getTitle() {
    return this.asPromise<string>(this.innerWindow.getTitle);
  }

  hasShadow() {
    return this.asPromise<boolean>(this.innerWindow.hasShadow);
  }

  hide() {
    return this.asPromise<void>(this.innerWindow.hide);
  }

  isAlwaysOnTop() {
    return this.asPromise<boolean>(this.innerWindow.isAlwaysOnTop);
  }

  isMaximizable() {
    return this.asPromise<boolean>(this.innerWindow.isMaximizable);
  }

  isMaximized() {
    return this.asPromise<boolean>(this.innerWindow.isMaximized);
  }

  isMinimizable() {
    return this.asPromise<boolean>(this.innerWindow.isMinimizable);
  }

  isMinimized() {
    return this.asPromise<boolean>(this.innerWindow.isMinimized);
  }

  isResizable() {
    return this.asPromise<boolean>(this.innerWindow.isResizable);
  }

  isVisible() {
    return this.asPromise<boolean>(this.innerWindow.isVisible);
  }

  loadURL(url) {
    return this.asPromise<void>(this.innerWindow.loadURL, url);
  }

  maximize() {
    return this.asPromise<void>(this.innerWindow.maximize);
  }

  minimize() {
    return this.asPromise<void>(this.innerWindow.minimize);
  }

  reload() {
    return this.asPromise<void>(this.innerWindow.reload);
  }

  restore() {
    return this.asPromise<void>(this.innerWindow.restore);
  }

  setAlwaysOnTop(alwaysOnTop) {
    return this.asPromise<void>(this.innerWindow.setAlwaysOnTop, alwaysOnTop);
  }

  setBounds(bounds) {
    return this.asPromise<void>(this.innerWindow.setBounds, bounds);
  }

  setIcon(icon) {
    const req = request.defaults({ encoding: null });
    return new Promise<void>((resolve, reject) => {
        req.get(icon, (err, res, body) => {
          const image = nativeImage.createFromBuffer(Buffer.from(body));
          if (image.isEmpty()) {
            reject(new Error('Image could not be created from the URL'));
          }
          this.asPromise<void>(this.innerWindow.setIcon, image).then(() => {
            resolve();
          });
        }
      );
    });
  }

  setMaximizable(maximizable) {
    return this.asPromise<void>(this.innerWindow.setMaximizable, maximizable);
  }

  setMaximumSize(width, height) {
    return this.asPromise<void>(this.innerWindow.setMaximumSize, width, height);
  }

  setMinimizable(minimizable) {
    return this.asPromise<void>(this.innerWindow.setMinimizable, minimizable);
  }

  setMinimumSize(width, height) {
    return this.asPromise<void>(this.innerWindow.setMinimumSize, width, height);
  }

  setPosition(x, y) {
    return this.asPromise<void>(this.innerWindow.setPosition, x, y);
  }

  setResizable(resizable) {
    return this.asPromise<void>(this.innerWindow.setResizable, resizable);
  }

  setSize(width, height) {
    return this.asPromise<void>(this.innerWindow.setSize, width, height);
  }

  setSkipTaskbar(skipTaskbar) {
    return this.asPromise<void>(this.innerWindow.setSkipTaskbar, skipTaskbar);
  }

  show() {
    return this.asPromise<void>(this.innerWindow.show);
  }

  unmaximize() {
    return this.asPromise<void>(this.innerWindow.unmaximize);
  }

  asPromise<T>(windowFunction, ...args): Promise<T> {
    return new Promise<T>((resolve) => {
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

  static getCurrentWindow(callback, errorCallback) {
    if (currentWindow) {
      return currentWindow;
    }

    currentWindow = new Window(null, callback, errorCallback);
    return currentWindow;
  }
}

export default Window;
