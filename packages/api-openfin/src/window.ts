let currentWindow = null;
import MessageService from './message-service';
import createMainProcess from './main-process';

const eventMap = {
  'auth-requested': 'auth-requested',
  'blur': 'blurred',
  'move': 'bounds-changed',
  'resize': 'bounds-changed',
  'bounds-changing': 'bounds-changing',
  'close': 'close-requested',
  'closed': 'closed',
  'disabled-frame-bounds-changed': 'disabled-frame-bounds-changed',
  'disabled-frame-bounds-changing': 'disabled-frame-bounds-changing',
  'embedded': 'embedded',
  'external-process-exited': 'external-process-exited',
  'external-process-started': 'external-process-started',
  'focus': 'focused',
  'frame-disabled': 'frame-disabled',
  'frame-enabled': 'frame-enabled',
  'group-changed': 'group-changed',
  'hide': 'hidden',
  'initialized': 'initialized',
  'maximize': 'maximized',
  'message': 'message',
  'minimize': 'minimized',
  'navigation-rejected': 'navigation-rejected',
  'restore': 'restored',
  'show-requested': 'show-requested',
  'show': 'shown'
};

const windowStates = {
  MAXIMIZED: 'maximized',
  MINIMIZED: 'minimized',
  RESTORED: 'restored'
};

const DEFAULT_WIDTH = 800;
const DEFAULT_HEIGHT = 600;

const isUrlPattern = /^https?:\/\//i;

const guid = () => {
  const s4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  };
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
};

const getDefaultOptions = () => ({
  name: guid(),
  autoShow: true
});

const convertOptions = (options: ssf.WindowOptions) => {
  const frameSize = navigator.appVersion.indexOf('Win') !== -1 ? 20 : 25;
  const clonedOptions: any = Object.assign({}, getDefaultOptions(), options);

  const optionsMap = {
    'alwaysOnTop': 'alwaysOnTop',
    'backgroundColor': 'backgroundColor',
    'child': 'child',
    'center': 'defaultCentered',
    'frame': 'frame',
    'hasShadow': 'shadow',
    'height': 'defaultHeight',
    'maxHeight': 'maxHeight',
    'maximizable': 'maximizable',
    'maxWidth': 'maxWidth',
    'minHeight': 'minHeight',
    'minimizable': 'minimizable',
    'minWidth': 'minWidth',
    'resizable': 'resizable',
    'show': 'autoShow',
    'skipTaskbar': 'showTaskbarIcon',
    'transparent': 'opacity',
    'width': 'defaultWidth',
    'x': 'defaultLeft',
    'y': 'defaultTop'
  };

  Object.keys(optionsMap).forEach((optionKey) => {
    const openFinOptionKey = optionsMap[optionKey];
    if (clonedOptions[optionKey] != null) {
      clonedOptions[openFinOptionKey] = clonedOptions[optionKey];
      if (openFinOptionKey !== optionKey) {
        delete clonedOptions[optionKey];
      }
    }
  });

  if (clonedOptions.transparent) {
    // OpenFin needs opacity between 1 (not transparent) and 0 (fully transparent)
    clonedOptions.opacity = clonedOptions.transparent === true ? 0 : 1;
    delete clonedOptions.transparent;
  }

  if (clonedOptions.skipTaskbar) {
    clonedOptions.showTaskbarIcon = !clonedOptions.skipTaskbar;
    delete clonedOptions.skipTaskbar;
  }

  if (clonedOptions.defaultLeft == null || clonedOptions.defaultTop == null) {
    // Electron requires both x and y to be defined else it centers the window even if center is false
    clonedOptions.defaultCentered = true;
  }

  if (clonedOptions.defaultWidth == null) {
    clonedOptions.defaultWidth = DEFAULT_WIDTH;
  }

  if (clonedOptions.defaultHeight == null) {
    clonedOptions.defaultHeight = DEFAULT_HEIGHT;
  }

  if (clonedOptions.maxHeight != null && clonedOptions.frame !== false) {
    clonedOptions.maxHeight += frameSize;
  }

  if (clonedOptions.minHeight != null && clonedOptions.frame !== false) {
    clonedOptions.minHeight += frameSize;
  }

  return clonedOptions;
};

