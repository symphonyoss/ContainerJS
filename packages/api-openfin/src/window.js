let currentWindow = null;

class Window {
  constructor(...args) {
    if (args.length === 0) {
      this.innerWindow = fin.desktop.Window.getCurrent();
    } else {
      const [url, name, features] = args;

      let newWindow;
      const handleError = (error) => console.error('Error creating window: ' + error);

      if (features && features.child) {
        newWindow = new fin.desktop.Window({
          name,
          url
        }, () => newWindow.show(), handleError);
      } else {
        // UUID must be the same as name
        const uuid = name;
        const mainWindowOptions = {
          autoShow: true
        };

        const app = new fin.desktop.Application({
          name,
          url,
          uuid,
          mainWindowOptions
        }, () => app.run(), handleError);

        // Need to return the window object, not the application
        newWindow = app.getWindow();
      }
      this.innerWindow = newWindow;
    }

    this.eventListeners = new Map();
  }

  close() {
    this.innerWindow.close();
  }

  hide() {
    this.innerWindow.hide();
  }

  show() {
    this.innerWindow.show();
  }

  focus() {
    this.innerWindow.focus();
  }

  blur() {
    this.innerWindow.blur();
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
        this.innerWindow.removeEventListener(eventMap[key], listener);
      });
    });

    this.eventListeners.clear();
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
  'minimize': 'minimized',
  'navigation-rejected': 'navigation-rejected',
  'restore': 'restored',
  'show-requested': 'show-requested',
  'show': 'shown'
};

export default Window;
