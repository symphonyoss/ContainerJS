if (!window.ssf) {
  window.ssf = {};
}

window.accessableWindows = [];

class Window {
  constructor(url, name, features) {
    const win = window.open(url, name, objectToFeaturesString(features));
    window.accessableWindows.push({
      id: name,
      window: win
    });
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

// if we have an opener, we are not the parent so we need to add it as a window
if (window.opener) {
  window.accessableWindows.push({
    id: 'parent',
    window: window.opener
  });
} else {
  window.name = 'parent';
}

window.ssf.Window = Window;