class Window implements ssf.Window {
  eventListeners: Map<string, ((...args: any[]) => void)[]> = new Map();
  innerWindow: fin.OpenFinWindow;
  id: string;

  constructor(options?: ssf.WindowOptions, callback?: any, errorCallback?: any) {
    MessageService.subscribe('*', 'ssf-window-message', (...args) => {
      const event = 'message';
      if (this.eventListeners.has(event)) {
        this.eventListeners.get(event).forEach(listener => listener(...args));
      }
    });

    if (!options) {
      this.innerWindow = fin.desktop.Window.getCurrent();
      this.id = `${this.innerWindow.uuid}:${this.innerWindow.name}`;
      if (callback) {
        callback(this);
      }
      return this;
    }

    const openFinOptions = convertOptions(options);

    // Allow relative urls (e.g. /index.html and demo/demo.html)
    if (!isUrlPattern.test(options.url) && openFinOptions.url !== 'about:blank') {
      if (openFinOptions.url.startsWith('/')) {
        // File at root
        openFinOptions.url = location.origin + openFinOptions.url;
      } else {
        // relative to current file
        const pathSections = location.pathname.split('/').filter(x => x);
        pathSections.splice(-1);
        const currentPath = pathSections.join('/');
        openFinOptions.url = location.origin + '/' + currentPath + openFinOptions.url;
      }
    }

    fin.desktop.Window.getCurrent().getOptions((options) => {
      openFinOptions.preload = options.preload;
        const appOptions = {
        name: openFinOptions.name,
        url: openFinOptions.url,
        uuid: openFinOptions.name, // UUID must be the same as name
        mainWindowOptions: openFinOptions
      };

      const app = new fin.desktop.Application(appOptions, (successObject) => {
        app.run();
        this.innerWindow = app.getWindow();
        this.id = `${this.innerWindow.uuid}:${this.innerWindow.name}`;

        fin.desktop.InterApplicationBus.publish('ssf-new-window', {
          windowName: this.innerWindow.uuid,
          parentName: openFinOptions.child ? Window.getCurrentWindow().innerWindow.uuid : null
        });

        if (callback) {
          callback(this);
        }
      }, errorCallback);
    });
  }

