if (!window.ssf) {
  window.ssf = {};
}

class Window {
  constructor(url, name, features) {
    window.open(url, name, objectToFeaturesString(features));
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

window.ssf.Window = Window;
