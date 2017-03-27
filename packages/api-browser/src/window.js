import {
  addAccessibleWindow,
  removeAccessibleWindow
} from './accessible-windows';

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
  }

  close() {
    // Close only works on windows that were opened by the current window
    if (this.innerWindow) {
      this.innerWindow.close();
    }
  }

  show() {
    // Unable to 'show' browser window
  }

  hide() {
    // Unable to 'hide' browser window
  }

  static getCurrentWindowId() {
    return window.name;
  };

  static getCurrentWindow() {
    return new Window();
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

export default Window;