  asPromise<T>(fn, ...args): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      if (this.innerWindow) {
        const openFinFunction = this.innerWindow[fn];
        openFinFunction.call(this.innerWindow, ...args, resolve, reject);
      } else {
        reject(new Error('The window does not exist or the window has been closed'));
      }
    });
  }

  blur() {
    return this.asPromise<void>('blur');
  }

  close(force = false) {
    return this.asPromise<void>('close', force)
      .then(() => {
        this.innerWindow = undefined;
      });
  }

  flashFrame(flag) {
    if (flag) {
      return this.asPromise<void>('flash', {});
    } else {
      return this.asPromise<void>('stopFlashing');
    }
  }

  focus() {
    return this.asPromise<void>('focus');
  }

  getBounds() {
    return this.asPromise<ssf.Rectangle>('getBounds')
      .then((bounds: any) => ({
        x: bounds.left,
        y: bounds.top,
        width: bounds.width,
        height: bounds.height
      }));
  }

  getChildWindows() {
    return new Promise<Window[]>(resolve => {
      const subscribeListener = (names) => {
        fin.desktop.InterApplicationBus.unsubscribe('*' , 'ssf-child-windows', subscribeListener);
        const children = [];
        names.forEach((name) => {
          const childWin = Window.getById(name);
          children.push(childWin);
        });
        resolve(children);
      };

      fin.desktop.InterApplicationBus.publish('ssf-get-child-windows', this.innerWindow.uuid);
      fin.desktop.InterApplicationBus.subscribe('*' , 'ssf-child-windows', subscribeListener);
    });
  }

  getId() {
    return this.id;
  }

  getMaximumSize() {
    return this.getOptions()
      .then((options: any) => [options.maxWidth, options.maxHeight]);
  }

  getMinimumSize() {
    return this.getOptions()
      .then((options: any) => [options.minWidth, options.minHeight]);
  }

  getOptions() {
    return this.asPromise<any>('getOptions');
  }

  getParentWindow() {
    return new Promise<Window>((resolve, reject) => {

      const subscribeListener = (name) => {
        fin.desktop.InterApplicationBus.unsubscribe('*', 'ssf-parent-window', subscribeListener);
        if (name === null) {
          resolve(null);
          return;
        }
        const parentWin = Window.getById(name);
        resolve(parentWin);
      };

      fin.desktop.InterApplicationBus.publish('ssf-get-parent-window', this.innerWindow.uuid);
      fin.desktop.InterApplicationBus.subscribe('*' , 'ssf-parent-window', subscribeListener);
    });
  }

  getPosition() {
    return this.getBounds()
      .then((bounds: any) => [bounds.x, bounds.y]);
  }

  getSize() {
    return this.getBounds()
      .then((bounds: any) => [bounds.width, bounds.height]);
  }

  getTitle() {
    return this.getOptions()
      .then((options: any) => options.title);
  }

  getState() {
    return this.asPromise<any>('getState');
  }

  hasShadow() {
    return this.getOptions()
      .then((options: any) => options.shadow);
  }

  hide() {
    return this.asPromise<void>('hide');
  }

  isAlwaysOnTop() {
    return this.getOptions()
      .then((options: any) => options.alwaysOnTop);
  }

  isMaximizable() {
    return this.getOptions()
      .then((options: any) => options.maximizable);
  }

  isMaximized() {
    return this.getState()
      .then((state: any) => state === windowStates.MAXIMIZED);
  }

  isMinimizable() {
    return this.getOptions()
      .then((options: any) => options.minimizable);
  }

  isMinimized() {
    return this.getState()
      .then((state: any) => state === windowStates.MINIMIZED);
  }

  isResizable() {
    return this.getOptions()
      .then((options: any) => options.resizable);
  }

  isVisible() {
    return this.asPromise<boolean>('isShowing');
  }

  loadURL(url) {
    return this.asPromise<void>('executeJavaScript', `window.location = '${url}'`);
  }

  reload() {
    return this.asPromise<void>('reload');
  }

  restore() {
    return this.asPromise<void>('restore');
  }

  setAlwaysOnTop(alwaysOnTop) {
    return this.updateOptions({ alwaysOnTop });
  }

  setBounds(bounds) {
    return this.asPromise<void>('setBounds', bounds.x, bounds.y, bounds.width, bounds.height);
  }

  setIcon(icon) {
    return this.updateOptions({ icon });
  }

  setMaximizable(maximizable) {
    return this.updateOptions({ maximizable });
  }

  setMaximumSize(maxWidth, maxHeight) {
    return this.updateOptions({ maxWidth, maxHeight });
  }

  setMinimizable(minimizable) {
    return this.updateOptions({ minimizable });
  }

  setMinimumSize(minWidth, minHeight) {
    return this.updateOptions({ minWidth, minHeight });
  }

  setPosition(x, y) {
    return this.asPromise<void>('moveTo', x, y);
  }

  setResizable(resizable) {
    return this.updateOptions({ resizable });
  }

  setSize(width, height) {
    return this.asPromise<void>('resizeTo', width, height, 'top-left');
  }

  setSkipTaskbar(skipTaskbar) {
    return this.updateOptions({ showTaskbarIcon: !skipTaskbar });
  }

  show() {
    return this.asPromise<void>('show', false);
  }

  maximize() {
    return this.asPromise<void>('maximize');
  }

  minimize() {
    return this.asPromise<void>('minimize');
  }

  unmaximize() {
    return this.restore();
  }

  updateOptions(options) {
    return this.asPromise<void>('updateOptions', options);
  }

  addListener(event, listener) {
    if (this.eventListeners.has(event)) {
      const temp = this.eventListeners.get(event);
      temp.push(listener);
      this.eventListeners.set(event, temp);
    } else {
      this.eventListeners.set(event, [listener]);
    }
    this.innerWindow.addEventListener(eventMap[event], listener);
    return this;
  }

  on(event, listener) {
    return this.addListener(event, listener);
  }

  eventNames() {
    return Array.from(this.eventListeners.keys());
  }

  listenerCount(event) {
    return this.eventListeners.has(event) ? this.eventListeners.get(event).length : 0;
  }

  listeners(event) {
    return this.eventListeners.get(event);
  }

  once(event, listener) {
    // Remove the listener once it is called
    const unsubscribeListener = (evt) => {
      this.removeListener(event, unsubscribeListener);
      listener(evt);
    };

    this.on(event, unsubscribeListener);
    return this;
  }

  removeListener(event, listener) {
    if (this.eventListeners.has(event)) {
      const listeners = this.eventListeners.get(event);
      const index = listeners.indexOf(listener);
      if (index >= 0) {
        listeners.splice(index, 1);
        listeners.length > 0
          ? this.eventListeners.set(event, listeners)
          : this.eventListeners.delete(event);
      }
    }

    this.innerWindow.removeEventListener(eventMap[event], listener);
    return this;
  }

  removeAllListeners(eventName) {
    const removeAllListenersForEvent = (event) => {
      if (this.eventListeners.has(event)) {
        this.eventListeners.get(event).forEach((listener) => {
          this.innerWindow.removeEventListener(eventMap[event], listener);
        });
        this.eventListeners.delete(event);
      }
    };

    if (eventName) {
      removeAllListenersForEvent(eventName);
    } else {
      this.eventListeners.forEach((value, key) => removeAllListenersForEvent(key));
    }

    return this;
  }

  postMessage(message) {
    MessageService.send(`${this.innerWindow.uuid}:${this.innerWindow.name}`, 'ssf-window-message', message);
  }

  static getCurrentWindow(callback?: any, errorCallback?: any) {
    if (currentWindow) {
      return currentWindow;
    }

    currentWindow = new Window(null, callback, errorCallback);
    return currentWindow;
  }

  static wrap(win: fin.OpenFinWindow) {
    const wrappedWin = new Window();
    wrappedWin.innerWindow = win;
    wrappedWin.id = win.uuid + ':' + win.name;
    return wrappedWin;
  }

  static getById(id: string) {
    const appExists = (uuid): Promise<boolean> => {
      return new Promise<boolean>(resolve => {
        fin.desktop.System.getAllApplications((apps) => {
          resolve(apps.filter((app) => app.uuid === uuid).length === 1);
        });
      });
    };

    const idRegex = '(' +    // Start group 1
            '[\w\d-]+' +     // At least 1 word character, digit or dash
            ')' +            // End group 1
            ':' +            // colon
            '\\1';            // Same string that was matched in group 1

    let app = null;
    const uuid = id.match(new RegExp(idRegex)) ? id.split(':')[0] : id;
    return appExists(uuid).then((exists) => {
      app = exists ? fin.desktop.Application.wrap(uuid) : null;
    }).then(() => {
      if (app) {
        const win = app.getWindow();
        return Window.wrap(win);
      }

      return null;
    });
  }

  static getAll() {
    return new Promise<Window[]>((resolve) => {
      const subscribeListener = (appUuids) => {
        fin.desktop.InterApplicationBus.unsubscribe('*', 'ssf-all-windows', subscribeListener);
        const windows = [];
        if (appUuids.length > 0) {
          appUuids.forEach((uuid) => {
            windows.push(Window.getById(uuid));
          });
        }

        resolve(windows);
      };

      fin.desktop.InterApplicationBus.publish('ssf-get-all-windows', '');
      fin.desktop.InterApplicationBus.subscribe('*' , 'ssf-all-windows', subscribeListener);
    });
  }
}

export default Window;
