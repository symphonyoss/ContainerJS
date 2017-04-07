import {
  addAccessibleWindow,
  removeAccessibleWindow
} from './accessible-windows';

let currentWindow = null;

const windowClosedError = new Error('The window does not exist or the window has been closed');

const withInnerWindow = (fn) => {
  return new Promise((resolve, reject) => {
    if (this.innerWindow) {
      fn(this.innerWindow);
      resolve();
    } else {
      reject(windowClosedError);
    }
  });
};

class Window {
  constructor(...args) {
    if (args.length === 0) {
      this.innerWindow = window;
    } else {
      const [url, name, features] = args;

      this.innerWindow = window.open(url, name, objectToFeaturesString(features));
      this.innerWindow.onclose = () => {
        removeAccessibleWindow(this.innerWindow.name);
      };

      addAccessibleWindow(name, this.innerWindow);
    }

    this.eventListeners = new Map();
    this.addListener('message', (e) => {
      const event = 'message';
      if (this.eventListeners.has(event)) {
        this.eventListeners.get(event).forEach(listener => listener(e.data));
      }
    });
  }

  close() {
    // Close only works on windows that were opened by the current window
    return withInnerWindow(innerWindow => innerWindow.close());
  }

  show() {
    // Unable to 'show' browser window
  }

  hide() {
    // Unable to 'hide' browser window
  }

  focus() {
    return withInnerWindow(innerWindow => innerWindow.focus());
  }

  blur() {
    return withInnerWindow(innerWindow => innerWindow.blur());
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
        listeners.splice(index, 1);
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

  postMessage(message) {
    this.innerWindow.postMessage(message, '*');
  }

  static getCurrentWindowId() {
    return window.name;
  };

  static getCurrentWindow() {
    if (currentWindow) {
      return currentWindow;
    }

    currentWindow = new Window();
    return currentWindow;
  }
}

const objectToFeaturesString = (features) => {
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
  'close': 'unload',
  'focus': 'focus',
  'hide': 'hidden',
  'message': 'message',
  'show': 'load'
};

export default Window;
