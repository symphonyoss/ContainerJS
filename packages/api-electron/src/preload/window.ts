const {
  ipcRenderer: ipc,
  remote
} = require('electron');
const { BrowserWindow, nativeImage } = remote;
const request = remote.require('request');
import { Emitter, Display } from 'containerjs-api-utility';
import { MessageService } from './message-service';
import { IpcMessages } from '../common/constants';

let currentWindow = null;
const isUrlPattern = /^https?:\/\//i;

export class Window extends Emitter implements ssf.Window {
  innerWindow: Electron.BrowserWindow;
  id: string;

  constructor(options?: ssf.WindowOptions, callback?: (window: Window) => void, errorCallback?: () => void) {
    super();

    MessageService.subscribe('*', 'ssf-window-message', (data?: any) => {
      this.emit('message', { data });
    });

    if (!options) {
      this.innerWindow = remote.getCurrentWindow();
      this.id = String(this.innerWindow.id);
      if (callback) {
        callback(this);
      }
      return this;
    }

    const electronOptions = Object.assign({}, options);

    Display.getDisplayAlteredPosition(options.display, { x: options.x || 0, y: options.y || 0 }).then(({ x, y }) => {
      if (x !== undefined) {
        electronOptions.x = x;
      }
      if (y !== undefined) {
        electronOptions.y = y;
      }

      // Allow relative urls (e.g. /index.html and demo/demo.html)
      if (!isUrlPattern.test(electronOptions.url) && electronOptions.url !== 'about:blank') {
        if (electronOptions.url.startsWith('/')) {
          // File at root
          electronOptions.url = location.origin + electronOptions.url;
        } else {
          // Relative to current file
          const pathSections = location.pathname.split('/').filter(x => x);
          pathSections.splice(-1);
          const currentPath = pathSections.join('/');
          electronOptions.url = location.origin + '/' + currentPath + electronOptions.url;
        }
      }

      const features = Object.assign({}, electronOptions, { title: electronOptions.name });

      this.id = ipc.sendSync(IpcMessages.IPC_SSF_NEW_WINDOW, {
        url: features.url,
        name: features.name,
        features
      });
      this.innerWindow = BrowserWindow.fromId(parseInt(this.id));

      if (callback) {
        callback(this);
      }
    });
  }

  blur() {
    return this.asPromise<void>(this.innerWindow.blur);
  }

  close() {
    return this.asPromise<void>(this.innerWindow.close);
  }

  flashFrame(flag: boolean) {
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

  loadURL(url: string) {
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

  setAlwaysOnTop(alwaysOnTop: boolean) {
    return this.asPromise<void>(this.innerWindow.setAlwaysOnTop, alwaysOnTop);
  }

  setBounds(bounds: ssf.Rectangle) {
    return this.asPromise<void>(this.innerWindow.setBounds, bounds);
  }

  setIcon(icon: string) {
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

  setMaximizable(maximizable: boolean) {
    return this.asPromise<void>(this.innerWindow.setMaximizable, maximizable);
  }

  setMaximumSize(width: number, height: number) {
    return this.asPromise<void>(this.innerWindow.setMaximumSize, width, height);
  }

  setMinimizable(minimizable: boolean) {
    return this.asPromise<void>(this.innerWindow.setMinimizable, minimizable);
  }

  setMinimumSize(width: number, height: number) {
    return this.asPromise<void>(this.innerWindow.setMinimumSize, width, height);
  }

  setPosition(x: number, y: number) {
    return this.asPromise<void>(this.innerWindow.setPosition, x, y);
  }

  setResizable(resizable: boolean) {
    return this.asPromise<void>(this.innerWindow.setResizable, resizable);
  }

  setSize(width: number, height: number) {
    return this.asPromise<void>(this.innerWindow.setSize, width, height);
  }

  setSkipTaskbar(skipTaskbar: boolean) {
    return this.asPromise<void>(this.innerWindow.setSkipTaskbar, skipTaskbar);
  }

  show() {
    return this.asPromise<void>(this.innerWindow.show);
  }

  unmaximize() {
    return this.asPromise<void>(this.innerWindow.unmaximize);
  }

  asPromise<T>(windowFunction: (...args: any[]) => any, ...args: any[]): Promise<T> {
    return new Promise<T>((resolve) => {
      resolve(windowFunction(...args));
    });
  }

  innerAddEventListener(event: string, listener: (...args: any[]) => void) {
    this.innerWindow.addListener(event, listener);
  }

  innerRemoveEventListener(event: string, listener: (...args: any[]) => void) {
    this.innerWindow.removeListener(event, listener);
  }

  postMessage(message: any) {
    MessageService.send(this.id, 'ssf-window-message', message);
  }

  getChildWindows() {
    return new Promise<ReadonlyArray<Window>>(resolve => {
      const children = [];
      this.innerWindow.getChildWindows().forEach(win => {
        const child = new Window(null, null, null);
        child.innerWindow = win;
        child.id = String(win.id);
        children.push(child);
      });
      resolve(children);
    });
  }

  static getCurrentWindow(callback: (win: Window) => void, errorCallback: (err?: any) => void) {
    if (currentWindow) {
      callback(currentWindow);
      return currentWindow;
    }

    currentWindow = new Window(null, callback, errorCallback);
    return currentWindow;
  }

  static wrap(win: Electron.BrowserWindow) {
    const wrappedWindow = new Window();
    wrappedWindow.innerWindow = win;
    wrappedWindow.id = String(win.id);
    return wrappedWindow;
  }

  static getById(id: string) {
    return new Promise<Window>(resolve => {
      if (!isNaN(parseInt(id))) {
        const bw = BrowserWindow.fromId(parseInt(id));
        resolve(bw === null ? null : Window.wrap(bw));
        return;
      }
      resolve(null);
    });
  }

  static getAll() {
    return new Promise<Window[]>(resolve => resolve(BrowserWindow.getAllWindows().map(Window.wrap)));
  }

  capture() {
    return new Promise<string>((resolve) => {
      this.innerWindow.capturePage((image: any) => {
        const dataUri = 'data:image/png;base64,' + image.toPng().toString('base64');
        resolve(dataUri);
      });
    });
  }
}
