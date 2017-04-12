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

const windowStates = {
  MAXIMIZED: 'maximized',
  MINIMIZED: 'minimized',
  RESTORED: 'restored'
};

const checkWindowOpen = (win, windowMethod, reject) => {
  if (win) {
    return windowMethod();
  } else {
    return reject(new Error('window does not exist'));
  }
};

class Window {
  constructor(...args) {
    this.children = [];
    if (args.length === 0) {
      this.innerWindow = fin.desktop.Window.getCurrent();
    } else {
      const [url, name, options] = args;

      let newWindow;
      const handleError = (error) => console.error('Error creating window: ' + error);

      const convertedOptions = {};

      Object.keys(optionsMap).forEach((key) => {
        const openfinOption = optionsMap[key];
        convertedOptions[openfinOption] = options[key];
      });

      const mergedOptions = Object.assign(
        {},
        convertedOptions,
        options
      );

      if (options.transparent) {
        // OpenFin needs opacity between 1 (not transparent) and 0 (fully transparent)
        mergedOptions.opacity = options.transparent === true ? 0 : 1;
      }

      mergedOptions.showTaskbarIcon = !options.skipTaskbar;

      if (mergedOptions.child) {
        const childOptions = Object.assign(
          {},
          mergedOptions,
          {
            name,
            url
          }
        );

        newWindow = new fin.desktop.Window(childOptions);

        const currentWindow = Window.getCurrentWindow();

        currentWindow.children.push(this);
      } else {
        // UUID must be the same as name
        const uuid = name;

        const app = new fin.desktop.Application({
          name,
          url,
          uuid,
          mainWindowOptions: mergedOptions
        }, () => app.run(), handleError);

        // Need to return the window object, not the application
        newWindow = app.getWindow();
      }
      this.innerWindow = newWindow;
    }

    this.eventListeners = new Map();
    MessageService.subscribe('*', 'ssf-window-message', (...args) => {
      const event = 'message';
      if (this.eventListeners.has(event)) {
        this.eventListeners.get(event).forEach(listener => listener(...args));
      }
    });
  }

  blur() {
    return new Promise((resolve, reject) => checkWindowOpen(this.innerWindow, () => this.innerWindow.blur(resolve, reject), reject));
  }

  close() {
    return new Promise((resolve, reject) => {
      checkWindowOpen(this.innerWindow, () => this.innerWindow.close(false, resolve, reject), reject);
      this.innerWindow = undefined;
    });
  }

  flashFrame(flag) {
    if (flag) {
      return new Promise((resolve, reject) => checkWindowOpen(this.innerWindow, () => this.innerWindow.flash({}, resolve, reject), reject));
    } else {
      return new Promise((resolve, reject) => checkWindowOpen(this.innerWindow, () => this.innerWindow.stopFlashing(resolve, reject), reject));
    }
  }

  focus() {
    return new Promise((resolve, reject) => checkWindowOpen(this.innerWindow, () => this.innerWindow.focus(resolve, reject), reject));
  }

  getBounds() {
    return new Promise((resolve, reject) => checkWindowOpen(this.innerWindow, () => this.innerWindow.getBounds((bounds) => {
      resolve({
        x: bounds.left,
        y: bounds.top,
        width: bounds.width,
        height: bounds.height
      });
    }, reject), reject));
  }

  getChildWindows() {
    return this.children;
  }

  getMaximumSize() {
    return this.getOptions()
      .then((options) => {
        return [options.maxWidth, options.maxHeight];
      });
  }

  getMinimumSize() {
    return this.getOptions()
      .then((options) => {
        return [options.minWidth, options.minHeight];
      });
  }

  getOptions() {
    return new Promise((resolve, reject) => checkWindowOpen(this.innerWindow, () => this.innerWindow.getOptions(resolve, reject), reject));
  }

  getParentWindow() {
    return checkWindowOpen(this.innerWindow, () => {
      const parent = this.innerWindow.getParentWindow();

      if (parent.name === this.innerWindow.name) {
        return null;
      }

      return parent;
    }, (error) => { console.log(error); });
  }

