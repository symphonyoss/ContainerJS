if (!window.ssf) {
  window.ssf = {};
}

window.ssf.window = function(url, name, features) {
  let newWindow;
  const featureObject = parseFeaturesString(features);
  const handleError = (error) => console.error('Error creating window: ' + error);

  if (featureObject.child) {
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

  return newWindow;
};

const parseFeaturesString = (features) => {
  const featureObject = {};

  features.split(/,\s*/).forEach((feature) => {
    let [key, value] = feature.split(/\s*=/);

    // interpret the value as a boolean, if possible
    value = (value === 'yes' || value === '1') ? true : (value === 'no' || value === '0') ? false : value;

    featureObject[key] = value;
  });

  return featureObject;
};
