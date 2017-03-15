if (!window.ssf) {
  window.ssf = {};
}

window.ssf.Window = function(url, name, features) {
  let newWindow;

  const handleError = (error) => {
    console.error('Error creating window: ' + error);
  };

  const featureArray = features.split(',');

  if (featureArray.includes('child=yes')) {
    newWindow = new fin.desktop.Window({
      name,
      url
    }, () => newWindow.show(), handleError);
  } else {
    newWindow = new fin.desktop.Application({
      name,
      url,
      uuid: name,
      mainWindowOptions: {
        autoShow: true
      }
    }, () => newWindow.run(), handleError).getWindow();
  }

  return newWindow;
};