  getPosition() {
    return this.getBounds()
      .then((bounds) => {
        return [bounds.left, bounds.top];
      });
  }

  getSize() {
    return this.getBounds()
      .then((bounds) => {
        return [bounds.width, bounds.height];
      });
  }

  getTitle() {
    return this.getOptions()
      .then((options) => {
        return options.title;
      });
  }

  getState() {
    return new Promise((resolve, reject) => checkWindowOpen(this.innerWindow, () => this.innerWindow.getState(resolve, reject), reject));
  }

  hasShadow() {
    return this.getOptions()
      .then((options) => {
        console.log(options);
        return options.shadow;
      });
  }

  hide() {
    return new Promise((resolve, reject) => checkWindowOpen(this.innerWindow, () => this.innerWindow.hide(resolve, reject), reject));
  }

  isAlwaysOnTop() {
    return this.getOptions()
      .then((options) => {
        return options.alwaysOnTop;
      });
  }

  isMaximizable() {
    return this.getOptions()
      .then((options) => {
        return options.maximizable;
      });
  }

  isMaximized() {
    return this.getState()
      .then((state) => {
        return state === windowStates.MAXIMIZED;
      });
  }

  isMinimizable() {
    return this.getOptions()
      .then((options) => {
        return options.minimizable;
      });
  }

  isMinimized() {
    return this.getState()
      .then((state) => {
        return state === windowStates.MINIMIZED;
      });
  }

  isResizable() {
    return this.getOptions()
      .then((options) => {
        return options.resizable;
      });
  }

  loadURL(url) {
    return new Promise((resolve, reject) => checkWindowOpen(this.innerWindow, () => this.innerWindow.executeJavaScript(`window.location = '${url}'`, resolve, reject), reject));
  }

  reload() {
    return new Promise((resolve, reject) => checkWindowOpen(this.innerWindow, () => this.innerWindow.executeJavaScript('window.location.reload()', resolve, reject), reject));
  }

  restore() {
    return new Promise((resolve, reject) => checkWindowOpen(this.innerWindow, () => this.innerWindow.restore(resolve, reject), reject));
  }

  setAlwaysOnTop(alwaysOnTop) {
    return this.updateOptions({ alwaysOnTop });
  }

  setBounds(bounds) {
    return new Promise((resolve, reject) => checkWindowOpen(this.innerWindow, () => this.innerWindow.setBounds(bounds.x, bounds.y, bounds.width, bounds.height, resolve, reject), reject));
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
    return new Promise((resolve, reject) => checkWindowOpen(this.innerWindow, () => this.innerWindow.moveTo(x, y, resolve, reject), reject));
  }

  setResizable(resizable) {
    return this.updateOptions({ resizable });
  }

  setSize(width, height) {
    return new Promise((resolve, reject) => checkWindowOpen(this.innerWindow, () => this.innerWindow.resizeTo(width, height, 'top-left', resolve, reject), reject));
  }

  setSkipTaskbar(skipTaskbar) {
    return this.updateOptions({ showTaskbarIcon: !skipTaskbar });
  }

  show() {
    return new Promise((resolve, reject) => checkWindowOpen(this.innerWindow, () => this.innerWindow.show(false, resolve, reject), reject));
  }

  maximize() {
    return new Promise((resolve, reject) => checkWindowOpen(this.innerWindow, () => this.innerWindow.maximize(resolve, reject), reject));
  }

  minimize() {
    return new Promise((resolve, reject) => checkWindowOpen(this.innerWindow, () => this.innerWindow.minimize(resolve, reject), reject));
  }

  unmaximize() {
    return this.restore();
  }

  updateOptions(options) {
    return new Promise((resolve, reject) => checkWindowOpen(this.innerWindow, () => this.innerWindow.updateOptions(options, resolve, reject), reject));
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

  static getCurrentWindow() {
    if (currentWindow) {
      return currentWindow;
    }

    currentWindow = new Window();
    return currentWindow;
  }
}

export default Window;
