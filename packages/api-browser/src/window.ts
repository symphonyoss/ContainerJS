import {
  addAccessibleWindow,
  removeAccessibleWindow
} from './accessible-windows';
import { Emitter } from 'containerjs-api-utility';

const DEFAULT_OPTIONS = {
  width: 800,
  height: 600
};

let currentWindow = null;

const getWindowOffsets = (win) => {
    const xOffset = (win.outerWidth / 2);
    const yOffset = (win.outerHeight / 2);
    return [Math.floor(xOffset), Math.floor(yOffset)];
};

export class Window extends Emitter implements ssf.WindowCore {
  children: ssf.Window[];
  innerWindow: any;
  id: string;

  constructor(options?: ssf.WindowOptions, callback?: (win: Window) => void, errorCallback?: (err?: any) => void) {
    super();
    this.children = [];

    if (!options) {
      this.innerWindow = window;
      this.id = window.name;
      if (callback) {
        callback(this);
      }
    } else {
      const winOptions = Object.assign({}, DEFAULT_OPTIONS, options);
      this.innerWindow = window.open(options.url, options.name, objectToFeaturesString(winOptions));
      this.id = this.innerWindow.name;
      const [xOffset, yOffset] = getWindowOffsets(this.innerWindow);
      this.setPosition(options.x || (screen.width / 2) - xOffset, options.y || (screen.height / 2) - yOffset);

      const currentWindow = Window.getCurrentWindow();
      const childClose = () => this.innerWindow.close();

      this.innerWindow.addEventListener('beforeunload', () => {
        const index = currentWindow.children.indexOf(this);
        if (index !== -1) {
          currentWindow.children.splice(index, 1);
          currentWindow.innerWindow.removeEventListener('beforeunload', childClose);
        }
        removeAccessibleWindow(this.innerWindow.name);
      });

      if (options.child) {
        currentWindow.children.push(this);
        currentWindow.innerWindow.addEventListener('beforeunload', childClose);
      }
      addAccessibleWindow(options.name, this.innerWindow);
    }

    if (callback) {
      callback(this);
    }
  }

  close() {
    return this.asPromise<void>(() => this.innerWindow.close());
  }

  getId() {
    return this.id;
  }

  focus() {
    return this.asPromise<void>(() => this.innerWindow.focus());
  }

  blur() {
    return this.asPromise<void>(() => this.innerWindow.blur());
  }

  getBounds() {
    return this.asPromise<ssf.Rectangle>(() => ({
      x: this.innerWindow.screenX,
      y: this.innerWindow.screenY,
      width: this.innerWindow.outerWidth,
      height: this.innerWindow.outerHeight
    }));
  }

  getParentWindow() {
    return new Promise<Window>(resolve => {
      let newWin = null;
      if (window.opener) {
        newWin = Window.wrap(window.opener);
      }

      resolve(newWin);
    });
  }

  getPosition() {
    return this.asPromise<ReadonlyArray<number>>(() => [this.innerWindow.screenX, this.innerWindow.screenY]);
  }

  getSize() {
    return this.asPromise<ReadonlyArray<number>>(() => [this.innerWindow.outerWidth, this.innerWindow.outerHeight]);
  }

  getTitle() {
    return this.asPromise<string>(() => this.innerWindow.name || this.innerWindow.document.title);
  }

  // Cannot be anything but true for browser
  isMaximizable() {
    return this.asPromise<boolean>(() => true);
  }

  // Cannot be anything but true for browser
  isMinimizable() {
    return this.asPromise<boolean>(() => true);
  }

  // Cannot be anything but true for browser
  isResizable() {
    return this.asPromise<boolean>(() => true);
  }

  loadURL(url: string) {
    return this.asPromise<void>(() => location.href = url);
  }

  reload() {
    return this.asPromise<void>(() => location.reload());
  }

  setBounds(bounds: ssf.Rectangle) {
    return this.asPromise<void>(() => {
      this.innerWindow.moveTo(bounds.x, bounds.y);
      this.innerWindow.resizeTo(bounds.width, bounds.height);
    });
  }

  setPosition(x: number, y: number) {
    return this.asPromise<void>(() => this.innerWindow.moveTo(x, y));
  }

  setSize(width: number, height: number) {
     return this.asPromise<void>(() => this.innerWindow.resizeTo(width, height));
  }

  innerAddEventListener(event: string, listener: (...args: any[]) => void) {
    this.innerWindow.addEventListener(eventMap[event], listener);
  }

  innerRemoveEventListener(event: string, listener: (...args: any[]) => void) {
    this.innerWindow.removeEventListener(eventMap[event], listener);
  }

  postMessage(message: any) {
    this.innerWindow.postMessage(message, '*');
  }

  getChildWindows() {
    return new Promise<ssf.Window[]>(resolve => resolve(this.children));
  }

  asPromise<T>(fn: (...args: any[]) => any): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      if (this.innerWindow) {
        resolve(fn());
      } else {
        reject(new Error('The window does not exist or the window has been closed'));
      }
    });
  }

  static getCurrentWindow(callback?: (win: Window) => void, errorCallback?: (err?: any) => void) {
    if (currentWindow) {
      return currentWindow;
    }

    currentWindow = new Window(null, callback, errorCallback);
    return currentWindow;
  }

  static wrap(win: BrowserWindow) {
    const wrappedWindow = new Window();
    wrappedWindow.innerWindow = win;
    wrappedWindow.id = String(win.name);
    return wrappedWindow;
  }
}

const objectToFeaturesString = (features: ssf.WindowOptions) => {
  return Object.keys(features).map((key) => {
    let value = features[key];

    // Need to convert booleans to yes/no
    if (value === true) {
      value = 'yes';
    } else if (value === false) {
      value = 'no';
    }

    return `${key}=${value}`;
  }).join(',');
};

const eventMap = {
  'blur': 'blur',
  'close': 'beforeunload',
  'closed': 'unload',
  'focus': 'focus',
  'hide': 'hidden',
  'message': 'message',
  'show': 'load'
};
