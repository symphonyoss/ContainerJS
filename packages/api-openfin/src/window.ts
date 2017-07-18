import { Emitter, Display } from 'containerjs-api-utility';
import { MessageService } from './message-service';
import { createMainProcess } from './main-process';
import { Screen } from './screen';

let currentWindow: Window = null;

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

type WindowState = 'maximized' | 'minimized' | 'restored';

const WindowStates = {
  MAXIMIZED: 'maximized',
  MINIMIZED: 'minimized',
  RESTORED: 'restored'
};

const DEFAULT_WIDTH = 800;
const DEFAULT_HEIGHT = 600;

const isUrlPattern = /^https?:\/\//i;

const guid = (): string => {
  const s4 = (): string => {
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

const convertOptions = (options: ssf.WindowOptions): fin.WindowOptions => {
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

export class Window extends Emitter implements ssf.Window {
  innerWindow: fin.OpenFinWindow;
  id: string;

  constructor(options?: ssf.WindowOptions, callback?: (win: Window) => void, errorCallback?: (err?: any) => void) {
    super();
    MessageService.subscribe('*', 'ssf-window-message', (data?: any) => {
      this.emit('message', { data });
    });

    if (!options) {
      this.innerWindow = fin.desktop.Window.getCurrent();
      this.id = `${this.innerWindow.uuid}:${this.innerWindow.name}`;
      if (callback) {
        callback(this);
      }
      return this;
    }

    const optionsCopy = Object.assign({}, options);
    const currentPosition: ssf.Position =  { x: optionsCopy.x || 0, y: optionsCopy.y || 0 };
    Display.getDisplayAlteredPosition(optionsCopy.display, currentPosition).then(({x, y}) => {
      optionsCopy.x = x;
      optionsCopy.y = y;
      const openFinOptions = convertOptions(optionsCopy);

      // Allow relative urls (e.g. /index.html and demo/demo.html)
      if (!isUrlPattern.test(options.url) && openFinOptions.url !== 'about:blank') {
        if (openFinOptions.url.startsWith('/')) {
          // File at root
          openFinOptions.url = location.origin + openFinOptions.url;
        } else {
          // Relative to current file
          const pathSections = location.pathname.split('/').filter(x => x);
          pathSections.splice(-1);
          const currentPath = pathSections.join('/');
          openFinOptions.url = location.origin + '/' + currentPath + openFinOptions.url;
        }
      }

      fin.desktop.Window.getCurrent().getOptions((windowOptions) => {
        openFinOptions.preload = windowOptions.preload;
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
            parentName: options.child ? Window.getCurrentWindow().innerWindow.uuid : null
          });

          if (callback) {
            callback(this);
          }
        }, errorCallback);
      });
    });
  }

  asPromise<T>(fn: string, ...args: any[]): Promise<T> {
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

  close(force: boolean = false) {
    return this.asPromise<void>('close', force)
      .then(() => {
        this.innerWindow = undefined;
      });
  }

  flashFrame(flag: boolean) {
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
      .then((bounds: fin.WindowBounds) => ({
        x: bounds.left,
        y: bounds.top,
        width: bounds.width,
        height: bounds.height
      }));
  }

  getChildWindows() {
    return new Promise<Window[]>(resolve => {
      const subscribeListener = (names: string[]) => {
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
      .then((options: fin.WindowOptions) => [options.maxWidth, options.maxHeight]);
  }

  getMinimumSize() {
    return this.getOptions()
      .then((options: fin.WindowOptions) => [options.minWidth, options.minHeight]);
  }

  getOptions() {
    return this.asPromise<fin.WindowOptions>('getOptions');
  }

  getParentWindow() {
    return new Promise<Window>((resolve, reject) => {
      const subscribeListener = (name: string) => {
        fin.desktop.InterApplicationBus.unsubscribe('*', 'ssf-parent-window', subscribeListener);
        if (name === null) {
          resolve(null);
          return;
        }
        Window.getById(name).then(parentWin => resolve(parentWin));
      };

      fin.desktop.InterApplicationBus.publish('ssf-get-parent-window', this.innerWindow.uuid);
      fin.desktop.InterApplicationBus.subscribe('*' , 'ssf-parent-window', subscribeListener);
    });
  }

  getPosition() {
    return this.getBounds()
      .then((bounds: ssf.Rectangle) => [bounds.x, bounds.y]);
  }

  getSize() {
    return this.getBounds()
      .then((bounds: ssf.Rectangle) => [bounds.width, bounds.height]);
  }

  getTitle() {
    return this.getOptions()
      .then((options: fin.WindowOptions) => options.title);
  }

  getState() {
    return this.asPromise<WindowState>('getState');
  }

  hasShadow() {
    return this.getOptions()
      .then((options: fin.WindowOptions) => options.shadow);
  }

  hide() {
    return this.asPromise<void>('hide');
  }

  isAlwaysOnTop() {
    return this.getOptions()
      .then((options: fin.WindowOptions) => options.alwaysOnTop);
  }

  isMaximizable() {
    return this.getOptions()
      .then((options: fin.WindowOptions) => options.maximizable);
  }

  isMaximized() {
    return this.getState()
      .then((state: WindowState) => state === WindowStates.MAXIMIZED);
  }

  isMinimizable() {
    return this.getOptions()
      .then((options: fin.WindowOptions) => options.minimizable);
  }

  isMinimized() {
    return this.getState()
      .then((state: WindowState) => state === WindowStates.MINIMIZED);
  }

  isResizable() {
    return this.getOptions()
      .then((options: fin.WindowOptions) => options.resizable);
  }

  isVisible() {
    return this.asPromise<boolean>('isShowing');
  }

  loadURL(url: string) {
    return this.asPromise<void>('executeJavaScript', `window.location = '${url}'`);
  }

  reload() {
    return this.asPromise<void>('reload');
  }

  restore() {
    return this.asPromise<void>('restore');
  }

  setAlwaysOnTop(alwaysOnTop: boolean) {
    return this.updateOptions({ alwaysOnTop });
  }

  setBounds(bounds: ssf.Rectangle) {
    return this.asPromise<void>('setBounds', bounds.x, bounds.y, bounds.width, bounds.height);
  }

  setIcon(icon: string) {
    return this.updateOptions({ icon });
  }

  setMaximizable(maximizable: boolean) {
    return this.updateOptions({ maximizable });
  }

  setMaximumSize(maxWidth: number, maxHeight: number) {
    return this.updateOptions({ maxWidth, maxHeight });
  }

  setMinimizable(minimizable: boolean) {
    return this.updateOptions({ minimizable });
  }

  setMinimumSize(minWidth: number, minHeight: number) {
    return this.updateOptions({ minWidth, minHeight });
  }

  setPosition(x: number, y: number) {
    return this.asPromise<void>('moveTo', x, y);
  }

  setResizable(resizable: boolean) {
    return this.updateOptions({ resizable });
  }

  setSize(width: number, height: number) {
    return this.asPromise<void>('resizeTo', width, height, 'top-left');
  }

  setSkipTaskbar(skipTaskbar: boolean) {
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

  updateOptions(options: fin.WindowOptions) {
    return this.asPromise<void>('updateOptions', options);
  }

  innerAddEventListener(event: string, listener: (...args: any[]) => void) {
    this.innerWindow.addEventListener(eventMap[event], listener);
  }

  innerRemoveEventListener(event: string, listener: (...args: any[]) => void) {
    this.innerWindow.removeEventListener(eventMap[event], listener);
  }

  postMessage(message: any) {
    MessageService.send(`${this.innerWindow.uuid}:${this.innerWindow.name}`, 'ssf-window-message', message);
  }

  static getCurrentWindow(callback?: (win: Window) => void, errorCallback?: (err?: any) => void) {
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
            ':' +            // Colon
            '\\1';           // Same string that was matched in group 1

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
        const promises = [];
        if (appUuids.length > 0) {
          appUuids.forEach((uuid) => {
            promises.push(Window.getById(uuid).then((win) => windows.push(win)));
          });
        }

        Promise.all(promises).then(() => {
          resolve(windows);
        });
      };

      fin.desktop.InterApplicationBus.publish('ssf-get-all-windows', '');
      fin.desktop.InterApplicationBus.subscribe('*' , 'ssf-all-windows', subscribeListener);
    });
  }
}
