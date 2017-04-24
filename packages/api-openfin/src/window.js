let currentWindow = null;
import MessageService from './message-service';

const eventMap = {
  'auth-requested': 'auth-requested',
  'blur': 'blurred',
  'move': 'bounds-changed',
  'resize': 'bounds-changed',
  'bounds-changing': 'bounds-changing',
  'close-requested': 'close-requested',
  'close': 'closed',
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

const convertOptions = (options) => {
  let clonedOptions = Object.assign({}, options);

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
    if (clonedOptions[optionKey]) {
      clonedOptions[openFinOptionKey] = clonedOptions[optionKey];
      delete clonedOptions[optionKey];
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

  return clonedOptions;
};

class Window {
  constructor(options, callback, errorCallback) {
    this.children = [];

    this.eventListeners = new Map();
    MessageService.subscribe('*', 'ssf-window-message', (...args) => {
      const event = 'message';
      if (this.eventListeners.has(event)) {
        this.eventListeners.get(event).forEach(listener => listener(...args));
      }
    });

    if (!options) {
      this.innerWindow = fin.desktop.Window.getCurrent();
      if (callback) {
        callback();
      }
      return this;
    }

    MessageService.subscribe('*', 'test2', (message) => console.log(message));

    const openFinOptions = convertOptions(options);

    if (openFinOptions.child) {
      const currentWindow = Window.getCurrentWindow();
      currentWindow.children.push(this);
      this.innerWindow = new fin.desktop.Window(openFinOptions, callback, errorCallback);
    } else {
      const appOptions = {
        name: openFinOptions.name,
        url: openFinOptions.url,
        uuid: openFinOptions.name, // UUID must be the same as name
        mainWindowOptions: openFinOptions
      };

      const app = new fin.desktop.Application(appOptions, (successObject) => {
        app.run();
        this.innerWindow = app.getWindow();
        if (callback) {
          callback(successObject);
        }
      }, errorCallback);
    }
  }

  asPromise(fn, ...args) {
    return new Promise((resolve, reject) => {
      if (this.innerWindow) {
        const openFinFunction = this.innerWindow[fn];
        openFinFunction.call(this.innerWindow, ...args, resolve, reject);
      } else {
        reject(new Error('The window does not exist or the window has been closed'));
      }
    });
  }

  blur() {
    return this.asPromise('blur');
  }

  close() {
    return this.asPromise('close', false)
      .then(() => {
        this.innerWindow = undefined;
      });
  }

  flashFrame(flag) {
    if (flag) {
      return this.asPromise('flash', {});
    } else {
      return this.asPromise('stopFlashing');
    }
  }

  focus() {
    return this.asPromise('focus');
  }

  getBounds() {
    return this.asPromise('getBounds')
      .then(bounds => ({
        x: bounds.left,
        y: bounds.top,
        width: bounds.width,
        height: bounds.height
      }));
  }

  getChildWindows() {
    return this.children;
  }

  getMaximumSize() {
    return this.getOptions()
      .then((options) => [options.maxWidth, options.maxHeight]);
  }

  getMinimumSize() {
    return this.getOptions()
      .then((options) => [options.minWidth, options.minHeight]);
  }

  getOptions() {
    return this.asPromise('getOptions');
  }

  getParentWindow() {
    if (this.innerWindow) {
      const parent = this.innerWindow.getParentWindow();

      if (parent.name === this.innerWindow.name) {
        return null;
      }

      return parent;
    } else {
      console.log(new Error('The window does not exist or the window has been closed'));
    }
  }

  getPosition() {
    return this.getBounds()
      .then((bounds) => [bounds.left, bounds.top]);
  }

  getSize() {
    return this.getBounds()
      .then((bounds) => [bounds.width, bounds.height]);
  }

  getTitle() {
    return this.getOptions()
      .then((options) => options.title);
  }

  getState() {
    return this.asPromise('getState');
  }

  hasShadow() {
    return this.getOptions()
      .then((options) => options.shadow);
  }

  hide() {
    return this.asPromise('hide');
  }

  isAlwaysOnTop() {
    return this.getOptions()
      .then((options) => options.alwaysOnTop);
  }

  isMaximizable() {
    return this.getOptions()
      .then((options) => options.maximizable);
  }

  isMaximized() {
    return this.getState()
      .then((state) => state === windowStates.MAXIMIZED);
  }

  isMinimizable() {
    return this.getOptions()
      .then((options) => options.minimizable);
  }

  isMinimized() {
    return this.getState()
      .then((state) => state === windowStates.MINIMIZED);
  }

  isResizable() {
    return this.getOptions()
      .then((options) => options.resizable);
  }

  loadURL(url) {
    return this.asPromise('executeJavaScript', `window.location = '${url}'`);
  }

  reload() {
    return this.asPromise('executeJavaScript', 'window.location.reload()');
  }

  restore() {
    return this.asPromise('restore');
  }

  setAlwaysOnTop(alwaysOnTop) {
    return this.updateOptions({ alwaysOnTop });
  }

  setBounds(bounds) {
    return this.asPromise('setBounds', bounds.x, bounds.y, bounds.width, bounds.height);
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
    return this.asPromise('moveTo', x, y);
  }

  setResizable(resizable) {
    return this.updateOptions({ resizable });
  }

  setSize(width, height) {
    return this.asPromise('resizeTo', width, height);
  }

  setSkipTaskbar(skipTaskbar) {
    return this.updateOptions({ showTaskbarIcon: !skipTaskbar });
  }

  show() {
    return this.asPromise('show', false);
  }

  maximize() {
    return this.asPromise('maximize');
  }

  minimize() {
    return this.asPromise('minimize');
  }

  unmaximize() {
    return this.restore();
  }

  updateOptions(options) {
    return this.asPromise('updateOptions', options);
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
  }

  removeListener(event, listener) {
    if (this.eventListeners.has(event)) {
      let listeners = this.eventListeners.get(event);
      let index = listeners.indexOf(listener);
      if (index >= 0) {
        listeners = listeners.splice(index, 1);
        this.eventListeners.set(listeners);
      }
    }

    this.innerWindow.removeEventListener(eventMap[event], listener);
  }

  removeAllListeners() {
    this.eventListeners.forEach((value, key) => {
      value.forEach((listener) => {
        this.innerWindow.removeEventListener(key, listener);
      });
    });

    this.eventListeners.clear();
  }

  postMessage(message) {
    MessageService.send(`${this.innerWindow.uuid}:${this.innerWindow.name}`, 'ssf-window-message', message);
  }

  static getCurrentWindowId() {
    const currentWin = fin.desktop.Window.getCurrent();
    return `${currentWin.uuid}:${currentWin.name}`;
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
