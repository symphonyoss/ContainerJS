if (!window.ssf) {
  window.ssf = {};
}

class Window {
  constructor(url, name, features) {
    window.open(url, name, objectToFeaturesString(features));
  }
}

const objectToFeaturesString = (features) => {
  let featuresString = '';

  Object.keys(features).forEach((key, index) => {
    // Need to convert booleans to yes/no
    if (features[key] === true) {
      features[key] = 'yes';
    } else if (features[key] === false) {
      features[key] = 'no';
    }

    featuresString += `${key}=${features[key]},`;
  });

  return featuresString;
};

window.ssf.Window = Window;
