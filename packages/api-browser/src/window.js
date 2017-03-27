import {
  addAccessibleWindow,
  removeAccessibleWindow
} from './accessible-windows';

class Window {
  constructor(url, name, features) {
    const win = window.open(url, name, objectToFeaturesString(features));
    win.onclose = () => {
      removeAccessibleWindow(win.name);
    };

    addAccessibleWindow(name, win);
  }

  static getCurrentWindowId() {
    return window.name;
  };
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
